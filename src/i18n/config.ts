/**
 * Locales and how they map to URLs.
 *
 * Portuguese is served at `/` and English at `/en/`. Both are statically
 * generated from the optional catch-all `app/[[...locale]]`, so switching
 * between them is a client-side navigation, not a page reload.
 */

export const locales = ['pt-BR', 'en'] as const
export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = 'pt-BR'

/** Persisted by the language switch; read by the boot script on `/`. */
export const LOCALE_STORAGE_KEY = 'gs-locale'

const segments: Record<Locale, string[]> = {
  'pt-BR': [],
  en: ['en'],
}

export function localeFromSegments(segment: string[] | undefined): Locale {
  return segment?.[0] === 'en' ? 'en' : defaultLocale
}

export function localeParams() {
  return locales.map((locale) => ({ locale: segments[locale] }))
}

/** Path of the home page for a locale, with a trailing slash. */
export function localePath(locale: Locale): string {
  const segment = segments[locale]
  return segment.length > 0 ? `/${segment.join('/')}/` : '/'
}

export const openGraphLocale: Record<Locale, string> = {
  'pt-BR': 'pt_BR',
  en: 'en_US',
}

/** `hreflang` values used in alternates and the sitemap. */
export const hrefLang: Record<Locale, string> = {
  'pt-BR': 'pt-BR',
  en: 'en',
}
