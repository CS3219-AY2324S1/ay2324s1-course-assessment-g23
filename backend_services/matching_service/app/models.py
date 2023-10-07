import queue

from fastapi import WebSocket
from pydantic import BaseModel


class User(BaseModel):
    id: str
    difficulty: str


class Match(BaseModel):
    user1: User
    user2: User


# Queues for each difficulty level
queues: dict[str, queue.Queue[tuple[User, WebSocket]]] = {
    "easy": queue.Queue(),
    "medium": queue.Queue(),
    "hard": queue.Queue(),
}
