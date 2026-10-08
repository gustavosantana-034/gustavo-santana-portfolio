import { Emphasized, SectionHeading } from '@/components/section-heading'
import { TechIcon } from '@/components/tech-icon'
import { certificates, certificatesRepo } from '@/data/certificates'
import { getContent } from '@/i18n'
import type { Locale } from '@/i18n/config'
import styles from './certificates.module.css'

export function Certificates({ locale }: { locale: Locale }) {
  const { certificates: copy } = getContent(locale)
  const { featured } = copy

  return (
    <section
      id="certificados"
      className={`container section-rule ${styles.section}`}
      aria-labelledby="certificados-title"
    >
      <SectionHeading
        index="04"
        label={copy.eyebrow}
        id="certificados-title"
        title={<Emphasized parts={copy.title} />}
        intro={copy.intro}
      />

      <article className={styles.featured} aria-labelledby="certificado-destaque" data-reveal>
        <div className={styles.featuredHead}>
          <p className={styles.badge}>
            <span aria-hidden="true">★</span> {featured.label}
          </p>
          <h3 id="certificado-destaque" className={styles.featuredTitle}>
            {featured.title}
          </h3>
          <p className={styles.featuredMeta}>
            {copy.by} <strong>{featured.issuer}</strong> · {featured.period} ·{' '}
            <span className={styles.status}>{featured.status}</span>
          </p>
          <p className={styles.featuredBody}>{featured.body}</p>
        </div>

        <div className={styles.modules}>
          <p className={styles.modulesLabel}>
            {featured.modules.length} {featured.modulesLabel}
          </p>
          <ol className={styles.moduleList}>
            {featured.modules.map((module) => (
              <li key={module}>{module}</li>
            ))}
          </ol>
        </div>
      </article>

      <div className={styles.listHeader} data-reveal>
        <h3 className={styles.listTitle}>
          {copy.listTitle} <span className={styles.count}>{certificates.length}</span>
        </h3>
        <a href={certificatesRepo} target="_blank" rel="noreferrer" className={styles.repoLink}>
          {copy.allOnGithub} <span aria-hidden="true">↗</span>
        </a>
      </div>

      <ol role="list" className={styles.list}>
        {certificates.map((certificate) => (
          <li key={certificate.id} className={styles.row} data-reveal>
            <p className={styles.issuer}>{certificate.issuer}</p>
            <div className={styles.rowBody}>
              <h4 className={styles.rowTitle}>{certificate.title}</h4>
              {certificate.instructor && (
                <p className={styles.instructor}>
                  {copy.by} {certificate.instructor}
                </p>
              )}
              <ul role="list" className={styles.skills}>
                {certificate.skills.map((skill) => (
                  <li key={skill}>
                    <TechIcon name={skill} />
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
            <a href={certificate.url} target="_blank" rel="noreferrer" className={styles.view}>
              {copy.view} <span aria-hidden="true">↗</span>
              <span className="visually-hidden">
                {' '}
                · {certificate.title} ({copy.newTab})
              </span>
            </a>
          </li>
        ))}
      </ol>
    </section>
  )
}
