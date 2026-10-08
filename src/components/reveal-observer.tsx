'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

declare global {
  interface Window {
    __revealReady?: boolean
  }
}

/**
 * One observer for the whole page. Sections mark elements with
 * `data-reveal` (and optionally `--reveal-delay`); this flips them to
 * `data-revealed="true"` the first time they enter the viewport.
 */
export function RevealObserver() {
  // Switching locale swaps the page content under the same layout, so the
  // new elements have to be observed again.
  const pathname = usePathname()

  useEffect(() => {
    // A locale switch dims the page (see LocaleSwitch); the new content is here.
    document.documentElement.removeAttribute('data-switching')
  }, [pathname])

  useEffect(() => {
    window.__revealReady = true
    const root = document.documentElement
    if (!root.classList.contains('js-reveal')) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          entry.target.setAttribute('data-revealed', 'true')
          observer.unobserve(entry.target)
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
    )

    document.querySelectorAll('[data-reveal]:not([data-revealed])').forEach((element) => {
      observer.observe(element)
    })

    return () => observer.disconnect()
  }, [pathname])

  return null
}
