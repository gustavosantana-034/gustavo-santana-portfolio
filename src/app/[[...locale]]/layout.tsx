import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'

import { AchievementsProvider } from '@/components/achievements/achievements-provider'
import { ConsoleGreeting } from '@/components/console-greeting'
import { RevealObserver } from '@/components/reveal-observer'
import { profile } from '@/data/profile'
import {
  hrefLang,
  localeFromSegments,
  localeParams,
  localePath,
  locales,
  openGraphLocale,
} from '@/i18n/config'
import { getClientContent, getContent } from '@/i18n'
import { I18nProvider } from '@/i18n/i18n-provider'
import { bootScript } from '@/lib/boot-script'
import { fontVariables } from '@/lib/fonts'
import { siteUrl } from '@/lib/site'
import '@/styles/globals.css'

interface LayoutProps {
  children: ReactNode
  params: Promise<{ locale?: string[] }>
}

export const dynamicParams = false

export function generateStaticParams() {
  return localeParams()
}

export async function generateMetadata({ params }: LayoutProps): Promise<Metadata> {
  const locale = localeFromSegments((await params).locale)
  const { meta } = getContent(locale)
  const path = localePath(locale)
  const ogImage = `/og/${locale === 'en' ? 'en' : 'pt-br'}.png`

  return {
    metadataBase: new URL(siteUrl),
    title: { default: meta.title, template: `%s · ${profile.name}` },
    description: meta.description,
    authors: [{ name: profile.name, url: siteUrl }],
    creator: profile.name,
    keywords: meta.keywords,
    alternates: {
      canonical: path,
      languages: {
        ...Object.fromEntries(locales.map((item) => [hrefLang[item], localePath(item)])),
        'x-default': '/',
      },
    },
    openGraph: {
      type: 'profile',
      locale: openGraphLocale[locale],
      alternateLocale: locales
        .filter((item) => item !== locale)
        .map((item) => openGraphLocale[item]),
      url: path,
      siteName: profile.name,
      title: meta.title,
      description: meta.description,
      firstName: 'Gustavo',
      lastName: 'Santana',
      images: [{ url: ogImage, width: 1200, height: 630, alt: meta.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: meta.title,
      description: meta.description,
      images: [ogImage],
    },
    robots: { index: true, follow: true },
  }
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f3f0e8' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
  colorScheme: 'light dark',
}

export default async function RootLayout({ children, params }: LayoutProps) {
  const locale = localeFromSegments((await params).locale)
  const { meta } = getContent(locale)

  const personJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: profile.name,
    alternateName: profile.fullName,
    url: siteUrl,
    email: `mailto:${profile.email}`,
    jobTitle: meta.jobTitle,
    knowsAbout: ['Node.js', 'TypeScript', 'REST APIs', 'PostgreSQL', 'Software architecture'],
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'São José dos Campos',
      addressRegion: 'SP',
      addressCountry: 'BR',
    },
    sameAs: [profile.links.github, profile.links.linkedin],
  }

  return (
    // data-theme and the reveal class are set by the boot script before paint.
    <html lang={locale} suppressHydrationWarning className={fontVariables}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      </head>
      <body>
        <I18nProvider locale={locale} content={getClientContent(locale)}>
          <AchievementsProvider>
            {children}
            <RevealObserver />
            <ConsoleGreeting />
          </AchievementsProvider>
        </I18nProvider>
      </body>
    </html>
  )
}
