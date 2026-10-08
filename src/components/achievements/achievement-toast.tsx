'use client'

import { useI18n } from '@/i18n/i18n-provider'
import type { AchievementId } from './achievements'
import styles from './achievements.module.css'

export interface ToastState {
  id: AchievementId
  leaving: boolean
}

/** Enter and exit are CSS animations; `leaving` is set shortly before unmount. */
export function AchievementToast({ toast }: { toast: ToastState | null }) {
  const { t } = useI18n()
  const achievement = toast && t.achievements.items[toast.id]

  return (
    <div className={styles.toastRegion} role="status" aria-live="polite" aria-atomic="true">
      {toast && achievement && (
        <div key={toast.id} className={styles.toast} data-leaving={toast.leaving}>
          <span className={styles.toastIcon} aria-hidden="true">
            ◆
          </span>
          <span>
            <span className={styles.toastLabel}>{t.achievements.toastLabel}</span>
            <span className={styles.toastTitle}>{achievement.title}</span>
            <span className={styles.toastDescription}>{achievement.description}</span>
          </span>
        </div>
      )}
    </div>
  )
}
