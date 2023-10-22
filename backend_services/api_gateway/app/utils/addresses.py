import os


def _get_env_variable(key: str) -> str:
    value = os.getenv(key)
    assert value is not None, f'Environment variable "{key}" not found.'
    return value


API_PORT = _get_env_variable("API_PORT")
USERS_SERVICE_HOST = _get_env_variable("USERS_SERVICE_HOST")
QUESTIONS_SERVICE_HOST = _get_env_variable("QUESTIONS_SERVICE_HOST")
SESSIONS_SERVICE_HOST = _get_env_variable("SESSIONS_SERVICE_HOST")
MATCHING_SERVICE_HOST = _get_env_variable("MATCHING_SERVICE_HOST")
COLLABORATION_SERVICE_HOST = _get_env_variable("COLLABORATION_SERVICE_HOST")
COMMUNICATION_SERVICE_HOST = _get_env_variable("COMMUNICATION_SERVICE_HOST")
