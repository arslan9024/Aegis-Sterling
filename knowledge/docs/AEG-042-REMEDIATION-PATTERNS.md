# AEG-042 Remediation Patterns & Monorepo Enforcement

Canonical patterns for maintaining the `<350`-line Single-Purpose File Law (`AEG-042`), 12-Way Mary Allen Wilkes architecture, and TypeScript strictness across the White Caves monorepo (`White-Caves-Frontend`, `White-Caves-Server`, `White-Caves-Web`, `Aegis-Sterling`).

## 1. AEG-042 `<350`-Line File Splitting
- **Threshold**: Non-test source files (`.ts`, `.tsx`, `.js`, `.jsx`) must stay strictly under `350` lines.
- **Leaf Target**: Atomic barrel leaf modules should target `<= 150` lines.
- **Audit Command**: `npm run aegis:limits` from the monorepo root automatically audits all four repositories (`White-Caves-Frontend`, `White-Caves-Server`, `White-Caves-Web`, `Aegis-Sterling`), or pass `--target <path>` for a single repo.
- **Splitting Strategy**:
  1. Extract pure types/interfaces into `*.types.ts`.
  2. Extract static registries, constants, and seed data into `*.data.ts`.
  3. Extract pure business logic/calculations into `*.logic.ts` or `rules/*.rule.ts`.
  4. Keep React views (`*.view.tsx` / `*.tsx`) focused on presentation and hook wiring.

## 2. 12-Way Wilkes Barrel Pattern
Organize complex components and protocol modules into single-purpose slices re-exported through an `index.ts` barrel:
- Core 7: `*.view.tsx`, `*.logic.ts` (or `use*.ts`), `*.styles.ts` (or `.css`), `*.data.ts`, `*.types.ts`, `*.workflow.ts`, `*.test.ts`.
- Full 12-Way: adds `*.fallback.ts`, `*.telemetry.ts`, `*.i18n.ts`, `*.cache.ts`, and `*.policy.ts` / `*.workers.ts` / `*.agent.ts`.
- Preserve public import paths via `index.ts` so callers require zero import-path rewrites when splitting a monolithic file.

## 3. JS-to-TS Model Migration
- Migrate legacy `.js` / `.jsx` models, services, and helpers to `.ts` / `.tsx` with explicit interfaces.
- Replace untyped `Record<string, any>` or implicit `any` with domain interfaces aligned to `White-Caves-Server/prisma/schema.prisma`.
- Verify type safety with `npm run aegis:typecheck` and targeted `npx vitest run <file.test.ts>` after each migration.
