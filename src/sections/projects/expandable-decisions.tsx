'use client'

import { useId, useState, type ReactNode } from 'react'

import styles from './projects.module.css'

interface ExpandableDecisionsProps {
  children: ReactNode
  count: number
  labels: { more: string; less: string }
}

/**
 * On narrow screens only the first two decisions show until expanded, which
 * keeps each case study short on a phone. Wide screens always show all.
 */
export function ExpandableDecisions({ children, count, labels }: ExpandableDecisionsProps) {
  const [expanded, setExpanded] = useState(false)
  const listId = useId()

  return (
    <>
      <ol role="list" id={listId} className={styles.decisions} data-expanded={expanded}>
        {children}
      </ol>
      {count > 2 && (
        <button
          type="button"
          className={styles.more}
          aria-expanded={expanded}
          aria-controls={listId}
          onClick={() => setExpanded((value) => !value)}
        >
          {expanded ? labels.less : `${labels.more} (${count - 2})`}
          <span aria-hidden="true">{expanded ? '↑' : '↓'}</span>
        </button>
      )}
    </>
  )
}
