# 🛡️ Frontend Team — Aegis Engineering Rules
# Project: White-Caves-Frontend | Team Lead: @Una (Dept 02 UI/UX)

## Context
This is the React + Vite + Tailwind CSS frontend application deployed on Vercel.

## Mandatory Rules
1. **Luxury Design System:** Always use White Caves design tokens — `#EF4444` (red), glassmorphism surfaces, Dubai-luxury spatial layouts.
2. **TypeScript Strictness:** No `any` types. Enforce strict `tsconfig.json` with `"strict": true`.
3. **Component Ceiling:** Maximum 350 lines per component file. Decompose into hooks + subcomponents.
4. **LTR/RTL Native Support:** All UI must render correctly in `dir="ltr"` (English) and `dir="rtl"` (Arabic).
5. **Zero Full-Suite Tests:** During iteration, run only `npx vitest run <file>` for the affected component.
6. **Co-location Pattern (7-way):** Each component lives with its `.data.ts`, `.logic.ts`, `.style.ts`, `.test.tsx`, `.types.ts`.
7. **No External Component Frameworks:** No MUI, Chakra, or Ant Design. Use headless primitives + Tailwind only.

## Assigned Agents
- **@Una** — UI/UX Lead, design system enforcement
- **@Rachel_QA** — Component testing, Playwright E2E
- **@Victoria** — PDF/Design asset generation
