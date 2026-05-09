import { writable, type Writable } from 'svelte/store';
import type { CrashReport } from './report.js';
import { buildCrashReport } from './report.js';

export const lastCrash: Writable<CrashReport | null> = writable(null);

let installed = false;

/**
 * Install global error listeners. Call once from the root layout. Subsequent
 * calls are a no-op so HMR or repeated mounts don't double-bind.
 */
export function installCrashHandler(getAppState: () => CrashReport['appState'] = () => ({})): void {
  if (installed) return;
  installed = true;
  if (typeof window === 'undefined') return;
  window.addEventListener('error', (e: ErrorEvent) => {
    const report = buildCrashReport(e.error ?? e.message, getAppState());
    lastCrash.set(report);
  });
  window.addEventListener('unhandledrejection', (e: PromiseRejectionEvent) => {
    const report = buildCrashReport(e.reason, getAppState());
    lastCrash.set(report);
  });
}

export function dismissCrash(): void {
  lastCrash.set(null);
}

/** Test harness — manually trigger a crash for verifying the modal flow. */
export function triggerTestCrash(): void {
  const report = buildCrashReport(new Error('Test crash from dev menu.'), {
    triggeredBy: 'dev-menu'
  });
  lastCrash.set(report);
}
