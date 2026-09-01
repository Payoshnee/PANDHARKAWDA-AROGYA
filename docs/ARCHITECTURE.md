# Architecture

The project is a monorepo with `apps/web` for Next.js, `apps/api` for FastAPI, shared TypeScript contracts in `packages/types`, docs, scripts, and Docker development infrastructure.

The backend uses layered modules: routers call services, services call repositories/domain utilities, and domain logic such as schedule calculation and red-flag detection is unit tested outside route handlers.

```mermaid
flowchart LR
  UI[Next.js UI] --> Client[Typed API client]
  Client --> FastAPI[FastAPI routers]
  FastAPI --> Services[Services]
  Services --> Domain[Domain logic]
  Services --> Repos[Repositories]
  Repos --> Postgres[(PostgreSQL)]
  Services --> Redis[(Redis)]
```
