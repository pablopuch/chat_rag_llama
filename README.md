# Chat-file

Here are the steps to download and install your document chat with LLM Llama 3.1.

![Descripción del GIF](resources/chat-llama.gif)



## Installation

Clone repo

bash
git clone https://github.com/pablopuch/chat_rag_llama.git


Move to frontend

bash
cd frontend/


Installation npm

bash
npm install


Move to backend

bash
cd backend/

Create a virtual environment


py -m venv env


Activate the virtual environment

*macOS/Linux*


source env/bin/activate


*Windows*


.\env\Scripts\activate


Install dependencias


 pip install -r requirements.txt


Put API KEY with specific prompts in Windows

$env:API_KEY = "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"


Put API KEY with specific prompts in Linux

export API_KEY="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"



Run backend


fastapi run


Run server ollama


ollama server
 

Run frontend


npm run dev