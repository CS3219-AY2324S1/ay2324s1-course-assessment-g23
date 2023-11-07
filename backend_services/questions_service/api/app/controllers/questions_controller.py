import uuid

from fastapi import HTTPException, status
from questions_database import QUESTIONS_DATABASE as db
from shared_definitions.api_models.questions import (
    CreateQuestionResponse,
    DeleteQuestionResponse,
    GetQuestionResponse,
    UpdateQuestionResponse,
)
from utils import questions_util


def create_question(
    title: str,
    description: str,
    category: str,
    complexity: str,
) -> CreateQuestionResponse:
    question_id = str(uuid.uuid4())
    while questions_util.qid_exists(question_id):
        question_id = str(uuid.uuid4())  # Regenerate UUID if there's conflict.

    if questions_util.title_exists(title):
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Title already exists")

    db.execute_sql_write(
        "INSERT INTO questions (question_id, title, description, category, complexity) VALUES (%s, %s, %s, %s, %s)",
        params=(question_id, title, description, category, complexity),
    )
    return CreateQuestionResponse(message=f"Question({question_id}) successfully created")


def get_all_questions() -> list[GetQuestionResponse]:
    FIELD_NAMES = ["question_id", "title", "description", "category", "complexity"]

    rows = db.execute_sql_read_fetchall(f"SELECT {', '.join(FIELD_NAMES)} FROM questions")
    questions = [dict(zip(FIELD_NAMES, row)) for row in rows]
    return [GetQuestionResponse(**q) for q in questions]  # type: ignore


def get_question(question_id: str) -> GetQuestionResponse:
    if not questions_util.qid_exists(question_id):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Question id does not exist"
        )

    FIELD_NAMES = ["question_id", "title", "description", "category", "complexity"]

    row = db.execute_sql_read_fetchone(
        f"SELECT {', '.join(FIELD_NAMES)} FROM questions WHERE question_id = %s",
        params=(question_id,),
    )
    assert row is not None
    question = dict(zip(FIELD_NAMES, row))
    return GetQuestionResponse(**question)  # type: ignore


def update_question_info(
    question_id: str, title: str, description: str, category: str, complexity: str
) -> UpdateQuestionResponse:
    if not questions_util.qid_exists(question_id):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Question does not exist")
    if questions_util.check_duplicate_title(question_id, title):
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Title already exists")

    db.execute_sql_write(
        """UPDATE questions
                        SET title = %s, description = %s, category = %s, complexity = %s
                        WHERE question_id = %s""",
        params=(title, description, category, complexity, question_id),
    )
    return UpdateQuestionResponse(message="Successfully updated")


def delete_all_questions() -> DeleteQuestionResponse:
    db.execute_sql_write("DELETE FROM questions")
    return DeleteQuestionResponse(message="All questions deleted")


def delete_question(question_id: str) -> DeleteQuestionResponse:
    if not questions_util.qid_exists(question_id):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Question does not exist")

    db.execute_sql_write("DELETE FROM questions WHERE question_id = %s", params=(question_id,))
    return DeleteQuestionResponse(message=f"Question({question_id}) deleted")
