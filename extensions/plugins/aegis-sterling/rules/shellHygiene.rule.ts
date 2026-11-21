/**
 * rules/shellHygiene.rule.ts — Pure Deterministic Guard Rules Shared by Antigravity Hooks
 */

export interface ToolGuardDecision {
  decision: 'allow' | 'deny';
  reason?: string;
}

export function checkDevServerBan(cmd: string): ToolGuardDecision {
  if (
    /(?:^|[;&|]\s*)(?:npm(?:\s+--prefix\s+\S+)?\s+run\s+dev(?:\S*)?|npx\s+vite(?:\s|$)|vite(?:\s|$)(?!\s*(?:build|preview|--version))|next\s+dev|nodemon\b|expo\s+start)/i.test(
      cmd
    )
  ) {
    return {
      decision: 'deny',
      reason:
        'TURING-DEV-SERVER-BAN-013: Dev servers must be run by the developer in an external terminal, not by agents.',
    };
  }
  return { decision: 'allow' };
}

export function checkPowerShellHeadBan(cmd: string): ToolGuardDecision {
  if (/(?:\|\s*head\b|(?:^|[;&|]\s*)head\s+-\w*)/i.test(cmd)) {
    return {
      decision: 'deny',
      reason:
        'TURING-SHELL-015: `head` does not exist in PowerShell; use `Select-Object -First N`.',
    };
  }
  return { decision: 'allow' };
}

export function checkDestructiveCommand(cmd: string): ToolGuardDecision {
  if (
    /rm\s+-rf\s+[^\n]*node_modules|rmdir\s+\/s\s+\/q\s+[^\n]*node_modules|Remove-Item[^\n]*node_modules|git\s+reset\s+--hard|git\s+push\s+(?:--force|-f)(?:\s|$)/i.test(
      cmd
    )
  ) {
    return {
      decision: 'deny',
      reason:
        'TURING-LAW-000 §6: Destructive workspace wipe or force-push requires explicit user confirmation.',
    };
  }
  return { decision: 'allow' };
}

export function checkRootCleanlinessPath(rawPath: string): ToolGuardDecision {
  const normalized = rawPath.replace(/\\/g, '/');
  if (
    /\/(White-Caves-Frontend|White-Caves-Server|White-Caves-Web|White-Caves-Mobile)\/(docs|plans|strategies|business_docs)\//i.test(
      normalized
    )
  ) {
    return {
      decision: 'deny',
      reason:
        'TURING-ROOT-007: Do not create loose docs/plans/strategies folders in app repo roots; write to Aegis-Sterling/.agents/ instead.',
    };
  }
  return { decision: 'allow' };
}
