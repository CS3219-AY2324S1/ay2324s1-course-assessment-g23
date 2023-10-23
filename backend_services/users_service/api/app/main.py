import uuid
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware

from api_models.users import CreateUserRequest, CreateUserResponse, DeleteUserResponse, GetSessionResponse, GetUserResponse, UpdateUserRequest, UpdateUserResponse, UpdateUserRoleRequest, UpdateUserRoleResponse, UserLoginRequest, UserLoginResponse, UserLogoutResponse
from api_models.error import ServiceError
from controllers import users_controller as uc, sessions_controller as sc

# create app
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"]
)

@app.post("/users", status_code=200, response_model=None)
async def create_user(r: CreateUserRequest) -> CreateUserResponse | ServiceError:
    user_id = str(uuid.uuid4())
    return uc.create_user(user_id, r.username, r.email, r.password)

@app.get("/users/{user_id}", status_code=200, response_model=None)
async def get_user(user_id: str) -> GetUserResponse:
    return uc.get_user(user_id)

@app.get("/users_all", status_code=200, response_model=None)
async def get_all_users() -> list[GetUserResponse]:
    return uc.get_all_users()

@app.delete("/users_all", status_code=200, response_model=None)
async def delete_all_users() -> DeleteUserResponse:
    return uc.delete_all_users()

@app.delete("/users/{user_id}", status_code=200, response_model=None)
async def delete_user(user_id: str) -> DeleteUserResponse | ServiceError:
    return uc.delete_user(user_id)

@app.put("/users/{user_id}", status_code=200, response_model=None)
async def update_user_info(user_id: str, r: UpdateUserRequest) -> UpdateUserResponse | ServiceError:
    return uc.update_user_info(user_id, r.username, r.password, r.email)

@app.put("/users_role/{user_id}", status_code=200, response_model=None)
async def update_user_role(user_id: str, r: UpdateUserRoleRequest) -> UpdateUserRoleResponse | ServiceError:
    return uc.update_user_role(user_id, r.role)

@app.post("/sessions", status_code=200, response_model=None)
async def user_login(r: UserLoginRequest) -> UserLoginResponse | ServiceError:
    return sc.user_login(r.username, r.password)

@app.get("/sessions_all",  status_code=200, response_model=None)
async def get_all_sessions() -> list[GetSessionResponse]:
    return sc.get_all_sessions()

@app.get("/sessions/{session_id}",  status_code=200, response_model=None)
async def get_session(session_id: str) -> GetSessionResponse | ServiceError:
    return sc.get_session(session_id)

@app.delete("/sessions/{session_id}",  status_code=200, response_model=None)
async def user_logout(session_id: str) -> UserLogoutResponse | ServiceError:
    return sc.user_logout(session_id)
