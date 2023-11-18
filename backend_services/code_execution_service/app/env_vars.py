import os


def _get_env_variable(key: str) -> str:
    value = os.getenv(key)
    assert value is not None, f'Environment variable "{key}" not found.'
    return value


JUDGE0_HOST = _get_env_variable("JUDGE0_HOST")
JUDGE0_PORT = _get_env_variable("JUDGE0_PORT")
