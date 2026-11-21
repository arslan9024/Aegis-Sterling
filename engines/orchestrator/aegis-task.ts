#!/usr/bin/env node
/**
 * aegis-task.ts — AEGIS Sovereign Task Preflight & Execution Trigger
 */

import { execSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ENGINE_PATH = join(__dirname, 'aegis-engine.ts');

const userTask = process.argv.slice(2).join(' ').trim();

console.log('='.repeat(70));
console.log('🛡️  AEGIS V5.1 SOVEREIGN TASK ACTIVATOR (TypeScript ESM)');
console.log('='.repeat(70));

if (userTask) {
  console.log(`\n📌 Task: "${userTask}"\n`);
} else {
  console.log('\n💡 Tip: Pass your task prompt: npm run aegis:task -- "Your task"\n');
}

console.log('▶ [1/2] Running Pre-flight Health Check...');
execSync(`node "${ENGINE_PATH}" health`, { stdio: 'inherit' });

console.log('\n▶ [2/2] Running Root Hygiene Sweep...');
execSync(`node "${ENGINE_PATH}" dedup`, { stdio: 'inherit' });

console.log('\n' + '='.repeat(70));
console.log('✅ PRE-FLIGHT VERIFIED — Ready for Sovereign Execution');
console.log('='.repeat(70));
console.log(`\nInvoke in chat:\n  /aegis-task ${userTask || '<your feature description>'}\n`);
