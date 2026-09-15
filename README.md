# AI Emotional Support Assistant

A compassionate AI-powered mental wellness companion built as a final-year project. The application provides mood tracking, guided conversations, and emotional support through an AI chat interface.

---

## Requirements

| Tool | Version |
|------|---------|
| Node.js | ≥ 20 |
| pnpm | ≥ 9 |

Install pnpm if you don't have it:

```bash
npm install -g pnpm
```

---

## Quick Start

```bash
# 1. Install dependencies
pnpm install

# 2. Set up environment variables
cp .env.example apps/api/.env
# Edit apps/api/.env and set JWT_SECRET and OPENROUTER_API_KEY

# 3. Generate the database schema
pnpm db:generate

# 4. Run migrations (creates the SQLite database)
pnpm db:migrate

# 5. Start both frontend and backend
pnpm dev
```

The apps will be available at:

| App | URL |
|-----|-----|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:3000 |
| Health check | http://localhost:3000/api/health |

---

## Environment Variables

All environment variables for the backend live in `apps/api/.env`.

| Variable | Default | Description |
|----------|---------|-------------|
| `NODE_ENV` | `development` | Runtime environment |
| `PORT` | `3000` | API server port |
| `DATABASE_URL` | `./data/app.db` | Path to SQLite database file |
| `JWT_SECRET` | *(required)* | Secret for signing JWT tokens |
| `OPENROUTER_API_KEY` | *(optional now)* | OpenRouter API key for AI chat |
| `FRONTEND_URL` | `http://localhost:5173` | Allowed CORS origin |

---

## Database Setup

The project uses **SQLite** with **Drizzle ORM** — no database server required.

```bash
# Generate SQL migration files from the schema
pnpm db:generate

# Apply migrations (creates ./data/app.db)
pnpm db:migrate
```

The database file is stored at `data/app.db` (gitignored).

### Schema

| Table | Description |
|-------|-------------|
| `users` | Registered user accounts |
| `conversations` | Chat sessions per user |
| `messages` | Individual messages with AI risk flagging |
| `moods` | Mood check-in entries |

---

## Development Commands

```bash
pnpm dev          # Start frontend + backend concurrently
pnpm build        # Build both apps for production
pnpm lint         # Lint both apps
pnpm db:generate  # Generate Drizzle migration files
pnpm db:migrate   # Apply migrations to the SQLite database
```

Running a single app:

```bash
pnpm --filter @ai-esa/web dev    # Frontend only (port 5173)
pnpm --filter @ai-esa/api dev    # Backend only  (port 3000)
```

---

## Repository Structure

```text
ai-emotional-support/
├── apps/
│   ├── web/                  # React + Vite frontend
│   │   └── src/
│   │       ├── components/   # Reusable UI components
│   │       ├── pages/        # Route-level page components
│   │       ├── services/     # API client layer
│   │       ├── hooks/        # Custom React hooks
│   │       └── types/        # Frontend type definitions
│   └── api/                  # Fastify TypeScript backend
│       └── src/
│           ├── config/       # Environment configuration
│           ├── db/           # Drizzle ORM + schema + migrations
│           ├── routes/       # Fastify route definitions
│           ├── controllers/  # Request handlers
│           ├── services/     # Business logic
│           └── schemas/      # Zod validation schemas
├── packages/
│   └── shared/               # Shared TypeScript types
├── data/                     # SQLite database (gitignored)
├── .env.example              # Environment variable template
└── package.json              # Workspace root scripts
```

---

## Technology Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, TypeScript, Tailwind CSS, React Router |
| Backend | Fastify, TypeScript, Zod |
| Database | SQLite, better-sqlite3, Drizzle ORM |
| Auth | JWT (@fastify/jwt) |
| Monorepo | pnpm workspaces |

---

## What's Next

1. **Authentication** — Register / Login endpoints + JWT middleware
2. **AI Chat** — OpenRouter integration for conversational AI
3. **Mood Tracking** — Log and visualise mood over time
4. **Conversations** — Persistent chat history
5. **Risk Detection** — Flag high-risk messages for escalation
