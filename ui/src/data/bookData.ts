export interface BookChapter {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  category: 'Core Architecture' | 'Autonomous Mesh' | 'Domain & Actors' | 'Multi-Repo Decoupling' | 'Living Chronicler';
  file: string;
  readTime: string;
  summary: string;
  topics: string[];
}

export const BOOK_CHAPTERS: BookChapter[] = [
  {
    id: 'ch-01',
    slug: 'chapter-01-architecture',
    title: 'Chapter 01: The Grand Architecture',
    subtitle: 'V5.0 Sovereign Architectural Principles & Turing Laws',
    category: 'Core Architecture',
    file: '/book-white-caves/chapter-01-architecture.html',
    readTime: '6 min read',
    summary: 'Establishes TURING-LAW-000 zero-waste AI credit rules, TURING-ROOT-007 cleanliness, and 12-way enterprise architecture.',
    topics: ['TURING-LAW-000', 'TURING-ROOT-007', 'TURING-NAV-TREE-009', 'Credit Shield', 'Statutory Gates']
  },
  {
    id: 'ch-02',
    slug: 'chapter-02-mesh',
    title: 'Chapter 02: AEGIS Sovereign Mesh',
    subtitle: 'Dual Track 1-12-108 Autonomous Network',
    category: 'Autonomous Mesh',
    file: '/book-white-caves/chapter-02-mesh.html',
    readTime: '8 min read',
    summary: 'Detailed decomposition of 108 Engineering specialist nodes across 12 departments and 120 Business supervisors.',
    topics: ['Sovereign Mesh', 'AEGIS Mesh', 'Track 1 Engineering', 'Track 2 Business', '1-12-108 Hierarchy']
  },
  {
    id: 'ch-03',
    slug: 'chapter-03-ouroboros',
    title: 'Chapter 03: Protocol Perpetual Ouroboros',
    subtitle: 'Autonomous Self-Evolution & Continuous Autopilot',
    category: 'Autonomous Mesh',
    file: '/book-white-caves/chapter-03-ouroboros.html',
    readTime: '7 min read',
    summary: 'The self-sustaining engineering lifecycle: diagnostics, planning, parallel multi-agent delegation, zero-token execution, and telemetry.',
    topics: ['Perpetual Ouroboros', 'Autopilot Loop', 'TURING-PERPETUAL-OUROBOROS', 'Zero-Token Speed']
  },
  {
    id: 'ch-04',
    slug: 'chapter-04-henry',
    title: 'Chapter 04: Henry OCR & Compliance Audit',
    subtitle: 'Web Worker Vision, Document Verification & RERA Gates',
    category: 'Autonomous Mesh',
    file: '/book-white-caves/chapter-04-henry.html',
    readTime: '9 min read',
    summary: 'Tesseract Web Worker OCR integration for Title Deeds, Passports, and Ejari contracts with statutory verification.',
    topics: ['Henry OCR', 'Tesseract Worker', 'RERA Compliance', 'Ejari Gate', 'Statutory Verification']
  },
  {
    id: 'ch-05',
    slug: 'chapter-05-mary',
    title: 'Chapter 05: Mary Property Inventory',
    subtitle: 'Real-Time Inventory Mesh & UAE Escrow Allocation',
    category: 'Domain & Actors',
    file: '/book-white-caves/chapter-05-mary.html',
    readTime: '8 min read',
    summary: 'State management for unit allocations, dynamic pricing tiers, developer integrations, and statutory escrow vaults.',
    topics: ['Mary Property Inventory', 'Escrow Vault', 'Unit Allocation', 'Real-Time Inventory']
  },
  {
    id: 'ch-06',
    slug: 'chapter-06-actors-matrix',
    title: 'Chapter 06: Domain Actors Matrix',
    subtitle: 'Strict Entity-Action-Structure Separation (ERMS/DMS/TMS)',
    category: 'Domain & Actors',
    file: '/book-white-caves/chapter-06-actors-matrix.html',
    readTime: '11 min read',
    summary: 'Clean boundary separation: DMS (Department Structure), ERMS (Actors & Entities), TMS (Verbs & Tasks) under TURING-SEPARATION-010.',
    topics: ['Domain Actors Matrix', 'ERMS', 'DMS', 'TMS', 'TURING-SEPARATION-010']
  },
  {
    id: 'ch-07',
    slug: 'chapter-07-web-decoupling',
    title: 'Chapter 07: Web Decoupling & Domains',
    subtitle: 'Separation of Public Showcase and Private ERP/CRM',
    category: 'Multi-Repo Decoupling',
    file: '/book-white-caves/chapter-07-web-decoupling.html',
    readTime: '10 min read',
    summary: 'Architectural rationale for decoupling public marketing web showcase (White-Caves-Web) from the private operating system.',
    topics: ['White-Caves-Web', 'Decoupling', 'Vercel Deployment', 'SEO Architecture']
  },
  {
    id: 'ch-08',
    slug: 'chapter-08-multi-repo-rbac',
    title: 'Chapter 08: Multi-Repo & Portals',
    subtitle: 'Four Independent Repositories with Strict RBAC',
    category: 'Multi-Repo Decoupling',
    file: '/book-white-caves/chapter-08-multi-repo-rbac.html',
    readTime: '8 min read',
    summary: 'Unified security architecture across White-Caves-Web, White-Caves-Frontend, White-Caves-Server, and White-Caves-Mobile.',
    topics: ['Multi-Repo Architecture', 'RBAC Level 5', 'Private Portals', 'Cross-Repo Contracts']
  },
  {
    id: 'ch-09',
    slug: 'chapter-09-conversations-and-decisions',
    title: 'Chapter 09: Architectural Decisions & ADR',
    subtitle: 'Living Chronicler of Every Milestone & Paradigm Shift',
    category: 'Living Chronicler',
    file: '/book-white-caves/chapter-09-conversations-and-decisions.html',
    readTime: '12 min read',
    summary: 'Captures every conversational decision, ADR, sovereign repo restructuring, and TURING-BOOK-011 continuous learning loop.',
    topics: ['TURING-BOOK-011', 'ADR Registry', 'Living Chronicler', 'Conversational History']
  },
  {
    id: 'ch-progress',
    slug: 'progress-intelligence',
    title: 'Appendix: Progress Intelligence & Target Mesh',
    subtitle: 'Autonomous Telemetry, Wave Velocity & Metric Graphs',
    category: 'Living Chronicler',
    file: '/book-white-caves/progress-intelligence.html',
    readTime: '5 min read',
    summary: 'Live velocity telemetry, daily milestone logs, and statutory audit readiness charts.',
    topics: ['Progress Intelligence', 'Wave Velocity', 'Telemetry Feed', 'Milestone Forecast']
  }
];

export const TOPIC_GLOSSARY: Record<string, { targetSlug: string; definition: string }> = {
  'TURING-LAW-000': {
    targetSlug: 'chapter-01-architecture',
    definition: 'Supreme law enforcing zero-waste AI credit spending, parallel tool batching, and sub-second execution velocity.'
  },
  'TURING-BOOK-011': {
    targetSlug: 'chapter-09-conversations-and-decisions',
    definition: 'Sovereign law requiring every key architectural decision and conversational breakthrough to be written into the living book.'
  },
  'TURING-ROOT-007': {
    targetSlug: 'chapter-01-architecture',
    definition: 'Strict cleanliness law forbidding rogue root directories and consolidating all documentation under .agents/ and Aegis.'
  },
  'TURING-NAV-TREE-009': {
    targetSlug: 'chapter-01-architecture',
    definition: 'Hierarchical tree-state navigation and leaf-task return system modeled after IDE file explorers.'
  },
  'TURING-SEPARATION-010': {
    targetSlug: 'chapter-06-actors-matrix',
    definition: 'Strict decoupling of organizational structure (DMS), actors/objects (ERMS), and actionable tasks (TMS).'
  },
  'Perpetual Ouroboros': {
    targetSlug: 'chapter-03-ouroboros',
    definition: 'Non-stop autonomous autopilot loop continuously scanning, planning, delegating, verifying, and committing improvements.'
  },
  'Sovereign Mesh': {
    targetSlug: 'chapter-02-mesh',
    definition: 'The AEGIS 1-12-108 dual-track multi-agent workforce spanning 108 engineering and 120 business nodes.'
  },
  'AEGIS Mesh': {
    targetSlug: 'chapter-02-mesh',
    definition: 'Autonomous orchestration mesh coordinating all specialized project subagents and supervisors.'
  },
  'Henry OCR': {
    targetSlug: 'chapter-04-henry',
    definition: 'Autonomous document parsing agent powered by in-browser Tesseract Web Workers for Title Deeds and Passports.'
  },
  'Mary Property Inventory': {
    targetSlug: 'chapter-05-mary',
    definition: 'Inventory management supervisor enforcing real-time unit status synchronization and UAE statutory escrow tracking.'
  },
  'Domain Actors Matrix': {
    targetSlug: 'chapter-06-actors-matrix',
    definition: 'High-precision operational matrix mapping actors to statutory permissions and department floors.'
  },
  'ERMS': {
    targetSlug: 'chapter-06-actors-matrix',
    definition: 'Entity Relationship Management System: pure entities (Users, Landlords, Units) strictly decoupled from tasks.'
  },
  'DMS': {
    targetSlug: 'chapter-06-actors-matrix',
    definition: 'Department Management System: organizational taxonomy across the 12 corporate departments.'
  },
  'TMS': {
    targetSlug: 'chapter-06-actors-matrix',
    definition: 'Task Management System: the actions/verbs connecting actors with department workflows.'
  },
  'White-Caves-Web': {
    targetSlug: 'chapter-07-web-decoupling',
    definition: 'Dedicated public showcase web application decoupled from the private White-Caves-Frontend ERP system.'
  },
  'Progress Intelligence': {
    targetSlug: 'progress-intelligence',
    definition: 'Real-time telemetry, automated velocity calculation, and milestone completion forecasting.'
  }
};
