import { Emphasized, SectionHeading } from '@/components/section-heading'
import { stackGroups, stackLabel } from '@/data/stack'
import { getContent, getProjects } from '@/i18n'
import type { Locale } from '@/i18n/config'
import styles from './stack.module.css'
import { StackExplorer, type ExplorerGroup } from './stack-explorer'

export function Stack({ locale }: { locale: Locale }) {
  const { stack: copy } = getContent(locale)
  const projectNames = Object.fromEntries(
    getProjects(locale).map((project) => [project.slug, project.name]),
  )

  // Resolved on the server so the client component only receives strings.
  const groups: ExplorerGroup[] = stackGroups.map((group) => ({
    id: group.id,
    title: copy.groups[group.id]?.title ?? group.id,
    description: copy.groups[group.id]?.description ?? '',
    items: group.items.map((item) => ({
      name: stackLabel(item.name, locale),
      evidence: item.evidence ?? [],
    })),
  }))

  return (
    <section
      id="stack"
      className={`container section-rule ${styles.section}`}
      aria-labelledby="stack-title"
    >
      <SectionHeading
        index="03"
        label={copy.eyebrow}
        id="stack-title"
        title={<Emphasized parts={copy.title} />}
        intro={
          <>
            {copy.introBefore}{' '}
            <span className={styles.legendDot} aria-label={copy.legendDot} role="img" />{' '}
            {copy.introAfter}
          </>
        }
      />
      <StackExplorer
        groups={groups}
        projectNames={projectNames}
        labels={{ filter: copy.filterLabel, all: copy.filterAll, usedIn: copy.usedIn }}
      />
    </section>
  )
}
