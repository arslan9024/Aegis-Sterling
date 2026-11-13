---
name: git-branch-release-guardian
description: "AEGIS Sovereign Git Guardian & Release Safety Protocol: Enforces pre-flight branch audits, backup tag creation, test gates verification, and safe --no-ff integration merging."
---

# Git Branch Release Guardian Skill (AEGIS Protocol)

This skill enforces strict git integrity across White Caves multi-root repositories (`White-Caves-Frontend`, `White-Caves-Server`, `White-Caves-Mobile`, `Aegis-Sterling`).

## 4 Immutable Guardrails:
1. **Never Destroy WIP:** Always take a timestamped backup branch or tag (`backup/pre-sync-YYYYMMDD-HHMM`) before touching unmerged branches.
2. **Never Blind Merge:** Check `git log main..feature-branch` to audit exact commit diffs before merging.
3. **Verification Gates Required:**
   - Gate 1: Typecheck (`npm run typecheck`)
   - Gate 2: Build verification (`npm run build`)
   - Gate 3: Test pass rate (`npm test` / `npm run test:run`)
4. **Clean Integration Merge:** Always merge feature/copilot branches into an integration branch first, resolve conflicts deliberately, and merge into `main` using `--no-ff`.
