from typing import Optional
from pydantic import BaseModel

class CreateUser(BaseModel):
    username: str
    password: str
    email: str

class UpdateUserInfo(BaseModel):
    user_id: str
    username: Optional[str] = None
    password: Optional[str] = None
    email: Optional[str] = None

class CreateQuestion(BaseModel):
    title: str
    description: str
    category: str
    complexity: str

class UpdateQuestionInfo(BaseModel):
    question_id: str
    title: str
    description: str
    category: str
    complexity: str
