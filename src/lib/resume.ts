import { existsSync } from 'node:fs'
import { join } from 'node:path'

import { profile } from '@/data/profile'
import type { Locale } from '@/i18n/config'

export interface Resume {
  href: string
  /** False while the PDF for this locale has not been added to public/. */
  available: boolean
}

/**
 * Checked at build time. A missing PDF hides the résumé links in production
 * builds instead of shipping a link that 404s; in development they stay
 * visible, marked as missing, so the layout can still be reviewed.
 */
export function getResume(locale: Locale): Resume | null {
  const href = profile.resume[locale]
  const available = existsSync(join(process.cwd(), 'public', href))

  if (!available) {
    console.warn(`[resume] ${href} not found in public/; résumé links are hidden in production.`)
    if (process.env.NODE_ENV === 'production') return null
  }

  return { href, available }
}
