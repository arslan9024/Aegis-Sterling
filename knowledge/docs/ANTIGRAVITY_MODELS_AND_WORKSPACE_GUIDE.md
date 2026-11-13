# Antigravity Model Selection & Multi-Repository Architecture Guide

## 1. AI Model Selection Matrix in Antigravity

In Antigravity, different AI models excel at different scopes. Matching the model tier to your task optimizes speed, accuracy, and quota usage:

| Model Tier | Suggested Models / Engines | Best For / When to Choose |
| :--- | :--- | :--- |
| **Heavy / Pro Tier** *(Deep Thinking & Orchestration)* | **Gemini 2.5 Pro / Claude 3.7 Sonnet (Thinking)** | • Large architectural planning & cross-repo sync<br>• Complex root-cause debugging & multi-layer test failures<br>• Database schema design (Prisma migrations, relational modeling)<br>• Refactoring 1,000+ line components into modular architectures |
| **Standard / Flash Tier** *(Balanced Speed & Reasoning)* | **Gemini 2.5 Flash / GPT-4o** | • Everyday full-stack feature development<br>• React components & CSS styling<br>• API route writing & validation schemas (Zod)<br>• Writing unit & E2E tests (Vitest / Playwright) |
| **Light / Flash Lite Tier** *(Fast, High-Volume)* | **Gemini Flash Lite** | • Bulk documentation generation<br>• Simple lint fixes & localized code-commenting<br>• Fast repetitive script conversions & simple subagent task sweeps |

> [!TIP]
> You can switch the active conversation model at any time using the model picker at the top of the chat or via setting changes. Subagents and swarm workers default to your parent conversation's model, but can also be spawned on `flash_lite`, `flash`, or `pro` depending on their assigned workload.

---

## 2. Multi-Repository Workspace Layout

Your project is structured as independent services under one unified Antigravity workspace:

```text
C:\Users\Dell\Documents\antigravity\White-Caves\
├── White-Caves.code-workspace              <-- Unified workspace entry point
├── White-Caves-Frontend/                   <-- Next.js/Vite Web App, UI, CRM, Tailwind (GitHub: White-Caves-Frontend)
├── White-Caves-Server/                     <-- Express API, Prisma DB, Cloudflare Tunnel, WhatsApp (GitHub: White-Caves-Server)
└── White-Caves-Mobile/                     <-- React Native / Mobile client (Future Repo)
```

### Why this setup scales:
1. **Independent Git Repositories:** Each folder tracks its own Git history, CI/CD pipelines, and pull requests without git submodule conflicts.
2. **Unified Search & Refactoring:** In Antigravity IDE and VS Code, opening `White-Caves.code-workspace` loads all three folders simultaneously. You can search, edit, and jump between frontend and server code in a single window.
3. **Optimized Watchers:** Heavy directories (`node_modules`, `dist`, `coverage`, `.gemini`) are excluded from file watchers so the editor remains fast and responsive.
