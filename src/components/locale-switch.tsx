'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type { MouseEvent } from 'react'

import { LOCALE_STORAGE_KEY, localePath, locales, type Locale } from '@/i18n/config'
import { useI18n } from '@/i18n/i18n-provider'
import styles from './locale-switch.module.css'

const shortLabel: Record<Locale, string> = { 'pt-BR': 'PT', en: 'EN' }

/**
 * Two plain links, so switching works without JavaScript too. With JS, the
 * choice is saved and the other locale replaces the current page client-side,
 * keeping the scroll position.
 */
export function LocaleSwitch() {
  const { locale, t } = useI18n()
  const router = useRouter()

  function select(event: MouseEvent<HTMLAnchorElement>, target: Locale) {
    try {
      window.localStorage.setItem(LOCALE_STORAGE_KEY, target)
    } catch {
      // Without storage the choice lasts until the next visit to `/`.
    }
    if (target === locale) {
      event.preventDefault()
      return
    }
    event.preventDefault()
    // Dims the page while the other locale loads; RevealObserver clears it
    // once the new content is in, with a timeout as a safety net.
    document.documentElement.setAttribute('data-switching', '')
    window.setTimeout(() => document.documentElement.removeAttribute('data-switching'), 1500)
    router.replace(localePath(target), { scroll: false })
  }

  return (
    <div className={styles.switch} role="group" aria-label={t.nav.languageLabel}>
      {locales.map((item) => (
        <Link
          key={item}
          href={localePath(item)}
          hrefLang={item}
          lang={item}
          className={styles.option}
          aria-current={item === locale ? 'true' : undefined}
          aria-label={t.nav.languageNames[item]}
          onClick={(event) => select(event, item)}
          scroll={false}
          replace
        >
          {shortLabel[item]}
        </Link>
      ))}
    </div>
  )
}
