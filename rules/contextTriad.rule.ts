/**
 * rules/contextTriad.rule.ts — AEG-003/041 Context Triad Enforcement
 */
export const ALLOWED_CONTEXT_TRIAD = ["ThemeContext", "LanguageContext", "CurrencyContext"] as const;

export function validateContextTriadStrict(contexts: readonly string[]): { valid: boolean; unauthorized: string[] } {
  const allowed = new Set<string>(ALLOWED_CONTEXT_TRIAD);
  const unauthorized = contexts.filter(c => !allowed.has(c));
  return { valid: unauthorized.length === 0, unauthorized };
}
