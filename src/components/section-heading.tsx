import type { ReactNode } from 'react'

import styles from './section-heading.module.css'

interface SectionHeadingProps {
  index: string
  label: string
  id: string
  title: ReactNode
  intro?: ReactNode
}

export function SectionHeading({ index, label, id, title, intro }: SectionHeadingProps) {
  return (
    <header className={styles.heading} data-reveal>
      <p className={styles.eyebrow}>
        <span className={styles.index}>{index}</span>
        <span className={styles.rule} aria-hidden="true" />
        <span>{label}</span>
      </p>
      <h2 id={id} className={styles.title}>
        {title}
      </h2>
      {intro && <p className={styles.intro}>{intro}</p>}
    </header>
  )
}

/** Renders a [before, emphasis, after] title with the emphasis in serif italic. */
export function Emphasized({ parts }: { parts: [string, string, string] }) {
  const [before, emphasis, after] = parts
  return (
    <>
      {before}
      <em>{emphasis}</em>
      {after}
    </>
  )
}
