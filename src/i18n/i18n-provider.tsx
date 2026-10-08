'use client'

import { createContext, useContext, type ReactNode } from 'react'

import type { Locale } from './config'
import type { SiteContent } from './types'

/**
 * The slices of content that client components need. Server components read
 * the full content directly, so the rest never ships twice in the payload.
 */
export type ClientContent = Pick<
  SiteContent,
  'nav' | 'resume' | 'inspector' | 'contact' | 'achievements' | 'console' | 'dateLocale'
>

interface I18nValue {
  locale: Locale
  t: ClientContent
}

const I18nContext = createContext<I18nValue | null>(null)

export function I18nProvider({
  locale,
  content,
  children,
}: {
  locale: Locale
  content: ClientContent
  children: ReactNode
}) {
  return <I18nContext.Provider value={{ locale, t: content }}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const value = useContext(I18nContext)
  if (!value) throw new Error('useI18n must be used inside <I18nProvider>')
  return value
}
