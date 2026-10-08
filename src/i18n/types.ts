import type { AchievementId } from '@/components/achievements/achievements'
import type { ProjectSlug } from '@/data/projects'

/**
 * Every piece of text on the site, for one locale.
 *
 * Both locale files must satisfy this type, so a string added in one and
 * forgotten in the other is a compile error, not a blank spot in production.
 * Locale-neutral data (URLs, technology names, file references) lives in
 * `src/data` and is merged in where needed.
 */

/** A heading with an emphasized (serif italic) fragment: [before, emphasis, after]. */
export type EmphasizedTitle = [string, string, string]

export interface SectionCopy {
  eyebrow: string
  title: EmphasizedTitle
  intro?: string
}

export interface ProjectCopy {
  name: string
  tagline: string
  kind: string
  problem: string
  solution: string
  /** Same order and length as the project's `flowKinds`. */
  flow: { label: string; detail: string }[]
  /** Same order and length as the project's `references`. */
  decisions: { title: string; body: string }[]
  facts: { value: string; label: string }[]
  outcome: string
  /** Alt text for the project's screenshot, when it has one. */
  previewAlt?: string
}

export interface Checkpoint {
  id: string
  period: string
  kind: 'study' | 'project' | 'work' | 'current'
  title: string
  /** Shown under the title for work checkpoints (role · organization). */
  subtitle?: string
  body: string
  highlights?: string[]
  /** Technologies or skills this stage added. */
  unlocked: string[]
  repos?: string[]
}

export interface SiteContent {
  meta: {
    title: string
    description: string
    ogTitle: [string, string]
    ogSubtitle: string
    ogLayers: string[]
    keywords: string[]
    jobTitle: string
  }
  dateLocale: string
  nav: {
    label: string
    skip: string
    openMenu: string
    closeMenu: string
    homeLabel: string
    sections: Record<
      'trajetoria' | 'projetos' | 'stack' | 'certificados' | 'sobre' | 'contato',
      string
    >
    languageLabel: string
    languageNames: Record<'pt-BR' | 'en', string>
    themeToLight: string
    themeToDark: string
    availability: string
  }
  resume: {
    cta: string
    short: string
    missing: string
  }
  hero: {
    role: string
    titleLine1: string
    titleLine2: EmphasizedTitle
    lead: string
    ctaProjects: string
    ctaTalk: string
    hint: string
  }
  glance: {
    label: string
    title: string
    items: { label: string; value: string; detail: string; href?: string }[]
  }
  inspector: {
    tabsLabel: string
    tabs: { interface: string; inside: string }
    badge: string
    appMeta: string
    gymAddress: string
    modalities: string[]
    distanceNear: string
    distanceFar: string
    youAreAt: string
    checkIn: string
    positionLegend: string
    near: string
    far: string
    note: string
    stats: { value: string; label: string }[]
    rerun: string
    tryFar: string
    tryNear: string
    backToInterface: string
    footnote: [string, string, string]
    footnoteHidden: string
    stepsLabel: string
    waiting: string
    notExecuted: string
    status: { ok: string; failed: string; skipped: string }
    layers: { client: string; http: string; domain: string; data: string }
    steps: Record<
      'request' | 'auth' | 'validation' | 'daily' | 'repository' | 'database' | 'errorHandler',
      string
    >
    distanceOk: string
    distanceFail: string
  }
  journey: SectionCopy & {
    start: string
    checkpointLabel: string
    currentLabel: string
    unlockedLabel: string
    inProgressLabel: string
    checkpoints: Checkpoint[]
    learning: [string, string]
    certificates: string
    certificatesShort: string
    activity: {
      title: string
      gitLog: string
      languages: string
      reposOf: string
      summary: [string, string, string]
    }
  }
  projects: SectionCopy & {
    labels: {
      type: string
      year: string
      problem: string
      solution: string
      engineering: string
      stack: string
      outcome: string
      newTab: string
      flowCaption: string
      showMore: string
      showLess: string
      links: { app: string; repo: string; docs: string }
    }
    items: Record<ProjectSlug, ProjectCopy>
  }
  stack: SectionCopy & {
    introBefore: string
    introAfter: string
    legendDot: string
    filterLabel: string
    filterAll: string
    usedIn: string
    groups: Record<string, { title: string; description: string }>
  }
  certificates: SectionCopy & {
    allOnGithub: string
    featured: {
      label: string
      title: string
      issuer: string
      period: string
      status: string
      body: string
      modulesLabel: string
      modules: string[]
    }
    listTitle: string
    view: string
    newTab: string
    by: string
  }
  about: SectionCopy & {
    photoAlt: string
    sides: {
      id: 'main' | 'side'
      label: string
      title: string
      paragraphs: string[]
      now: { label: string; value: string }[]
    }[]
  }
  contact: SectionCopy & {
    requestPath: string
    nameLabel: string
    optional: string
    namePlaceholder: string
    companyLabel: string
    companyPlaceholder: string
    messageLabel: string
    messagePlaceholder: string
    submit: string
    hint: string
    responseStatus: string
    responseText: string
    copy: string
    copied: string
    direct: string
    subjectPrefix: string
    subjectSuffix: string
  }
  footer: {
    signature: string
    backToTop: string
    built: string
  }
  achievements: {
    toastLabel: string
    counter: string
    unlocked: string
    locked: string
    items: Record<AchievementId, { title: string; description: string; hint: string }>
  }
  console: [string, string]
}
