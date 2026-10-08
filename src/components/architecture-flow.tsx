import type { FlowNode } from '@/data/types'

import styles from './architecture-flow.module.css'

/**
 * A request's path through a system, drawn as a chain of layers with a single
 * packet travelling along it. Horizontal on wide screens, vertical on narrow.
 */
export function ArchitectureFlow({ nodes, label }: { nodes: FlowNode[]; label: string }) {
  return (
    <figure className={styles.figure} data-reveal>
      <div className={styles.track} aria-hidden="true">
        <span className={styles.packetRail}>
          <span className={styles.packet} />
        </span>
      </div>
      <ol className={styles.flow} style={{ '--nodes': nodes.length } as React.CSSProperties}>
        {nodes.map((node, index) => (
          <li key={node.label} className={styles.node} data-layer={node.kind} data-node={index}>
            <span className={styles.step}>{String(index + 1).padStart(2, '0')}</span>
            <span className={styles.label}>{node.label}</span>
            <span className={styles.detail}>{node.detail}</span>
          </li>
        ))}
      </ol>
      <figcaption className="visually-hidden">{label}</figcaption>
    </figure>
  )
}
