export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://gustavo-santana-fullstack-dev.vercel.app'
).replace(/\/$/, '')

/** Section ids double as anchors; their labels come from the locale content. */
export const sectionIds = [
  'trajetoria',
  'projetos',
  'stack',
  'certificados',
  'sobre',
  'contato',
] as const

export type SectionId = (typeof sectionIds)[number]
