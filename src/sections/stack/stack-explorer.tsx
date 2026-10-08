'use client'

import { useRef, useState } from 'react'

import { useAchievements } from '@/components/achievements/achievements-provider'
import { TechIcon } from '@/components/tech-icon'
import styles from './stack.module.css'

export interface ExplorerGroup {
  id: string
  title: string
  description: string
  items: { name: string; evidence: string[] }[]
}

interface StackExplorerProps {
  groups: ExplorerGroup[]
  projectNames: Record<string, string>
  labels: { filter: string; all: string; usedIn: string }
}

export function StackExplorer({ groups, projectNames, labels }: StackExplorerProps) {
  const [project, setProject] = useState<string | null>(null)
  const explored = useRef(new Set<string>())
  const { unlock } = useAchievements()
  const filters: [string | null, string][] = [[null, labels.all], ...Object.entries(projectNames)]

  function select(slug: string | null) {
    setProject(slug)
    if (!slug) return
    explored.current.add(slug)
    if (explored.current.size === Object.keys(projectNames).length) unlock('full-stack')
  }

  return (
    <div className={styles.explorer} data-filtering={project !== null}>
      <div className={styles.filters} role="group" aria-label={labels.filter} data-reveal>
        {filters.map(([slug, name]) => (
          <button
            key={slug ?? 'all'}
            type="button"
            className={styles.filter}
            aria-pressed={project === slug}
            onClick={() => select(slug)}
          >
            {name}
          </button>
        ))}
      </div>

      <ol role="list" className={styles.groups}>
        {groups.map((group, index) => (
          <li key={group.id} className={styles.group} data-reveal>
            <div className={styles.groupHeader}>
              <span className={styles.groupIndex} aria-hidden="true">
                {String(index + 1).padStart(2, '0')}
              </span>
              <h3 className={styles.groupTitle}>{group.title}</h3>
              <p className={styles.groupDescription}>{group.description}</p>
            </div>

            <ul role="list" className={styles.items}>
              {group.items.map((item) => {
                const highlighted = project !== null && item.evidence.includes(project)
                return (
                  <li
                    key={item.name}
                    className={styles.item}
                    data-evidence={item.evidence.length > 0}
                    data-highlighted={highlighted}
                  >
                    <TechIcon name={item.name} />
                    {item.name}
                    <span className={styles.itemDot} aria-hidden="true" />
                    {item.evidence.length > 0 && (
                      <span className="visually-hidden">
                        , {labels.usedIn}{' '}
                        {item.evidence.map((slug) => projectNames[slug]).join(', ')}
                      </span>
                    )}
                  </li>
                )
              })}
            </ul>
          </li>
        ))}
      </ol>
    </div>
  )
}
