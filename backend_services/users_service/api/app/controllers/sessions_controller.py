import hashlib

from fastapi import HTTPException, status
from fastapi.responses import JSONResponse, Response
from shared_definitions.api_models.users import UserLoginResponse
from shared_definitions.auth.core import (
    TokenData,
    create_access_token,
    create_refresh_token,
)
from utils import sessions_util, users_util


def user_login(username: str, password: str) -> JSONResponse:
    if not users_util.username_exists(username):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Account does not exist",
        )

    hashed_password = hashlib.md5(password.encode()).hexdigest()

    user_id, role = sessions_util.get_user_id_and_role(username, hashed_password)

    if user_id is None or role is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid password")

    access_token = create_access_token(user_id, role)
    refresh_token = create_refresh_token(user_id, role)
    sessions_util.store_refresh_token(refresh_token)

    response_payload = UserLoginResponse(message=f"User {username} successfully logged in")
    response = JSONResponse(content=response_payload.model_dump(mode="json"))
    response.set_cookie(key="refresh_token", value=refresh_token)
    response.set_cookie(key="access_token", value=access_token)
    return response


def user_logout(refresh_token: str | None) -> Response:
    try:
        if refresh_token is not None:
            sessions_util.delete_refresh_token(refresh_token)
    finally:
        # Return `401 No Content` regardless of deletion outcome.
        response = Response(status_code=status.HTTP_204_NO_CONTENT)
        response.delete_cookie("refresh_token")
        response.delete_cookie("access_token")
        return response


def get_new_access_token(refresh_token: str, refresh_token_data: TokenData) -> Response:
    if not sessions_util.is_valid_refresh_token(refresh_token):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)

    access_token = create_access_token(refresh_token_data.user_id, refresh_token_data.role)
    response = Response(status_code=status.HTTP_204_NO_CONTENT)
    response.set_cookie(key="access_token", value=access_token)
    return response
