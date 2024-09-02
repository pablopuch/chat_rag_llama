# Project Setup

This document provides the commands to set up a project consisting of a FastAPI backend and a React frontend using Vite.

## Table of Contents

- [Backend Setup (FastAPI)](#backend-setup-fastapi)
- [Frontend Setup (React with Vite)](#frontend-setup-react-with-vite)
- [General Commands](#general-commands)

## Backend Setup (FastAPI)

### Create and Activate Virtual Environment

Create a virtual environment

```
python -m venv env
```

Activate the virtual environment

**macOS/Linux**

```
source env/bin/activate
```

**Windows**

```
.\env\Scripts\activate
```


### Install Dependencies

```
 pip install -r requirements.txt
```

### Run backend

```
fastapi dev main.py
```

## Frontend Setup (React with Vite)

### Install Node.js and npm

Make sure you have Node.js and npm installed. You can download them from [nodejs.org](https://nodejs.org/).

### Create the React Project with Vite

Create a new React project using Vite

```
npm create vite@latest my-react-app --template react
```


Change into the project directory

```
cd my-react-app
```


### Install Dependencies

Install the project dependencies

```
npm install
```


### Start the React Development Server

Run the React development server

```
npm run dev
```