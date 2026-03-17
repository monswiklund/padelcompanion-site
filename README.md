# Padel Companion

This repo contains the web app and a minimal tournament session backend for
sharing and restoring tournament state across devices.

## Local development

Frontend only:

```bash
npm run dev
```

Frontend + backend:

```bash
npm run dev:full
```

Backend only:

```bash
npm run api
```

Run the PostgreSQL migration:

```bash
npm run api:migrate
```

The frontend uses `/api` during development and Vite proxies it to
`http://localhost:8787`.

## Backend storage

The backend supports two storage modes:

- `file`: default local fallback using `backend/data/sessions.json`
- `postgres`: enabled when `DATABASE_URL` is set

Healthcheck:

```bash
curl http://localhost:8787/api/health
```

## PostgreSQL setup

1. Copy [backend/.env.example](/Users/mans/Dev/padelcompanion-site/backend/.env.example) into your runtime environment.
2. Create a PostgreSQL database.
3. Run `npm run api:migrate` or apply [001_create_tournament_sessions.sql](/Users/mans/Dev/padelcompanion-site/backend/migrations/001_create_tournament_sessions.sql).
4. Start the backend with `DATABASE_URL` set.

Example:

```bash
export DATABASE_URL='postgresql://postgres:postgres@localhost:5432/padel_companion'
node backend/server.js
```

## Hetzner direction

For a first production version on a Hetzner VM:

- run the frontend as static assets behind Caddy
- run `backend/server.js` as a separate service
- use PostgreSQL as the primary session store
- keep the current file store only as local-development fallback
- use [docker-compose.api.yml](/Users/mans/Dev/padelcompanion-site/ops/docker-compose.api.yml) to attach the API to the existing Docker network
- use [Caddyfile.padel_companion.example](/Users/mans/Dev/padelcompanion-site/ops/Caddyfile.padel_companion.example) as the reverse-proxy snippet
