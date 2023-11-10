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

    def add_message(self, sender_id, message, msg_type):
        message_entry = (sender_id, message, msg_type)
        self.chat_messages.append(message_entry)

    def get_messages(self):
        return self.chat_messages


@dataclass
class Room:
    """Represents a room, containing the websockets of all clients in the room"""

    # clients: list[UserWebSocket] = field(default_factory=list)
    clients: dict[str, UserWebSocket] = field(default_factory=dict)
    chat_room: ChatRoom = field(default_factory=ChatRoom)

    def is_full(self) -> bool:
        return len(self.clients) > 2
    
    def is_empty(self) -> bool:
        return not bool(self.clients)
    
    def remove_user(self, user_id: str) -> None:
        if user_id in self.clients:
            del self.clients[user_id]
            
    def add_user(self, user: UserWebSocket) -> None:
        self.clients[user.user_id] = user
        
    def delete_if_empty(self, rooms_dict: dict[str, 'Room'], room_id: str) -> None:
        if self.is_empty():
            # Optionally, perform any cleanup or additional actions before deleting
            del rooms_dict[room_id]


@dataclass
class VideoRoom:
    """Represents a room, containing the websockets of all clients in the room"""

    # clients: list[UserWebSocket] = field(default_factory=list)
    clients: dict[str, UserWebSocket] = field(default_factory=dict)

    def is_full(self) -> bool:
        return len(self.clients) > 2


class MessagePayload(TypedDict):
    event: str
    sender: str
    message: str
