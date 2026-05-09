/**
 * Crash report shape and helpers. Crash data lives entirely in memory and
 * the user's clipboard; nothing is uploaded.
 */

export interface CrashReport {
  capturedAt: string;
  buildVersion: string;
  appBuild: 'web' | 'desktop' | 'unknown';
  userAgent: string;
  platform: string;
  message: string;
  stack: string | null;
  /**
   * App-state snapshot at crash time. Must NEVER include user-entered text,
   * client identifiers, target-memory notes, or any other PII. Today only
   * the active preset id and session status are captured.
   */
  appState: Record<string, string | number | boolean | null>;
}

export const CRASH_GH_REPO = 'gndl00p/openbls';
export const CRASH_GH_TEMPLATE = 'crash-report.md';

const APP_VERSION = '0.1.0';

function detectAppBuild(): CrashReport['appBuild'] {
  if (typeof globalThis === 'undefined') return 'unknown';
  const w = globalThis as unknown as { __TAURI_INTERNALS__?: unknown };
  if (w.__TAURI_INTERNALS__) return 'desktop';
  if (typeof window !== 'undefined') return 'web';
  return 'unknown';
}

export function buildCrashReport(
  err: unknown,
  appState: CrashReport['appState'] = {}
): CrashReport {
  const e =
    err instanceof Error
      ? err
      : new Error(typeof err === 'string' ? err : 'Unknown error');
  return {
    capturedAt: new Date().toISOString(),
    buildVersion: APP_VERSION,
    appBuild: detectAppBuild(),
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'n/a',
    platform:
      typeof navigator !== 'undefined' ? navigator.platform || 'n/a' : 'n/a',
    message: e.message,
    stack: e.stack ?? null,
    appState
  };
}

export function reportToText(report: CrashReport): string {
  return JSON.stringify(report, null, 2);
}

export function githubIssueUrl(report: CrashReport): string {
  const params = new URLSearchParams();
  params.set('template', CRASH_GH_TEMPLATE);
  params.set('title', `[crash] ${report.message.slice(0, 80)}`);
  params.set('labels', 'crash,needs-triage');
  // GitHub limits prefilled body length to ~2KB before truncation. Truncate
  // gracefully and tell the user.
  const text = reportToText(report);
  const max = 2000;
  const body =
    text.length <= max
      ? '```json\n' + text + '\n```'
      : '```json\n' +
        text.slice(0, max) +
        '\n... (truncated; please paste full report from clipboard)\n```';
  params.set('body', body);
  return `https://github.com/${CRASH_GH_REPO}/issues/new?${params.toString()}`;
}
