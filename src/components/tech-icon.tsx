import { techIconSlug } from '@/data/tech-icons'
import styles from './tech-icon.module.css'

/**
 * A technology logo drawn as a CSS mask, so it takes the current text color:
 * monochrome, consistent in both themes, and tinted when its parent is
 * highlighted. Renders nothing for names without a logo.
 */
export function TechIcon({ name }: { name: string }) {
  const slug = techIconSlug(name)
  if (!slug) return null

  return (
    <span
      className={styles.icon}
      style={{ '--icon': `url(/tech/${slug}.svg)` } as React.CSSProperties}
      aria-hidden="true"
    />
  )
}
