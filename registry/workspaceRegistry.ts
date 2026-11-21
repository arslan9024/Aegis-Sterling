/**
 * registry/workspaceRegistry.ts — Canonical White Caves Monorepo Port & Repo Registry
 */
export interface WorkspaceRepoSpec {
  id: string;
  name: string;
  port: number;
  stack: string;
}

export const WHITE_CAVES_WORKSPACE_REPOS: readonly WorkspaceRepoSpec[] = [
  { id: "server", name: "White-Caves-Server", port: 5001, stack: "Express + Prisma + PostgreSQL" },
  { id: "frontend", name: "White-Caves-Frontend", port: 3000, stack: "React + Vite + Redux Toolkit" },
  { id: "web", name: "White-Caves-Web", port: 3001, stack: "Next.js SSR Public Portal" },
  { id: "linda", name: "whatsapp-bot-linda", port: 3002, stack: "Node.js + Baileys + Gemini" },
  { id: "aegis", name: "Aegis-Sterling", port: 3333, stack: "TypeScript ESM Orchestrator + Vite UI" },
  { id: "mobile", name: "White-Caves-Mobile", port: 8081, stack: "React Native + Expo" },
] as const;
