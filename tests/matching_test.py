import asyncio
import websockets
import json


async def send_message():
    async with websockets.connect('ws://localhost:8000/ws') as ws:
        queue_message = {
            "action": "queue",
            "user_id": "1234",
            "complexity": "easy"
        }
        cancel_message = {
            "action": "cancel",
            "user_id": "1234",
            "complexity": "easy"
        }
        await ws.send(json.dumps(queue_message))
        response = await ws.recv()
        response = json.loads(response)
        print("Response: ", response)

if __name__ == "__main__":
    asyncio.run(send_message())
