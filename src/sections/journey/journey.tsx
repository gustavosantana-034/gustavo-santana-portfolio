import { Emphasized, SectionHeading } from '@/components/section-heading'
import { github } from '@/data/github'
import { profile } from '@/data/profile'
import { getContent } from '@/i18n'
import type { Locale } from '@/i18n/config'
import { formatMonthYear, formatShortDate } from '@/lib/format'
import styles from './journey.module.css'
import { ProgressMap } from './progress-map'

export function Journey({ locale }: { locale: Locale }) {
  const { journey, dateLocale } = getContent(locale)
  const { activity } = journey

  return (
    <section
      id="trajetoria"
      className={`container section-rule ${styles.section}`}
      aria-labelledby="trajetoria-title"
    >
      <SectionHeading
        index="01"
        label={journey.eyebrow}
        id="trajetoria-title"
        title={<Emphasized parts={journey.title} />}
        intro={journey.intro}
      />

      <ProgressMap
        checkpoints={journey.checkpoints}
        labels={{
          start: journey.start,
          checkpoint: journey.checkpointLabel,
          current: journey.currentLabel,
          unlocked: journey.unlockedLabel,
          inProgress: journey.inProgressLabel,
        }}
      />

      <p className={styles.learning} data-reveal>
        {journey.learning[0]}
        {journey.learning[1]}{' '}
        <a href={profile.links.certificates} target="_blank" rel="noreferrer">
          {journey.certificates} <span aria-hidden="true">↗</span>
        </a>
      </p>

      <div className={styles.activity} data-reveal>
        <h3 className={styles.activityTitle}>{activity.title}</h3>

        <div className={styles.activityGrid}>
          <div>
            <p className={styles.activityLabel}>
              <span className={styles.prompt} aria-hidden="true">
                $
              </span>{' '}
              {activity.gitLog}
            </p>
            <ol role="list" className={styles.commits}>
              {github.recentCommits.map((commit) => (
                <li key={commit.sha}>
                  <a href={commit.url} target="_blank" rel="noreferrer" className={styles.commit}>
                    <span className={styles.sha}>{commit.sha}</span>
                    <span className={styles.message}>{commit.message}</span>
                    <span className={styles.commitMeta}>
                      {commit.repo} ·{' '}
                      <time dateTime={commit.date}>{formatShortDate(commit.date, dateLocale)}</time>
                    </span>
                  </a>
                </li>
              ))}
            </ol>
          </div>

          <div>
            <p className={styles.activityLabel}>{activity.languages}</p>
            <dl className={styles.years}>
              {github.languagesByYear.map(({ year, languages }) => {
                const total = languages.reduce((sum, language) => sum + language.repos, 0)
                return (
                  <div key={year} className={styles.yearRow}>
                    <dt>{year}</dt>
                    <dd>
                      <span className={styles.bar} aria-hidden="true">
                        {languages.map((language) => (
                          <span
                            key={language.name}
                            className={styles.segment}
                            data-language={language.name}
                            style={{ flexGrow: language.repos }}
                          />
                        ))}
                      </span>
                      <span className={styles.legend}>
                        {languages
                          .map((language) => `${language.name} ${language.repos}`)
                          .join(' · ')}
                        <span className="visually-hidden">
                          {' '}
                          / {total} {activity.reposOf}
                        </span>
                      </span>
                    </dd>
                  </div>
                )
              })}
            </dl>
            <p className={styles.synced}>
              {github.profile.publicRepos} {activity.summary[0]} · {activity.summary[1]}{' '}
              {formatMonthYear(github.profile.memberSince, dateLocale)} · {activity.summary[2]}{' '}
              <time dateTime={github.syncedAt}>{formatShortDate(github.syncedAt, dateLocale)}</time>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
