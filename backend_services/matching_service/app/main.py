import asyncio
import logging
import pprint
import random
import uuid

import requests
from data_classes import (
    Complexity,
    MatchRequest,
    MatchResponse,
    UserWebSocket,
    UserWebSocketQueue,
)
from fastapi import Cookie, Depends, FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.websockets import WebSocketState
from shared_definitions.auth.fastapi_dependencies import require_logged_in

TIMEOUT_MESSAGE = "Timed out. Couldn't find a match."
CANCEL_MESSAGE = "Queuing cancelled."
SUCCESS_MESSAGE = "Match found!"

QUEUE_TIMEOUT_SECONDS: int = 30
"""Seconds before a queued user times out and gets removed from the queue."""

logging.basicConfig(level=logging.INFO)

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

queues: dict[Complexity, UserWebSocketQueue] = {
    "easy": UserWebSocketQueue(),
    "medium": UserWebSocketQueue(),
    "hard": UserWebSocketQueue(),
}


@app.websocket("/matching", dependencies=[Depends(require_logged_in)])
async def websocket_endpoint(websocket: WebSocket, access_token: str | None = Cookie(None)):
    assert access_token is not None
    await websocket.accept()
    try:
        while True:
            json_data = await websocket.receive_json()
            payload = MatchRequest(**json_data)
            user = UserWebSocket(
                user_id=payload.user_id, websocket=websocket, access_token=access_token
            )

            match payload.action:
                case "queue":
                    assert payload.complexity is not None, "Missing `complexity` in queue payload."
                    await handle_queue(payload.complexity, user)
                    logging.info("[queued] Queues:\n%s", pprint.pformat(queues, width=-1))
                case "cancel":
                    await handle_cancel(user)
                    logging.info("[cancelled] Queues:\n%s", pprint.pformat(queues, width=-1))

    # Ignore exceptions related to websocket disconnecting.
    except WebSocketDisconnect:
        logging.info("[disconnected] Queues:\n%s", pprint.pformat(queues, width=-1))
    except RuntimeError as e:
        if "WebSocket is not connected" in str(e):
            return
        raise e

    finally:
        await handle_cleanup(websocket)


async def handle_queue(complexity: Complexity, user_1: UserWebSocket) -> None:
    queue = queues[complexity]

    # If no match, add user to queue and start timeout.
    if queue.is_empty():
        queue.push(user_1)
        user_1.timeout_task = asyncio.create_task(handle_timeout(complexity, user_1))
        return

    # If has match, send both users their matches and close both websockets.
    user_2 = queue.pop()
    user_2.timeout_task.cancel()

    new_room_id = str(uuid.uuid4())

    session = requests.Session()
    cookie = {"access_token": user_1.access_token}
    session.cookies.update(cookie)
    question_url = "http://api_gateway/api/questions/questions_all"
    response = session.get(question_url)
    all_questions = response.json()
    filtered_questions = [
        question for question in all_questions if question["complexity"].lower() == complexity
    ]
    random_question = random.choice(filtered_questions)
    rand_question_id = random_question["question_id"]

    await user_1.websocket.send_json(
        MatchResponse(
            is_matched=True,
            detail=SUCCESS_MESSAGE,
            user_id=user_2.user_id,
            room_id=new_room_id,
            question_id=rand_question_id,
        ).model_dump(mode="json")
    )
    await user_2.websocket.send_json(
        MatchResponse(
            is_matched=True,
            detail=SUCCESS_MESSAGE,
            user_id=user_1.user_id,
            room_id=new_room_id,
            question_id=rand_question_id,
        ).model_dump(mode="json")
    )

    await user_1.websocket.close()
    await user_2.websocket.close()


async def handle_cancel(user: UserWebSocket) -> None:
    for queue in queues.values():
        queue.remove_by_websocket(user.websocket)
    user.timeout_task.cancel()
    await user.websocket.send_json(
        MatchResponse(is_matched=False, detail=CANCEL_MESSAGE).model_dump(mode="json")
    )
    await user.websocket.close()


async def handle_cleanup(websocket: WebSocket) -> None:
    # Remove websocket from queue if it exists.
    for queue in queues.values():
        user = queue.remove_by_websocket(websocket)
        if user:
            user.timeout_task.cancel()

    try:
        # Close websocket if it hasn't closed yet.
        if websocket.client_state != WebSocketState.DISCONNECTED:
            await websocket.close()

    # Idk why, but sometimes this gets thrown.
    # It's something to do with `websocket.client_state == WebSocketState.DISCONNECTED`
    # while calling `websocket.close()`.
    # Idk how that manages to happen but this try-except ignores it.
    except RuntimeError as e:
        if 'Cannot call "send" once a close message has been sent' in str(e):
            return
        raise e


async def handle_timeout(complexity: Complexity, user: UserWebSocket) -> None:
    try:
        await asyncio.sleep(QUEUE_TIMEOUT_SECONDS)
        queue = queues[complexity]
        if user not in queue:
            return

        queue.remove_by_websocket(user.websocket)
        await user.websocket.send_json(
            MatchResponse(is_matched=False, detail=TIMEOUT_MESSAGE).model_dump(mode="json")
        )
        await user.websocket.close()

    # Ignore error from being cancelled.
    except asyncio.CancelledError:
        pass
