import { ResumeLink } from '@/components/resume-link'
import { profile } from '@/data/profile'
import { getContent } from '@/i18n'
import type { Locale } from '@/i18n/config'
import type { Resume } from '@/lib/resume'
import styles from './glance.module.css'

/**
 * The recruiter's shortcut: specialty, experience, stack, projects and the
 * résumé, readable in the first half minute without scrolling through the
 * rest of the story.
 */
export function Glance({ locale, resume }: { locale: Locale; resume: Resume | null }) {
  const { glance, journey } = getContent(locale)

  return (
    <section className={`container ${styles.section}`} aria-labelledby="resumo-title">
      <div className={styles.panel} data-reveal>
        <header className={styles.header}>
          <p className={styles.label}>{glance.label}</p>
          <h2 id="resumo-title" className={styles.title}>
            {glance.title}
          </h2>
        </header>

        <dl className={styles.items}>
          {glance.items.map((item) => (
            <div key={item.label} className={styles.item}>
              <dt>{item.label}</dt>
              <dd>
                {item.href ? (
                  <a href={item.href} className={styles.value}>
                    {item.value}
                  </a>
                ) : (
                  <span className={styles.value}>{item.value}</span>
                )}
                <span className={styles.detail}>{item.detail}</span>
              </dd>
            </div>
          ))}
        </dl>

        <div className={styles.actions}>
          {resume && <ResumeLink resume={resume} variant="button" />}
          <a href={profile.links.linkedin} target="_blank" rel="noreferrer" className={styles.link}>
            LinkedIn <span aria-hidden="true">↗</span>
          </a>
          <a href={profile.links.github} target="_blank" rel="noreferrer" className={styles.link}>
            GitHub <span aria-hidden="true">↗</span>
          </a>
          <a
            href={profile.links.certificates}
            target="_blank"
            rel="noreferrer"
            className={styles.link}
          >
            {journey.certificates} <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
    </section>
  )
}
