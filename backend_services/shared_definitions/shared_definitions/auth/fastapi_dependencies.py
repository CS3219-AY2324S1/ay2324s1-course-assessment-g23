import jwt
from fastapi import Cookie, HTTPException, status

from .core import TokenData, decode_token


def decode_access_token_data(access_token: str | None = Cookie(None)) -> TokenData:
    """FastAPI dependency for decoding the JWT `access_token` cookie send by user requests.

    Raises `HTTPException(status_code=401)` on:
    - missing `access_token` cookie
    - expired `access_token`
    - unable to decoded `access_token`

    Args:
        access_token (str | None, optional): `access_token` cookie. \
            Defaults to `Cookie(None)`.

    Raises:
        HTTPException: With `status_code=401` if \
            `access_token` cookie is missing, expired, or unable to be decoded.

    Returns:
        TokenData: The data contained in the JWT `access_token` cookie.

    Examples:
        ```py
        from fastapi import Depends

        # Get decoded `access_token` data.
        @app.get("/users")
        async def get_users(access_token_data: TokenData = Depends(decode_access_token)):
        ```
    """
    if access_token is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)

    try:
        token_data = decode_token(access_token)
    except jwt.PyJWTError:
        # Return 401 if there's any decoding errors,
        # INCLUDING if token has expired.
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)

    if token_data.token_type != "access_token":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)

    return token_data


def decode_refresh_token_data(refresh_token: str | None = Cookie(None)) -> TokenData:
    """FastAPI dependency for decoding the JWT `refresh_token` cookie send by user requests.

    Raises `HTTPException(status_code=401)` on:
    - missing `refresh_token` cookie
    - expired `refresh_token`
    - unable to decoded `refresh_token`

    Args:
        refresh_token (str | None, optional): `refresh_token` cookie. \
            Defaults to `Cookie(None)`.

    Raises:
        HTTPException: With `status_code=401` if \
            `refresh_token` cookie is missing, expired, or unable to be decoded.

    Returns:
        TokenData: The data contained in the JWT `refresh_token` cookie.

    Examples:
        ```py
        from fastapi import Depends

        # Get decoded `refresh_token` data.
        @app.get("/users")
        async def get_users(refresh_token_data: TokenData = Depends(decode_refresh_token)):
        ```
    """
    if refresh_token is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)

    try:
        token_data = decode_token(refresh_token)
    except jwt.PyJWTError:
        # Return 401 if there's any decoding errors,
        # INCLUDING if token has expired.
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)

    if token_data.token_type != "refresh_token":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)

    return token_data


def require_maintainer_role(access_token: str | None = Cookie(None)) -> None:
    """FastAPI dependency for requiring `"maintainer"` role to access API endpoint.

    Raises `HTTPException(status_code=401)` on:
    - missing `access_token` cookie
    - expired `access_token`
    - unable to decoded `access_token`

    Raises `HTTPException(status_code=403)` on:
    - `role` in `access_token` cookie is not `"maintainer"`

    Args:
        access_token (str | None, optional): `access_token` cookie. \
            Defaults to `Cookie(None)`.

    Raises:
        HTTPException: With `status_code=401` if \
            `access_token` cookie is missing, expired, or unable to be decoded. \
            With `status_code=403` if `role != "maintainer"`.

    Examples:
        ```py
        from fastapi import Depends

        # Set all API-endpoints to require "maintainer" role.
        app = FastAPI(dependencies=[Depends(require_maintainer_role)])

        # Set an API-endpoint to require "maintainer" role.
        @app.delete("/users", dependencies=[Depends(require_maintainer_role)])
        async def delete_users():
        ```
    """
    token_data = decode_access_token_data(access_token)

    if token_data.role != "maintainer":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN)


def require_logged_in(access_token: str | None = Cookie(None)) -> None:
    """FastAPI dependency for requiring user to be logged in to access API endpoint.

    Raises `HTTPException(status_code=401)` if `access_token` cookie is:
    - missing
    - expired
    - unable to be decoded

    Args:
        access_token (str | None, optional): `access_token` cookie. \
            Defaults to `Cookie(None)`.

    Raises:
        HTTPException: With `status_code=401` if \
            `access_token` cookie is missing, expired, or unable to be decoded.

    Examples:
        ```py
        from fastapi import Depends

        # Set all API-endpoints to require user to be logged in.
        app = FastAPI(dependencies=[Depends(require_logged_in)])

        # Set an API-endpoint to require user to be logged in.
        @app.get("/users", dependencies=[Depends(require_logged_in)])
        async def get_users():
        ```
    """
    decode_access_token_data(access_token)


def require_same_user_or_maintainer_role(
    user_id: str,
    access_token: str | None = Cookie(None),
) -> None:
    """FastAPI dependency for requiring same `user_id` as in the API's path or `"maintainer"` role
    to access API endpoint.

    API-endpoint MUST have `{user_id}` in their URL path (eg. "/users/{user_id}").

    Raises `HTTPException(status_code=401)` on:
    - missing `access_token` cookie
    - expired `access_token`
    - unable to decoded `access_token`

    Raises `HTTPException(status_code=403)` on:
    - (`user_id` in `access_token` cookie) is not (`user_id` in API's path.)
    - AND (`role` in `access_token` cookie is not `"maintainer"`)

    Args:
        access_token (str | None, optional): `access_token` cookie. \
            Defaults to `Cookie(None)`.

    Raises:
        HTTPException: With `status_code=401` if \
            `access_token` cookie is missing, expired, or unable to be decoded. \
            With `status_code=403` if `user_id` doesn't match.

    Examples:
        ```py
        from fastapi import Depends

        # Set all API-endpoints to require either matching `user_id` or have "maintainer" role.
        app = FastAPI(dependencies=[Depends(require_same_user_or_maintainer_role)])

        # Set an API-endpoint to require either matching `user_id` or have "maintainer" role.
        @app.delete("/users/{user_id}", dependencies=[Depends(require_same_user_or_maintainer_role)])
        async def delete_user(user_id: str) -> DeleteUserResponse:
            return uc.delete_user(user_id)
        ```
    """
    token_data = decode_access_token_data(access_token)

    if token_data.user_id != user_id and token_data.role != "maintainer":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN)
