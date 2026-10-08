import Image from 'next/image'

import { ArchitectureFlow } from '@/components/architecture-flow'
import { Emphasized, SectionHeading } from '@/components/section-heading'
import { TechIcon } from '@/components/tech-icon'
import { ExpandableDecisions } from './expandable-decisions'
import { getContent, getProjects, type Project } from '@/i18n'
import type { Locale } from '@/i18n/config'
import type { SiteContent } from '@/i18n/types'
import styles from './projects.module.css'

type Labels = SiteContent['projects']['labels']

export function Projects({ locale }: { locale: Locale }) {
  const { projects: copy } = getContent(locale)
  const projects = getProjects(locale)

  return (
    <section
      id="projetos"
      className={`container section-rule ${styles.section}`}
      aria-labelledby="projetos-title"
    >
      <SectionHeading
        index="02"
        label={copy.eyebrow}
        id="projetos-title"
        title={<Emphasized parts={copy.title} />}
        intro={copy.intro}
      />

      <ol role="list" className={styles.list}>
        {projects.map((project, index) => (
          <li key={project.slug}>
            <ProjectCase project={project} index={index} labels={copy.labels} />
          </li>
        ))}
      </ol>
    </section>
  )
}

function ProjectCase({
  project,
  index,
  labels,
}: {
  project: Project
  index: number
  labels: Labels
}) {
  const titleId = `projeto-${project.slug}`

  return (
    <article className={styles.case} aria-labelledby={titleId}>
      <header className={styles.aside}>
        <div className={styles.asideInner} data-reveal>
          <p className={styles.number}>{String(index + 1).padStart(2, '0')}</p>
          <h3 id={titleId} className={styles.name}>
            {project.name}
          </h3>
          <p className={styles.tagline}>{project.tagline}</p>
          <dl className={styles.meta}>
            <div>
              <dt>{labels.type}</dt>
              <dd>{project.kind}</dd>
            </div>
            <div>
              <dt>{labels.year}</dt>
              <dd>{project.year}</dd>
            </div>
          </dl>
          <ul role="list" className={styles.links}>
            {project.links.map((link) => (
              <li key={link.href}>
                <a href={link.href} target="_blank" rel="noreferrer">
                  {link.label}
                  <span aria-hidden="true"> ↗</span>
                  <span className="visually-hidden">
                    {' '}
                    · {project.name} ({labels.newTab})
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </header>

      <div className={styles.body}>
        <div className={styles.narrative} data-reveal>
          <div className={styles.block}>
            <h4 className={styles.blockTitle}>{labels.problem}</h4>
            <p>{project.problem}</p>
          </div>
          <div className={styles.block}>
            <h4 className={styles.blockTitle}>{labels.solution}</h4>
            <p>{project.solution}</p>
          </div>
        </div>

        {project.preview && (
          <figure className={styles.preview} data-reveal>
            <div className={styles.browserBar} aria-hidden="true">
              <span className={styles.dots}>
                <span />
                <span />
                <span />
              </span>
              <span className={styles.address}>
                {project.preview.url.replace(/^https?:\/\//, '')}
              </span>
            </div>
            <a href={project.preview.url} target="_blank" rel="noreferrer">
              <Image
                src={project.preview.src}
                alt={project.preview.alt}
                width={project.preview.width}
                height={project.preview.height}
                sizes="(min-width: 64rem) 52rem, 100vw"
                className={styles.previewImage}
              />
              <span className="visually-hidden"> ({labels.newTab})</span>
            </a>
          </figure>
        )}

        <ArchitectureFlow nodes={project.flow} label={`${labels.flowCaption} ${project.name}`} />

        <div className={styles.engineering}>
          <h4 className={styles.blockTitle} data-reveal>
            {labels.engineering}
          </h4>
          <ExpandableDecisions
            count={project.decisions.length}
            labels={{ more: labels.showMore, less: labels.showLess }}
          >
            {project.decisions.map((decision, decisionIndex) => (
              <li
                key={decision.title}
                className={styles.decision}
                data-nodes={decision.nodes.join(' ')}
                data-reveal
                style={{ '--reveal-delay': `${(decisionIndex % 2) * 80}ms` } as React.CSSProperties}
              >
                <h5 className={styles.decisionTitle}>{decision.title}</h5>
                <p>{decision.body}</p>
                {decision.reference && (
                  <p className={styles.reference}>
                    <a
                      href={`${project.repoUrl}/${decision.reference.endsWith('/') ? 'tree' : 'blob'}/main/${decision.reference}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <span aria-hidden="true">→ </span>
                      {decision.reference}
                    </a>
                  </p>
                )}
              </li>
            ))}
          </ExpandableDecisions>
        </div>

        <div className={styles.footer} data-reveal>
          <dl className={styles.facts}>
            {project.facts.map((fact) => (
              <div key={fact.label} className={styles.fact}>
                <dt>{fact.label}</dt>
                <dd>{fact.value}</dd>
              </div>
            ))}
          </dl>

          <div>
            <h4 className={styles.blockTitle}>{labels.stack}</h4>
            <ul role="list" className={styles.stack}>
              {project.stack.map((item) => (
                <li key={item}>
                  <TechIcon name={item} />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <figure className={styles.outcome}>
            <h4 className={styles.blockTitle}>{labels.outcome}</h4>
            <blockquote>
              <p>{project.outcome}</p>
            </blockquote>
          </figure>
        </div>
      </div>
    </article>
  )
}
