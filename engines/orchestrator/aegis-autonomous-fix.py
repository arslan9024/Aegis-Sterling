"""
aegis-autonomous-fix.py — AEGIS V5.1 Autonomous Fix-Verify Workflow (run_workflow)
Reads `aegis-engine.ts dispatch --json`, groups findings by Director
(@Hejlsberg, @Kay, @Turing, @Dijkstra, @Diffie), spawns parallel subagents
for safe remediation batches (WC-UI-ALERT, PHOENIX-TS-STRICT, AEGIS-TS-MIGRATION),
and verifies each batch with `tsc --noEmit` and `vitest`.
"""

import json
import subprocess

TARGET_DIRECTORS = {"@Hejlsberg", "@Kay", "@Turing", "@Dijkstra", "@Diffie"}
SAFE_RULES = {"WC-UI-ALERT", "PHOENIX-TS-STRICT", "AEGIS-TS-MIGRATION"}

BATCH_SCHEMA = {
    "type": "object",
    "properties": {
        "director": {"type": "string"},
        "fixedCount": {"type": "integer"},
        "typecheckPassed": {"type": "boolean"},
        "vitestPassed": {"type": "boolean"},
        "summary": {"type": "string"},
    },
    "required": ["director", "fixedCount", "typecheckPassed", "vitestPassed", "summary"],
}

phase("Dispatch & Group Findings")
raw = subprocess.check_output(
    ["node", "Aegis-Sterling/engines/orchestrator/aegis-engine.ts", "dispatch", "--json"],
    text=True,
)
dispatch = json.loads(raw)
batches = [
    d for d in dispatch.get("breakdown", [])
    if d.get("directorName") in TARGET_DIRECTORS
]
log(f"Loaded {dispatch.get('totalFindings', 0)} findings; {len(batches)} target Director batches.")

phase("Parallel Autonomous Fix & Verify")


def build_agent(batch):
    director = batch["directorName"]
    model_tier = batch.get("modelTier", "inherit")
    rules = sorted({r for s in batch.get("subagents", []) for r in s.get("rules", [])})
    safe_subset = [r for r in rules if r in SAFE_RULES] or rules
    prompt = (
        f"You are {director} ({batch['domain']}).\n"
        f"Fix safe AEGIS findings for rules: {', '.join(safe_subset)} "
        f"(total assigned: {batch['totalCount']}).\n"
        "After applying minimal, single-purpose (<350-line) TypeScript fixes, "
        "verify with `tsc --noEmit` and `npx vitest run` on affected files."
    )
    return agent(
        prompt=prompt,
        schema=BATCH_SCHEMA,
        role=f"{director} Autonomous Fix",
        workspace="share",
        model=model_tier,
    )


results = await parallel(batches, build_agent) if batches else []
for res in results:
    log(
        f"{res['director']}: fixed={res['fixedCount']}, "
        f"tsc={res['typecheckPassed']}, vitest={res['vitestPassed']} — {res['summary']}"
    )
