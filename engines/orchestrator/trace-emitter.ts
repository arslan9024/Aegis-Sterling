#!/usr/bin/env node
/**
 * trace-emitter.ts — Structured JSONL Trace Emitter (TypeScript ESM)
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync, appendFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import { randomUUID } from 'node:crypto';
import { createTraceContext, isFeatureEnabled, loadPolicy, type AegisPolicy } from './policy-loader.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const TRACE_ROOT = join(__dirname, 'logs', 'traces');

function getTraceDir(policy: AegisPolicy): string {
  const configured = policy.observability?.tracing?.traceDir;
  const dir = configured && configured.startsWith('engines/') ? resolve(__dirname, '..', '..', configured) : TRACE_ROOT;
  mkdirSync(dir, { recursive: true });
  return dir;
}

function getCurrentTraceFile(traceDir: string): string {
  return join(traceDir, `trace-${new Date().toISOString().slice(0, 10)}.jsonl`);
}

function readOpenSpans(spansFile: string): Record<string, { name: string; startTime: string; attributes: Record<string, unknown> }> {
  if (!existsSync(spansFile)) return {};
  try {
    return JSON.parse(readFileSync(spansFile, 'utf8'));
  } catch {
    return {};
  }
}

export function emitInstantSpan(name: string, attrsArg: string | null, policy: AegisPolicy): string {
  const traceDir = getTraceDir(policy);
  const traceFile = getCurrentTraceFile(traceDir);
  const now = new Date().toISOString();
  const spanId = randomUUID().slice(0, 8);
  const trace = createTraceContext(policy, { component: 'trace-emitter' });
  let attrs: Record<string, unknown> = {};
  if (attrsArg) {
    try { attrs = JSON.parse(attrsArg); } catch { attrs = { note: attrsArg }; }
  }
  const record = { type: 'span', traceId: trace.traceId, policyVersion: trace.policyVersion, spanId, name, startTime: now, endTime: now, durationMs: 0, status: 'ok', attributes: attrs };
  appendFileSync(traceFile, JSON.stringify(record) + '\n', 'utf8');
  console.log(`Span emitted: ${name} [${spanId}] -> ${traceFile}`);
  return spanId;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  const policy = loadPolicy();
  if (!policy.observability?.tracing?.enabled || !isFeatureEnabled(policy, 'tracing')) {
    console.warn('Tracing disabled.');
  } else if (args.includes('--span')) {
    emitInstantSpan(args[args.indexOf('--span') + 1] ?? 'unnamed', args.includes('--attrs') ? args[args.indexOf('--attrs') + 1] : null, policy);
  } else if (args.includes('--event')) {
    const dir = getTraceDir(policy);
    const trace = createTraceContext(policy, { component: 'trace-emitter' });
    appendFileSync(getCurrentTraceFile(dir), JSON.stringify({ type: 'event', traceId: trace.traceId, eventType: args[args.indexOf('--event') + 1] ?? 'event', timestamp: new Date().toISOString() }) + '\n', 'utf8');
    console.log('Event emitted.');
  } else if (args.includes('--tail')) {
    const file = getCurrentTraceFile(getTraceDir(policy));
    if (!existsSync(file)) console.log('No trace file for today.');
    else console.log(readFileSync(file, 'utf8').split('\n').filter(Boolean).slice(-20).join('\n'));
  } else {
    const dir = getTraceDir(policy);
    const files = existsSync(dir) ? readdirSync(dir).filter(f => f.endsWith('.jsonl')) : [];
    console.log(`=== Aegis Trace Emitter Status ===\nTrace dir: ${dir}\nFiles: ${files.length}`);
  }
  void writeFileSync;
  void readOpenSpans;
}
