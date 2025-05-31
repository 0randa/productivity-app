# [Pomo Timer]

"A full-stack application for user registration and task management built with React and Flask."

## Table of Contents

- [Description](#description)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Getting Started with Docker](#getting-started-with-docker)
  - [Building the Docker Images](#building-the-docker-images)
  - [Running the Application](#running-the-application)
  - [Accessing the Application](#accessing-the-application)
  - [Viewing Logs](#viewing-logs)
  - [Stopping the Application](#stopping-the-application)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Troubleshooting](#troubleshooting)
- [Future Enhancements](#future-enhancements)

## Description

<!-- Add descro[topm ;ater] -->

This project consists of a React (Next.js with Turbopack) frontend and a Python Flask backend. It uses a `data.json` file for simple data persistence on the backend.

## Features

- User Registration
- Features planned to implement
  - Pomodoro Timer
  - Your own Pokémon you can raise and gain experience when you complete a task

## Tech Stack

- **Frontend:** React, Next.js, Axios
- **Backend:** Python, Flask, Flask-CORS
- **Database:** JSON file (`data.json`)
- **Containerization:** Docker, Docker Compose

## Prerequisites

Before you begin, ensure you have met the following requirements:

- [Docker](https://www.docker.com/get-started) installed and running.
- [Docker Compose](https://docs.docker.com/compose/install/) installed (usually comes with Docker Desktop).
- A code editor (e.g., VS Code).
- A web browser.
- Git (for cloning the repository).

## Getting Started with Docker

These instructions will get your application up and running using Docker and Docker Compose.

1.  **Clone the repository (if you haven't already):**

    ```bash
    git clone [your-repository-url]
    cd [your-project-directory]
    ```

2.  **Ensure `data.json` is Initialized (Backend):**
    Make sure the `backend/src/data.json` file exists and has at least the following basic structure if it's the first time running or if you've cleared data:
    ```json
    {
      "users": [],
      "pets": [],
      "tasks": []
    }
    ```
    _The application attempts to handle an empty or missing `data.json`, but starting with this structure is safest._

### Building the Docker Images

This step "compiles" or builds the Docker images for your frontend and backend services based on their respective `Dockerfile`s.

1. Run `docker compose up --build` to compile
2. To run this again after compiling, `run docker compose up`, without the `--build`.
