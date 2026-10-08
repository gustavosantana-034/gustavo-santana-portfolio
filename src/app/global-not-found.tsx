import type { Metadata } from 'next'
import Link from 'next/link'

import { bootScript } from '@/lib/boot-script'
import { fontVariables } from '@/lib/fonts'
import '@/styles/globals.css'
import styles from './global-not-found.module.css'

export const metadata: Metadata = {
  title: '404',
  robots: { index: false },
}

/**
 * Unmatched URLs never reach the localized layout, so this page carries its
 * own document and speaks both languages.
 */
export default function GlobalNotFound() {
  return (
    <html lang="pt-BR" suppressHydrationWarning className={fontVariables}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body>
        <main className={`container ${styles.page}`}>
          <p className={styles.status}>
            <span>HTTP/1.1</span> 404 Not Found
          </p>
          <h1 className={styles.title}>
            Obrigado por visitar, mas a página que você procura está <em>em outro castelo</em>.
          </h1>
          <p className={styles.text} lang="en">
            Thanks for stopping by, but the page you are looking for is in another castle.
          </p>
          <div className={styles.actions}>
            <Link href="/" className={styles.back}>
              <span aria-hidden="true">←</span> Início
            </Link>
            <Link href="/en/" className={styles.back} lang="en">
              Home (EN)
            </Link>
          </div>
        </main>
      </body>
    </html>
  )
}
