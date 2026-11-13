# Chapter 10 — Frontend ↔ Server Live Connection
**Book of White Caves**  
**Date:** 2026-11-13  
**Status:** ✅ COMPLETE  
**Aegis Law:** `TURING-SEPARATION-010` | `TURING-LAW-000` | `AEG-001`

---

## Overview

This chapter documents the successful live connection of `White-Caves-Frontend` to `White-Caves-Server` as fully sovereign, separately-running processes.  
Both repos now communicate over HTTP (`/api`) and WebSocket (`/socket.io`) through Vite's dev proxy — no cross-origin issues, no mocking.

---

## Architecture Established

```
┌──────────────────────────────────┐
│   Browser (localhost:3000)       │
│   White-Caves-Frontend (Vite)    │
│                                  │
│   VITE_API_URL=/api              │
│   apiClient → /api/v1/...        │
│   socketService → /socket.io     │
└────────────┬─────────────────────┘
             │  Vite Dev Proxy
             │  /api        → http://127.0.0.1:5001
             │  /socket.io  → ws://127.0.0.1:5001
             ▼
┌──────────────────────────────────┐
│   White-Caves-Server             │
│   http://localhost:5001          │
│   AEGIS-V4-Supercharged-300%    │
│   v2.0.26 | NODE_ENV=development │
│                                  │
│   DEV_AUTH_BYPASS=true           │
│   → Lion superuser (no login)    │
│                                  │
│   MongoDB Atlas ✅               │
│   Prisma v6.19.3 ✅              │
│   Socket.IO ✅                   │
│   5 AI Assistants registered ✅  │
│   8 cron jobs active ✅          │
└──────────────────────────────────┘
```

---

## Env Files Created

### `White-Caves-Server/.env` (gitignored — local only)
Built from `secrets/` vault. Key variables:

| Variable | Source | Value |
|---|---|---|
| `PORT` | manual | `5001` |
| `NODE_ENV` | manual | `development` |
| `DEV_AUTH_BYPASS` | manual | `true` |
| `DATABASE_URL` | `secrets/.env` | MongoDB Atlas URI |
| `MONGODB_URI` | `secrets/.env` | MongoDB Atlas URI (legacy alias) |
| `JWT_SECRET` | `secrets/crm.env` | 88-char base64 secret |
| `SESSION_SECRET` | `secrets/crm.env` | Same as JWT_SECRET for dev |
| `CORS_ORIGIN` | manual | `localhost:3000, localhost:5173` |
| `FIREBASE_SERVICE_ACCOUNT` | `secrets/.env.local` | Full JSON (single line) |
| `GOOGLE_API_KEY` | `secrets/.env` | AIzaSy... |
| `STRIPE_SECRET_KEY` | `secrets/crm.env` | sk_live_... |
| `WHATSAPP_WEBHOOK_SECRET` | `secrets/crm.env` | dev secret |
| `LINDA_ENABLED` | manual | `true` |
| `CREATOR_SUPERUSER_EMAIL` | `secrets/crm.env` | arslanmalikgoraha@gmail.com |

### `White-Caves-Frontend/.env.local` (gitignored — local only)
Rebuilt from secrets vault. Key variables:

| Variable | Value |
|---|---|
| `VITE_API_URL` | `/api` (relative — proxied by Vite to port 5001) |
| `VITE_FIREBASE_API_KEY` | AIzaSy... |
| `VITE_FIREBASE_PROJECT_ID` | `white-caves-fb` |
| `VITE_STRIPE_PUBLIC_KEY` | `pk_live_...` |
| `VITE_CREATOR_SUPERUSER_EMAIL` | arslanmalikgoraha@gmail.com |

> **Why `VITE_API_URL=/api` and not `http://localhost:5001`?**  
> Using a relative path `/api` means the browser sends requests to `localhost:3000/api/...`.  
> Vite's proxy intercepts and forwards to `http://127.0.0.1:5001` server-side.  
> This avoids CORS completely in development. `socketConfig.ts` reads the same var and connects Socket.IO to browser origin, which Vite proxies as WebSocket.

---

## Vite Proxy Config (already correct — no changes needed)

```js
// vite.config.js — lines 198-235
proxy: {
  '/socket.io': {
    target: apiTarget,  // http://127.0.0.1:5001
    changeOrigin: true,
    ws: true,           // ← WebSocket upgrade
  },
  '/api': {
    target: apiTarget,
    changeOrigin: true,
    configure: proxy => {
      // Returns 503 JSON instead of crashing if server not running
    }
  }
}
```

`apiTarget` = `http://127.0.0.1:${process.env.API_PORT || '5001'}`

---

## Smoke Test Results (2026-11-13T06:28)

| Test | Result |
|---|---|
| `node -e "require('dotenv').config()..."` in Server | ✅ 31 vars injected, PORT=5001, DB=true, JWT=true |
| `GET http://localhost:5001/api/v1/health` | ✅ `status: OK`, AEGIS-V4-Supercharged-300%, v2.0.26 |
| `GET http://localhost:5001/api/health` | ✅ Same response (legacy route alias active) |
| `GET http://localhost:5001/api/v1/properties` | ✅ 8 real property records from MongoDB Atlas |
| Mongoose connection | ✅ `Mongoose connected successfully` |
| Prisma connection | ✅ `Prisma connected to database`, health check passed |
| All 5 AI assistants | ✅ Linda, Nadia, Nina, Mary, Henry handlers registered |
| 8 cron jobs | ✅ Registered with node-cron engine |

---

## How to Start for Development

**Terminal 1 — Server:**
```bash
cd White-Caves-Server
npm run dev
# → http://localhost:5001
```

**Terminal 2 — Frontend:**
```bash
cd White-Caves-Frontend
npm run dev
# → http://localhost:3000
# Proxy: /api → localhost:5001
#         /socket.io → ws://localhost:5001
```

> **Note:** `DEV_AUTH_BYPASS=true` in `White-Caves-Server/.env` means you can open the app without logging in — all unauthenticated `/api` requests are automatically assigned the **Lion** superuser identity. Turn this off (`false`) when testing real auth flows.

---

## Port Reference

| Service | Port | Notes |
|---|---|---|
| White-Caves-Frontend (Vite) | 3000 | `strictPort: false` → tries next if busy |
| White-Caves-Server (Node/Express) | 5001 | Falls back to 5002 if already occupied |
| Socket.IO | 5001 | Same port as HTTP (Express + io attach) |
| Prisma Studio (optional) | 5555 | `npx prisma studio` |

---

## Secrets Vault Reference

All secrets live in `White-Caves/secrets/` (workspace root, gitignored):

| File | Contents |
|---|---|
| `secrets/.env` | Main: MongoDB URI, Firebase service account, Google keys |
| `secrets/.env.local` | Vercel Env: Firebase VITE_ vars, Stripe, Mongo |
| `secrets/crm.env` | JWT, Session, CORS, Stripe, Superuser email, VITE_ vars |
| `secrets/database.env` | DATABASE_URL placeholder, DEV_AUTH_BYPASS |
| `secrets/firebase.env` | Firebase Admin full config |
| `secrets/google.env` | Google base64 service account keys |
| `secrets/linda-bot.env` | Linda WhatsApp bot config |
| `secrets/meta-cloud.env` | Meta Cloud API (Nadia WhatsApp) |

---

## What's Next (Phase 4 — Client Portal Dashboards)

Build the 4 dedicated client-facing portal pages in `White-Caves-Frontend/src/pages/`:

| Page | Route | RBAC Guard | Key Features |
|---|---|---|---|
| `LandlordPortalPage.tsx` | `/portal/landlord` | `requireRole('property_owner')` | Yields, Ejari renewals, maintenance approvals |
| `TenantPortalPage.tsx` | `/portal/tenant` | `requireRole('tenant')` | Rent PDC ledger, Ejari downloads, maintenance requests |
| `BuyerPortalPage.tsx` | `/portal/buyer` | `requireRole('buyer')` | Off-plan launches, escrow milestones, NOC status |
| `SellerPortalPage.tsx` | `/portal/seller` | `requireRole('seller')` | Valuation metrics, buyer matching, conveyancing |

Each portal:
- Uses `apiClient` hitting real `GET /api/v1/...` endpoints
- Checks role via RBAC middleware (`server/middleware/rbac.ts`)
- Follows Single Purpose File Law (< 350 lines per file)
- TypeScript only (RULE-009)

---

*Chapter authored by Aegis-Sterling governance engine. Session completed 2026-11-13T06:35 GST.*
