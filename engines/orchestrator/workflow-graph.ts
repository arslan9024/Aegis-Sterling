#!/usr/bin/env node
/**
 * workflow-graph.ts — Sequential/Parallel/Handoff Workflow Graph Tracker (TypeScript ESM)
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import { isFeatureEnabled, loadPolicy } from './policy-loader.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const STATE_DIR = join(__dirname, 'logs', 'workflow-state');
const STATE_FILE = join(STATE_DIR, 'current-state.json');

interface WorkflowState {
  currentStep: string | null;
  stepHistory: Array<{ step: string; completedAt: string; outcome: string }>;
  lastUpdatedAt: string | null;
}

function readState(): WorkflowState {
  mkdirSync(STATE_DIR, { recursive: true });
  if (!existsSync(STATE_FILE)) return { currentStep: null, stepHistory: [], lastUpdatedAt: null };
  return JSON.parse(readFileSync(STATE_FILE, 'utf8')) as WorkflowState;
}

function writeState(state: WorkflowState): void {
  state.lastUpdatedAt = new Date().toISOString();
  writeFileSync(STATE_FILE, JSON.stringify(state, null, 2), 'utf8');
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  const policy = loadPolicy();
  const steps = policy.workflowGraph?.steps ?? ['plan', 'code', 'verify', 'merge-ready'];
  if (!policy.workflowGraph?.enabled || !isFeatureEnabled(policy, 'graph')) {
    console.warn('Workflow graph disabled.');
  } else {
    const state = readState();
    if (args.includes('--start')) {
      state.currentStep = args[args.indexOf('--start') + 1] ?? steps[0];
      writeState(state);
      console.log(`Started workflow step: ${state.currentStep}`);
    } else if (args.includes('--advance')) {
      const idx = state.currentStep ? steps.indexOf(state.currentStep) : -1;
      if (idx >= 0 && idx < steps.length - 1) {
        state.stepHistory.push({ step: state.currentStep!, completedAt: new Date().toISOString(), outcome: 'advanced' });
        state.currentStep = steps[idx + 1];
        writeState(state);
        console.log(`Advanced to: ${state.currentStep}`);
      } else {
        console.log('Workflow already complete or not started.');
      }
    } else {
      console.log(`=== Aegis Workflow Graph ===\nSteps: ${steps.join(' -> ')}\nCurrent: ${state.currentStep ?? '(not started)'}`);
    }
  }
}
