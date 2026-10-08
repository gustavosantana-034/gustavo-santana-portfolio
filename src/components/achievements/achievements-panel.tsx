'use client'

import { useId, useState } from 'react'

import { useI18n } from '@/i18n/i18n-provider'
import { achievementIds } from './achievements'
import { useAchievements } from './achievements-provider'
import styles from './achievements.module.css'

/** The quiet counter in the footer, expandable into the full list. */
export function AchievementsPanel() {
  const { t } = useI18n()
  const { unlocked } = useAchievements()
  const [open, setOpen] = useState(false)
  const listId = useId()

  return (
    <div className={styles.panel}>
      <button
        type="button"
        className={styles.counter}
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((value) => !value)}
      >
        <span aria-hidden="true">◆</span> {t.achievements.counter} {unlocked.size}/
        {achievementIds.length}
      </button>

      {open && (
        <ul id={listId} role="list" className={styles.list}>
          {achievementIds.map((id) => {
            const achievement = t.achievements.items[id]
            const isUnlocked = unlocked.has(id)
            return (
              <li key={id} className={styles.item} data-unlocked={isUnlocked}>
                <span className={styles.itemIcon} aria-hidden="true">
                  {isUnlocked ? '◆' : '◇'}
                </span>
                <span>
                  <span className={styles.itemTitle}>
                    {isUnlocked ? achievement.title : '???'}
                    <span className="visually-hidden">
                      {` (${isUnlocked ? t.achievements.unlocked : t.achievements.locked})`}
                    </span>
                  </span>
                  <span className={styles.itemText}>
                    {isUnlocked ? achievement.description : achievement.hint}
                  </span>
                </span>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
