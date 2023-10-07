from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware

from .matchmaking import matchmake
from .models import User

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.websocket("/ws/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: str):
    await websocket.accept()
    while True:
        data = await websocket.receive_text()
        user_data = User.parse_raw(data)

        # Perform matchmaking
        await matchmake(user_data, websocket)
