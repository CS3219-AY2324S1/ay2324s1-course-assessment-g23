import hashlib
from fastapi import HTTPException
import database as db
from .utils import users_util
from .utils import sessions_util
from database_functions import session_functions
# import requests

def create_user(user_id, username, email, password):
    if users_util.uid_exists(user_id):
        raise HTTPException(status_code=500, detail='Internal server error (uid already exists)')
    if users_util.username_exists(username):
        raise HTTPException(status_code=409, detail='Username already exists')
    if users_util.email_exists(email):
        raise HTTPException(status_code=409, detail='Email already exists')

    hashed_password = hashlib.md5(password.encode()).hexdigest()

    db.execute_sql_write("INSERT INTO users (user_id, username, email, password) VALUES (%s, %s, %s, %s)",
                         params=(user_id, username, email, hashed_password))
    return {'message': f'User({user_id}) successfully created'}
    # return {'message': f'User successfully created'}


def get_user(user_id, session_id):
    # check if logged in
    # session_user = session_functions.get_session('all')
    # if len(session_user) < 1:
    #     raise HTTPException(status_code=401, detail='You are not logged in')

    # check if maintainer
    # if not session_user[0]['role'] == "maintainer":
    #     raise HTTPException(status_code=401, detail='You do not have read access to users')
    if not sessions_util.is_logged_in(session_id):
        raise HTTPException(status_code=401, detail='You are not logged in')
    
    if not users_util.is_maintainer(session_id):
        raise HTTPException(status_code=401, detail='You do not have access')

    if user_id != "all" and not users_util.uid_exists(user_id):
        raise HTTPException(status_code=404, detail='User does not exist')

    FIELD_NAMES = ['user_id', 'username', 'email', 'password', 'role']
    if user_id == "all":
        rows = db.execute_sql_read_fetchall(f"SELECT {', '.join(FIELD_NAMES)} FROM users")
        users = [dict(zip(FIELD_NAMES, row)) for row in rows]
        return users
    return db.execute_sql_read_fetchone(f"SELECT {', '.join(FIELD_NAMES)} FROM users WHERE user_id = %s",
                                        params=(user_id,))

def update_user_info(user_id, username, password, email, session_id):
    if not sessions_util.is_logged_in(session_id):
        raise HTTPException(status_code=401, detail='You are not logged in')

    if not users_util.is_maintainer(session_id) and not users_util.is_account_owner(user_id, session_id):
        raise HTTPException(status_code=401, detail='You do not have access')

    if not users_util.uid_exists(user_id):
        raise HTTPException(status_code=404, detail="User does not exist")
    if users_util.check_duplicate_username(user_id, username):
            raise HTTPException(status_code=409, detail='Username already exists')
    if users_util.check_duplicate_email(user_id, email):
            raise HTTPException(status_code=409, detail='Email already exists')

    new_password = hashlib.md5(password.encode()).hexdigest()

    db.execute_sql_write("""UPDATE users
                        SET username = %s, password = %s, email = %s
                        WHERE user_id = %s""",
                        params=(username, new_password, email, user_id))
    return {'message': 'Successfully updated'}

def delete_user(user_id, session_id):
    if not sessions_util.is_logged_in(session_id):
        raise HTTPException(status_code=401, detail='You are not logged in')

    if not users_util.is_maintainer(session_id) and not users_util.is_account_owner(user_id, session_id):
        raise HTTPException(status_code=401, detail='You do not have access')

    if user_id != "all" and not users_util.uid_exists(user_id):
        raise HTTPException(status_code=404, detail="User does not exist")

    if user_id == "all":
        db.execute_sql_write("DELETE FROM users")
        return {'message': 'All users deleted'}
    else:
        db.execute_sql_write("DELETE FROM users WHERE user_id = %s", params=(user_id,))
        return {'message': f'User id {user_id} deleted'}
    
def update_user_role(user_id, role, session_id):
    if not sessions_util.is_logged_in(session_id):
        raise HTTPException(status_code=401, detail='You are not logged in')

    if not users_util.is_maintainer(session_id):
        raise HTTPException(status_code=401, detail='You do not have access')

    curr_role = get_user(user_id, session_id)[4]

    if curr_role == "maintainer" and role == "normal":
        if db.execute_sql_read_fetchone("SELECT COUNT(*) FROM users WHERE role = 'maintainer'")[0] <= 1:
            raise HTTPException(status_code=409, detail='Only one maintainer left')

    db.execute_sql_write("UPDATE users SET role = %s WHERE user_id = %s", params=(role, user_id))

    return {'message': 'Successfully updated'}