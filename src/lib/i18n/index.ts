import { addMessages, init, getLocaleFromNavigator } from 'svelte-i18n';
import enMessages from './locales/en.json' with { type: 'json' };

let initialized = false;

export const SUPPORTED_LOCALES = ['en'] as const;
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

/**
 * Initialize i18n. Safe to call multiple times — subsequent calls are no-ops.
 * Locale dictionaries live in `src/lib/i18n/locales/`. Adding a locale is a
 * three-step PR: drop a JSON file, register it here, document review.
 */
export function setupI18n(): void {
  if (initialized) return;
  initialized = true;
  addMessages('en', enMessages);
  void init({
    fallbackLocale: 'en',
    initialLocale: pickInitialLocale()
  });
}

function pickInitialLocale(): string {
  const fromBrowser = typeof window !== 'undefined' ? getLocaleFromNavigator() : null;
  if (!fromBrowser) return 'en';
  const tag = fromBrowser.toLowerCase().split('-')[0];
  return (SUPPORTED_LOCALES as readonly string[]).includes(tag) ? tag : 'en';
}
