/**
 * skills/skill.types.ts — Typed Descriptor for Aegis Skills
 */
export type AegisSkillCategory = "ORCHESTRATION" | "UAE_COMPLIANCE" | "FRONTEND_UI" | "QUALITY" | "GIT_OPS" | "SESSION";

export interface AegisSkillDescriptor {
  id: string;
  name: string;
  category: AegisSkillCategory;
  trigger: string;
  description: string;
  markdownPath: string;
  ownerDepartment: string;
}
