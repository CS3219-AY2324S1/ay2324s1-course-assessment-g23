from data_classes import QuillPayload, Room
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


@app.websocket("/collab/{room_id}")
async def join_collab_editor(websocket: WebSocket, room_id: str):
    global rooms

    await websocket.accept()

    # If the room_id doesn't exist in the dict yet, create it.
    if room_id not in rooms:
        rooms[room_id] = Room()
    room = rooms[room_id]

    room.clients.append(websocket)

    # send current room document to newly connected client
    await websocket.send_json({"event": "open", "data": room.full_document})

    try:
        while True:
            data: QuillPayload = await websocket.receive_json()
            event = data.get("event")
            if event == "send-changes":
                payload = data.get("data")
                delta = payload.get("delta")
                room.full_document = payload.get("fullDoc")
                for client in room.clients:
                    if client != websocket:
                        await client.send_json({"event": "receive-changes", "data": delta})

    except WebSocketDisconnect:
        room.clients.remove(websocket)
