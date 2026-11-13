// Book 2: Aegis Sterling — Ch08 UAE Statutory Domain | Ch09 SecOps | Ch10 Reflections
import { Chapter } from './treeTypes';

export const CHAPTER_AEGIS_UAE_DOMAIN: Chapter = {
  level: 5,
  nodeId: 'CH05-AS-008',
  chapterNumber: 8,
  chapterCode: 'AS-CH-08',
  title: 'Chapter 08: Statutory UAE Domain — DLD, Ejari & Tax Invariants',
  subtitle: 'How AEGIS Encodes Dubai Land Department Rules as Unbreakable Code Contracts',
  readTimeMinutes: 16,
  subChapters: [
    {
      level: 6,
      nodeId: 'SC06-AS-081',
      subChapterNumber: 1,
      title: 'Sub-Chapter 1: UAE FTA 5% VAT & 9% Corporate Tax Reserves',
      summary:
        'Every financial transaction in White Caves CRM auto-applies UAE FTA 5% VAT on eligible commissions and 9% corporate tax reserve deductions (AEG-029–031). These rates are hardcoded as IMMUTABLE_UAE_VAT_RATE = 0.05 and IMMUTABLE_UAE_CORP_TAX_RATE = 0.09 — never computed dynamically from API because regulatory constants must survive network outages.',
      sections: [
        {
          level: 7,
          nodeId: 'S07-AS-081',
          sectionNumber: 1,
          title: 'Section 8.1.1: Commission Split Architecture',
          summary:
            'Dynamic 60%–70% agent splits (AEG-033) are computed pre-VAT. The escrow settlement sequence: (1) Gross commission received, (2) 5% VAT isolated to FTA reserve account, (3) net split computed, (4) immutable COMPLETED deal status set. No reversal after COMPLETED.',
          topics: [
            {
              level: 8,
              nodeId: 'T08-AS-0811',
              topicNumber: 1,
              title: 'Topic 8.1.1.1: Zoho Books Sync Protocol',
              summary:
                'Sequential receipt numbers (AEG-030) are generated monotonically and synced to Zoho Books via the Finance API (AEG-031). Duplicate receipt detection uses idempotency keys identical to Ejari/DLD idempotency pattern (AEG-012).',
              artifacts: [],
              paragraphs: [],
              sentences: [],
              lines: [],
            },
          ],
        },
      ],
    },
    {
      level: 6,
      nodeId: 'SC06-AS-082',
      subChapterNumber: 2,
      title: 'Sub-Chapter 2: Ejari Registration & 90/60/30-Day Alert Logic',
      summary:
        'Every tenancy contract must be registered via Ejari (Dubai Smart Government portal) within 30 days of signing. AEGIS tracks the expiry_date field on every LeaseContract and fires 90-day, 60-day, and 30-day alert tasks (AEG-027) assigned to the responsible agent. Idempotency key format: ejari-{contractId}-{daysLeft} prevents duplicate alerts.',
      sections: [
        {
          level: 7,
          nodeId: 'S07-AS-082',
          sectionNumber: 2,
          title: 'Section 8.2.1: DLD Idempotency Keys',
          summary:
            'AEG-012: All Dubai Land Department form submissions must carry a deterministic idempotency key (dld-{txnType}-{unitId}-{date}) before hitting the gov API. The 1500ms timeout (AEG-010) applies. If gov API is unreachable, the submission is queued — never retried with a fresh key, which would create duplicate registrations.',
          topics: [],
        },
      ],
    },
    {
      level: 6,
      nodeId: 'SC06-AS-083',
      subChapterNumber: 3,
      title: 'Sub-Chapter 3: Trakheesi, AML/KYC & RERA Compliance',
      summary:
        'All property listings require Trakheesi permit numbers (Dept 10 SOP). Every buyer/seller/broker undergoes AML/KYC screening at onboarding. AEGIS encodes the check as a mandatory gate task: until KYC_STATUS === "VERIFIED", no deal can transition to ACTIVE. This is enforced at the Prisma model level via a check constraint.',
      sections: [],
    },
  ],
};

export const CHAPTER_AEGIS_SECOPS: Chapter = {
  level: 5,
  nodeId: 'CH05-AS-009',
  chapterNumber: 9,
  chapterCode: 'AS-CH-09',
  title: 'Chapter 09: SecOps — Cryptographic Integrity & Access Sovereignty',
  subtitle: "How @Sofia's Defense Layer Keeps 235 Agent Sessions Zero-Breach",
  readTimeMinutes: 13,
  subChapters: [
    {
      level: 6,
      nodeId: 'SC06-AS-091',
      subChapterNumber: 1,
      title: 'Sub-Chapter 1: Husky Secret Scan & Pre-Commit Gates',
      summary:
        'AEG-016: Every git commit passes through @Sofia\'s Husky pre-commit hook that scans staged files for secret patterns: AWS keys, JWT secrets, Stripe keys, Supabase keys, Firebase service accounts. Any match exits with code 1 — commit blocked. Secrets live exclusively in .env files (never committed) with a single-source vault pattern.',
      sections: [
        {
          level: 7,
          nodeId: 'S07-AS-091',
          sectionNumber: 1,
          title: 'Section 9.1.1: Level 5 RBAC Architecture',
          summary:
            'AEG-004: Five RBAC tiers — L1 (Public viewer), L2 (Junior Agent), L3 (Senior Agent/Lead), L4 (Department Head/Manager), L5 (Executive Council + Zoe). The 13-floor RoleAssignment join table (AEG-042) maps every User to exactly one role per department floor. Floor-crossing queries require L4+ tokens.',
          topics: [
            {
              level: 8,
              nodeId: 'T08-AS-0911',
              topicNumber: 1,
              title: 'Topic 9.1.1.1: JWT + Supabase RLS',
              summary:
                'Auth tokens are short-lived (15 min access, 7 day refresh). Supabase Row Level Security policies mirror the RBAC tiers — the database enforces the same constraints as the API layer. Defense in depth: even a compromised API layer cannot read unauthorized rows.',
              artifacts: [],
              paragraphs: [],
              sentences: [],
              lines: [],
            },
          ],
        },
      ],
    },
    {
      level: 6,
      nodeId: 'SC06-AS-092',
      subChapterNumber: 2,
      title: 'Sub-Chapter 2: CORS & Secret Abstraction Pattern',
      summary:
        'AEG-018: All environment secrets are abstracted behind a typed env.ts module that validates shape at startup via zod. If any required secret is missing at boot, the server crashes with a clear error — never silently falling back to undefined values that cause runtime leaks downstream.',
      sections: [],
    },
  ],
};

export const CHAPTER_AEGIS_REFLECTIONS: Chapter = {
  level: 5,
  nodeId: 'CH05-AS-010',
  chapterNumber: 10,
  chapterCode: 'AS-CH-10',
  title: 'Chapter 10: Session Reflections & Autonomous Growth Index',
  subtitle: 'How Every Human Correction Becomes Permanent Machine Wisdom',
  readTimeMinutes: 10,
  subChapters: [
    {
      level: 6,
      nodeId: 'SC06-AS-101',
      subChapterNumber: 1,
      title: 'Sub-Chapter 1: The Sovereign Self-Correction Loop (TURING-RULE-TIERS-012)',
      summary:
        'When a human architect corrects AEGIS — changes architectural direction, fixes a pattern, or rejects an approach — the agent does not simply comply and move on. The correction is crystallized into the appropriate rule tier (Tier 1 Global → Tier 3 Project), documented in the Book of White Caves, and inherited by every subsequent subagent. The human conversation is the seed; the rule file is the tree.',
      sections: [
        {
          level: 7,
          nodeId: 'S07-AS-101',
          sectionNumber: 1,
          title: 'Section 10.1.1: Growth Velocity Metrics',
          summary:
            'Per wave: (1) Net new TSX chapter nodes created, (2) Protocols promoted from conversational to crystallized rule, (3) Files refactored to <350 lines, (4) Build bundle delta (should stay <500 kB gzip), (5) TypeScript error count delta. Autonomous Growth Index = (improvements - regressions) / wave_count.',
          topics: [
            {
              level: 8,
              nodeId: 'T08-AS-1011',
              topicNumber: 1,
              title: 'Topic 10.1.1.1: The Two-Books Doctrine as Learning Mechanism',
              summary:
                'Book 1 (What we build) grows with each Feature Wave. Book 2 (How Aegis works) grows with each Meta-Correction. When Book 2 references a chapter in Book 1 and vice versa via ProtocolRef portals, the cross-link forms a bidirectional memory anchor — the highest form of machine learning without gradient descent.',
              artifacts: [],
              paragraphs: [],
              sentences: [],
              lines: [],
            },
          ],
        },
      ],
    },
    {
      level: 6,
      nodeId: 'SC06-AS-102',
      subChapterNumber: 2,
      title: 'Sub-Chapter 2: The Arslan-Aegis Creative Loop',
      summary:
        'The user (Arslan Malik) brings the vision, the domain knowledge, and the aesthetic direction. AEGIS brings velocity, pattern recognition, and institutional memory. Neither is complete without the other. The session reflections in this chapter document the creative dialogue that produced the dual-book system, the counting philosophy, and the Protocol Portal hyperlinking concept — all born from a single question: "do you understand my idea?"',
      sections: [
        {
          level: 7,
          nodeId: 'S07-AS-102',
          sectionNumber: 2,
          title: 'Section 10.2.1: Decisions That Shaped Aegis Sterling',
          summary:
            'Key inflection points: (1) Light-default theme invariant — user insisted even OS dark mode must not change default; (2) Numbers as portals — the counting philosophy that birthed ProtocolRef; (3) TSX over MD/HTML everywhere — user confirmed explicitly after seeing iframe ugliness; (4) Book 1 = WHAT, Book 2 = HOW — the dual autobiography concept as self-learning mechanism; (5) Sub-items in sidebar accordion — users should navigate books from the left rail, not just the header tab.',
          topics: [],
        },
      ],
    },
  ],
};
