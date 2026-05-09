import { describe, expect, it } from 'vitest';
import {
  buildCrashReport,
  githubIssueUrl,
  reportToText,
  CRASH_GH_REPO,
  CRASH_GH_TEMPLATE
} from '../../src/lib/crash/report.js';

describe('Crash report', () => {
  it('captures Error message and stack', () => {
    const e = new Error('boom');
    const r = buildCrashReport(e, { foo: 1 });
    expect(r.message).toBe('boom');
    expect(r.stack).toBeTruthy();
    expect(r.appState).toEqual({ foo: 1 });
    expect(r.capturedAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });

  it('falls back to "Unknown error" for non-Error thrown values', () => {
    const r = buildCrashReport(undefined);
    expect(r.message).toBe('Unknown error');
  });

  it('serializes to readable JSON', () => {
    const r = buildCrashReport(new Error('boom'));
    const text = reportToText(r);
    expect(text).toContain('"message": "boom"');
  });

  it('GitHub issue URL targets the configured repo and template', () => {
    const r = buildCrashReport(new Error('boom'));
    const url = githubIssueUrl(r);
    expect(url.startsWith(`https://github.com/${CRASH_GH_REPO}/issues/new?`)).toBe(true);
    expect(url).toContain(`template=${CRASH_GH_TEMPLATE}`);
    expect(url).toContain('labels=crash');
  });

  it('truncates long bodies and signals truncation in the URL body', () => {
    const long = 'x'.repeat(5000);
    const r = buildCrashReport(new Error(long));
    const url = githubIssueUrl(r);
    expect(url).toContain(encodeURIComponent('truncated'));
  });
});
