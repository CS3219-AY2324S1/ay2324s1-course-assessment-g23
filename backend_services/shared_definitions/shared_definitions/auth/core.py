import os
from datetime import datetime, timedelta
from typing import Literal, TypeAlias

import jwt
from pydantic import BaseModel


def _get_env_variable(key: str) -> str:
    value = os.getenv(key)
    assert value is not None, f'Environment variable "{key}" not found.'
    return value


JWT_RS256_PUBLIC_KEY = _get_env_variable("JWT_RS256_PUBLIC_KEY")
ALGORITHM = "RS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 15
REFRESH_TOKEN_EXPIRE_DAYS = 7


Role: TypeAlias = Literal["normal", "maintainer"]
TokenType: TypeAlias = Literal["access_token", "refresh_token"]


class TokenData(BaseModel):
    user_id: str
    role: Role
    token_type: TokenType
    exp: datetime


def _create_token(user_id: str, role: Role, token_type: TokenType, duration: timedelta) -> str:
    JWT_RS256_PRIVATE_KEY = _get_env_variable("JWT_RS256_PRIVATE_KEY")
    to_encode = TokenData(
        user_id=user_id,
        role=role,
        token_type=token_type,
        exp=datetime.utcnow() + duration,
    )
    encoded_jwt = jwt.encode(to_encode.model_dump(), JWT_RS256_PRIVATE_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def create_access_token(user_id: str, role: str) -> str:
    assert role == "normal" or role == "maintainer"
    return _create_token(
        user_id=user_id,
        role=role,
        token_type="access_token",
        duration=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES),
    )


def create_refresh_token(user_id: str, role: str) -> str:
    assert role == "normal" or role == "maintainer"
    return _create_token(
        user_id=user_id,
        role=role,
        token_type="refresh_token",
        duration=timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS),
    )


def decode_token(token: str) -> TokenData:
    payload = jwt.decode(token, JWT_RS256_PUBLIC_KEY, algorithms=[ALGORITHM])
    return TokenData(**payload)
