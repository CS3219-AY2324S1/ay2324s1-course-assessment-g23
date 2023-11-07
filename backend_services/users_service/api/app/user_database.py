import os

from database_model import Database


def _get_env_variable(key: str) -> str:
    value = os.getenv(key)
    assert value is not None, f'Environment variable "{key}" not found.'
    return value


HOST = _get_env_variable("POSTGRES_HOST")
PORT = _get_env_variable("POSTGRES_PORT")
DATABASE = _get_env_variable("POSTGRES_DB")
USER = _get_env_variable("POSTGRES_USER")
PASSWORD = _get_env_variable("POSTGRES_PASSWORD")

USER_DATABASE = Database(HOST, PORT, DATABASE, USER, PASSWORD)
