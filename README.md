# MoneyMind

MoneyMind is a digital banking experience platform built with Next.js 14, TypeScript, TailwindCSS, shadcn-style UI primitives, Supabase, OpenAI, and Recharts.

## Stack

- Next.js 14 App Router
- TypeScript
- TailwindCSS
- Supabase Auth + Postgres + RLS
- OpenAI API
- Recharts

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Create an environment file:

```bash
cp .env.example .env.local
```

3. Add the required variables:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
OPENAI_API_KEY=your_openai_api_key
OPENAI_MODEL=gpt-4o-mini
```

4. Run the development server:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Supabase Setup

1. Create a Supabase project.
2. Run [`database/schema.sql`](/home/bacancy/Documents/MoneyMind/database/schema.sql) in the SQL editor.
3. Run [`database/seed.sql`](/home/bacancy/Documents/MoneyMind/database/seed.sql) to populate the workspace with sample data.
4. Run [`database/realtime.sql`](/home/bacancy/Documents/MoneyMind/database/realtime.sql) to enable realtime publications for app tables.
5. Add your project URL and anon key to `.env.local`.

The schema includes:

- `users`
- `accounts`
- `transactions`
- `transfers`
- `cards`
- `notifications`
- `ai_insights`

It also enables Row Level Security and creates the `execute_transfer` RPC used by the transfer flow.

## Product Areas

- `/login` and `/signup` for authentication
- `/dashboard` for balances, charting, transactions, notifications, and AI copilot
- `/accounts` for account summaries and onboarding new checking/savings/credit wallets (users can spin up accounts + optional opening balance via `POST /api/accounts`).
- `/transactions` for search, filters, and pagination
- `/transfer` for money movement once two linked accounts exist
- `/cards` for freeze and payment controls
- `/notifications` for alerts
- `/insights` for AI-driven guidance
- `/admin` for platform reporting

## Notes

- The AI copilot falls back to deterministic insights if `OPENAI_API_KEY` is not set.
- Card and transfer actions are fully wired to Supabase when configured.
- The admin page assumes the seeded user has the `admin` role.
- For OAuth login (Google/GitHub), enable providers in Supabase Auth settings and add callback URL: `http://localhost:3000/auth/callback` (and your deployed URL equivalent).
