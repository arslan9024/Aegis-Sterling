"""
AEGIS V5.1 — Reusable 12-Director Audit & 108-Subagent Parallel Implementation Workflow.
Run via: run_workflow(ScriptPath=".../Aegis-Sterling/engines/orchestrator/aegis_12_director_108_wave.py")
"""

DIRECTORS = [
    ("DEPT-01", "DIR-01", "AI_AURA", "Executive, Architecture & Auth (src/app, src/context, src/lib)"),
    ("DEPT-02", "DIR-02", "AI_OLIVIA", "Marketing, Branding & Campaigns (src/components/marketing, src/components/ZoeFeatures)"),
    ("DEPT-03", "DIR-03", "AI_HELENA", "Finance, Commissions & VAT (src/components/finance, src/components/accounting)"),
    ("DEPT-04", "DIR-04", "AI_VICTORIA", "HR, Recruitment & Onboarding (src/components/hr, src/components/crm/DepartmentManager)"),
    ("DEPT-05", "DIR-05", "AI_CLARA", "Leasing, Ejari & Tenancy (src/components/crm/ClaraLeadsCRM_NEW, src/components/leasing)"),
    ("DEPT-06", "DIR-06", "AI_SENTINEL", "Portfolio, Properties & Inventory (src/components/properties, src/components/crm/Property*)"),
    ("DEPT-07", "DIR-07", "AI_ARIA", "Sales, Deals & Transactions (src/components/deals, src/components/sales)"),
    ("DEPT-08", "DIR-08", "AI_MAYA", "Omnichannel, WhatsApp & Comms (src/components/whatsapp, src/components/chat)"),
    ("DEPT-09", "DIR-09", "AI_NOVA", "AI Command Center & Agents (src/agents, src/components/aicc)"),
    ("DEPT-10", "DIR-10", "AI_ATLAS", "Task Management & Operations (src/components/crm/TaskManager, src/components/operations)"),
    ("DEPT-11", "DIR-11", "AI_SOFIA", "Legal, DLD Compliance & Vault (src/components/crm/StatutoryWizards, src/components/documents)"),
    ("DEPT-12", "DIR-12", "AI_CHRONOS", "Analytics, Dashboards & Telemetry (src/components/dashboard, src/components/analytics)"),
]

AUDIT_SCHEMA = {
    "type": "object",
    "properties": {
        "floor": {"type": "string"},
        "director": {"type": "string"},
        "files": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "path": {"type": "string"},
                    "issues": {"type": "array", "items": {"type": "string"}},
                },
                "required": ["path", "issues"],
            },
        },
    },
    "required": ["floor", "director", "files"],
}

phase("Phase 1: 12-Director Parallel Audit")
audit_results = await parallel(
    DIRECTORS,
    lambda d: agent(
        prompt=(
            f"You are {d[2]} ({d[1]}, {d[0]}). Audit {d[3]} in White-Caves-Frontend.\n"
            "Use run_command with `git grep -n` to find:\n"
            "1. `alert(` or `confirm(` or `prompt(`\n"
            "2. `.catch(() => {})` or raw `fetch(`\n"
            "3. Physical RTL classes (`ml-`, `mr-`, `pl-`, `pr-`, `left-`, `right-`) in JSX/TSX\n"
            "4. `createContext` outside Theme/Language/Currency\n"
            "Return up to 9 distinct file paths with their issues. Do NOT edit files."
        ),
        schema=AUDIT_SCHEMA,
        role=f"{d[1]} {d[2]} Audit",
        type_name="research",
        model="flash",
    ),
)

# Deduplicate by file path and cap at 108 subagent file-tasks
file_map = {}
for res in audit_results:
    for f in res.get("files", []):
        p = f.get("path", "").strip()
        if p and f.get("issues"):
            file_map.setdefault(p, set()).update(f["issues"])

fix_tasks = [(path, sorted(list(issues))) for path, issues in list(file_map.items())[:108]]
log(f"12-Director Audit complete: {len(fix_tasks)} unique files queued for 108-Subagent Wave.")

if fix_tasks:
    phase("Phase 2: 108-Subagent Parallel Implementation Wave")
    fix_results = await parallel(
        fix_tasks,
        lambda item: agent(
            prompt=(
                f"Fix the following audited issues in `{item[0]}`:\n"
                + "\n".join(f"- {iss}" for iss in item[1])
                + "\nRules:\n"
                "- Replace `alert()`/`confirm()` with `<AlertBanner />` / `<ToastContainer />` or inline state.\n"
                "- Replace silent `.catch(() => {})` with proper error logging/state.\n"
                "- Convert physical RTL classes (`ml-`/`mr-`/`pl-`/`pr-`/`left-`/`right-`) to logical (`ms-`/`me-`/`ps-`/`pe-`/`start-`/`end-`).\n"
                "- Keep file < 350 lines (AEG-042). Make minimal, surgical edits."
            ),
            schema={"type": "string"},
            role=f"Fix {item[0].split('/')[-1]}",
            type_name="self",
            workspace="inherit",
            model="flash",
        ),
    )
    log(f"108-Subagent Wave complete: {len(fix_results)} files processed.")
