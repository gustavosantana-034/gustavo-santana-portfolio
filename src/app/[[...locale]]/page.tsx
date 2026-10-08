import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'
import { localeFromSegments } from '@/i18n/config'
import { getResume } from '@/lib/resume'
import { About } from '@/sections/about/about'
import { Certificates } from '@/sections/certificates/certificates'
import { Contact } from '@/sections/contact/contact'
import { Glance } from '@/sections/glance/glance'
import { Hero } from '@/sections/hero/hero'
import { Journey } from '@/sections/journey/journey'
import { Projects } from '@/sections/projects/projects'
import { Stack } from '@/sections/stack/stack'

/**
 * The page reads as a journey: who I am, what I do, how I got here, what I
 * built, how I build, who I am outside code, and an invitation to talk.
 */
export default async function HomePage({ params }: { params: Promise<{ locale?: string[] }> }) {
  const locale = localeFromSegments((await params).locale)
  const resume = getResume(locale)

  return (
    <>
      <SiteHeader resume={resume} />
      <main id="conteudo" tabIndex={-1}>
        <Hero locale={locale} />
        <Glance locale={locale} resume={resume} />
        <Journey locale={locale} />
        <Projects locale={locale} />
        <Stack locale={locale} />
        <Certificates locale={locale} />
        <About locale={locale} />
        <Contact locale={locale} resume={resume} />
      </main>
      <SiteFooter locale={locale} />
    </>
  )
}
