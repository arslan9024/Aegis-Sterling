---
name: hybrid-oop-functional-architect
description: 'Guides hybrid Object-Oriented and Functional Programming architecture across the White Caves ecosystem under AEG-042 (<350 lines/file) and 12-Way Wilkes separation'
---

# Hybrid OOP & Functional Architect

Use this skill when designing, refactoring, or reviewing modules across `White-Caves-Server`, `White-Caves-Frontend`, `White-Caves-Web`, and `Aegis-Sterling` to decide between Object-Oriented Programming (OOP) and Functional Programming (FP).

## 1. When to Use Object-Oriented Programming (OOP)

Use **classes, inheritance, and encapsulated instance state** only when a component manages **long-lived state, lifecycle, or polymorphic agent behavior**:

- **Stateful AI Agents**: Agents extending `BaseAIAgent` (e.g., `LindaWhatsAppAgent`, `DaisyLeasingAgent`) that hold conversation context, memory, tool bindings, or persona state.
- **Core Engines**: Stateful runtime orchestrators such as `NinaEngine` and `WhatsAppEngine` managing connections, queues, or event loops.
- **Infrastructure & Resource Managers**: Rate-limiters, session managers, and telemetry/metrics managers that maintain mutable counters, timers, or connection pools.
- **Supervisor Chain Actors (`TURING-SUPERVISOR-CHAIN-019`)**: Specific accountable AI Supervisor actors (`SQD-XX-Y-ZZ-W` / `SUP-XX-Y-ZZ-W`) when modeled as stateful runtime actors with delegated authority.

## 2. When to Use Functional Programming (FP)

Use **pure functions, immutable data, and composition** for all stateless business logic, transformations, and UI:

- **Stateless Domain Calculators**: Commission splits, UAE 5% VAT + 9% corporate tax reserve calculations, XP/level rollups, and Bhakti `1-12-108` hierarchy math.
- **Statutory & Schema Validators**: Ejari, DLD, and VAT validators, idempotency key builders, and request/payload sanitizers.
- **Express Route Handlers**: Thin, stateless HTTP handlers delegating to pure domain functions or injected services.
- **Frontend UI & State**: React components, custom hooks, Redux Toolkit slices/reducers/selectors, and `AICC-Sanctum` pure logic.

## 3. Structural Guardrails (`AEG-042` & 12-Way Wilkes)

- **Single-Purpose File Ceiling (`AEG-042`)**: Every non-test source file MUST stay strictly under `350` lines. Split oversized classes or function collections before they breach the ceiling.
- **12-Way Mary Allen Wilkes Architecture**: Organize modules into clean, single-purpose units across `laws/`, `rules/`, `protocols/`, `skills/`, `hooks/`, and `registry/` TypeScript modules.
- **Verification**: Run `npm --prefix .. run aegis:limits` (`check-12-way-and-file-limits.ts`) to verify `<350`-line compliance after refactoring.
