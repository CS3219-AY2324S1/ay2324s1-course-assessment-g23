import uuid
from fastapi import FastAPI, Cookie
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response

import requestModels as rm
import database as db
from database_functions import user_functions as uf, question_functions as qf, session_functions as sf

# create app
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost", "http://localhost:80"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/users", status_code=200)
async def create_user(r: rm.CreateUser):
    user_id = str(uuid.uuid4())
    return uf.create_user(user_id, r.username, r.email, r.password)

@app.get("/users/{user_id}", status_code=200)
async def get_user(user_id: str, session_id: str | None = Cookie(None)):
    return uf.get_user(user_id, session_id)

@app.delete("/users/{user_id}", status_code=200)
async def delete_user(user_id: str, session_id: str | None = Cookie(None)):
    return uf.delete_user(user_id, session_id)

@app.put("/users", status_code=200)
async def update_user_info(r: rm.UpdateUserInfo, session_id: str | None = Cookie(None)):
    return uf.update_user_info(r.user_id, r.username, r.password, r.email, r.role, session_id)

@app.post("/questions", status_code=200)
async def create_question(r: rm.CreateQuestion, session_id: str | None = Cookie(None)):
    question_id = str(uuid.uuid4())
    return qf.create_question(question_id, r.title, r.description, r.category, r.complexity, session_id)

@app.get("/questions/{question_id}", status_code=200)
async def get_question(question_id: str, session_id: str | None = Cookie(None)):
    return qf.get_question(question_id, session_id)

@app.put("/questions", status_code=200)
async def update_question_info(r: rm.UpdateQuestionInfo, session_id: str | None = Cookie(None)):
    return qf.update_question_info(r.question_id, r.title, r.description, r.category, r.complexity, session_id)

@app.delete("/questions/{question_id}", status_code=200)
async def delete_question(question_id: str, session_id: str | None = Cookie(None)):
    return qf.delete_question(question_id, session_id)

@app.post("/sessions",  status_code=200)
async def user_login(r: rm.UserLogin, response: Response):
    result = sf.user_login(r.username, r.password)
    response.set_cookie(key="session_id", value=result['session_details']['session_id'])
    return result

@app.get("/sessions",  status_code=200)
async def get_session(session_id: str | None = Cookie(None)):
    return sf.get_session(session_id)

@app.delete("/sessions",  status_code=200)
async def user_logout(session_id: str | None = Cookie(None)):
    return sf.user_logout(session_id)
