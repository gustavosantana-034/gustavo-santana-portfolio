import { ResumeLink } from '@/components/resume-link'
import { Emphasized, SectionHeading } from '@/components/section-heading'
import { profile } from '@/data/profile'
import { getContent } from '@/i18n'
import type { Locale } from '@/i18n/config'
import type { Resume } from '@/lib/resume'
import styles from './contact.module.css'
import { RequestComposer } from './request-composer'

const handle = (url: string) => new URL(url).pathname.replace(/^\/(in\/)?|\/$/g, '')

export function Contact({ locale, resume }: { locale: Locale; resume: Resume | null }) {
  const { contact, journey } = getContent(locale)
  const channels = [
    { label: 'LinkedIn', value: handle(profile.links.linkedin), href: profile.links.linkedin },
    { label: 'GitHub', value: handle(profile.links.github), href: profile.links.github },
    {
      label: journey.certificatesShort,
      value: 'Certifications-',
      href: profile.links.certificates,
    },
  ]

  return (
    <section
      id="contato"
      className={`container section-rule ${styles.section}`}
      aria-labelledby="contato-title"
    >
      <SectionHeading
        index="06"
        label={contact.eyebrow}
        id="contato-title"
        title={<Emphasized parts={contact.title} />}
        intro={contact.intro}
      />

      <div className={styles.layout}>
        <RequestComposer email={profile.email} />

        <div className={styles.channels} data-reveal>
          <h3 className={styles.channelsTitle}>{contact.direct}</h3>
          <a className={styles.email} href={`mailto:${profile.email}`}>
            {profile.email}
          </a>
          <ul role="list" className={styles.channelList}>
            {channels.map((channel) => (
              <li key={channel.label}>
                <a href={channel.href} target="_blank" rel="noreferrer">
                  <span className={styles.channelLabel}>{channel.label}</span>
                  <span className={styles.channelValue}>{channel.value}</span>
                  <span aria-hidden="true" className={styles.channelArrow}>
                    ↗
                  </span>
                </a>
              </li>
            ))}
            {resume && (
              <li>
                <ResumeLink resume={resume} variant="row" />
              </li>
            )}
          </ul>
        </div>
      </div>
    </section>
  )
}
