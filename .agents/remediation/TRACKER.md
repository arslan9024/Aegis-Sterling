# White Caves Remediation Tracker (113-Point Plan)

| Phase | Items | Status | Commit / Branch | Evidence |
| :--- | :--- | :--- | :--- | :--- |
| **Phase 0** | 1, 4, 5, 7–11, 101 | **Done** | Server `c9e3655`, Frontend `fa7fcd4c8` | Startup secret checks enforced; tracked backups/reports/owners.json removed |
| **Phase 0** | 2 (git history purge) | **Deferred** | — | Deferred until explicit user confirmation for force-push |
| **Wave 5** | `TSK-ARCH-W5` (6 files) | **Done** | Server `7999b5f` | 22 files all `< 350` lines; Vitest 2/2 suites (7/7 tests) PASS |
| **Phase 1** | 16–18, 27, 30 | **Done** | Server & Web `fix/phase-1-rules-and-ci` | `Dockerfile.prod` fixed; Server & Web CI, `.nvmrc`, `.env.example` added |
| **Phase 2** | 31–44 (ADRs) | **Done** | `Aegis-Sterling/.agents/remediation/ADRs.md` | Authoritative backend, Prisma-first, API versioning, Web/Frontend/Mobile split locked |
| **300% Upgrade** | AEGIS Hardening & Mobile PWA | **Done** | `Aegis-Sterling` (`aegis-gates.yml`) | `TRACKER.md` updated; irrelevant non-stack skills pruned; CI gates (`AEG-042` `<350` lines, `@ts-nocheck`, `gitleaks`) configured; `White-Caves-Mobile` PWA strategy verified per ADR-004 |
