from pydantic import BaseModel

class QuestionRequest(BaseModel):
    question: str

class FileRequest(BaseModel):
    filename: str

class AssociationRequest(BaseModel):
    question: str
    filename: str