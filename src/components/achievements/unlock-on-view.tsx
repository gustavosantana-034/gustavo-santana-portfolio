'use client'

import { useEffect, useRef } from 'react'

import type { AchievementId } from './achievements'
import { useAchievements } from './achievements-provider'

/** An invisible marker that unlocks an achievement once it scrolls into view. */
export function UnlockOnView({ id }: { id: AchievementId }) {
  const ref = useRef<HTMLSpanElement>(null)
  const { unlock } = useAchievements()

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry?.isIntersecting) return
      unlock(id)
      observer.disconnect()
    })

    observer.observe(element)
    return () => observer.disconnect()
  }, [id, unlock])

  return <span ref={ref} aria-hidden="true" style={{ display: 'block', height: 1 }} />
}
