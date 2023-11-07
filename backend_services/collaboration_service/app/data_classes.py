from dataclasses import dataclass, field
from typing import Any, TypedDict

from fastapi import WebSocket


@dataclass
class Room:
    """Represents a room, containing the websockets of all clients in the room,
    and the current full document string.
    """

    clients: list[WebSocket] = field(default_factory=list)
    full_document: str = ""


class _QuillData(TypedDict):
    delta: dict[str, Any]
    fullDoc: str


class QuillPayload(TypedDict):
    event: str
    data: _QuillData
