import Image from 'next/image'

import { UnlockOnView } from '@/components/achievements/unlock-on-view'
import { Emphasized, SectionHeading } from '@/components/section-heading'
import { getContent } from '@/i18n'
import type { Locale } from '@/i18n/config'
import styles from './about.module.css'

export function About({ locale }: { locale: Locale }) {
  const { about } = getContent(locale)

  return (
    <section
      id="sobre"
      className={`container section-rule ${styles.section}`}
      aria-labelledby="sobre-title"
    >
      <SectionHeading
        index="05"
        label={about.eyebrow}
        id="sobre-title"
        title={<Emphasized parts={about.title} />}
      />

      <div className={styles.sides}>
        {about.sides.map((side, index) => {
          const now = side.now.filter((entry) => entry.value.trim() !== '')
          return (
            <article
              key={side.id}
              className={styles.side}
              data-side={side.id}
              data-reveal
              style={{ '--reveal-delay': `${index * 120}ms` } as React.CSSProperties}
              aria-labelledby={`sobre-${side.id}`}
            >
              {side.id === 'main' && (
                <Image
                  src="/gustavo-santana.webp"
                  alt={about.photoAlt}
                  width={88}
                  height={88}
                  className={styles.photo}
                />
              )}
              <p className={styles.label}>
                <span className={styles.labelIcon} aria-hidden="true">
                  {side.id === 'main' ? '◆' : '◇'}
                </span>
                {side.label}
              </p>
              <h3 id={`sobre-${side.id}`} className={styles.title}>
                {side.title}
              </h3>
              {side.paragraphs.map((paragraph) => (
                <p key={paragraph} className={styles.paragraph}>
                  {paragraph}
                </p>
              ))}
              {now.length > 0 && (
                <dl className={styles.now}>
                  {now.map((entry) => (
                    <div key={entry.label}>
                      <dt>{entry.label}</dt>
                      <dd>{entry.value}</dd>
                    </div>
                  ))}
                </dl>
              )}
              {side.id === 'side' && <UnlockOnView id="side-quest" />}
            </article>
          )
        })}
      </div>
    </section>
  )
}
