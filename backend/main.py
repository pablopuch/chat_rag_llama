from fastapi import FastAPI, UploadFile, File, HTTPException
from pydantic import BaseModel
from typing import List, Dict
import os
import shutil
from langchain.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain.vectorstores import Chroma
from langchain import hub
from langchain.chains import RetrievalQA
from langchain.llms import Ollama
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()

# Permitir CORS para que el frontend en React pueda comunicarse con el backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permitir todos los orígenes, restringir en producción
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

api_key = os.getenv('API_KEY')
if not api_key:
    raise ValueError("API_KEY no está configurada correctamente.")

# Directorio para almacenar archivos PDF cargados
UPLOAD_DIRECTORY = "uploaded_docs"

# Crear directorio si no existe
os.makedirs(UPLOAD_DIRECTORY, exist_ok=True)

# Global variable to store the QA chain
qa_chain = None

# Cargar el contenido de todos los archivos PDF en una carpeta
def load_documents(folder_path):
    all_documents = []
    for filename in os.listdir(folder_path):
        if filename.endswith('.pdf'):
            loader = PyPDFLoader(os.path.join(folder_path, filename))
            all_documents.extend(loader.load())
    return all_documents

# Dividir el texto en fragmentos
def split_text(data):
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000,)
    return text_splitter.split_documents(data)

# Crear el vectorstore a partir de los fragmentos de texto
def create_vectorstore(splits):
    embeddings = HuggingFaceEmbeddings(model_name='all-MiniLM-L6-v2')
    return Chroma.from_documents(documents=splits, embedding=embeddings)

# Descargar el prompt de RAG
def load_prompt():
    return hub.pull("llama-rag", api_key=api_key)

# Configurar el modelo de lenguaje Llama3.1 con Ollama
def configure_llm():
    return Ollama(model="llama3.1:latest", verbose=True)

# Configurar la cadena de preguntas y respuestas con recuperación
def create_qa_chain(llm, vectorstore, prompt):
    return RetrievalQA.from_chain_type(
        llm=llm,
        retriever=vectorstore.as_retriever(),
        chain_type_kwargs={"prompt": prompt}
    )

# Inicializar el sistema: cargar documentos, crear vectorstore y cadena de QA
def initialize_system():
    # 1. Cargar documentos desde la carpeta especificada
    data = load_documents(UPLOAD_DIRECTORY)
    
    # 2. Dividir en fragmentos
    all_splits = split_text(data)
    
    # 3. Crear el vectorstore
    vectorstore = create_vectorstore(all_splits)
    
    # 4. Cargar el prompt
    prompt = load_prompt()
    
    # 5. Configurar el LLM
    llm = configure_llm()
    
    # 6. Configurar la cadena de QA
    global qa_chain
    qa_chain = create_qa_chain(llm, vectorstore, prompt)

class QuestionRequest(BaseModel):
    question: str

@app.post("/upload-docs/")
async def upload_docs(files: List[UploadFile]):
    # Guardar los archivos PDF en el directorio
    for file in files:
        file_path = os.path.join(UPLOAD_DIRECTORY, file.filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    
    # Re-inicializar el sistema para procesar los nuevos documentos
    initialize_system()
    
    return {"message": "Documents uploaded and processed successfully"}

@app.post("/ask-question/")
async def ask_question(request: QuestionRequest):
    if qa_chain is None:
        raise HTTPException(status_code=400, detail="System not initialized")
    
    # Obtener la respuesta a la pregunta usando el QA chain
    result = qa_chain({"query": request.question})
    
    return {"response": result["result"]}

# Ejecutar el servidor de FastAPI
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)