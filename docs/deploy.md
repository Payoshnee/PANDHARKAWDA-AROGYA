# Free Deployment Guide

This project can be deployed for free as a demo, but not as a production healthcare platform without proper hosting, monitoring, data verification, and security review.

Recommended free demo setup:

| Layer | Free Option | Notes |
|---|---|---|
| Frontend | Vercel free plan | Best fit for the Next.js app in `apps/web`. |
| API | Render free web service, Railway trial/free credits, or Fly.io free allowance when available | Free API hosting changes often and may sleep when inactive. |
| PostgreSQL | Neon free tier or Supabase free tier | Use a managed Postgres URL instead of local Docker. |
| Redis | Upstash free tier | Optional until Redis-backed rate limits/jobs are fully wired. |
| AI | `LLM_PROVIDER=disabled`, OpenAI, or Azure OpenAI | Local Ollama works on your laptop, but hosted cloud services cannot call `localhost:11434`. |
| Domain | Vercel subdomain | Custom domains are optional. |

## Important Limits

- Do not publish unverified real doctor, facility, or phone data.
- Free hosts may sleep, cold start, throttle, or remove free tiers.
- Local Ollama is not directly deployable to Vercel/Render because `localhost` means the cloud server, not your Mac.
- If you need Ollama in production, deploy Ollama on a reachable server with authentication/network protection, or keep Ask Arogya in disabled/OpenAI/Azure mode for hosted demos.
- Run the full security and healthcare-content review before treating this as deployment-ready.

## Recommended Free Path

Use:

1. Neon or Supabase for Postgres.
2. Upstash for Redis.
3. Render for the FastAPI backend.
4. Vercel for the Next.js frontend.

This keeps the frontend fast and gives the API a normal public URL.

## Step 1: Prepare Environment Variables

Create production values from `.env.example`.

Backend variables:

```bash
DATABASE_URL=postgresql+asyncpg://USER:PASSWORD@HOST/DB?ssl=require
REDIS_URL=redis://default:PASSWORD@HOST:PORT
JWT_SECRET=use-a-long-random-secret
ADMIN_SESSION_COOKIE=arogya_admin
CORS_ORIGINS=https://your-vercel-app.vercel.app
LLM_PROVIDER=disabled
OPENAI_API_KEY=
OPENAI_MODEL=
AZURE_OPENAI_API_KEY=
AZURE_OPENAI_ENDPOINT=
AZURE_OPENAI_DEPLOYMENT=
AZURE_OPENAI_API_VERSION=
OLLAMA_BASE_URL=
OLLAMA_MODEL=
```

Frontend variable:

```bash
NEXT_PUBLIC_API_BASE_URL=https://your-api-host.example.com
```

For a hosted demo, start with `LLM_PROVIDER=disabled`. The deterministic emergency and local demo-content paths still work without a model provider.

## Step 2: Create Free Postgres

Neon option:

1. Create a Neon project.
2. Copy the pooled or direct connection string.
3. Make sure the URL is converted for SQLAlchemy async use:

```bash
postgresql+asyncpg://USER:PASSWORD@HOST/DB?ssl=require
```

Supabase option:

1. Create a Supabase project.
2. Copy the database connection string.
3. Convert `postgresql://` to `postgresql+asyncpg://`.

## Step 3: Create Free Redis

Upstash option:

1. Create an Upstash Redis database.
2. Copy the Redis connection URL.
3. Set it as `REDIS_URL` in the API host.

If Redis is not required for the current demo path, you can still provide the variable for future compatibility.

## Step 4: Deploy The API

Render example:

| Setting | Value |
|---|---|
| Service type | Web Service |
| Root directory | `apps/api` |
| Runtime | Python |
| Build command | `pip install .` |
| Start command | `python -m uvicorn app.main:app --host 0.0.0.0 --port $PORT` |

Add backend environment variables in the Render dashboard.

After deploy, test:

```bash
curl https://your-api-host.example.com/health
curl https://your-api-host.example.com/ready
```

Expected health response:

```json
{"status":"ok"}
```

## Step 5: Run Migrations

After the API environment variables are set, run migrations from a one-off shell on the API host:

```bash
alembic upgrade head
```

If the host does not provide a shell, run migrations locally against the hosted database:

```bash
cd apps/api
DATABASE_URL='postgresql+asyncpg://USER:PASSWORD@HOST/DB?ssl=require' alembic upgrade head
```

Only seed demo data if you are intentionally deploying a clearly fictional demo.

```bash
cd apps/api
DATABASE_URL='postgresql+asyncpg://USER:PASSWORD@HOST/DB?ssl=require' python -m app.seed
```

## Step 6: Deploy The Frontend

Vercel setup:

| Setting | Value |
|---|---|
| Framework | Next.js |
| Root directory | `apps/web` |
| Build command | `npm run build` |
| Output | Vercel auto-detect |

Set this Vercel environment variable:

```bash
NEXT_PUBLIC_API_BASE_URL=https://your-api-host.example.com
```

Deploy, then open the Vercel URL.

## Step 7: Update CORS

After Vercel gives you a URL, update the API environment:

```bash
CORS_ORIGINS=https://your-vercel-app.vercel.app
```

Redeploy or restart the API.

If you use preview deployments, add each preview URL or implement a safer preview-origin strategy before sharing admin flows.

## Step 8: AI Provider Choices

### Free/Safe Demo

```bash
LLM_PROVIDER=disabled
```

This avoids model cost and keeps Ask Arogya deterministic.

### OpenAI Hosted Demo

```bash
LLM_PROVIDER=openai
OPENAI_API_KEY=your-key
OPENAI_MODEL=gpt-4o-mini
```

### Azure OpenAI Hosted Demo

```bash
LLM_PROVIDER=azure_openai
AZURE_OPENAI_API_KEY=your-key
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com
AZURE_OPENAI_DEPLOYMENT=your-deployment
AZURE_OPENAI_API_VERSION=2024-02-15-preview
```

### Ollama

Local laptop:

```bash
LLM_PROVIDER=ollama
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama3:8b
```

Hosted API:

```bash
LLM_PROVIDER=ollama
OLLAMA_BASE_URL=https://your-private-ollama-host.example.com
OLLAMA_MODEL=llama3:8b
```

Do not expose Ollama publicly without authentication, firewall rules, or a private network.

## Step 9: Verify Deployment

Run these checks after deploy:

```bash
curl https://your-api-host.example.com/health
curl https://your-api-host.example.com/api/v1/meta
curl https://your-api-host.example.com/api/v1/doctors
```

Frontend checks:

```bash
NEXT_PUBLIC_API_BASE_URL=https://your-api-host.example.com npm --workspace apps/web run build
npm --workspace apps/web run lint
npm --workspace apps/web run typecheck
npm --workspace apps/web test
```

Browser checks:

| Page | What To Verify |
|---|---|
| `/` | Homepage loads and search does not crash. |
| `/emergency` | 108, 102, and 104 call links are visible. |
| `/doctors` | Demo doctors load from the API. |
| `/facilities` | Demo facilities load from the API. |
| `/ask-arogya` | Emergency prompt returns call-108 action. |
| `/admin/login` | Login screen loads over HTTPS. |

## Step 10: Deployment Readiness Gate

Before calling this production-ready, complete:

| Area | Required Before Production |
|---|---|
| Real data | Verified local data collection and source review. |
| Admin | Full DB-backed users, sessions, RBAC, CRUD, audit, and MFA plan. |
| Security | CSRF, CORS hardening, rate limits, IDOR tests, secret scan. |
| PWA | Manual device install/offline QA. |
| Monitoring | Error logging, uptime checks, request logs, backup checks. |
| Database | Migration-from-zero verification and backup/restore drill. |
| AI | Clinician-reviewed safety rules and broader multilingual evals. |

## Quick Command Summary

Local preflight:

```bash
npm --workspace apps/web run lint
npm --workspace apps/web run typecheck
npm --workspace apps/web test
npm --workspace apps/web run build
cd apps/api && python3 -m pytest -q
```

API start command for most free hosts:

```bash
python -m uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

Frontend build command:

```bash
npm run build
```

Current honest deployment label:

```text
Free hosted demo, not production healthcare deployment.
```
