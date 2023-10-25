from data_classes import MessagePayload, Room, UserWebSocket
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware

# create app
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

rooms: dict[str, Room] = {}
"""Dict where keys are the room-ID, values are the room's info."""


@app.websocket("/ws/communication/{room_id}")
async def join_communication_channel(websocket: WebSocket, room_id: str):
    global rooms

    await websocket.accept()

    # If the room_id doesn't exist in the dict yet, create it.
    if room_id not in rooms:
        rooms[room_id] = Room()
    room = rooms[room_id]

    user_websocket = UserWebSocket(user_id="user_id", websocket=websocket)

    room.clients.append(user_websocket)

    chat_messages = room.chat_room.get_messages()
    for sender_id, message in chat_messages:
        await websocket.send_json({
            "event": "receive-message",
            "sender": sender_id,
            "message": message
        })

    try:
        while True:
            data: MessagePayload = await websocket.receive_json()
            event = data.get("event")
            if event == "send-message":
                message = data.get("message")
                sender = data.get("sender")
                room.chat_room.add_message(sender_id=sender, message=message)

                for client in room.clients:
                    if client.websocket != user_websocket.websocket:
                        await client.websocket.send_json({
                            "event": "receive-message",
                            "sender": sender,
                            "message": message
                        })

    except WebSocketDisconnect:
        room.clients.remove(websocket)


'''
payload = {
    "event": "send-message",
    "sender": "Yaladah",
    "message": "message"
}
'''
