'use client'

import { useEffect, useRef, useState } from 'react'

import { profile } from '@/data/profile'
import { useI18n } from '@/i18n/i18n-provider'
import type { Resume } from '@/lib/resume'
import { sectionIds, type SectionId } from '@/lib/site'
import { LocaleSwitch } from './locale-switch'
import { ResumeLink } from './resume-link'
import styles from './site-header.module.css'
import { ThemeToggle } from './theme-toggle'

function useActiveSection() {
  const [active, setActive] = useState<SectionId | null>(null)

  useEffect(() => {
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => element !== null)

    // A section counts as active while it crosses a band near the top third
    // of the viewport.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id as SectionId)
        }
      },
      { rootMargin: '-35% 0px -60% 0px' },
    )

    elements.forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [])

  return active
}

export function SiteHeader({ resume }: { resume: Resume | null }) {
  const { t } = useI18n()
  const active = useActiveSection()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const headerRef = useRef<HTMLElement>(null)

  // Scroll state: a hairline under the header and the page progress bar,
  // written to a CSS variable so scrolling never re-renders React.
  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      const max = document.documentElement.scrollHeight - window.innerHeight
      const progress = max > 0 ? Math.min(1, window.scrollY / max) : 0
      headerRef.current?.style.setProperty('--page-progress', progress.toFixed(4))
      setScrolled(window.scrollY > 8)
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  useEffect(() => {
    if (!menuOpen) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [menuOpen])

  return (
    <header
      ref={headerRef}
      className={styles.header}
      data-scrolled={scrolled}
      data-menu-open={menuOpen}
    >
      <a className={styles.skip} href="#conteudo">
        {t.nav.skip}
      </a>
      <div className={`container ${styles.bar}`}>
        <a href="#topo" className={styles.brand}>
          <span className={styles.mark} aria-hidden="true">
            g<span>/</span>s
          </span>
          <span className={styles.name}>{profile.name}</span>
          <span className="visually-hidden">, {t.nav.homeLabel}</span>
        </a>

        <nav aria-label={t.nav.label} className={styles.nav} id="menu-principal">
          <ul role="list">
            {sectionIds.map((id) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  aria-current={active === id ? 'location' : undefined}
                  onClick={() => setMenuOpen(false)}
                >
                  {t.nav.sections[id]}
                </a>
              </li>
            ))}
          </ul>
          {resume && (
            <div className={styles.menuExtras}>
              <ResumeLink resume={resume} variant="button" />
            </div>
          )}
        </nav>

        <div className={styles.actions}>
          {profile.available && (
            <span className={styles.status}>
              <span className={styles.statusDot} aria-hidden="true" />
              {t.nav.availability}
            </span>
          )}
          {resume && (
            <span className={styles.resume}>
              <ResumeLink resume={resume} variant="compact" />
            </span>
          )}
          <LocaleSwitch />
          <ThemeToggle />
          <button
            type="button"
            className={styles.menuButton}
            aria-expanded={menuOpen}
            aria-controls="menu-principal"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span className="visually-hidden">{menuOpen ? t.nav.closeMenu : t.nav.openMenu}</span>
            <span className={styles.menuIcon} aria-hidden="true" />
          </button>
        </div>
      </div>
      <span className={styles.progress} aria-hidden="true" />
    </header>
  )
}
