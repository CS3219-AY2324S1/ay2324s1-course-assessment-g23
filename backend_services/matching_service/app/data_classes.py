import asyncio
from dataclasses import dataclass
from typing import Any, Literal, Optional, TypeAlias

from fastapi import WebSocket
from pydantic import BaseModel

Complexity: TypeAlias = Literal["easy", "medium", "hard"]


async def placeholder_func():
    pass


CANCELLED_TASK: asyncio.Task = asyncio.create_task(placeholder_func())
CANCELLED_TASK.cancel()


class MatchRequest(BaseModel):
    """Payload received from frontend."""

    user_id: str
    action: Literal["queue", "cancel"]
    complexity: Optional[Complexity] = None


class MatchResponse(BaseModel):
    """Payload sent to frontend."""

    is_matched: bool
    detail: str
    user_id: Optional[str] = None


# Using normal dataclass instead of Pydantic because `WebSocket` and
# `asyncio.Task` aren't compatible with Pydantic.
@dataclass
class UserWebSocket:
    """Representation of a user (with their corresponding websocket)."""

    user_id: str
    websocket: WebSocket
    timeout_task: asyncio.Task = CANCELLED_TASK


class UserWebSocketQueue:
    """Queue for `UserWebSocket`."""

    def __init__(self) -> None:
        self._queue: list[UserWebSocket] = []

    def is_empty(self) -> bool:
        return len(self._queue) == 0

    def push(self, x: UserWebSocket) -> None:
        self._queue.append(x)

    def pop(self) -> UserWebSocket:
        return self._queue.pop(0)

    def remove_by_websocket(self, websocket: WebSocket) -> UserWebSocket | None:
        for i, x in enumerate(self._queue):
            if x.websocket == websocket:
                del self._queue[i]
                break

    def __contains__(self, item: Any) -> bool:
        if not isinstance(item, UserWebSocket):
            return False
        for x in self._queue:
            if x.websocket == item.websocket:
                return True
        return False

    def __len__(self) -> int:
        return len(self._queue)

    def __str__(self) -> str:
        return str(self._queue)
