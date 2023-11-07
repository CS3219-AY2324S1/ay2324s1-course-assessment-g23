from user_database import USER_DATABASE as db


def get_user_id_and_role(
    username: str, hashed_password: str
) -> tuple[str, str] | tuple[None, None]:
    result = db.execute_sql_read_fetchone(
        "SELECT user_id, role FROM users where username = %s AND password = %s",
        params=(username, hashed_password),
    )
    if result is None:
        return None, None
    user_id, role = result
    return user_id, role


def store_refresh_token(refresh_token: str) -> None:
    db.execute_sql_write("INSERT INTO refresh_tokens VALUES (%s)", params=(refresh_token,))


def delete_refresh_token(refresh_token: str) -> None:
    db.execute_sql_write("DELETE FROM refresh_tokens WHERE token = %s", params=(refresh_token,))


def is_valid_refresh_token(refresh_token: str) -> bool:
    result = db.execute_sql_read_fetchone(
        "SELECT COUNT(*) FROM refresh_tokens WHERE token = %s",
        params=(refresh_token,),
    )
    return result[0] > 0 if result else False
