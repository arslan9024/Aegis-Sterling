/**
 * @file index.ts
 * @module core/siddhanta
 * @description AEGIS V5.0 Siddhanta 108 Sovereign Engineering Matrix & Subagent Registry Index.
 * Unified, strictly typed, zero circular dependencies. Single Purpose Law: <350 lines.
 */

export interface AegisGovernance {
  law: string;
  maxFileLines: number;
  zeroBacklogLaw: boolean;
  typeScriptStrict: boolean;
  singlePurposeFileLaw: boolean;
  continuousDeduplication: boolean;
}

export interface AegisDepartmentMeta {
  id: number;
  name: string;
  slug: string;
  director: string;
  directorRole: string;
  nodeCount: number;
}

export interface AegisSubagentNode {
  name: string;
  id: string;
  nodeNumber: number;
  isDirector: boolean;
  departmentId: number;
  departmentName: string;
  departmentSlug: string;
  role: string;
  responsibility: string;
  protocol: string;
  framework: string;
  governance: AegisGovernance;
  attachedSkills: string[];
  tools: string[];
}

export interface Siddhanta108Manifest {
  version: string;
  codeName: string;
  totalDepartments: number;
  nodesPerDepartment: number;
  totalNodes: number;
  departments: AegisDepartmentMeta[];
}

export const SIDDHANTA_DEPARTMENTS: AegisDepartmentMeta[] = [
  { id: 1, name: 'Autonomous Agent Orchestration Core', slug: 'agent-orchestration', director: 'Nova', directorRole: 'Principal Orchestrator', nodeCount: 9 },
  { id: 2, name: 'Frontend Architecture & React 19 Core', slug: 'frontend-react19', director: 'Elena', directorRole: 'VP of Frontend Architecture', nodeCount: 9 },
  { id: 3, name: 'Backend Services, Node.js & Prisma', slug: 'backend-microservices', director: 'Marcus', directorRole: 'VP of Cloud Engineering', nodeCount: 9 },
  { id: 4, name: 'Database Architecture & BigQuery Core', slug: 'database-bigquery', director: 'Aria', directorRole: 'Principal Data Architect', nodeCount: 9 },
  { id: 5, name: 'DevOps, CI/CD & Cloud Infrastructure', slug: 'devops-infra', director: 'Victor', directorRole: 'Head of Infrastructure', nodeCount: 9 },
  { id: 6, name: 'Software Quality Assurance & Vitest', slug: 'sqa-automation', director: 'Sophia', directorRole: 'Chief Quality Architect', nodeCount: 9 },
  { id: 7, name: 'Security, Cryptography & Compliance', slug: 'security-compliance', director: 'Kael', directorRole: 'Chief Information Security Officer', nodeCount: 9 },
  { id: 8, name: 'Machine Learning, NLP & Predictive AI', slug: 'ml-intelligence', director: 'Lyra', directorRole: 'Head of AI Research', nodeCount: 9 },
  { id: 9, name: 'UI/UX Design, Visual Hierarchy & Systems', slug: 'design-system', director: 'Chloe', directorRole: 'Creative Director', nodeCount: 9 },
  { id: 10, name: 'Analytics, Business Intelligence & Metrics', slug: 'analytics-bi', director: 'Darius', directorRole: 'Chief Data Officer', nodeCount: 9 },
  { id: 11, name: 'API Integrations & External Gateways', slug: 'api-gateways', director: 'Maya', directorRole: 'Director of Platform Engineering', nodeCount: 9 },
  { id: 12, name: 'Mobile, PWA & Omnichannel Experience', slug: 'mobile-omnichannel', director: 'Leo', directorRole: 'Mobile Technical Lead', nodeCount: 9 },
];

export const SIDDHANTA_108_MANIFEST: Siddhanta108Manifest = {
  version: '5.0.0',
  codeName: 'SIDDHANTA_108_SOVEREIGN',
  totalDepartments: 12,
  nodesPerDepartment: 9,
  totalNodes: 108,
  departments: SIDDHANTA_DEPARTMENTS,
};

export function getDepartmentById(id: number): AegisDepartmentMeta | undefined {
  return SIDDHANTA_DEPARTMENTS.find(d => d.id === id);
}

export function getDepartmentBySlug(slug: string): AegisDepartmentMeta | undefined {
  return SIDDHANTA_DEPARTMENTS.find(d => d.slug === slug);
}
