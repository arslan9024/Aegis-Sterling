# Aegis Sterling — Sovereign AI Orchestrator & Plugin Core

- **Location:** `C:\Users\Dell\Documents\antigravity\White-Caves\Aegis-Sterling`
- **UI Port:** `3333` (`Aegis-Sterling/ui`)
- **Canonical Control Plane:** `engines/` (TypeScript ESM executed natively on Node v24), `extensions/plugins/aegis-sterling/` (Antigravity plugin + hooks), `.agents/orchestrator/policy.json` (single policy truth), `.agents/aegis/` (protocol rules & Turing Core).

## Rules
- All executable orchestrators, scanners, hooks, and sync scripts in `engines/` must be strict TypeScript ESM (`.ts`) using erasable syntax only (no `enum`, `namespace`, or parameter properties) so `node <file>.ts` runs natively with zero build step and passes `npm run typecheck`.
- Keep `engines/hooks/aegis-guard.ts` synced into `extensions/plugins/aegis-sterling/` and `~/.gemini/config/plugins/aegis-sterling/` via `npm run aegis:plugin:sync`.
- Never fabricate telemetry or scan results; all gates and scanners must read real files and exit non-zero only on genuine threshold breaches.
