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

> The container always uses **Node 22 + its bundled npm** — no need for `nvm use` on the host.

### Dev (hot reload)

From the project root:

```bash
# First run — builds the image and starts the dev server
docker compose up --build

# Subsequent runs — skip the build step
docker compose up
```

The dev server starts on `http://localhost:3000` with hot reload via a volume mount.
Source changes in `./frontend` are reflected immediately inside the container.

### Production image

`NEXT_PUBLIC_*` env vars are baked into the bundle at build time, so they must be available when building the image:

```bash
cd frontend
docker build \
  --build-arg NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co \
  --build-arg NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key \
  -t pomopet-frontend .
docker run -p 3000:3000 pomopet-frontend
```

Or export them first:

```bash
export NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
export NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key

docker build \
  --build-arg NEXT_PUBLIC_SUPABASE_URL \
  --build-arg NEXT_PUBLIC_SUPABASE_ANON_KEY \
  -t pomopet-frontend .
docker run -p 3000:3000 pomopet-frontend
```

App runs on `http://localhost:3000`.

## Notes
- Starter selection happens on first dashboard visit for guests.
- Guest progress persists locally; the demo register/login endpoints do not persist across restarts.
