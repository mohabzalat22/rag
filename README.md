# RAG — Retrieval-Augmented Chat Application

A modern Retrieval-Augmented Generation (RAG) chat application built with Next.js, Prisma + Postgres, and Google GenAI (Gemini). The app provides an authenticated chat UI, stores chats and messages, and generates streaming AI responses from Google GenAI using conversation context.

## Highlights

- Next.js (App Router) frontend and server actions
- Prisma ORM with Postgres (adapter: @prisma/adapter-pg)
- Authentication via Clerk
- Google GenAI (Gemini) used for streaming assistant responses
- Stores chats, messages, and prompts in Postgres

## What this app does

1. Users sign in (Clerk) and can create chats.
2. Messages are stored in Postgres through Prisma repositories and services.
3. When a user asks something, the server gathers the chat context and streams a response from Google GenAI (via the `services/OpenaiService`).
4. The UI shows chat lists, messages, and a streaming assistant response experience.

## Repo structure (top-level)

- `app/` — Next.js App Router pages, API routes and layout
- `components/` — React components (chat UI, sidebar, inputs, etc.)
- `services/` — Application services (chat, message, openai/google-genai wrappers)
- `repositories/` — Database access (chat, message, user)
- `prisma/` — Prisma schema, client generation and migrations
- `public/` — Static assets
- `types/` — Shared TypeScript types

## Quick start (local)

Prerequisites:

- Node.js 18+ (recommended)
- Postgres (local or remote)
- Clerk account (for auth)
- Google Cloud / GenAI API access with a key (Gemini)

1. Install dependencies

```bash
npm install
```

2. Create a `.env` file in the repo root with the values below or just use .env.example (example):

```
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/rag_db

# Google GenAI API key used by services/openai.service.ts
GOOGLE_SECRET=your_google_genai_api_key

# Clerk (authentication)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...
NEXT_PUBLIC_CLERK_DOMAIN=your-clerk-domain

# Other (optional)
NEXT_PUBLIC_VERCEL_URL=http://localhost:3000
```

3. Run database migrations (Prisma)

If you need to apply migrations locally (development):

```bash
npx prisma migrate deploy
# or for development migrations (interactive):
npx prisma migrate dev
```

4. Run the development server

```bash
npm run dev
```

Open http://localhost:3000 to view the app.

## Environment variables (summary)

- DATABASE_URL — Postgres connection string used by Prisma
- GOOGLE_SECRET — API key for Google GenAI (Gemini)
- NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY — Clerk publishable key (client)
- CLERK_SECRET_KEY — Clerk secret key (server)
- NEXT_PUBLIC_CLERK_DOMAIN — Clerk domain if applicable

Note: There may be other Clerk environment variables used by the Clerk SDK (see app config or Clerk docs). The repo also references several `NEXT_PUBLIC_CLERK_*` variables — keep your Clerk configuration consistent with your Clerk dashboard.

## How the pieces fit

- UI (app/pages & components): handles chat list, message input and streaming display.
- Repositories (`repositories/`) abstract DB access (Chat, Message, User).
- Services (`services/`):
	- `openai.service.ts` wraps Google GenAI (Gemini) and exposes a `respond` streaming method. It expects `GOOGLE_SECRET` to be set.
	- `message.service.ts`, `chat.service.ts`, etc. orchestrate DB reads/writes and business logic.
- Prisma (`prisma/`): schema and generated client used by repositories and services.

## Running tests & linters

- Lint: `npm run lint`
- Lint fix: `npm run lint:fix`

(There are no automated tests included by default in this repository — adding unit and integration tests is recommended as a next step.)

## Deployment notes

- Set environment variables in your hosting provider (Vercel, Render, Fly, etc.).
- Ensure your Postgres instance is reachable by the deployed app and `DATABASE_URL` is set.
- Clerk keys and Google GenAI key must be configured in the production environment.

If deploying to Vercel, you can use the standard Next.js build pipeline:

```bash
npm run build
npm start
```

## Security & costs

- Google GenAI calls will incur costs — be mindful of usage and configure rate-limiting / quotas as needed.
- Keep API keys and database credentials out of version control. Use your host's secret manager or `.env` in local development (do not commit `.env`).

## Next steps / Recommendations

- Add tests (unit & integration) for services and repositories.
- Add a small seed script to create demo users & chats for development.
- Add monitoring/telemetry for API usage and GenAI streaming errors.
- Consider adding moderation/safety checks for user-supplied messages.

## Useful commands

- Install: `npm install`
- Dev: `npm run dev`
- Build: `npm run build`
- Start (production): `npm run start`
- Lint: `npm run lint`

## Credits

This project uses:

- Next.js
- React
- Prisma + @prisma/adapter-pg
- Clerk (authentication)
- Google GenAI (Gemini)

---

If you want, I can also:

- Add a simple `.env.example` file to the repo with the variables above.
- Create a short dev-seed script to populate the DB with sample data.

Tell me which of those you'd like next.
