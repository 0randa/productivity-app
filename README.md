# PomoPet

Gamified pomodoro productivity app where focus sessions and tasks power Pokémon-style progression.

## Stack (current)
- Frontend: Next.js 16 (App Router), React 19, Tailwind CSS, Radix UI primitives
- Auth (client): Supabase auth session via `src/context/auth-context.jsx`
- API (server): Next.js Route Handlers in `frontend/src/app/api/*`
- Persistence:
  - Guest progress: local storage (see `src/lib/guest-storage`)
  - `/api/register` + `/api/login`: **in-memory** demo store (non-persistent)
- Tests:
  - Integration: Vitest + React Testing Library
  - E2E: Playwright

## Requirements
- Node.js **>= 20.9** (Next 16 requirement)

## Quick start (local dev)
```bash
cd frontend
npm install
npm run dev
```

App runs on `http://localhost:3000`.

## Testing
From `frontend/`:

### Integration tests
```bash
npm run test
```

### E2E tests
```bash
npm run test:e2e:install
npm run test:e2e
```

## API endpoints (current)
- `POST /api/register`
- `POST /api/login`

Example register body:
```json
{ "username": "ash", "email": "ash@example.com", "password": "secret" }
```

## Docker
From project root:
```bash
docker compose up --build
```

## Notes
- Starter selection happens on first dashboard visit for guests.
- Guest progress persists locally; the demo register/login endpoints do not persist across restarts.
