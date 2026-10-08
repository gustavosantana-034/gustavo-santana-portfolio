'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from 'react'

import type { AchievementId } from './achievements'
import { getServerUnlocked, getUnlocked, subscribe, unlockAchievement } from './achievements-store'
import { AchievementToast, type ToastState } from './achievement-toast'
import { useKonamiCode } from './use-konami-code'

const TOAST_DURATION_MS = 3600
const TOAST_EXIT_MS = 240

interface AchievementsContextValue {
  unlocked: ReadonlySet<AchievementId>
  unlock: (id: AchievementId) => void
}

const AchievementsContext = createContext<AchievementsContextValue | null>(null)

export function AchievementsProvider({ children }: { children: ReactNode }) {
  const unlocked = useSyncExternalStore(subscribe, getUnlocked, getServerUnlocked)
  const [toast, setToast] = useState<ToastState | null>(null)
  const toastTimers = useRef<number[]>([])

  const unlock = useCallback((id: AchievementId) => {
    if (!unlockAchievement(id)) return

    toastTimers.current.forEach((timer) => window.clearTimeout(timer))
    setToast({ id, leaving: false })
    toastTimers.current = [
      window.setTimeout(() => setToast({ id, leaving: true }), TOAST_DURATION_MS),
      window.setTimeout(() => setToast(null), TOAST_DURATION_MS + TOAST_EXIT_MS),
    ]
  }, [])

  useEffect(() => () => toastTimers.current.forEach((timer) => window.clearTimeout(timer)), [])

  useKonamiCode(useCallback(() => unlock('konami'), [unlock]))

  const value = useMemo(() => ({ unlocked, unlock }), [unlocked, unlock])

  return (
    <AchievementsContext.Provider value={value}>
      {children}
      <AchievementToast toast={toast} />
    </AchievementsContext.Provider>
  )
}

export function useAchievements() {
  const context = useContext(AchievementsContext)

  if (!context) {
    throw new Error('useAchievements must be used inside <AchievementsProvider>')
  }

  return context
}
