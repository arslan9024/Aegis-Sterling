# AEGIS Master Synchronization Plan: Aegis-Sterling UI & CRM Backend
> **Protocol:** AEGIS V5.0 Unified Mesh · Policy `2026.11.06-aegis-v5-unified-mesh-v1`  
> **Target Workspaces:** `Aegis-Sterling/ui`, `White-Caves-Frontend`, `White-Caves-Server`  
> **Status:** `PROPOSED & READY`  
> **Date:** 2026-11-13  
> **Plan Path:** `.agents/plans/aegis-sterling-and-backend-sync.md`

---

## 1. Executive Summary

This plan synchronizes two vital operational tracks:
1. **Track 2 (Aegis-Sterling UI):** Upgrading the AEGIS sovereign command center dashboard (`Aegis-Sterling/ui`), linking all 4 active workspace projects (`Web`, `Frontend`, `Server`, `Mobile`), indexing the living **Book of White Caves (Chapters 1–7)**, and enabling real-time telemetry.
2. **Track 3 (CRM & Backend Infrastructure):** Synchronizing `White-Caves-Server` (Express, Prisma, PostgreSQL/Supabase, Redis) with `White-Caves-Frontend` to support cross-origin authenticated workflows, DLD/Ejari integrations, and real-time WebSocket event dispatching.

---

## 2. Architecture Map

```mermaid
flowchart TD
    subgraph Control Plane ["AEGIS Control Plane (Aegis-Sterling)"]
        AS_UI["Aegis-Sterling UI (Vite + React)"]
        BOOK["Book of White Caves Viewer (Ch 1-7)"]
        TELEMETRY["108-Node Mesh & Squad Monitor"]
    end

    subgraph Operations ["Operational Tier (White Caves CRM)"]
        FE["White-Caves-Frontend (Vite / React CRM)"]
        BE["White-Caves-Server (Express / Prisma / UAE Tax Engine)"]
        WEB["White-Caves-Web (Next.js 16 Marketing Engine)"]
    end

    AS_UI -->|Monitors Telemetry| FE
    AS_UI -->|Monitors Health| BE
    AS_UI -->|Monitors Deployments| WEB
    WEB -->|Agent Portal CTA| FE
    FE <-->|REST + WebSockets (JWT)| BE
```

---

## 3. Work Breakdown: Step 2 (Aegis-Sterling UI)

### Milestone AS-1: Project Registry & Squad Alignment
- [ ] Add `White-Caves-Web` (Next.js 16) to the active squads card deck in `Aegis-Sterling/ui/src/App.tsx`.
- [ ] Wire the newly authored **Chapter 07 (The Great Web Decoupling)** into `bookData.ts` inside `Aegis-Sterling/ui`.
- [ ] Display real-time project metrics (LOC count, bundle weight, test suite health).

### Milestone AS-2: Sovereign Mission Command Dashboard
- [ ] Implement an active **Deployment & Domain Health Panel** showing live statuses for:
  - `whitecaves.com` / `white-caves-web.vercel.app`
  - `app.whitecaves.com` / `white-caves-frontend`
  - API Gateway health check on `White-Caves-Server`
- [ ] Add an interactive **Autopilot Crucible Trigger** widget to inspect ongoing Ouroboros cycles.

---

## 4. Work Breakdown: Step 3 (CRM & Backend Invariants)

### Milestone BE-1: Multi-Origin CORS & Cookie Handshake
- [ ] Update `White-Caves-Server/server/app.ts` (or `index.ts`) CORS policy to allow:
  - `https://whitecaves.com`
  - `https://www.whitecaves.com`
  - `https://white-caves-web.vercel.app`
  - `https://app.whitecaves.com`
  - `http://localhost:3000` & `http://localhost:5173`
- [ ] Set JWT session cookie domain to `.whitecaves.com` for unified authentication.

### Milestone BE-2: DLD Trakheesi & Ejari Contract Synchronizer
- [ ] Audit Prisma schema in `White-Caves-Server/prisma/schema.prisma` for contract compliance models.
- [ ] Validate idempotent API endpoints for DLD validation keys (`AEG-012`).
- [ ] Wire 5% UAE FTA VAT & 9% Corporate Tax invariant checks on commission calculations (`AEG-029`–`031`).

### Milestone BE-3: Frontend CRM State & Live Sync
- [ ] Verify `White-Caves-Frontend` environment variables (`.env.production` / `.env.local`):
  - `VITE_API_URL` pointing to backend gateway.
  - `VITE_PUBLIC_SITE_URL="https://whitecaves.com"`.
- [ ] Execute `tsc --noEmit` and targeted test verification on affected CRM views.

---

## 5. AEGIS Verification Gate (AEG-022 & AEG-042)
- All new/edited files must strictly stay `< 350 lines`.
- Zero-token deterministic scripts preferred for repetitive updates.
- Both `Aegis-Sterling/ui` and `White-Caves-Server` must compile with 0 TypeScript errors before git commits.
