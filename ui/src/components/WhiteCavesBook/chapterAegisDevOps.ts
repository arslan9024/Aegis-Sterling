// Book 2: Aegis Sterling — Ch06 DevOps & CI Conventions | Ch07 TypeScript Strictness
import { Chapter } from './treeTypes';

export const CHAPTER_AEGIS_DEVOPS: Chapter = {
  level: 5,
  nodeId: 'CH05-AS-006',
  chapterNumber: 6,
  chapterCode: 'AS-CH-06',
  title: 'Chapter 06: DevOps, CI/CD & Git Governance',
  subtitle: 'How @Gwynne Enforces Branch Sovereignty and Zero-Regression Pipelines',
  readTimeMinutes: 14,
  subChapters: [
    {
      level: 6,
      nodeId: 'SC06-AS-061',
      subChapterNumber: 1,
      title: 'Sub-Chapter 1: Conventional Commits & Semantic Versioning',
      summary:
        'Every commit authored by an AEGIS agent must follow the Conventional Commits v1.0 specification: feat(scope), fix(scope), refactor(scope), chore, docs. This creates a machine-readable audit trail that feeds the XP leaderboard hooks in AEG-037–039 and auto-generates the CHANGELOG for every Wave completion.',
      sections: [
        {
          level: 7,
          nodeId: 'S07-AS-061',
          sectionNumber: 1,
          title: 'Section 6.1.1: The Commit Grammar',
          summary:
            'type(scope): short imperative summary — no period, present tense, ≤ 72 chars. Breaking changes append BREAKING CHANGE: in the footer. Scope = repo module (aegis-ui, frontend, server, mobile, web).',
          topics: [
            {
              level: 8,
              nodeId: 'T08-AS-0611',
              topicNumber: 1,
              title: 'Topic 6.1.1.1: Forbidden Commit Patterns',
              summary:
                'Never: "WIP", "fix stuff", "update", "misc", "temp". These block the merge gate. @Gwynne\'s Husky pre-commit hook rejects non-conventional commits with exit code 1.',
              artifacts: [],
              paragraphs: [],
              sentences: [],
              lines: [],
            },
          ],
        },
        {
          level: 7,
          nodeId: 'S07-AS-062',
          sectionNumber: 2,
          title: 'Section 6.1.2: Protected Branch Rules',
          summary:
            'main is the sovereign trunk — zero direct pushes. All features branch from main (feat/TICKET-NNN-short-name) and merge via squash PR after: (1) npx tsc --noEmit passes, (2) Vitest suite green, (3) Playwright E2E LTR+RTL pass, (4) Husky secret scan clean.',
          topics: [
            {
              level: 8,
              nodeId: 'T08-AS-0621',
              topicNumber: 1,
              title: 'Topic 6.1.2.1: Branch Pruning Protocol',
              summary:
                'After each Wave completion, @Gwynne runs: git branch --merged main | grep -v main | xargs git branch -d. No stale branches accumulate. The commit matrix in Aegis Sterling\'s Multi-Repo view reflects live branch count.',
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
      nodeId: 'SC06-AS-062',
      subChapterNumber: 2,
      title: 'Sub-Chapter 2: CI/CD Pipeline Architecture',
      summary:
        'Each repository has a Vite build gate (npm run build), TypeScript gate (npx tsc --noEmit), and Vitest unit gate (npx vitest run) that AEGIS executes in <2s per targeted file. The Playwright E2E suite runs only at Wave boundary, not per commit. TURING-DEV-SERVER-BAN-013 forbids live dev servers inside Antigravity sessions.',
      sections: [
        {
          level: 7,
          nodeId: 'S07-AS-063',
          sectionNumber: 3,
          title: 'Section 6.2.1: Zero-Build-Failure Policy',
          summary:
            'If npm run build exits non-zero, the agent MUST stop all other work, fix the TS error or import gap, and re-run build before any git commit. No "it compiles locally" exceptions. The build IS the truth.',
          topics: [],
        },
      ],
    },
  ],
};

export const CHAPTER_AEGIS_TYPESCRIPT: Chapter = {
  level: 5,
  nodeId: 'CH05-AS-007',
  chapterNumber: 7,
  chapterCode: 'AS-CH-07',
  title: 'Chapter 07: TypeScript Strictness & The Single-Purpose File Law',
  subtitle: "How @Grace's Token Shield Keeps Every File Under 350 Lines",
  readTimeMinutes: 11,
  subChapters: [
    {
      level: 6,
      nodeId: 'SC06-AS-071',
      subChapterNumber: 1,
      title: 'Sub-Chapter 1: The 350-Line Covenant (AEG-042)',
      summary:
        'AEG-042 is an absolute engineering law: every TypeScript/TSX file must be ≤ 350 lines. This is not a style guide — it is a cognitive budget constraint. A file longer than 350 lines cannot be read in a single surgical window, violates TURING-LAW-000 token economy, and creates unmergeable conflict surfaces in concurrent agent sessions.',
      sections: [
        {
          level: 7,
          nodeId: 'S07-AS-071',
          sectionNumber: 1,
          title: 'Section 7.1.1: Enforcement Mechanisms',
          summary:
            'npx ts-prune flags unused exports. The orchestrator checks line counts before committing. Any file over 350 lines triggers an immediate AEG-042 refactor split before the next commit gate.',
          topics: [
            {
              level: 8,
              nodeId: 'T08-AS-0711',
              topicNumber: 1,
              title: 'Topic 7.1.1.1: Split Heuristics',
              summary:
                'Extract: (a) pure data constants → separate .ts file; (b) sub-components → own .tsx; (c) hooks → useHookName.ts; (d) types → types.ts. Never split by alphabetical or random chunking — split by semantic cohesion.',
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
      nodeId: 'SC06-AS-072',
      subChapterNumber: 2,
      title: 'Sub-Chapter 2: Zero-Any Policy',
      summary:
        'TypeScript strict mode (strict: true in tsconfig) is non-negotiable. No any, no @ts-ignore, no non-null assertion (!.) without an explicit comment explaining why the runtime guarantee is provable. @Grace\'s review gate rejects PRs containing these patterns without written justification.',
      sections: [
        {
          level: 7,
          nodeId: 'S07-AS-072',
          sectionNumber: 2,
          title: 'Section 7.2.1: Tree Types System',
          summary:
            'All 12-level book data is typed via treeTypes.ts (MasterCorpusRoot → Library → Book → Volume → Canto → Chapter → SubChapter → Section → Topic → Artifact → Paragraph → Sentence → Line). This schema eliminates runtime shape errors and enables surgical range reads.',
          topics: [],
        },
      ],
    },
  ],
};
