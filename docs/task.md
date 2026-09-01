# PANDHARKAWDA AROGYA
# MASTER IMPLEMENTATION TASK TRACKER

Status: ACTIVE  
Execution Model: Sequential Phase Gates  
Project Type: Production-style Full-Stack Healthcare Information Platform

## Important Honesty Note

This repository is currently a solid runnable foundation, not the full production-complete platform described by the complete product mega-spec. The remaining incomplete areas are tracked below, especially full PostgreSQL persistence workflows, full admin CRUD/RBAC/auth, PWA offline cache, and complete E2E visual/interaction audit.

`npm install` reported dependency vulnerabilities in the current frontend dependency tree, so a follow-up dependency audit is required before treating this as deployment-ready.

## Status Legend

| Status | Meaning |
|---|---|
| `[x] Complete` | Built, connected, tested where applicable, and verified in the current repo. |
| `[~] In Progress` | Created or partially implemented, but not production-complete. |
| `[ ] Not Started` | Required by the product plan but not implemented yet. |
| `[!] Blocked` | Cannot be completed honestly until external data, production credentials, or a major missing dependency exists. |

## Current Verification Snapshot

| No. | Check | Result | Notes |
|---:|---|---|---|
| 1 | Backend tests | `[x] Complete` | `python3 -m pytest -q`: 35 backend tests passed. |
| 2 | TypeScript | `[x] Complete` | `npm run typecheck`: passed. |
| 3 | Frontend unit test | `[x] Complete` | `npm test`: 2 frontend unit tests passed. |
| 4 | Production build | `[x] Complete` | `npm run build`: passed and generated 41 routes including `manifest.webmanifest`. |
| 5 | E2E route audit | `[~] In Progress` | Playwright route audit exists, but full run/screenshots were not completed. |
| 6 | Real healthcare data | `[!] Blocked` | Real Pandharkawda healthcare data requires verified private collection and must not be committed as fake truth. |
| 7 | Dependency audit | `[x] Complete` | `npm audit --audit-level=moderate`: found 0 vulnerabilities after upgrading Next/Vitest and Tailwind PostCSS adapter. |

## Master Numbered Task Table

| No. | Phase | Task | Current Status | What Is Created | What Is Not Done / Next Work |
|---:|---|---|---|---|---|
| 1 | 1 Foundation | Monorepo structure | `[x] Complete` | `apps/web`, `apps/api`, `packages/types`, `docs`, `infra`, `scripts`, `seed/demo`, Docker/Make/README structure, and `.gitignore`. | Add `packages/ui`, `packages/config`, and `eslint-config` only when shared code needs them. |
| 2 | 1 Foundation | Frontend foundation | `[~] In Progress` | Next.js App Router, React, TypeScript strict, CSS tokens, Lucide icons, API client, pages, Tailwind/PostCSS config, ESLint, Prettier, TanStack Query provider, React Hook Form dependencies, Radix Dialog dependency, env validation, absolute import alias. | shadcn component installation, full Zod form layer, and deeper server/client conventions still need production setup. |
| 3 | 1 Foundation | Backend foundation | `[x] Complete` | FastAPI app, `/health`, `/ready`, `/api/v1/meta`, public API shell, layered domain/service files. | Structured route modules and deeper repository layer can improve maintainability in later phases. |
| 4 | 1 Foundation | PostgreSQL foundation | `[~] In Progress` | Docker Postgres service, SQLAlchemy base, async engine/session, and 26-table normalized SQLAlchemy model inventory. | Repository persistence and migration-from-zero verification in Docker. |
| 5 | 1 Foundation | Alembic migrations | `[~] In Progress` | `alembic.ini`, `env.py`, `0001_initial.py`, and Alembic creates/drops the SQLAlchemy metadata schema. | Verify migrations from zero in Docker and replace metadata migration with explicit revisions before production. |
| 6 | 1 Foundation | Redis foundation | `[~] In Progress` | Redis service in Docker Compose. | Rate limiting, queues, caching, and freshness reminders are not wired. |
| 7 | 1 Foundation | Environment configuration | `[x] Complete` | `.env.example` with required variable names only, API settings object, and frontend Zod env validation. | Add stricter production-only validation for secrets before deployment. |
| 8 | 1 Foundation | API error contract | `[x] Complete` | `ApiError` helper and validation handler standardize selected API errors; missing content now returns proper 404 error contracts and tests. | Extend same pattern as future endpoints are added. |
| 9 | 1 Foundation | API response convention | `[~] In Progress` | Public resource responses include `data` and some `meta`. | Apply consistently across every endpoint, including admin endpoints. |
| 10 | 1 Foundation | Request IDs and structured logging | `[x] Complete` | Request middleware adds `x-request-id` and structured JSON request logs with method, route, status, and duration. | Add production log sinks and deeper sensitive-field redaction during auth/chat phases. |
| 11 | 1 Foundation | Design tokens | `[x] Complete` | Semantic CSS variables in `apps/web/app/globals.css`. | Tailwind token integration and component-level polish. |
| 12 | 1 Foundation | Typography and Devanagari support | `[~] In Progress` | Devanagari-safe font stack and readable base styles. | Font loading strategy and visual QA at all breakpoints. |
| 13 | 1 Foundation | Localization foundation | `[~] In Progress` | `locales/en.json`, `locales/mr.json`, language switch control. | Replace remaining public literals with translation keys and add full route/content localization. |
| 14 | 1 Foundation | Public app shell | `[x] Complete` | Header, global emergency bar, mobile nav, public routes. | More refined footer and offline banner. |
| 15 | 1 Foundation | Admin shell foundation | `[~] In Progress` | Admin sidebar and all admin route destinations exist. | Authenticated layout, breadcrumbs, command search, notifications, user menu. |
| 16 | 1 Foundation | Shared UI components | `[~] In Progress` | Search, emergency dialog, verification badge, call/navigate, save, content list/detail. | Full component system, form components, tables, drawers, status filters. |
| 17 | 1 Foundation | Docker development | `[!] Blocked` | `docker-compose.yml`, API Dockerfile, Postgres, Redis, API and web services. Docker CLI is installed. | Docker daemon is not running on this machine, so `docker compose up -d postgres redis` cannot connect to `/Users/himanshumathankar/.docker/run/docker.sock`. Start Docker Desktop, then verify compose, migrations, seed, and health checks. |
| 18 | 1 Foundation | Developer commands | `[x] Complete` | `Makefile` commands for dev/test/lint/typecheck/build/db/migrate/seed/e2e and working ESLint command. | Keep commands green as later phases expand. |
| 19 | 1 Foundation | Testing infrastructure | `[~] In Progress` | Pytest, Vitest, Playwright config, route-audit spec, and lint/type/build checks pass locally. | Expand coverage and run full E2E/screenshots. |
| 20 | 1 Foundation | GitHub Actions CI | `[~] In Progress` | CI workflow for web and API. | Add lint, migration checks, secret scan, vulnerability scan, E2E gate. |
| 21 | 2 Data | Domain models | `[x] Complete` | Pydantic domain models plus SQLAlchemy model inventory for all required production table names. | Add richer field-level constraints as workflows mature. |
| 22 | 2 Data | Doctor model | `[~] In Progress` | Doctor fields include verification and phone consent. | Full DB persistence, admin notes privacy, audit fields. |
| 23 | 2 Data | Specialty model | `[~] In Progress` | Specialty derived from demo doctors and `/specialties` endpoint. | Dedicated DB table, bilingual fields, admin management. |
| 24 | 2 Data | Facility model | `[~] In Progress` | Facility domain model, public API, demo records. | Full persistence, services/departments/verified map pin workflow. |
| 25 | 2 Data | Doctor-facility relationship | `[~] In Progress` | `facility_ids` on doctors. | Normalized join table and schedule relationship. |
| 26 | 2 Data | Verification model | `[~] In Progress` | Verification enum and public filtering. | Verification requests/history tables and approval workflow. |
| 27 | 2 Data | Sources | `[~] In Progress` | Source strings on demo data/content. | Normalized `sources` table and source metadata workflow. |
| 28 | 2 Data | Public query boundary | `[x] Complete` | Unverified doctor is hidden from public API and tested. | Apply DB-level query policies when persistence is added. |
| 29 | 2 Data | Phone privacy | `[x] Complete` | Public API hides doctor phone without publication consent and test passes. | Add admin consent recording workflow. |
| 30 | 2 Data | Slugs | `[x] Complete` | Demo doctor/facility/content slugs exist and route pages use them. | Add collision-safe slug generation. |
| 31 | 2 Data | Demo seed architecture | `[x] Complete` | Clearly fictional in-memory demo data and seed command module. | Move seed to DB fixtures when persistence is complete. |
| 32 | 2 Data | Private import architecture | `[!] Blocked` | Policy documented. | Requires verified real local data collection and private import source. |
| 33 | 2 Data | Validation | `[~] In Progress` | Pydantic request models for chat and reports. | Full request/response schemas and frontend Zod validation. |
| 34 | 2 Data | Database constraints | `[~] In Progress` | Core unique constraints and foreign keys added on relationship tables and slugs. | Add check constraints, indexes, and full production referential rules. |
| 35 | 2 Data | Public doctor/facility/specialty APIs | `[x] Complete` | Public doctors, doctor detail, facilities, facility detail, specialties endpoints. | Pagination/filter/sort completeness and OpenAPI examples. |
| 36 | 2 Data | OpenAPI documentation | `[~] In Progress` | FastAPI Swagger works by framework default. | Add rich descriptions, examples, auth docs, response models. |
| 37 | 2 Data | Data QA tests | `[~] In Progress` | Tests for hidden unverified records and phone consent. | Add stale behavior, pagination, IDOR, source freshness tests. |
| 38 | 3 Public | Public navigation | `[x] Complete` | Desktop header and mobile nav link to real routes. | Add active state, footer links, full Marathi labels. |
| 39 | 3 Public | Homepage | `[x] Complete` | Search-led task homepage with action tiles, visiting soon, open-now link, public hospital, updates. | More responsive visual QA and richer seasonal info. |
| 40 | 3 Public | Search UX | `[~] In Progress` | Debounced client search suggestions and empty state. | Keyboard navigation, typo tolerance, recent selections. |
| 41 | 3 Public | Unified search backend | `[~] In Progress` | Searches verified doctors/facilities. | Expand to schemes, tests, procedures, alerts, Marathi/transliteration normalization. |
| 42 | 3 Public | Doctor directory UI | `[~] In Progress` | Doctor cards with call/profile/report/save paths. | Full filters, sort, distance, availability badges. |
| 43 | 3 Public | Doctor profile | `[~] In Progress` | Profile route with trust panel, facility block, call/navigate/report/save. | Weekly schedule, exceptions, related specialists, visiting sessions. |
| 44 | 3 Public | Facilities directory/detail | `[~] In Progress` | Facility list/detail routes with services, verification, call/navigate. | Filters, service grouping, embedded map component. |
| 45 | 3 Public | Maps | `[~] In Progress` | OpenStreetMap external deep links. | Leaflet embedded maps and user-position distance calculation. |
| 46 | 3 Public | User location | `[ ] Not Started` | No automatic tracking, privacy-safe by omission. | Explicit permission flow and non-persistent distance calculation. |
| 47 | 3 Public | Favorites | `[x] Complete` | Browser local storage save/clear flow and `/saved`. | Show rich saved item details, not only IDs. |
| 48 | 3 Public | Report incorrect information | `[x] Complete` | Public report form posts to API, creates an in-process report record, creates an audit entry, and returns success state. | Move report/audit persistence to SQLAlchemy DB repositories. |
| 49 | 3 Public | Bilingual public experience | `[~] In Progress` | Language switch and curated dictionaries exist. | Apply translations across all visible public/admin strings. |
| 50 | 3 Public | Accessibility foundation | `[~] In Progress` | Skip link, semantic landmarks, focus styles, accessible dialog role. | Full WCAG 2.2 AA audit and keyboard testing. |
| 51 | 3 Public | SEO foundation | `[~] In Progress` | Metadata, robots, sitemap. | Localized metadata, JSON-LD, breadcrumbs, admin noindex verification. |
| 52 | 4 Availability | Weekly schedule model | `[~] In Progress` | `ScheduleBlock` domain model. | DB model and admin editor. |
| 53 | 4 Availability | Overrides | `[~] In Progress` | Override model and schedule logic support. | API/admin forms and overlap validation. |
| 54 | 4 Availability | Visiting sessions | `[~] In Progress` | Confirmed/cancelled demo sessions and public endpoint. | DB persistence and admin session status mutation. |
| 55 | 4 Availability | Timezone | `[x] Complete` | Schedule engine uses `Asia/Kolkata`. | More edge-case tests around midnight/date boundaries. |
| 56 | 4 Availability | Facility open engine | `[x] Complete` | Weekly schedule and override logic implemented and tested. | Stale schedule handling and production freshness integration. |
| 57 | 4 Availability | Doctor availability engine | `[x] Complete` | Separates facility open from doctor availability and test passes. | Manual presence toggles and confirmed session windows. |
| 58 | 4 Availability | Freshness | `[~] In Progress` | Trust metadata shown on public records. | Full review policy engine and stale rendering rules. |
| 59 | 4 Availability | Visiting session resolution | `[x] Complete` | Cancelled visits are hidden from public upcoming endpoint and tested. | Reschedule replacement and completion job. |
| 60 | 4 Availability | Visiting doctors page | `[~] In Progress` | Upcoming confirmed sessions page. | Filters, countdown, cancellation admin demo flow. |
| 61 | 4 Availability | Open Now page/API | `[~] In Progress` | API and page show facility open versus doctor available. | Filters, stale state, location sorting. |
| 62 | 5 Content | Public hospital experience | `[~] In Progress` | Dedicated `/public-hospital` route uses verified facility demo data. | Full departments, notices, schemes, diagnostics workflows. |
| 63 | 5 Content | Government schemes | `[~] In Progress` | Scheme list/detail with safety-minded content. | Full bilingual structured fields and official links. |
| 64 | 5 Content | Lab tests | `[~] In Progress` | Lipid profile content and detail route. | Rich preparation schema, reviewer workflow, local availability. |
| 65 | 5 Content | Procedures | `[~] In Progress` | Procedure list/detail for X-ray demo content. | Full reviewed procedure library. |
| 66 | 5 Content | Medical term explainer | `[~] In Progress` | Simple reviewed-term UI for MRI/X-ray/ultrasound. | Backend-backed knowledge records and Marathi output. |
| 67 | 5 Content | Health alerts | `[~] In Progress` | Alert list from API. | Expiry filtering, severity, geography, publishing workflow. |
| 68 | 5 Content | Public health analytics | `[ ] Not Started` | None exposed, avoiding fake charts. | Demo-mode-only dataset architecture and clear labelling. |
| 69 | 5 Content | Content source attribution | `[~] In Progress` | Source and review date displayed on content cards. | Normalized sources, reviewer identity, next review due. |
| 70 | 6 Admin | Admin authentication | `[~] In Progress` | Backend Argon2 password verification, in-memory demo admin sessions, secure cookie issuance, login/logout/me endpoints, login lockout/backoff after repeated failures, `/admin/login` form route, Next auth proxy routes for login/logout cookie forwarding, protected admin page login fallbacks, and tests for login, unauthorized access, and lockout. | DB-backed admins, session persistence, Redis-backed rate limiting, MFA architecture, and full browser E2E auth verification. |
| 71 | 6 Admin | RBAC | `[~] In Progress` | Backend roles/permissions map, dependency-based permission checks, protected admin endpoints, and forbidden-action test. | Persist roles/permissions in DB and apply checks to all future admin APIs. |
| 72 | 6 Admin | Admin dashboard | `[~] In Progress` | `/admin` overview uses API-derived demo statistics and unresolved report count from repository. | Real DB metrics, verification queue, freshness summary. |
| 73 | 6 Admin | Admin route inventory | `[x] Complete` | Every required sidebar destination exists, plus `/admin/login`. | Replace remaining placeholder route content with actual workflows. |
| 74 | 6 Admin | Doctor administration | `[ ] Not Started` | Admin route exists only. | List, filters, create/edit forms, validation, audit. |
| 75 | 6 Admin | Facility administration | `[ ] Not Started` | Admin route exists only. | Form, map pin confirmation, services/hours editor. |
| 76 | 6 Admin | Specialty/service management | `[ ] Not Started` | Admin routes exist only. | CRUD with verification/audit where required. |
| 77 | 6 Admin | Schedule editor | `[ ] Not Started` | Admin route exists only. | Weekly schedule UI, exceptions, overlap validation. |
| 78 | 6 Admin | Visiting sessions admin | `[ ] Not Started` | Admin route exists only. | Create/update/cancel/reschedule sessions and public reflection. |
| 79 | 6 Admin | Verification queue | `[~] In Progress` | Report API creates an in-process queue item; `GET /api/v1/admin/verification` lists items; approve/reject endpoints update status and create audit logs; `/admin/verification` renders an API-backed review table with working decision actions. | DB persistence, before/after diff, request-correction workflow, and real RBAC. |
| 80 | 6 Admin | User reports | `[~] In Progress` | Public report submission exists, `GET /api/v1/admin/reports` exposes submitted reports, and `/admin/reports` renders an API-backed table with empty state. | Add resolution workflow and DB persistence. |
| 81 | 6 Admin | Content management | `[ ] Not Started` | Admin routes exist only. | Forms for schemes, tests, procedures, knowledge, notices, alerts. |
| 82 | 6 Admin | Audit logs | `[~] In Progress` | Migration includes `audit_logs` table shell; report submissions and verification decisions create in-process audit entries exposed by `GET /api/v1/admin/audit-logs`, and `/admin/audit-log` renders an API-backed table with empty state. | Move to immutable DB service and richer admin timeline. |
| 83 | 6 Admin | Freshness queue/job | `[ ] Not Started` | Review policy documented. | Background job and admin queue. |
| 84 | 7 AI | Chat API | `[~] In Progress` | `POST /api/v1/chat` is async, returns structured response with message, cards, actions, sources, verification, and optional provider metadata. | Full intent classification and retrieval orchestration. |
| 85 | 7 AI | Multi-provider AI adapter | `[x] Complete` | Provider interface and implementations exist for disabled, OpenAI, Azure OpenAI, and Ollama/local models. Provider selection is tested. | Add streaming only if the chat UX later needs it. |
| 86 | 7 AI | AI provider configuration | `[x] Complete` | `.env.example` and API settings include `LLM_PROVIDER`, OpenAI, Azure OpenAI, and Ollama configuration fields. | Add per-provider retry/timeout tuning in production settings. |
| 87 | 7 AI | Provider fallback strategy | `[ ] Not Started` | None. | Decide safe fallback order; local facts must still come only from DB/reviewed content. |
| 88 | 7 AI | Intent layer | `[~] In Progress` | Deterministic classifier supports doctor search, visiting specialists, open-now, facility search, service search, test preparation, procedure explanation, scheme guidance, medical terms, health alerts, unknown, and emergency override through red flags. | Add general education refinements and broader multilingual cases. |
| 89 | 7 AI | Tool layer | `[~] In Progress` | Local fact tools return structured cards/actions/sources for doctors, facilities, services, visiting sessions, open-now schedule status, lab tests, procedures, medical terms, schemes, health alerts, and emergency actions before optional model explanation. | Add richer card payloads and broader content retrieval. |
| 90 | 7 AI | Emergency red-flag engine | `[x] Complete` | Deterministic English/Marathi red flags before normal answer, with tests. | Clinician-reviewed rule set and versioned config. |
| 91 | 7 AI | Emergency response | `[x] Complete` | E0 response returns call action for 108 and emergency card. | Nearest verified emergency facility when user grants location. |
| 92 | 7 AI | Triage levels | `[~] In Progress` | E0 implemented. | E1/E2/E3 triage workflow and disclaimers. |
| 93 | 7 AI | Retrieval and grounding | `[~] In Progress` | Doctor, visiting, open-now, scheme, and lipid-profile answers are grounded in local verified/demo or reviewed content; optional LLM explanation receives only verified context. | Retrieval index and source-bound generation for larger content corpus. |
| 94 | 7 AI | Unknown handling | `[x] Complete` | Unknown facts return a safe "no verified information" answer with next action. | Add localized unknown responses. |
| 95 | 7 AI | Chat UI | `[~] In Progress` | Ask Arogya page with chips, composer, answer panel, actions, sources. | Mobile-safe full conversation design and rich card rendering. |
| 96 | 7 AI | Prompt injection resistance | `[~] In Progress` | Prompt-injection detector skips optional provider generation for common instruction override attempts; tests cover this path. | Expand multilingual/adversarial prompt-injection corpus. |
| 97 | 7 AI | AI evaluation suite | `[~] In Progress` | Tests cover red flags, provider disabled behavior, provider selection, grounded lipid-profile response, doctor/facility/service/visiting/open-now/scheme/procedure/medical-term/health-alert intents, cancelled session hiding, prompt injection, unsafe medical output, unsourced local fact blocking, provider timeout, and provider transport failure. | Add broader multilingual hallucination-resistance tests. |
| 98 | 8 PWA | PWA manifest | `[x] Complete` | `app/manifest.ts` generates install metadata and references a local maskable SVG icon. | Add larger raster icons later if store-quality installation is needed. |
| 99 | 8 PWA | Service worker/offline shell | `[~] In Progress` | `/sw.js` caches only offline-safe URLs: `/`, `/emergency`, manifest, icon, and static emergency JSON. | Add robust service-worker version tests and cache invalidation monitoring. |
| 100 | 8 PWA | Offline emergency | `[~] In Progress` | Static emergency route and `emergency-offline.json` are cached with a last-review label. | Verify in browser offline mode with Playwright or manual PWA test. |
| 101 | 8 PWA | Offline indicator | `[x] Complete` | `PwaClient` registers the service worker and displays an offline banner from browser network state. | Add visual E2E coverage. |
| 102 | 8 PWA | Availability caching | `[ ] Not Started` | None. | Avoid stale availability confidence; cache only with short TTL and warnings. |
| 103 | 8 PWA | Install prompt | `[ ] Not Started` | None. | Show after meaningful engagement only. |
| 104 | 8 PWA | Reminder architecture | `[ ] Not Started` | Feature hidden, no dead reminder button exposed. | Implement subscription model or keep hidden. |
| 105 | 9 Hardening | Security review | `[ ] Not Started` | Security doc exists. | CSRF, CORS hardening, rate limits, auth, IDOR tests, secret scan. |
| 106 | 9 Hardening | Authorization audit | `[ ] Not Started` | None. | Backend RBAC audit after admin APIs exist. |
| 107 | 9 Hardening | Privacy audit | `[~] In Progress` | Public phone consent protection and no public user accounts. | Chat retention/location policy enforcement. |
| 108 | 9 Hardening | Rate limiting | `[~] In Progress` | Admin login lockout/backoff is implemented in the auth service and tested. | Move counters to Redis and add chat/report/API rate limits. |
| 109 | 9 Hardening | Accessibility audit | `[~] In Progress` | Basic semantic/focus/accessibility foundations. | Manual keyboard pass, screen reader review, contrast audit, reduced motion. |
| 110 | 9 Hardening | Performance audit | `[~] In Progress` | Production build works, small route sizes. | Lighthouse, slow-network QA, lazy map loading. |
| 111 | 9 Hardening | SEO audit | `[~] In Progress` | Metadata, sitemap, robots. | Structured data and localized metadata. |
| 112 | 9 Hardening | Browser/responsive testing | `[ ] Not Started` | Playwright config exists. | Run and fix 390x844, 768x1024, 1440x900 screenshots. |
| 113 | 9 Hardening | Dependency audit | `[x] Complete` | Upgraded `next` to 16.3.4, `vitest` to 4.1.11, added `@tailwindcss/postcss`, and verified `npm audit --audit-level=moderate` reports 0 vulnerabilities. | Keep audit clean after future dependency changes. |
| 114 | 9 Hardening | Production build | `[x] Complete` | `npm run build` passed. | Keep passing after future changes. |
| 115 | 10 Final | Full route inventory | `[~] In Progress` | Route inventory documented and 41 routes built after adding PWA manifest and Next admin auth proxy routes. | Automated crawl must run against live app/API. |
| 116 | 10 Final | Interaction audit | `[~] In Progress` | `FEATURE_AUDIT.md` created with key controls. | Verify every visible CTA in Playwright and update table. |
| 117 | 10 Final | API audit | `[~] In Progress` | Main public endpoints exist. | Ensure every required endpoint has validation, pagination, auth docs, tests. |
| 118 | 10 Final | Console/network audit | `[ ] Not Started` | Playwright route-audit spec exists. | Run with API and web, fix console errors/network failures. |
| 119 | 10 Final | Empty/error/loading state audit | `[~] In Progress` | Some empty states and API errors exist. | Complete every async screen state. |
| 120 | 10 Final | Visual consistency audit | `[ ] Not Started` | Design tokens and initial layout exist. | Full mobile/desktop visual QA and polish. |
| 121 | 10 Final | Recruiter demo flow | `[~] In Progress` | Many demo routes exist for the flow. | Admin cancel/approve/audit flow and live public reflection are not done. |
| 122 | 10 Final | README portfolio quality | `[~] In Progress` | Professional README with overview and Mermaid diagram. | Add screenshots, complete feature matrix, deployment walkthrough, future work details. |
| 123 | 10 Final | Deployment readiness | `[ ] Not Started` | Docker/CI scaffolds exist. | Validate local Docker, migrations, seed, production envs, monitoring. |
| 124 | 10 Final | Final definition of done | `[ ] Not Started` | Tracker exists. | Cannot mark done until all production requirements pass. |

## AI Provider Architecture Requirement

Ask Arogya must not be hard-coded to OpenAI only. The production AI layer should use a provider adapter interface so the same safety and grounding pipeline can run with multiple model providers.

| No. | AI Provider Task | Status | Requirement |
|---:|---|---|---|
| 125 | Provider interface | `[x] Complete` | Common provider protocol with `generate` request/response types and structured fallback behavior. |
| 126 | OpenAI provider | `[x] Complete` | OpenAI provider supports API key and model configuration. |
| 127 | Azure OpenAI provider | `[x] Complete` | Azure OpenAI provider supports endpoint, deployment, API version, and key configuration. |
| 128 | Ollama/local provider | `[x] Complete` | Ollama provider supports base URL and model name configuration. |
| 129 | Disabled provider | `[x] Complete` | `LLM_PROVIDER=disabled` is default; Ask Arogya handles emergency and grounded demo content without LLM. |
| 130 | Provider safety wrapper | `[~] In Progress` | Red flags and local content grounding run before optional provider generation; model output post-check blocks unsafe medical advice and unsourced local facts; provider timeout/transport failures return safe fallback metadata. | Add multilingual safety checks. |
| 131 | Provider tests | `[~] In Progress` | Tests cover disabled fallback, provider selection for OpenAI/Azure/Ollama, prompt injection, bad output, hallucination-style local fact blocking, timeout, and provider transport failure. | Add broader multilingual/adversarial provider tests. |

## Completion Summary

| Category | Complete | In Progress | Not Started | Blocked |
|---|---:|---:|---:|---:|
| Foundation | 9 | 9 | 1 | 1 |
| Healthcare data | 6 | 11 | 0 | 1 |
| Public experience | 4 | 10 | 1 | 0 |
| Availability | 5 | 5 | 0 | 0 |
| Content modules | 0 | 7 | 1 | 0 |
| Admin platform | 1 | 6 | 8 | 0 |
| Ask Arogya AI | 5 | 8 | 4 | 0 |
| PWA/offline | 2 | 2 | 3 | 0 |
| Hardening | 2 | 5 | 5 | 0 |
| Final audit/deployment | 0 | 6 | 4 | 0 |

## Current Exit Gate

The project is not production complete yet.

Current acceptable label: `[~] In Progress - runnable foundation`.

Do not claim 100% completion until all incomplete rows above are implemented, tested, audited, and verified.
