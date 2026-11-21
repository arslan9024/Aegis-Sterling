/**
 * skills/skillRegistry.ts — Canonical TypeScript Registry of Core Active AEGIS Skills
 */
import type { AegisSkillCategory, AegisSkillDescriptor } from "./skill.types.ts";

export const AEGIS_SKILL_REGISTRY: readonly AegisSkillDescriptor[] = [
  { id: "skill-aegis-task", name: "aegis-task", category: "ORCHESTRATION", trigger: "/aegis-task", description: "Executes an AEGIS sovereign task under TURING-LAW-000.", markdownPath: "extensions/plugins/aegis-sterling/skills/aegis-task/SKILL.md", ownerDepartment: "DEPT-01" },
  { id: "skill-ejari-rules", name: "whitecaves-ejari-rules", category: "UAE_COMPLIANCE", trigger: "ejari", description: "Dubai DLD, Ejari, PDC, 5% commercial VAT, and Form 12 eviction rules.", markdownPath: "extensions/plugins/aegis-sterling/skills/whitecaves-ejari-rules/SKILL.md", ownerDepartment: "DEPT-10" },
  { id: "skill-ui-library", name: "whitecaves-ui-library", category: "FRONTEND_UI", trigger: "ui-library", description: "White Caves CRM design system, lucide-react icons, and AlertBanner/Toast rules.", markdownPath: "extensions/plugins/aegis-sterling/skills/whitecaves-ui-library/SKILL.md", ownerDepartment: "DEPT-02" },
  { id: "skill-session-handover", name: "session-handover", category: "SESSION", trigger: "handover", description: "Generates standardized next-session handoff prompts with clean branch checks.", markdownPath: "extensions/plugins/aegis-sterling/skills/session-handover/SKILL.md", ownerDepartment: "DEPT-01" },
  { id: "skill-ts-triage", name: "ts-typecheck-triage", category: "QUALITY", trigger: "typecheck", description: "Triages TypeScript errors in focused waves.", markdownPath: "extensions/plugins/aegis-sterling/skills/ts-typecheck-triage/SKILL.md", ownerDepartment: "DEPT-12" },
  { id: "skill-security-audit", name: "security-audit", category: "QUALITY", trigger: "security", description: "Focused security hardening audit across API, auth, and secrets.", markdownPath: "extensions/plugins/aegis-sterling/skills/security-audit/SKILL.md", ownerDepartment: "DEPT-07" },
  { id: "skill-pr-review", name: "pr-review-checklist", category: "QUALITY", trigger: "pr-review", description: "Structured pass/fail pull request review checklist.", markdownPath: "extensions/plugins/aegis-sterling/skills/pr-review-checklist/SKILL.md", ownerDepartment: "DEPT-12" },
  { id: "skill-git-manager", name: "git-manager", category: "GIT_OPS", trigger: "git", description: "Standardized conventional commits and branch workflows via @Orion.", markdownPath: "extensions/plugins/aegis-sterling/skills/git-manager/SKILL.md", ownerDepartment: "DEPT-08" },
] as const;

export function getSkillByName(name: string): AegisSkillDescriptor | undefined {
  return AEGIS_SKILL_REGISTRY.find(s => s.name === name);
}

export function listSkillsByCategory(category: AegisSkillCategory): AegisSkillDescriptor[] {
  return AEGIS_SKILL_REGISTRY.filter(s => s.category === category);
}
