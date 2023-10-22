from dataclasses import dataclass, field
from typing import TypedDict

from fastapi import WebSocket

@dataclass
class UserWebSocket:
    """Representation of a user (with their corresponding websocket)."""

    user_id: str
    websocket: WebSocket

class ChatRoom:
    def __init__(self):
        self.chat_messages = []

    def add_message(self, sender_id, message):
        message_entry = (sender_id, message)
        self.chat_messages.append(message_entry)

    def get_messages(self):
        return self.chat_messages

    def get_messages_in_order(self):
        return [message for sender_id, message in self.chat_messages]

@dataclass
class Room:
    """Represents a room, containing the websockets of all clients in the room
    """

    clients: list[UserWebSocket] = field(default_factory=list)
    chat_room: ChatRoom = field(default_factory=ChatRoom)


class MessagePayload(TypedDict):
    event: str
    sender: str
    message: str
    