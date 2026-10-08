'use client'

import { useEffect } from 'react'

import { profile } from '@/data/profile'
import { useI18n } from '@/i18n/i18n-provider'

/** For whoever opens DevTools. */
export function ConsoleGreeting() {
  const { t } = useI18n()
  const [headline, body] = t.console

  useEffect(() => {
    console.log(`%c${headline}`, 'font: 600 14px ui-monospace, monospace; color: #ff7a4d')
    console.log(`${body}\nGitHub: ${profile.links.github}\n${profile.email}`)
  }, [headline, body])

  return null
}
