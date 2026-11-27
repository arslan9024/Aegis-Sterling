/**
 * aegisTeamTypes.ts — Typed definitions for the 12 AEGIS Directors & 108 AEGIS Subagents.
 * Strictly separate from Zoe Team / White Caves operational hierarchy.
 */

export type AegisToolPermission = 'read_file' | 'edit_file' | 'write_file' | 'run_command' | 'search_web';

export interface AegisDirectorSpec {
  id: string;
  departmentId: number;
  departmentSlug: string;
  domain: string;
  name: string;
  title: string;
  skills: string[];
  tools: AegisToolPermission[];
  scope: string;
}

export interface AegisSubagentSpec {
  id: string;
  directorId: string;
  departmentId: number;
  nodeNumber: number;
  name: string;
  role: string;
  skills: string[];
  tools: AegisToolPermission[];
  scope: string;
}

export interface AegisTeamRosterSummary {
  directorsCount: number;
  subagentsCount: number;
  totalAegisTeam: number;
  departments: Array<{
    departmentId: number;
    director: string;
    domain: string;
    subagentsCount: number;
  }>;
}
