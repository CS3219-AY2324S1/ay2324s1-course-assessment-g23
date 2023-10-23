from typing import Optional
from pydantic import BaseModel


class CreateUserRequest(BaseModel):
    username: str
    password: str
    email: str


class CreateUserResponse(BaseModel):
    message: str


class GetUserResponse(BaseModel):
    user_id: str
    username: str
    email: str
    role: str


class DeleteUserResponse(BaseModel):
    message: str


class UpdateUserRequest(BaseModel):
    username: Optional[str] = None
    password: Optional[str] = None
    email: Optional[str] = None


class UpdateUserResponse(BaseModel):
    message: str


class UserLoginRequest(BaseModel):
    username: str
    password: str


class UserLoginResponse(BaseModel):
    session_id: str
    message: str


class UpdateUserRoleRequest(BaseModel):
    role: str


class UpdateUserRoleResponse(BaseModel):
    message: str


class GetSessionResponse(BaseModel):
    session_id: str
    user_id: str
    role: str
    creation_time: str
    expiration_time: str


class UserLogoutResponse(BaseModel):
    message: str
