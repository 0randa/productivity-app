# PomoPet (Next.js + Flask)

Gamified pomodoro productivity app with:
- `frontend/`: Next.js app with Chakra UI
- `backend/`: Flask API for auth and task data

## Stack
- Frontend: Next.js 15, React 19, Chakra UI, Axios
- Backend: Flask, Flask-CORS
- Data store: JSON file (`backend/src/data.json`)
- Optional local orchestration: Docker Compose

## Quick Start (Local Dev)

### 1) Backend (Flask)
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cd src
python3 app.py
```
Backend runs on `http://localhost:8000`.

### 2) Frontend (Next.js)
```bash
cd frontend
npm install
npm run dev
```
Frontend runs on `http://localhost:3000`.

## Docker (Alternative)
From project root:
```bash
docker compose up --build
```

## API Endpoints (Current)
- `POST /register`
- `POST /login`

`POST /register` expects:
```json
{
  "username": "ash",
  "email": "ash@example.com",
  "password": "secret",
  "starter": "bulbasaur"
}
```
`starter` must be one of: `bulbasaur`, `charmander`, `squirtle`.

## Notes
- Frontend auth pages call Flask at `http://localhost:8000`.
- If you reset app data, initialize `backend/src/data.json` with:
```json
{
  "users": [],
  "pets": [],
  "tasks": []
}
```
