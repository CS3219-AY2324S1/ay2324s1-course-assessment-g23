from fastapi import FastAPI, HTTPException, Request, WebSocket
from fastapi.responses import JSONResponse
import httpx
import json
from fastapi.middleware.cors import CORSMiddleware

from utils.addresses import API_PORT, MATCHING_SERVICE_HOST
from utils.api_gateway_util import check_permission, map_path_microservice_url, connect_matching_service_websocket

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()

    try:
        # Receive message from client
        message = await websocket.receive_text()

        request =  json.loads(message)
        service = request["service"]

        # Send message to microservice
        if service == "matching-service":
            connect_matching_service_websocket(websocket, request)
        else:
            raise HTTPException(status_code=400, detail=f"Invalid service requested: {service}")

    except HTTPException as http_exc:
        await websocket.send_text(http_exc.detail)

async def route_request(method: str, path: str, request: Request):
    # Determine the microservice URL based on the path
    service, microservice_url = map_path_microservice_url(path)

    if not service:
        raise HTTPException(status_code=404, detail="Endpoint not found")

    cookies = request.cookies
    session_id = cookies.get('session_id')

    await check_permission(session_id, path, method)

    data = await request.body()

    # Forward the request to the microservice
    async with httpx.AsyncClient() as client:
        if method == "GET":
            response = await client.get(f"{microservice_url}{path}")
        elif method == "POST":
            response = await client.post(f"{microservice_url}{path}", data=data)
        elif method == "PUT":
            response = await client.put(f"{microservice_url}{path}", data=data)
        elif method == "DELETE":
             response = await client.delete(f"{microservice_url}{path}", data=data)

        return response

@app.api_route("/{path:path}", methods=["GET", "POST", "PUT", "DELETE"])
async def handle_request(request: Request):
    path = request.url.path
    method = request.method

    response = await route_request(method, path, request)

    if path == "/sessions" and method == "POST":
        response_content = response.json()
        session_id = response_content['session_id']
        message = response_content['message']
        response = JSONResponse(content=message)
        response.set_cookie(key='session_id', value=session_id)
        return response

    return response.json()