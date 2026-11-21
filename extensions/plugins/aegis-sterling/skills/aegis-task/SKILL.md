---
name: aegis-task
description: Executes an AEGIS V5.1 sovereign task under TURING-LAW-000 and TURING-ROOT-007. Activated via `/aegis-task` or `aegis:task`.
triggers:
  - "/aegis-task"
  - "aegis:task"
---

# AEGIS V5.1 Sovereign Task Execution Protocol

When invoked via `/aegis-task <feature_description>`, execute the requested update under this zero-waste protocol:

## Step 0: Invariants
- **TURING-LAW-000**: Batch independent tool calls in parallel per turn; use `git grep -n` + surgical `StartLine`/`EndLine` reads; test only affected files (`< 2s`).
- **TURING-ROOT-007**: Keep app repo roots pristine (no loose `docs/`, `plans/`, `strategies/`).
- **Design & Limits**: White Caves Red (`#EF4444`), Slate (`#0F172A`), Context Triad (`Theme`, `Language`, `Currency`), `< 350` lines per file (`AEG-042`), RTL (`dir="rtl"`) compatible.

## Step 1: Pre-flight Health & Hygiene Check
```powershell
node ../Aegis-Sterling/engines/orchestrator/aegis-engine.ts health
node ../Aegis-Sterling/engines/orchestrator/aegis-engine.ts dedup
```

## Step 2: Implementation
Implement changes with strict TypeScript (zero new `any` / `@ts-ignore`) and preserve existing comments/docstrings.

## Step 3: Targeted Verification (< 2 seconds)
Run only the relevant Vitest test file and/or typecheck:
```powershell
npx vitest run <path/to/touched.test.ts>
```
