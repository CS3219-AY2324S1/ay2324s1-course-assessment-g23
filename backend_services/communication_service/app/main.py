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


@app.websocket("/communication/{room_id}/{user_id}")
async def join_communication_channel(websocket: WebSocket, room_id: str, user_id: str):
    global rooms

    await websocket.accept()

    # If the room_id doesn't exist in the dict yet, create it.
    if room_id not in rooms:
        rooms[room_id] = Room()
    room = rooms[room_id]

    user_websocket = UserWebSocket(user_id=user_id, websocket=websocket)

    if room.is_full():
        await websocket.send_json(
            {
                "event": "room-full",
                "message": "The room is already full. You cannot join at the moment.",
            }
        )
        await websocket.close()
        return

    room.add_user(user_websocket)

    chat_messages = room.chat_room.get_messages()
    for sender_id, message, msg_type in chat_messages:
        if msg_type == "message":
            await websocket.send_json(
                {
                    "event": "receive-message",
                    "sender": sender_id,
                    "message": message,
                    "msg_type": msg_type,
                }
            )
        elif msg_type == "join":
            await websocket.send_json(
                {"event": "join-room", "sender": sender_id, "message": "", "msg_type": msg_type}
            )
        elif msg_type == "leave":
            await websocket.send_json(
                {"event": "leave-room", "sender": sender_id, "message": "", "msg_type": msg_type}
            )

    try:
        while True:
            data: MessagePayload = await websocket.receive_json()
            event = data.get("event")
            if event == "send-message":
                message = data.get("message")
                sender = data.get("sender")
                room.chat_room.add_message(sender_id=sender, message=message, msg_type="message")
                for client_id, client in room.clients.items():
                    if client_id != user_websocket.user_id:  # Exclude the sender
                        await client.websocket.send_json(
                            {"event": "receive-message", "sender": sender, "message": message}
                        )
            elif event == "join-room":
                sender = data.get("sender")
                room.chat_room.add_message(sender_id=sender, message="", msg_type="join")
                for client_id, client in room.clients.items():
                    if client_id != user_websocket.user_id:  # Exclude the sender
                        await client.websocket.send_json(
                            {
                                "event": "join-room",
                                "sender": sender,
                            }
                        )
            elif event == "leave-room":
                sender = data.get("sender")
                room.chat_room.add_message(sender_id=sender, message="", msg_type="leave")
                for client_id, client in room.clients.items():
                    if client_id != user_websocket.user_id:  # Exclude the sender
                        await client.websocket.send_json(
                            {
                                "event": "leave-room",
                                "sender": sender,
                            }
                        )
            elif event == "update-question":
                question_id = data.get("question_id")
                for client_id, client in room.clients.items():
                    if client_id != user_websocket.user_id:
                        await client.websocket.send_json(
                            {"event": "update-question", "question_id": question_id}
                        )
            elif event == "update-language":
                language = data.get("language")
                for client_id, client in room.clients.items():
                    if client_id != user_websocket.user_id:
                        await client.websocket.send_json(
                            {"event": "update-language", "language": language}
                        )

    except WebSocketDisconnect:
        if user_websocket.user_id in room.clients:
            for client_id, client in room.clients.items():
                if client_id != user_websocket.user_id:
                    await client.websocket.send_json({
                        "event": "leave-room",
                        "sender": user_websocket.user_id,
                    })
            room.remove_user(user_websocket.user_id)
            
            if room.is_empty():
                del rooms[room_id]
    except RuntimeError as e:
        if "WebSocket is not connected" in str(e):
            return
        raise e

clients = []


@app.websocket("/communication_video/{room_id}/{user_id}")
async def join_video_channel(websocket: WebSocket, room_id: str, user_id: str):
    global clients

    await websocket.accept()
    clients.append(websocket)
    try:
        while True:
            data = await websocket.receive_json()
            event = data["event"]
            if event == "join-video":
                p2p_id = data["p2pId"]
                for client in clients:
                    if client is not websocket:
                        await client.send_json(
                            {
                                "event": "join-video",
                                "p2pId": p2p_id,
                            }
                        )
    except WebSocketDisconnect:
        websocket.close()
        clients.remove(websocket)
