import re

from fastapi import Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from pydantic import BaseModel


class ServiceError(BaseModel):
    status_code: int
    message: str

    @staticmethod
    def is_service_error(json: dict) -> bool:
        return "status_code" in json


async def stringify_exception_handler(request: Request, exc: RequestValidationError):
    """Handler for FastAPI's Pydantic exceptions.

    It'll parse the `RequestValidationError` into a human readable string in the
    payload's "detail" JSON value.

    Example response payload format:
    ```json
    { "detail": "\\"title\\" cannot be empty nor whitespaces only" }
    ```

    Examples:
        ```py
        from fastapi.exceptions import RequestValidationError

        @app.exception_handler(RequestValidationError)
        async def validation_exception_handler(*args):
            return await stringify_exception_handler(*args)
        ```
    """
    messages: list[str] = []

    for error in exc.errors():
        loc = '"' + '" -> "'.join(error["loc"][1:]) + '"'
        error_msg: str = error["msg"]
        error_msg = _remove_error_type(error_msg)
        error_msg = _replace_input_field(error_msg, loc)
        messages.append(error_msg)

    payload = {"detail": ", ".join(messages)}

    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content=payload,
    )


def _remove_error_type(error_msg: str) -> str:
    return re.sub(r"^(Assertion failed|Value error), ", "", error_msg)


def _replace_input_field(error_msg: str, loc: str) -> str:
    return re.sub(r"^(Input|Field)", loc, error_msg)
