import uuid
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware

from api_models.questions import CreateQuestionRequest, CreateQuestionResponse, DeleteQuestionResponse, GetQuestionResponse, UpdateQuestionRequest, UpdateQuestionResponse
from api_models.error import ServiceError
from controllers import questions_controller as qc

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

@app.post("/questions", status_code=200, response_model=None)
async def create_question(r: CreateQuestionRequest) -> CreateQuestionResponse | ServiceError:
    question_id = str(uuid.uuid4())
    return qc.create_question(question_id, r.title, r.description, r.category, r.complexity)

@app.get("/questions/{question_id}", status_code=200, response_model=None)
async def get_question(question_id: str) -> GetQuestionResponse | ServiceError:
    return qc.get_question(question_id)

@app.get("/questions_all", status_code=200, response_model=None)
async def get_all_questions() -> list[GetQuestionResponse]:
    return qc.get_all_questions()


@app.put("/questions", status_code=200, response_model=None)
async def update_question_info(r: UpdateQuestionRequest) -> UpdateQuestionResponse | ServiceError:
    return qc.update_question_info(r.question_id, r.title, r.description, r.category, r.complexity)

@app.delete("/questions/{question_id}", status_code=200, response_model=None)
async def delete_question(question_id: str) -> DeleteQuestionResponse | ServiceError:
    return qc.delete_question(question_id)