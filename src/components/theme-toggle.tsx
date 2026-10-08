'use client'

import { useEffect, useSyncExternalStore } from 'react'

import { useI18n } from '@/i18n/i18n-provider'
import { THEME_STORAGE_KEY } from '@/lib/boot-script'
import styles from './theme-toggle.module.css'

type Theme = 'light' | 'dark'

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme
}

// The theme lives on <html data-theme>, set before paint by the boot script.
// React only observes it.
function subscribeToTheme(onChange: () => void) {
  const observer = new MutationObserver(onChange)
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
  return () => observer.disconnect()
}

function getTheme(): Theme {
  return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light'
}

function getServerTheme(): Theme | null {
  return null
}

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribeToTheme, getTheme, getServerTheme)
  const { t } = useI18n()

  useEffect(() => {
    // Follow the system while the visitor hasn't picked a theme themselves.
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    function handleSystemChange(event: MediaQueryListEvent) {
      try {
        if (window.localStorage.getItem(THEME_STORAGE_KEY)) return
      } catch {
        // Without storage there is no saved choice; keep following the system.
      }
      applyTheme(event.matches ? 'dark' : 'light')
    }

    media.addEventListener('change', handleSystemChange)
    return () => media.removeEventListener('change', handleSystemChange)
  }, [])

  function toggle(event: React.MouseEvent<HTMLButtonElement>) {
    const next: Theme = theme === 'dark' ? 'light' : 'dark'

    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, next)
    } catch {
      // The choice simply won't survive a reload.
    }

    const commit = () => applyTheme(next)

    if (prefersReducedMotion()) {
      commit()
      return
    }

    if (!document.startViewTransition) {
      const root = document.documentElement
      root.classList.add('theme-transition')
      commit()
      window.setTimeout(() => root.classList.remove('theme-transition'), 400)
      return
    }

    // Circular reveal that starts at the toggle itself.
    const { left, top, width, height } = event.currentTarget.getBoundingClientRect()
    const x = left + width / 2
    const y = top + height / 2
    const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y))

    const transition = document.startViewTransition(commit)
    transition.ready
      .then(() => {
        document.documentElement.animate(
          {
            clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`],
          },
          {
            duration: 560,
            easing: 'cubic-bezier(0.65, 0, 0.35, 1)',
            pseudoElement: '::view-transition-new(root)',
          },
        )
      })
      .catch(() => {
        // Transition was skipped; the theme is already applied.
      })
  }

  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      className={styles.toggle}
      onClick={toggle}
      aria-label={isDark ? t.nav.themeToLight : t.nav.themeToDark}
      title={isDark ? t.nav.themeToLight : t.nav.themeToDark}
      data-theme-state={theme ?? 'unknown'}
    >
      <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
        <mask id="theme-toggle-mask">
          <rect width="24" height="24" fill="white" />
          <circle className={styles.maskMoon} cx="26" cy="2" r="7" fill="black" />
        </mask>
        <circle className={styles.core} cx="12" cy="12" r="5.5" mask="url(#theme-toggle-mask)" />
        <g className={styles.rays}>
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
            <line
              key={angle}
              x1="12"
              y1="1.8"
              x2="12"
              y2="3.6"
              transform={`rotate(${angle} 12 12)`}
            />
          ))}
        </g>
      </svg>
    </button>
  )
}
