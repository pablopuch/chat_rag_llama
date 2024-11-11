from fastapi import FastAPI, UploadFile, HTTPException, Depends
from typing import List, Dict
import os
import shutil
from langchain.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain.vectorstores import Chroma
from langchain import hub
from sqlalchemy.orm import Session
from langchain.chains import RetrievalQA
from langchain.llms import Ollama
from fastapi.middleware.cors import CORSMiddleware
from database.database import SessionLocal, Association
from models.requests import AssociationRequest, QuestionRequest, FileRequest


app = FastAPI()

# Permitir CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://192.168.1.140:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

api_key = os.getenv('API_KEY')
if not api_key:
    raise ValueError("API_KEY no está configurada correctamente.")

UPLOAD_DIRECTORY = "uploaded_docs"
os.makedirs(UPLOAD_DIRECTORY, exist_ok=True)

qa_chain = None

# Diccionario para asociar preguntas con archivos
questions_to_files: Dict[str, str] = {}



def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()



def load_document(file_path):
    loader = PyPDFLoader(file_path)
    return loader.load()

def split_text(data):
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000,)
    return text_splitter.split_documents(data)

def create_vectorstore(splits):
    embeddings = HuggingFaceEmbeddings(model_name='all-MiniLM-L6-v2')
    return Chroma.from_documents(documents=splits, embedding=embeddings)

def load_prompt():
    return hub.pull("llama-rag", api_key=api_key)

def configure_llm():
    return Ollama(model="llama3.1:latest", verbose=True)

def create_qa_chain(llm, vectorstore, prompt):
    return RetrievalQA.from_chain_type(
        llm=llm,
        retriever=vectorstore.as_retriever(),
        chain_type_kwargs={"prompt": prompt}
    )

def initialize_system(document):
    splits = split_text(document)
    vectorstore = create_vectorstore(splits)
    prompt = load_prompt()
    llm = configure_llm()
    global qa_chain
    qa_chain = create_qa_chain(llm, vectorstore, prompt)



# _______________________________________________________RUTAS___________________________________________________________

@app.post("/upload-docs/")
async def upload_docs(files: List[UploadFile]):
    for file in files:
        file_path = os.path.join(UPLOAD_DIRECTORY, file.filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        print(f"File uploaded: {file.filename}")  # Mensaje de depuración
    return {"message": "Documents uploaded successfully"}

@app.get("/list-docs/")
async def list_docs():
    files = [f for f in os.listdir(UPLOAD_DIRECTORY) if os.path.isfile(os.path.join(UPLOAD_DIRECTORY, f))]
    print(f"Files listed: {files}")  # Mensaje de depuración
    return {"documents": files}

@app.post("/associate-question/")
async def associate_question(request: AssociationRequest, db: Session = Depends(get_db)):
    if not os.path.isfile(os.path.join(UPLOAD_DIRECTORY, request.filename)):
        raise HTTPException(status_code=404, detail="File not found")

    db_item = db.query(Association).filter(Association.question == request.question).first()
    if db_item:
        db_item.filename = request.filename
    else:
        db_item = Association(question=request.question, filename=request.filename)
        db.add(db_item)
    
    db.commit()
    return {"message": "Question associated with document successfully"}

@app.get("/list-questions/")
async def list_questions(db: Session = Depends(get_db)):
    associations = db.query(Association).all()
    return {"questions": [{"question": a.question, "file": a.filename} for a in associations]}

@app.post("/process-doc/")
async def process_doc(request: FileRequest):
    filename = request.filename
    file_path = os.path.join(UPLOAD_DIRECTORY, filename)

    if not os.path.isfile(file_path):
        raise HTTPException(status_code=404, detail="File not found")

    document = load_document(file_path)
    initialize_system(document)

    return {"message": f"Document {filename} processed successfully"}



# Diccionario para almacenar el historial del chat
chat_memory: Dict[str, List[Dict[str, str]]] = {}

def store_interaction(user_id: str, question: str, answer: str):
    """Almacenar la interacción de un usuario en el historial de conversación."""
    if user_id not in chat_memory:
        chat_memory[user_id] = []
    chat_memory[user_id].append({"question": question, "answer": answer})

def get_chat_history(user_id: str) -> str:
    """Obtener el historial de conversación de un usuario."""
    if user_id not in chat_memory:
        return ""
    history = chat_memory[user_id]
    return "\n".join([f"Pregunta: {interaction['question']}\nRespuesta: {interaction['answer']}" for interaction in history])

@app.post("/ask-question/")
async def ask_question(request: QuestionRequest):
    if qa_chain is None:
        raise HTTPException(status_code=400, detail="System not initialized")

    user_id = request.user_id  # Suponiendo que agregas un user_id en la petición para identificar la sesión del usuario.
    
    # Recuperar el historial de conversación
    history = get_chat_history(user_id)
    
    # Formatear la pregunta incluyendo el historial de conversación
    formatted_question = f"Historial:\n{history}\n\nNueva pregunta: {request.question}"

    # Realizar la consulta al modelo
    result = qa_chain({"query": formatted_question})
    
    # Almacenar la nueva interacción
    store_interaction(user_id, request.question, result["result"])

    return {"response": result["result"]}






if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="192.168.1.140", port=8000)