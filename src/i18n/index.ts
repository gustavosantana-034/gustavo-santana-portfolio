import { projectMeta, type ProjectSlug } from '@/data/projects'
import type { FlowNode } from '@/data/types'
import type { Locale } from './config'
import { en } from './content/en'
import { ptBR } from './content/pt-BR'
import type { ClientContent } from './i18n-provider'
import type { SiteContent } from './types'

const contents: Record<Locale, SiteContent> = { 'pt-BR': ptBR, en }

export function getContent(locale: Locale): SiteContent {
  return contents[locale]
}

export function getClientContent(locale: Locale): ClientContent {
  const { nav, resume, inspector, contact, achievements, console, dateLocale } = contents[locale]
  return { nav, resume, inspector, contact, achievements, console, dateLocale }
}

export interface Project {
  slug: ProjectSlug
  name: string
  tagline: string
  kind: string
  year: string
  problem: string
  solution: string
  flow: FlowNode[]
  decisions: { title: string; body: string; reference: string | null; nodes: number[] }[]
  stack: string[]
  facts: { value: string; label: string }[]
  outcome: string
  repoUrl: string
  links: { label: string; href: string }[]
  preview: { src: string; width: number; height: number; url: string; alt: string } | null
}

/**
 * Merges each project's locale-neutral data with its copy. Array lengths are
 * checked so a decision or flow node added on one side only fails the build.
 */
export function getProjects(locale: Locale): Project[] {
  const content = contents[locale].projects

  return projectMeta.map((meta) => {
    const copy = content.items[meta.slug]

    if (copy.flow.length !== meta.flowKinds.length) {
      throw new Error(`[${locale}] ${meta.slug}: flow copy and flowKinds differ in length`)
    }
    if (copy.decisions.length !== meta.references.length) {
      throw new Error(`[${locale}] ${meta.slug}: decisions copy and references differ in length`)
    }

    return {
      slug: meta.slug,
      name: copy.name,
      tagline: copy.tagline,
      kind: copy.kind,
      year: meta.year,
      problem: copy.problem,
      solution: copy.solution,
      flow: copy.flow.map((node, index) => ({ ...node, kind: meta.flowKinds[index] ?? 'edge' })),
      decisions: copy.decisions.map((decision, index) => ({
        ...decision,
        reference: meta.references[index] ?? null,
        nodes: meta.decisionNodes[index] ?? [],
      })),
      stack: meta.stack,
      facts: copy.facts,
      outcome: copy.outcome,
      repoUrl: meta.repoUrl,
      preview: meta.preview ? { ...meta.preview, alt: copy.previewAlt ?? copy.name } : null,
      links: meta.links.map((link) => ({
        label: content.labels.links[link.kind],
        href: link.href,
      })),
    }
  })
}
