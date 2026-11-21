#!/usr/bin/env node
/**
 * hooks/aegis-guard.ts — Antigravity PreToolUse Deterministic Guard Hook (TypeScript ESM)
 */
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";

export interface ToolGuardDecision {
  decision: "allow" | "deny";
  reason?: string;
}

export function checkDevServerBan(cmd: string): ToolGuardDecision {
  if (
    /(?:^|[;&|]\s*)(?:npm(?:\s+--prefix\s+\S+)?\s+run\s+dev(?:\S*)?|npx\s+vite(?:\s|$)|vite(?:\s|$)(?!\s*(?:build|preview|--version))|next\s+dev|nodemon\b|expo\s+start)/i.test(
      cmd
    )
  ) {
    return {
      decision: "deny",
      reason:
        "TURING-DEV-SERVER-BAN-013: Dev servers must be run by the developer in an external terminal, not by agents.",
    };
  }
  return { decision: "allow" };
}

export function checkPowerShellHeadBan(cmd: string): ToolGuardDecision {
  if (/(?:\|\s*head\b|(?:^|[;&|]\s*)head\s+-\w*)/i.test(cmd)) {
    return {
      decision: "deny",
      reason: "TURING-SHELL-015: `head` does not exist in PowerShell; use `Select-Object -First N`.",
    };
  }
  return { decision: "allow" };
}

export function checkDestructiveCommand(cmd: string): ToolGuardDecision {
  if (
    /rm\s+-rf\s+[^\n]*node_modules|rmdir\s+\/s\s+\/q\s+[^\n]*node_modules|Remove-Item[^\n]*node_modules|git\s+reset\s+--hard|git\s+push\s+(?:--force|-f)(?:\s|$)/i.test(
      cmd
    )
  ) {
    return {
      decision: "deny",
      reason: "TURING-LAW-000 §6: Destructive workspace wipe or force-push requires explicit user confirmation.",
    };
  }
  return { decision: "allow" };
}

export function checkRootCleanlinessPath(rawPath: string): ToolGuardDecision {
  const normalized = rawPath.replace(/\\/g, "/");
  if (
    /\/(White-Caves-Frontend|White-Caves-Server|White-Caves-Web|White-Caves-Mobile)\/(docs|plans|strategies|business_docs)\//i.test(
      normalized
    )
  ) {
    return {
      decision: "deny",
      reason:
        "TURING-ROOT-007: Do not create loose docs/plans/strategies folders in app repo roots; write to Aegis-Sterling/.agents/ instead.",
    };
  }
  return { decision: "allow" };
}

interface PreToolUseInput {
  toolCall?: { name?: string; args?: Record<string, unknown> };
  cwd?: string;
}

export function evaluateToolCall(input: PreToolUseInput): ToolGuardDecision {
  const toolName = input?.toolCall?.name ?? "";
  const args = input?.toolCall?.args ?? {};
  if (toolName === "run_command") {
    const cmd = String(args.CommandLine ?? "").trim();
    for (const check of [checkDevServerBan, checkPowerShellHeadBan, checkDestructiveCommand]) {
      const res = check(cmd);
      if (res.decision === "deny") return res;
    }
  }
  if (toolName === "write_file") {
    const res = checkRootCleanlinessPath(String(args.Path ?? ""));
    if (res.decision === "deny") return res;
  }
  return { decision: "allow" };
}

process.on("uncaughtException", () => {
  process.stdout.write('{"decision":"allow"}\n');
  process.exit(0);
});
process.on("unhandledRejection", () => {
  process.stdout.write('{"decision":"allow"}\n');
  process.exit(0);
});

async function readStdinSafe(timeoutMs = 800): Promise<string> {
  return new Promise(resolveStdin => {
    const chunks: Buffer[] = [];
    let settled = false;
    const finish = (text: string) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      try {
        process.stdin.removeAllListeners();
        process.stdin.pause();
      } catch {}
      resolveStdin(text);
    };
    const timer = setTimeout(() => finish(Buffer.concat(chunks).toString("utf8")), timeoutMs);
    process.stdin.on("data", chunk => chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)));
    process.stdin.on("end", () => finish(Buffer.concat(chunks).toString("utf8")));
    process.stdin.on("error", () => finish(""));
    if (process.stdin.readableEnded) finish(Buffer.concat(chunks).toString("utf8"));
  });
}

async function main(): Promise<void> {
  try {
    const raw = await readStdinSafe();
    const parsed = raw.trim() ? (JSON.parse(raw) as PreToolUseInput) : {};
    process.stdout.write(JSON.stringify(evaluateToolCall(parsed)) + "\n", () => process.exit(0));
  } catch {
    process.stdout.write(JSON.stringify({ decision: "allow" }) + "\n", () => process.exit(0));
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  void main();
}
