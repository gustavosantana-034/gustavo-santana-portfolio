import { profile } from '@/data/profile'
import { getContent } from '@/i18n'
import type { Locale } from '@/i18n/config'
import { formatShortDate } from '@/lib/format'
import { AchievementsPanel } from './achievements/achievements-panel'
import { UnlockOnView } from './achievements/unlock-on-view'
import styles from './site-footer.module.css'

export function SiteFooter({ locale }: { locale: Locale }) {
  const { footer, dateLocale } = getContent(locale)
  const builtAt = new Date().toISOString()

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.row}>
          <p className={styles.signature}>
            <span className={styles.mark} aria-hidden="true">
              g<span>/</span>s
            </span>
            {footer.signature}
          </p>
          <a href="#topo" className={styles.top}>
            {footer.backToTop} <span aria-hidden="true">↑</span>
          </a>
        </div>

        <div className={styles.row}>
          <AchievementsPanel />
          <p className={styles.meta}>
            © {new Date(builtAt).getFullYear()} {profile.name} · {footer.built}{' '}
            <time dateTime={builtAt}>{formatShortDate(builtAt, dateLocale)}</time>
          </p>
        </div>

        <p className={styles.eof} aria-hidden="true">
          — EOF —
        </p>
        <UnlockOnView id="eof" />
      </div>
    </footer>
  )
}
