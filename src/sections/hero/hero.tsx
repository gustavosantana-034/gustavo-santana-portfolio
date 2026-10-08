import { profile } from '@/data/profile'
import { getContent } from '@/i18n'
import type { Locale } from '@/i18n/config'
import styles from './hero.module.css'
import { RequestInspector } from './request-inspector'

export function Hero({ locale }: { locale: Locale }) {
  const { hero } = getContent(locale)
  const [before, commit, after] = hero.titleLine2

  return (
    <section id="topo" className={`container ${styles.hero}`} aria-labelledby="hero-title">
      <div className={styles.copy}>
        <p className={styles.eyebrow}>
          <span className={styles.name}>{profile.name}</span>
          <span className={styles.role}>{hero.role}</span>
        </p>

        <h1 id="hero-title" className={styles.title}>
          {hero.titleLine1}
          <br />
          {before}
          <span className={styles.commit}>{commit}</span>
          {after}
        </h1>

        <p className={styles.lead}>{hero.lead}</p>

        <div className={styles.ctas}>
          <a href="#projetos" className={styles.primary}>
            {hero.ctaProjects} <span aria-hidden="true">↓</span>
          </a>
          <a href="#contato" className={styles.secondary}>
            {hero.ctaTalk}
          </a>
        </div>

        <ul role="list" className={styles.links}>
          <li>
            <a href={profile.links.github} target="_blank" rel="noreferrer">
              GitHub <span aria-hidden="true">↗</span>
            </a>
          </li>
          <li>
            <a href={profile.links.linkedin} target="_blank" rel="noreferrer">
              LinkedIn <span aria-hidden="true">↗</span>
            </a>
          </li>
          <li>
            <a href={`mailto:${profile.email}`}>{profile.email}</a>
          </li>
        </ul>
      </div>

      <div className={styles.demo}>
        <p className={styles.hint} aria-hidden="true">
          {hero.hint}
          <svg viewBox="0 0 40 28" width="40" height="28">
            <path d="M2 4 C 16 4, 28 10, 34 22" />
            <path d="M28 20 L 34 23 L 36 16" />
          </svg>
        </p>
        <RequestInspector />
      </div>
    </section>
  )
}
