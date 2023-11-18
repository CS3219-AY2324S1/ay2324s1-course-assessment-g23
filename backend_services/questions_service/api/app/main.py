from controllers import questions_controller as qc
from fastapi import Depends, FastAPI, status
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from shared_definitions.api_models.error import stringify_exception_handler
from shared_definitions.api_models.questions import (
    CreateQuestionRequest,
    CreateQuestionResponse,
    DeleteQuestionResponse,
    GetQuestionResponse,
    UpdateQuestionRequest,
    UpdateQuestionResponse,
)
from shared_definitions.auth.fastapi_dependencies import (
    require_logged_in,
    require_maintainer_role,
)

# create app
app = FastAPI(dependencies=[Depends(require_logged_in)])

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(*args):
    return await stringify_exception_handler(*args)


@app.post(
    "/questions",
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(require_maintainer_role)],
)
async def create_question(r: CreateQuestionRequest) -> CreateQuestionResponse:
    return qc.create_question(r.title, r.description, r.category, r.complexity)


@app.get("/questions/{question_id}")
async def get_question(question_id: str) -> GetQuestionResponse:
    return qc.get_question(question_id)


@app.get("/questions_all")
async def get_all_questions() -> list[GetQuestionResponse]:
    return qc.get_all_questions()


@app.put("/questions", dependencies=[Depends(require_maintainer_role)])
async def update_question_info(r: UpdateQuestionRequest) -> UpdateQuestionResponse:
    return qc.update_question_info(r.question_id, r.title, r.description, r.category, r.complexity)


@app.delete("/questions/{question_id}", dependencies=[Depends(require_maintainer_role)])
async def delete_question(question_id: str) -> DeleteQuestionResponse:
    return qc.delete_question(question_id)
