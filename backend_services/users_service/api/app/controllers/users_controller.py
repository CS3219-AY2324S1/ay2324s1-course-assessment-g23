import hashlib
from fastapi import HTTPException
from api_models.error import ServiceError
from api_models.users import CreateUserResponse, DeleteUserResponse, GetUserResponse, UpdateUserResponse, UpdateUserRoleResponse
from user_database import USER_DATABASE as db
from utils import users_util

def create_user(user_id: str, username: str, email: str, password: str) -> CreateUserResponse | ServiceError:
    if users_util.uid_exists(user_id):
        return ServiceError(status_code=500, message='Internal server error (uid already exists)')
    if users_util.username_exists(username):
        return ServiceError(status_code=409, message='Username already exists')
    if users_util.email_exists(email):
        return ServiceError(status_code=409, message='Email already exists')

    hashed_password = hashlib.md5(password.encode()).hexdigest()

    db.execute_sql_write("INSERT INTO users (user_id, username, email, password, role) VALUES (%s, %s, %s, %s, %s)",
                         params=(user_id, username, email, hashed_password, "normal"))
    return CreateUserResponse(message=f'User({user_id}) successfully created')

def get_all_users() -> list[GetUserResponse]:
    FIELD_NAMES = ['user_id', 'username', 'email', 'role']
    rows = db.execute_sql_read_fetchall(f"SELECT {', '.join(FIELD_NAMES)} FROM users")
    users = [dict(zip(FIELD_NAMES, row)) for row in rows]
    return [GetUserResponse(**x) for x in users]  # type: ignore

def get_user(user_id: str) -> GetUserResponse:
    FIELD_NAMES = ['user_id', 'username', 'email', 'role']
    row = db.execute_sql_read_fetchone(f"SELECT {', '.join(FIELD_NAMES)} FROM users WHERE user_id = %s",
                                        params=(user_id,))
    user = dict(zip(FIELD_NAMES, row))
    return GetUserResponse(**user)  # type: ignore

def update_user_info(user_id: str, username: str | None, password: str | None, email: str | None) -> UpdateUserResponse | ServiceError:
    if not users_util.uid_exists(user_id):
        return ServiceError(status_code=404, message="User does not exist")
    if username and users_util.check_duplicate_username(user_id, username):
        return ServiceError(status_code=409, message='Username already exists')
    if email and users_util.check_duplicate_email(user_id, email):
        return ServiceError(status_code=409, message='Email already exists')

    columns_values = {
        'username': username,
        'password': hashlib.md5(password.encode()).hexdigest() if password else None,
        'email': email
    }

    # Use dictionary comprehension to filter out None values and prepare the SQL parts.
    updates: list[str] = [f"{col} = %s" for col, val in columns_values.items() if val is not None]
    params: list[str] = [val for val in columns_values.values() if val is not None]

    if not updates:  # No updates to make
        return UpdateUserResponse(message='Nothing to update')

    # Construct the full SQL query.
    sql_query = f"UPDATE users SET {', '.join(updates)} WHERE user_id = %s"
    params.append(user_id)

    db.execute_sql_write(sql_query, params=tuple(params))
    return UpdateUserResponse(message='Successfully updated')


def delete_all_users() -> DeleteUserResponse:
    db.execute_sql_write("DELETE FROM users")
    return DeleteUserResponse(message='All users deleted')

def delete_user(user_id: str) -> DeleteUserResponse | ServiceError:
    if not users_util.uid_exists(user_id):
        return ServiceError(status_code=404, message="User does not exist")

    if users_util.is_maintainer(user_id) and users_util.get_num_maintainers() == 1:
        return ServiceError(status_code=403, message="Cannot delete last maintainer")

    db.execute_sql_write("DELETE FROM users WHERE user_id = %s", params=(user_id,))
    return DeleteUserResponse(message=f'User id {user_id} deleted')

def update_user_role(user_id: str, role: str) -> UpdateUserRoleResponse | ServiceError:
    if role == "normal" and users_util.get_num_maintainers() <= 1:
        return ServiceError(status_code=409, message='Only one maintainer left')

    db.execute_sql_write("UPDATE users SET role = %s WHERE user_id = %s", params=(role, user_id))

    return UpdateUserRoleResponse(message='Successfully updated')
