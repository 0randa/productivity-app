# PomoPet (Next.js Full Stack)

Gamified pomodoro productivity app built as a single Next.js project.

## Stack
- Frontend: Next.js 15, React 19, Chakra UI
- Backend (in-app): Next.js Route Handlers (`/api/*`)
- Runtime data: in-memory only (no persistence on restart/refresh)
- Optional orchestration: Docker Compose

## Quick Start (Local Dev)
```bash
cd frontend
npm install
npm run dev
```

App runs on `http://localhost:3000`.

## Docker
From project root:
```bash
docker compose up --build
```

## API Endpoints (Current)
- `POST /api/register`
- `POST /api/login`

`POST /api/register` expects:
```json
{
  "username": "ash",
  "email": "ash@example.com",
  "password": "secret"
}
```

## Notes
- Starter selection now happens on first dashboard visit.
- Session progress and users are intentionally non-persistent for now.
