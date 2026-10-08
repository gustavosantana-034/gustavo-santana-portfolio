'use client'

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'

import { repoUrl } from '@/data/projects'
import { TechIcon } from '@/components/tech-icon'
import { useReducedMotion } from '@/hooks/use-reduced-motion'
import type { Checkpoint } from '@/i18n/types'
import styles from './journey.module.css'

interface Labels {
  start: string
  checkpoint: string
  current: string
  unlocked: string
  inProgress: string
}

interface Point {
  x: number
  y: number
}

/** Where the fill line sits in the viewport: checkpoints unlock as it passes them. */
const READING_LINE = 0.62

/**
 * A curve through every node, always moving down, so the path's length grows
 * monotonically with its y coordinate (which the scroll mapping relies on).
 */
function buildPath(points: Point[]): string {
  const [first, ...rest] = points
  if (!first) return ''
  let d = `M ${first.x} 0 L ${first.x} ${first.y}`
  let previous = first
  for (const point of rest) {
    const bend = (point.y - previous.y) * 0.5
    d += ` C ${previous.x} ${previous.y + bend}, ${point.x} ${point.y - bend}, ${point.x} ${point.y}`
    previous = point
  }
  return d
}

/** Length along the path at which it reaches a given y (binary search). */
function lengthAtY(path: SVGPathElement, total: number, y: number): number {
  let low = 0
  let high = total
  for (let i = 0; i < 18; i += 1) {
    const mid = (low + high) / 2
    if (path.getPointAtLength(mid).y < y) low = mid
    else high = mid
  }
  return low
}

export function ProgressMap({
  checkpoints,
  labels,
}: {
  checkpoints: Checkpoint[]
  labels: Labels
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const nodeRefs = useRef<(HTMLSpanElement | null)[]>([])
  const itemRefs = useRef<(HTMLLIElement | null)[]>([])
  const fillRef = useRef<SVGPathElement>(null)
  const geometry = useRef({ total: 0, nodeYs: [] as number[], reached: 0 })
  const [shape, setShape] = useState<{ d: string; width: number; height: number } | null>(null)
  const reduceMotion = useReducedMotion()

  // Rebuild the path whenever the layout changes size.
  useLayoutEffect(() => {
    const container = containerRef.current
    if (!container) return

    const measure = () => {
      const box = container.getBoundingClientRect()
      const points = nodeRefs.current.flatMap((node) => {
        if (!node) return []
        const rect = node.getBoundingClientRect()
        return [
          { x: rect.left + rect.width / 2 - box.left, y: rect.top + rect.height / 2 - box.top },
        ]
      })
      geometry.current.nodeYs = points.map((point) => point.y)
      setShape({ d: buildPath(points), width: box.width, height: box.height })
    }

    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(container)
    return () => observer.disconnect()
  }, [])

  const update = useCallback(() => {
    const container = containerRef.current
    const fill = fillRef.current
    if (!container || !fill) return
    const state = geometry.current
    if (!state.total) return

    let reached = state.total
    if (!reduceMotion) {
      const target = window.innerHeight * READING_LINE - container.getBoundingClientRect().top
      // Progress is kept like a save point: scrolling back up does not re-lock.
      reached = Math.max(state.reached, lengthAtY(fill, state.total, target))
    }
    state.reached = reached
    fill.style.strokeDashoffset = String(state.total - reached)

    const reachedY = fill.getPointAtLength(reached).y
    state.nodeYs.forEach((y, index) => {
      if (y <= reachedY + 2) itemRefs.current[index]?.setAttribute('data-unlocked', 'true')
    })
  }, [reduceMotion])

  // Once the path exists, measure its length and follow the scroll.
  useEffect(() => {
    const fill = fillRef.current
    if (!shape || !fill) return

    const total = fill.getTotalLength()
    geometry.current.total = total
    fill.style.strokeDasharray = `${total} ${total}`
    containerRef.current?.setAttribute('data-ready', 'true')

    let frame = 0
    const onScroll = () => {
      if (!frame)
        frame = requestAnimationFrame(() => {
          frame = 0
          update()
        })
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [shape, update])

  // Numbered stages skip the "current" checkpoint, which has its own label.
  const stageNumbers = checkpoints.reduce<number[]>((numbers, checkpoint) => {
    const previous = numbers.at(-1) ?? 0
    return [...numbers, checkpoint.kind === 'current' ? previous : previous + 1]
  }, [])

  return (
    <div ref={containerRef} className={styles.map}>
      {shape && (
        <svg
          className={styles.path}
          width={shape.width}
          height={shape.height}
          viewBox={`0 0 ${shape.width} ${shape.height}`}
          aria-hidden="true"
        >
          <path className={styles.track} d={shape.d} />
          <path ref={fillRef} className={styles.fill} d={shape.d} />
        </svg>
      )}

      <p className={styles.start} aria-hidden="true">
        {labels.start}
      </p>

      <ol className={styles.checkpoints}>
        {checkpoints.map((checkpoint, index) => {
          const isCurrent = checkpoint.kind === 'current'
          const stageNumber = stageNumbers[index] ?? 0
          return (
            <li
              key={checkpoint.id}
              ref={(element) => {
                itemRefs.current[index] = element
              }}
              className={styles.checkpoint}
              data-side={index % 2 === 0 ? 'left' : 'right'}
              data-kind={checkpoint.kind}
            >
              <span
                ref={(element) => {
                  nodeRefs.current[index] = element
                }}
                className={styles.node}
                aria-hidden="true"
              >
                {isCurrent ? '★' : ''}
              </span>

              <article className={styles.card}>
                <p className={styles.meta}>
                  <span className={styles.stage}>
                    {isCurrent
                      ? labels.current
                      : `${labels.checkpoint} ${String(stageNumber).padStart(2, '0')}`}
                  </span>
                  <span>{checkpoint.period}</span>
                </p>
                <h3 className={styles.title}>{checkpoint.title}</h3>
                {checkpoint.subtitle && <p className={styles.subtitle}>{checkpoint.subtitle}</p>}
                <p className={styles.body}>{checkpoint.body}</p>

                {checkpoint.highlights && (
                  <ul className={styles.highlights}>
                    {checkpoint.highlights.map((highlight) => (
                      <li key={highlight}>{highlight}</li>
                    ))}
                  </ul>
                )}

                <div className={styles.unlocked}>
                  <span className={styles.unlockedLabel}>
                    {isCurrent ? labels.inProgress : labels.unlocked}
                  </span>
                  <ul role="list" className={styles.skills}>
                    {checkpoint.unlocked.map((skill) => (
                      <li key={skill}>
                        <TechIcon name={skill} />
                        {skill}
                      </li>
                    ))}
                  </ul>
                </div>

                {checkpoint.repos && (
                  <ul role="list" className={styles.repos}>
                    {checkpoint.repos.map((name) => (
                      <li key={name}>
                        <a href={repoUrl(name)} target="_blank" rel="noreferrer">
                          {name}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </article>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
