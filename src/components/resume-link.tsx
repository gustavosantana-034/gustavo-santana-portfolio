'use client'

import { useI18n } from '@/i18n/i18n-provider'
import type { Resume } from '@/lib/resume'
import styles from './resume-link.module.css'

interface ResumeLinkProps {
  resume: Resume
  /** compact: header pill · button: primary CTA · row: contact channel. */
  variant: 'compact' | 'button' | 'row'
}

export function ResumeLink({ resume, variant }: ResumeLinkProps) {
  const { t } = useI18n()
  const label = variant === 'compact' ? t.resume.short : t.resume.cta

  return (
    <a
      href={resume.href}
      download
      className={styles[variant]}
      data-missing={!resume.available}
      title={resume.available ? undefined : t.resume.missing}
    >
      {variant === 'row' ? (
        <>
          <span className={styles.rowLabel}>{t.resume.short}</span>
          <span className={styles.rowValue}>PDF</span>
          <span className={styles.rowArrow} aria-hidden="true">
            ↓
          </span>
        </>
      ) : (
        <>
          {label} <span aria-hidden="true">↓</span>
        </>
      )}
      {!resume.available && <span className={styles.missing}>{t.resume.missing}</span>}
    </a>
  )
}
