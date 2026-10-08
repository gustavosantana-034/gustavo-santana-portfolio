'use client'

import { useId, useState, type FormEvent } from 'react'

import { useI18n } from '@/i18n/i18n-provider'
import styles from './contact.module.css'

type Status = 'idle' | 'sent'

/**
 * A contact form shaped like an HTTP request. There is no backend: submitting
 * opens the visitor's e-mail client with everything filled in, which keeps the
 * site static and the conversation in a real inbox.
 */
export function RequestComposer({ email }: { email: string }) {
  const { t } = useI18n()
  const copy = t.contact
  const [status, setStatus] = useState<Status>('idle')
  const [copied, setCopied] = useState(false)
  const formId = useId()

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const name = String(data.get('name') ?? '').trim()
    const company = String(data.get('company') ?? '').trim()
    const message = String(data.get('message') ?? '').trim()

    const subject = [copy.subjectPrefix, company || name, copy.subjectSuffix]
      .filter(Boolean)
      .join(' · ')
    const signature = [name, company].filter(Boolean).join(' · ')
    const body = signature ? `${message}\n\n— ${signature}` : message

    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    setStatus('sent')
  }

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(email)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  return (
    <form
      className={styles.composer}
      onSubmit={handleSubmit}
      aria-describedby={`${formId}-hint`}
      data-reveal
    >
      <p className={styles.requestLine} aria-hidden="true">
        <span className={styles.method}>POST</span> {copy.requestPath}
      </p>

      <div className={styles.fieldRow}>
        <div className={styles.field}>
          <label htmlFor={`${formId}-name`} className={styles.fieldLabel}>
            {copy.nameLabel} <span className={styles.optional}>{copy.optional}</span>
          </label>
          <input
            id={`${formId}-name`}
            name="name"
            type="text"
            autoComplete="name"
            className={styles.input}
            placeholder={copy.namePlaceholder}
          />
        </div>
        <div className={styles.field}>
          <label htmlFor={`${formId}-company`} className={styles.fieldLabel}>
            {copy.companyLabel} <span className={styles.optional}>{copy.optional}</span>
          </label>
          <input
            id={`${formId}-company`}
            name="company"
            type="text"
            autoComplete="organization"
            className={styles.input}
            placeholder={copy.companyPlaceholder}
          />
        </div>
      </div>

      <div className={styles.field}>
        <label htmlFor={`${formId}-message`} className={styles.fieldLabel}>
          {copy.messageLabel}
        </label>
        <textarea
          id={`${formId}-message`}
          name="message"
          required
          rows={5}
          className={styles.input}
          placeholder={copy.messagePlaceholder}
        />
      </div>

      <div className={styles.submitRow}>
        <button type="submit" className={styles.submit}>
          {copy.submit} <span aria-hidden="true">→</span>
        </button>
        <p id={`${formId}-hint`} className={styles.hint}>
          {copy.hint}
        </p>
      </div>

      <div className={styles.response} aria-live="polite">
        {status === 'sent' && (
          <>
            <p className={styles.responseStatus}>{copy.responseStatus}</p>
            <p className={styles.responseText}>
              {copy.responseText} <strong>{email}</strong>.{' '}
              <button type="button" className={styles.copy} onClick={copyEmail}>
                {copied ? copy.copied : copy.copy}
              </button>
            </p>
          </>
        )}
      </div>
    </form>
  )
}
