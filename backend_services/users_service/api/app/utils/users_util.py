from fastapi import HTTPException

from user_database import USER_DATABASE as db

def username_exists(username: str) -> bool:
    cur = db.execute_sql_read_fetchone("SELECT EXISTS (SELECT 1 FROM users WHERE username = %s)", params=(username,))
    assert cur is not None and isinstance(cur[0], bool)
    return cur[0]

def email_exists(email: str) -> bool:
    cur = db.execute_sql_read_fetchone("SELECT EXISTS (SELECT 1 FROM users WHERE email = %s)", params=(email,))
    assert cur is not None and isinstance(cur[0], bool)
    return cur[0]

def uid_exists(uid: str) -> bool:
    cur = db.execute_sql_read_fetchone("SELECT EXISTS (SELECT 1 FROM users WHERE user_id = %s)", params=(uid,))
    assert cur is not None and isinstance(cur[0], bool)
    return cur[0]

def check_duplicate_username(uid: str, username: str) -> bool:
    cur = db.execute_sql_read_fetchone("SELECT EXISTS (SELECT 1 FROM users WHERE username = %s AND user_id != %s)",
                                       params=(username, uid,))
    assert cur is not None and isinstance(cur[0], bool)
    return cur[0]

def check_duplicate_email(uid: str, email: str) -> bool:
    cur = db.execute_sql_read_fetchone("SELECT EXISTS (SELECT 1 FROM users WHERE email = %s AND user_id != %s)",
                                       params=(email, uid,))
    assert cur is not None and isinstance(cur[0], bool)
    return cur[0]

def is_maintainer(user_id: str) -> bool:
    cur = db.execute_sql_read_fetchone("SELECT role FROM users WHERE user_id = %s", params=(user_id,))
    assert cur is not None
    return cur[0] == "maintainer"

def get_num_maintainers() -> int:
    cur = db.execute_sql_read_fetchone("SELECT COUNT(role) FROM users WHERE role = 'maintainer'")
    assert cur is not None
    return cur[0]

