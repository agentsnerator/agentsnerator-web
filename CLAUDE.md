# AgentsNerator — Claude Code Context

## Project Identity
- **Name:** AgentsNerator (agentsnerator.com)
- **Concept:** AI Agents Marketplace — agents as tradeable digital assets with ownership, lineage, and royalties
- **Tagline:** "Agency-in-a-Box" for Arab digital agencies (Gulf, Egypt, North Africa)
- **Repo:** github.com/agentsnerator/agentsnerator-web

---

## Tech Stack

### Frontend
- Next.js 16.2.3 (App Router)
- React 19
- TypeScript (strict)
- Tailwind CSS
- Clerk v7 (auth)

### Backend / Database
- Supabase (PostgreSQL + RLS + Realtime)
- Supabase vector store (pgvector)
- SQL trigger: `auto_create_ceo_agent` — fires on every new project creation

### AI / Automation
- n8n self-hosted at `n8n.passtop.store` (Hostinger VPS: 31.97.47.86)
- Groq API — model: `llama-3.3-70b-versatile`
- Pollinations.ai (image generation)

### Infrastructure
- Vercel (frontend deployment)
- Docker + Traefik + Let's Encrypt SSL
- Paperclip at `paperclip.passtop.store` (monitoring — NO Anthropic API inside)

### Wallet System
- Neutrons (internal currency)
- USDT (external)
- Dual-currency wallet with conversion logic

---

## Active n8n Workflows

| Workflow | Status | Notes |
|----------|--------|-------|
| CEO Agent | ✅ Active | Auto-called via SQL trigger |
| Writer Agent | ✅ Active | Called by CEO Agent |
| Keyword Researcher Agent | ✅ Active | Standalone |
| Social Media Agent | ✅ Active | Latest built |

---

## Core Platform Features

1. **Hierarchical Agent Teams** — CEO Agent orchestrates sub-agents
2. **Clone Lineage Royalties** — decay across generations
3. **Penalty/Exit System** — agent scoring
4. **Widget Support** — "Powered by AgentsNerator" branding
5. **Agent Marketplace** — buy/sell/clone agents

---

## Coding Standards

### General
- TypeScript strict mode — no `any`, no implicit types
- Functional components only (React)
- Server Components by default, Client Components only when needed
- No manual state when server state works

### File Structure
```
/app              → Next.js App Router pages
/components       → Shared UI components
/lib              → Utilities, helpers, Supabase client
/hooks            → Custom React hooks
/types            → TypeScript interfaces
/n8n-workflows    → Exported n8n JSON workflows
```

### Naming Conventions
- Components: `PascalCase`
- Hooks: `use` prefix — `useAgentScore`
- DB tables: `snake_case`
- API routes: kebab-case — `/api/agent-create`

### Supabase Patterns
- Always use RLS policies — never bypass
- UUID primary keys everywhere
- Timestamps: `created_at`, `updated_at` on all tables
- Dedup pattern: `DELETE WHERE created_at NOT IN (SELECT MIN(created_at)...)`

### n8n Patterns (CRITICAL)
- Groq HTTP Request: build JSON body in Code node → reference via `{{ $json.request_body }}`
- Variables inside Code nodes: use `$input.item.json` (NOT `$json`)
- Expression mode: `fx` toggle must be explicitly enabled
- Never hardcode API keys — use n8n Credentials

---

## Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

# n8n
N8N_BASE_URL=https://n8n.passtop.store
N8N_WEBHOOK_SECRET=

# AI
GROQ_API_KEY=
POLLINATIONS_API_URL=https://image.pollinations.ai
```

---

## Development Workflow

### Before coding
1. Check existing components in `/components` before creating new ones
2. Check Supabase schema for existing tables/columns
3. Verify n8n webhook URLs are correct

### When building features
1. Schema first (Supabase migration)
2. Types second (`/types`)
3. API route / Server Action third
4. UI last

### When debugging n8n
1. Check Code node uses `$input.item.json`
2. Check `fx` toggle is enabled on expression fields
3. Check Groq request body is built in Code node
4. Test webhook with manual trigger first

---

## What NOT to Do
- ❌ Never use Anthropic API inside Paperclip
- ❌ Never bypass Supabase RLS
- ❌ Never use `any` in TypeScript
- ❌ Never create new Supabase tables without RLS policies
- ❌ Never hardcode secrets in code
- ❌ Never use client-side fetch for Supabase when server-side is possible

---

## Agent Architecture (Business Logic)

```
Project Created
    ↓
auto_create_ceo_agent (SQL trigger)
    ↓
CEO Agent (n8n) — orchestrates
    ↓
Writer Agent / Keyword Agent / Social Media Agent
    ↓
Results stored in Supabase
```

### Royalty System
- Clone generation tracked in `clone_lineage` table
- Royalty % decays per generation: Gen1=10%, Gen2=5%, Gen3=2.5%...
- Payments processed via Neutrons wallet

---

## Useful Commands

```bash
# Dev
npm run dev

# Type check
npx tsc --noEmit

# Supabase local
npx supabase start
npx supabase db push

# Deploy
git push origin main  # Auto-deploys to Vercel
```

---

## Key Contacts / Services
- n8n dashboard: https://n8n.passtop.store
- Paperclip: https://paperclip.passtop.store
- Supabase project: [your project URL]
- Vercel dashboard: [your project URL]
