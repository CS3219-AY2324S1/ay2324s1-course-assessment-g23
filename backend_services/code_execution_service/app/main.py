import httpx
from env_vars import JUDGE0_HOST, JUDGE0_PORT
from fastapi import Depends, FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from shared_definitions.api_models.error import stringify_exception_handler
from shared_definitions.auth.fastapi_dependencies import require_logged_in

JUDGE0_API_BASE_URL = f"http://{JUDGE0_HOST}:{JUDGE0_PORT}"

# create app
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(*args):
    return await stringify_exception_handler(*args)


@app.post("/execute", dependencies=[Depends(require_logged_in)])
async def execute_code(request: Request):
    # Forward to Judge0 server.
    async with httpx.AsyncClient() as client:
        httpx_res = await client.request(
            method=request.method,
            url=JUDGE0_API_BASE_URL + "/submissions/?wait=true",
            headers=request.headers,
            cookies=request.cookies,
            data=await request.body(),  # type: ignore
        )

        return StreamingResponse(
            content=httpx_res.iter_bytes(),
            headers=httpx_res.headers,
            status_code=httpx_res.status_code,
        )
