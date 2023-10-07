import logging

from fastapi import WebSocket

from .models import Match, User, queues

logging.basicConfig(level=logging.INFO)


async def matchmake(user_data: User, websocket: WebSocket):
    logging.info(f"User {user_data.id} queued for {user_data.difficulty} difficulty.")
    if user_data.difficulty in queues:
        queues[user_data.difficulty].put((user_data, websocket))

        # Check if we can form a match
        if queues[user_data.difficulty].qsize() >= 2:
            user1_data, user1_ws = queues[user_data.difficulty].get()
            user2_data, user2_ws = queues[user_data.difficulty].get()

            # Notify users of the match
            match = Match(user1=user1_data, user2=user2_data)
            await user1_ws.send_text(f"Match found: {match.json()}")
            await user2_ws.send_text(f"Match found: {match.json()}")
