# Project Setup

This document provides the commands to set up a project consisting of a FastAPI backend and a React frontend using Vite.

## Table of Contents

- [Backend Setup (FastAPI)](#backend-setup-fastapi)
- [Frontend Setup (React with Vite)](#frontend-setup-react-with-vite)
- [General Commands](#general-commands)

## Backend Setup (FastAPI)

### Create and Activate Virtual Environment

Create a virtual environment

`python -m venv env`

Activate the virtual environment

**macOS/Linux**

`source env/bin/activate`

**Windows**

`.\env\Scripts\activate`

### Install Dependencies

Install FastAPI and Uvicorn

`pip install fastapi uvicorn`

### Run the FastAPI Server

Run the FastAPI development server

`uvicorn main:app --reload`

Replace `main:app` with the appropriate module and application instance name if different.

## Frontend Setup (React with Vite)

### Install Node.js and npm

Make sure you have Node.js and npm installed. You can download them from [nodejs.org](https://nodejs.org/).

### Create the React Project with Vite

Create a new React project using Vite

`npm create vite@latest my-react-app --template react`

Change into the project directory

`cd my-react-app`

### Install Dependencies

Install the project dependencies

`npm install`

### Start the React Development Server

Run the React development server

`npm run dev`

## General Commands

### Generate `requirements.txt` for Python Dependencies

Generate a `requirements.txt` file with all installed packages in the Python environment

`pip freeze > requirements.txt`

### Clean Terminal

Clear the terminal screen

**macOS/Linux**

`clear`

**Windows**

`cls`

This README provides a starting point for setting up both the backend and frontend environments. Ensure that you have the necessary tools and permissions to run these commands.
