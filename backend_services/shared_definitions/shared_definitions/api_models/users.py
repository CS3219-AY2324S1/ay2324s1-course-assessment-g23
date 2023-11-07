from typing import Literal, Optional

from pydantic import BaseModel, ValidationInfo, field_validator


class CreateUserRequest(BaseModel):
    username: str
    password: str
    email: str

    @field_validator("username", "password", "email")
    @classmethod
    def check_title_not_empty_or_whitespace(cls, v: str, info: ValidationInfo) -> str:
        is_not_empty_or_whitespace = v.strip() != ""
        assert is_not_empty_or_whitespace, f"Input cannot be empty nor whitespaces-only"
        return v


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

    @field_validator("username", "password", "email")
    @classmethod
    def check_title_not_empty_or_whitespace(cls, v: str, info: ValidationInfo) -> str:
        is_not_empty_or_whitespace = v.strip() != ""
        assert is_not_empty_or_whitespace, f"Input cannot be empty nor whitespaces-only"
        return v


class UpdateUserResponse(BaseModel):
    message: str


class UserLoginRequest(BaseModel):
    username: str
    password: str

    @field_validator("username", "password")
    @classmethod
    def check_title_not_empty_or_whitespace(cls, v: str, info: ValidationInfo) -> str:
        is_not_empty_or_whitespace = v.strip() != ""
        assert is_not_empty_or_whitespace, f"Input cannot be empty nor whitespaces-only"
        return v


class UserLoginResponse(BaseModel):
    message: str


class UpdateUserRoleRequest(BaseModel):
    role: Literal["normal", "maintainer"]


class UpdateUserRoleResponse(BaseModel):
    message: str
