import { achievementIds, type AchievementId } from './achievements'

/**
 * Unlocked achievements live in localStorage; this module is the single
 * reader/writer and exposes it as an external store for useSyncExternalStore.
 */

const STORAGE_KEY = 'gs-achievements'
const EMPTY: ReadonlySet<AchievementId> = new Set()
const knownIds = new Set<string>(achievementIds)
const listeners = new Set<() => void>()

let cache: ReadonlySet<AchievementId> | null = null

function read(): ReadonlySet<AchievementId> {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    const ids: unknown = raw ? JSON.parse(raw) : []
    return new Set(
      Array.isArray(ids) ? ids.filter((id): id is AchievementId => knownIds.has(id)) : [],
    )
  } catch {
    return new Set()
  }
}

export function getUnlocked(): ReadonlySet<AchievementId> {
  cache ??= read()
  return cache
}

export function getServerUnlocked(): ReadonlySet<AchievementId> {
  return EMPTY
}

export function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

/** Returns false when the achievement was already unlocked. */
export function unlockAchievement(id: AchievementId): boolean {
  const current = getUnlocked()
  if (current.has(id)) return false

  cache = new Set(current).add(id)

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...cache]))
  } catch {
    // Storage can be unavailable (private mode); achievements just won't persist.
  }

  listeners.forEach((listener) => listener())
  return true
}
