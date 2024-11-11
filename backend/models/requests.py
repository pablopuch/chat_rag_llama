from pydantic import BaseModel

class QuestionRequest(BaseModel):
    user_id: str  # Identificador único de usuario
    question: str

class FileRequest(BaseModel):
    filename: str

class AssociationRequest(BaseModel):
    question: str
    filename: str