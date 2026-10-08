import type { MetadataRoute } from 'next'

import { hrefLang, localePath, locales } from '@/i18n/config'
import { siteUrl } from '@/lib/site'

export const dynamic = 'force-static'

/** One entry per locale, each listing the other as an alternate. */
export default function sitemap(): MetadataRoute.Sitemap {
  const languages = Object.fromEntries(
    locales.map((locale) => [hrefLang[locale], `${siteUrl}${localePath(locale)}`]),
  )

  return locales.map((locale) => ({
    url: `${siteUrl}${localePath(locale)}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: locale === 'pt-BR' ? 1 : 0.9,
    alternates: { languages },
  }))
}
