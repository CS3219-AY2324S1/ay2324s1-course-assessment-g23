from typing import Literal
import uuid
from datetime import datetime, timedelta

from user_database import USER_DATABASE as db

def is_valid_login(username: str, hashed_password: str) -> tuple[str, str] | Literal[False]:
    result = db.execute_sql_read_fetchone("SELECT user_id, role FROM users where username = %s AND password = %s",
                                        params=(username, hashed_password))
    if result is None:
        return False
    user_id, role = result
    return user_id, role

def is_expired_session(expiration_time: datetime) -> bool:
    current_time = datetime.now()
    return current_time > expiration_time

def create_session(user_id: str, role: str) -> str:
    session_id = str(uuid.uuid4())
    creation_time = datetime.now()
    expiration_time = creation_time + timedelta(minutes=15)

    db.execute_sql_write("INSERT INTO sessions (session_id, user_id, role, creation_time, expiration_time) VALUES (%s, %s, %s, %s, %s)",
                         params=(session_id, user_id, role, creation_time, expiration_time))
    return session_id

def delete_session(session_id: str) -> Literal[True]:
    db.execute_sql_write("DELETE FROM sessions WHERE session_id = %s", params=(session_id,))
    return True

def is_logged_in(session_id: str) -> bool:
    cur = db.execute_sql_read_fetchone("SELECT COUNT(*) FROM sessions WHERE session_id = %s", params=(session_id,))
    assert cur is not None
    return cur[0] > 0
