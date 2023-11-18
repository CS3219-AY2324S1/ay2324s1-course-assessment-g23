from typing import Literal

from pydantic import BaseModel, ValidationInfo, field_validator


class CreateQuestionRequest(BaseModel):
    title: str
    description: str
    category: str
    complexity: Literal["Easy", "Medium", "Hard"]

    @field_validator("title", "description", "category")
    @classmethod
    def check_title_not_empty_or_whitespace(cls, v: str, info: ValidationInfo) -> str:
        is_not_empty_or_whitespace = v.strip() != ""
        assert is_not_empty_or_whitespace, f"Input cannot be empty nor whitespaces-only"
        return v


class CreateQuestionResponse(BaseModel):
    message: str


class GetQuestionResponse(CreateQuestionRequest):
    question_id: str


class UpdateQuestionRequest(CreateQuestionRequest):
    question_id: str


class UpdateQuestionResponse(BaseModel):
    message: str


class DeleteQuestionResponse(BaseModel):
    message: str
