import httpx
from fastapi import HTTPException, Response, WebSocket
from fastapi.responses import JSONResponse

from api_models.users import UserLoginResponse, UserLogoutResponse

from api_models.error import ServiceError
from api_models.users import GetSessionResponse
from .addresses import API_PORT, USERS_SERVICE_HOST, QUESTIONS_SERVICE_HOST, SESSIONS_SERVICE_HOST, MATCHING_SERVICE_HOST
from .api_permissions import *
import websockets
import json
from typing import Literal, TypeAlias

async def connect_matching_service_websocket(websocket: WebSocket, message):
    # websocket_url = "ws://{MATCHING_SERVICE_HOST}/{API_PORT}/ws/matching"
    websocket_url = "ws://localhost:8003/ws/matching"
    async with websockets.connect(websocket_url) as matching_service_websocket:
                await matching_service_websocket.send(message)
                response = await matching_service_websocket.receive_text()
                await websocket.send_text(response)
                websocket.close()

def _get_id_from_url(path: str) -> str | None:
    tokens = path.split("/")
    tokens = tokens[1:] # remove service name
    if len(tokens) < 1:
        return None
    return tokens[-1]

Services: TypeAlias = Literal["users", "questions", "sessions"]
def map_path_microservice_url(path: str) -> tuple[Services, str]:
    URL_PREFIX = "http://"
    if path.startswith("/users"):
        return "users", f"{URL_PREFIX}{USERS_SERVICE_HOST}:{API_PORT}"
    if path.startswith("/questions"):
        return "questions", f"{URL_PREFIX}{QUESTIONS_SERVICE_HOST}:{API_PORT}"
    if path.startswith("/sessions"):
        return "sessions", f"{URL_PREFIX}{SESSIONS_SERVICE_HOST}:{API_PORT}"
    raise Exception(f'path="{path}" doesn\'t match any existing services.')

def _map_role_permission(role: str) -> PermissionLevel:
    if role == "public":
        return PUBLIC_PERMISSION
    elif role == "normal":
        return USER_PERMISSION
    elif role == "maintainer":
        return MAINTAINER_PERMISSION
    raise Exception(f'Unknown role "{role}".')

def _get_service_path(path: str) -> str:
    tokens = path.split("/")
    return tokens[1]

async def has_permission(session_id: str | None, path: str, method: Method) -> bool:
    service_path = _get_service_path(path)
    permission_required = PERMISSIONS_TABLE[service_path][method]

    if permission_required == PUBLIC_PERMISSION:
        return True

    if session_id is None:
        return False

    url = f"http://{SESSIONS_SERVICE_HOST}:{API_PORT}/sessions/{session_id}"

    async with httpx.AsyncClient() as client:
        response = await client.get(url)

        res_json: dict = response.json()
        if ServiceError.is_service_error(res_json):
            service_error = ServiceError(**res_json)
            raise HTTPException(status_code=service_error.status_code, detail=service_error.message)

        session = GetSessionResponse(**res_json)

        _check_access_to_supplied_id(session, path, service_path)

        permission_level = _map_role_permission(session.role)

        return permission_level >= permission_required


def _check_access_to_supplied_id(session: GetSessionResponse, path: str, service: str):
    if session.role == "maintainer":
        return

    # Normal users will pass these checks to call `users_all``. There are no supplied ids => vacuously true.
    # But their permissions will be checked by permissions table
    if service == "users":
        supplied_id = _get_id_from_url(path)
        session_user_id = session.user_id
        if supplied_id != session_user_id:
            raise HTTPException(status_code=401, detail="Unauthorized access")
