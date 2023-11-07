import hashlib
import uuid

from fastapi import HTTPException, status
from shared_definitions.api_models.users import (
    CreateUserResponse,
    DeleteUserResponse,
    GetUserResponse,
    UpdateUserResponse,
    UpdateUserRoleResponse,
)
from shared_definitions.auth.core import TokenData
from user_database import USER_DATABASE as db
from utils import users_util


def create_user(username: str, email: str, password: str) -> CreateUserResponse:
    user_id = str(uuid.uuid4())
    while users_util.uid_exists(user_id):
        user_id = str(uuid.uuid4())  # Regenerate UUID if there's conflict.

    if users_util.username_exists(username):
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Username already exists")
    if users_util.email_exists(email):
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already exists")

    hashed_password = hashlib.md5(password.encode()).hexdigest()

    db.execute_sql_write(
        "INSERT INTO users (user_id, username, email, password, role) VALUES (%s, %s, %s, %s, %s)",
        params=(user_id, username, email, hashed_password, "normal"),
    )
    return CreateUserResponse(message=f"User({user_id}) successfully created")


def get_all_users() -> list[GetUserResponse]:
    FIELD_NAMES = ["user_id", "username", "email", "role"]
    rows = db.execute_sql_read_fetchall(f"SELECT {', '.join(FIELD_NAMES)} FROM users")
    users = [dict(zip(FIELD_NAMES, row)) for row in rows]
    return [GetUserResponse(**x) for x in users]  # type: ignore


def get_current_user(access_token_data: TokenData) -> GetUserResponse:
    if not users_util.uid_exists(access_token_data.user_id):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)
    return get_user(access_token_data.user_id)


def get_user(user_id: str) -> GetUserResponse:
    FIELD_NAMES = ["user_id", "username", "email", "role"]
    row = db.execute_sql_read_fetchone(
        f"SELECT {', '.join(FIELD_NAMES)} FROM users WHERE user_id = %s", params=(user_id,)
    )
    if row is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)
    user = dict(zip(FIELD_NAMES, row))
    return GetUserResponse(**user)  # type: ignore


def update_user_info(
    user_id: str,
    username: str | None,
    password: str | None,
    email: str | None,
    access_token_data: TokenData,
) -> UpdateUserResponse:
    # Check again if user has perms to delete,
    # incase access token is stale.
    if access_token_data.user_id != user_id and not users_util.is_maintainer(
        access_token_data.user_id
    ):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN)

    if not users_util.uid_exists(user_id):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User does not exist")
    if username and users_util.check_duplicate_username(user_id, username):
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Username already exists")
    if email and users_util.check_duplicate_email(user_id, email):
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already exists")

    columns_values = {
        "username": username,
        "password": hashlib.md5(password.encode()).hexdigest() if password else None,
        "email": email,
    }

    # Use dictionary comprehension to filter out None values and prepare the SQL parts.
    updates: list[str] = [f"{col} = %s" for col, val in columns_values.items() if val is not None]
    params: list[str] = [val for val in columns_values.values() if val is not None]

    if not updates:  # No updates to make
        return UpdateUserResponse(message="Nothing to update")

    # Construct the full SQL query.
    sql_query = f"UPDATE users SET {', '.join(updates)} WHERE user_id = %s"
    params.append(user_id)

    db.execute_sql_write(sql_query, params=tuple(params))
    return UpdateUserResponse(message="Successfully updated")


def delete_user(user_id: str, access_token_data: TokenData) -> DeleteUserResponse:
    # Check again if user has perms to delete,
    # incase access token is stale.
    if access_token_data.user_id != user_id and not users_util.is_maintainer(
        access_token_data.user_id
    ):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN)

    if not users_util.uid_exists(user_id):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User does not exist")

    if users_util.is_maintainer(user_id) and users_util.get_num_maintainers() == 1:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Cannot delete last maintainer",
        )

    db.execute_sql_write("DELETE FROM users WHERE user_id = %s", params=(user_id,))
    return DeleteUserResponse(message=f"User id {user_id} deleted")


def update_user_role(
    user_id: str,
    role: str,
    access_token_data: TokenData,
) -> UpdateUserRoleResponse:
    # Check again if user has perms to delete,
    # incase access token is stale.
    if not users_util.is_maintainer(access_token_data.user_id):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN)

    if (
        # Attempting to downgrade perms of a maintainer.
        users_util.is_maintainer(user_id)
        and role == "normal"
    ) and users_util.get_num_maintainers() <= 1:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Only one maintainer left")

    db.execute_sql_write("UPDATE users SET role = %s WHERE user_id = %s", params=(role, user_id))

    return UpdateUserRoleResponse(message="Successfully updated")
