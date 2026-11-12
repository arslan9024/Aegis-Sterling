# ⚙️ Server Team — Aegis Engineering Rules
# Project: White-Caves-Server | Team Lead: @Mira (Dept 04 Backend)

## Context
This is the Express.js + Prisma ORM backend server bridged via Cloudflare Tunnel to Vercel frontend.

## Mandatory Rules
1. **Prisma-Only Data Layer:** No raw SQL queries where Prisma models exist. All schema changes require generated migrations.
2. **UAE Statutory Compliance:** Enforce 5% FTA VAT, 9% Corporate Tax reserves on all financial transactions. Ejari operations must be idempotent (no duplicate contract registrations).
3. **Secret Abstraction:** Zero hardcoded credentials. All secrets come from environment variables. Never commit `.env` files.
4. **API Timeout Law:** All external/government API calls must have a 1,500ms timeout with exponential backoff retry (max 3 attempts).
5. **Route Modularity:** No route handler file exceeds 350 lines. Extract into domain modules.
6. **Auth Middleware Everywhere:** Every sensitive endpoint requires `authMiddleware` and RBAC role checking.

## Assigned Agents
- **@Mira** — Backend Systems Lead, Express architecture
- **@Barbara** — Prisma & database schema ownership
- **@Ruchi** — API Gateway, rate limiting & routing
- **@Sofia** — SecOps, secret scanning, Husky hooks
- **@Gwynne** — DevOps, CI/CD, Dockerfile, deployment
