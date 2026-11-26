# White Caves Architecture Decision Records (Phase 2)

## ADR-001: Authoritative Backend (`White-Caves-Server`)
- **Decision:** `White-Caves-Server` (Express 5) is the sole authoritative backend.
- **Action:** Unique routes/logic in `White-Caves-Frontend/server/` will be ported to `White-Caves-Server`, and `White-Caves-Frontend/server/` will be removed.

## ADR-002: Data Layer (Freeze Mongoose, New Code in Prisma)
- **Decision:** Keep both Mongoose and Prisma during transition, **freeze** new Mongoose usage, and write all new data-access code using **Prisma** (MongoDB connector).
- **Action:** Remove Postgres-only `prisma/migrations/add_recruitment_models/migration.sql` and unused `pg` dependency from `White-Caves-Server`.

## ADR-003: API Contract & Versioning
- **Decision:** Replace legacy `*Compatibility` mounts in `White-Caves-Server/server/index.ts` with versioned `/api/v1` and dated deprecation headers, backed by generated OpenAPI specs and typed clients.

## ADR-004: Web vs. Frontend Split & Mobile Strategy
- **Decision:**
  - `White-Caves-Web` (Next.js 16, `:3001`) owns public SEO pages, listings, and `/careers`.
  - `White-Caves-Frontend` (Vite + React, `:3000`) owns the authenticated CRM, AI Command Center, and operations.
  - `White-Caves-Mobile` uses the **PWA from `White-Caves-Frontend`** as the default until a dedicated React Native / Expo app is chosen.
