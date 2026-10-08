import type { Locale } from '@/i18n/config'
import type { ProjectSlug } from './projects'

type Label = string | Record<Locale, string>

export interface StackItem {
  name: Label
  /** Featured projects that use it. Empty for tools used outside them. */
  evidence?: ProjectSlug[]
}

export interface StackGroup {
  id: 'edge' | 'domain' | 'data' | 'quality' | 'runtime' | 'interface'
  items: StackItem[]
}

/**
 * Grouped by where each tool sits in a request's path, not by popularity.
 * Group titles and descriptions are in src/i18n/content.
 */
export const stackGroups: StackGroup[] = [
  {
    id: 'edge',
    items: [
      { name: 'Node.js', evidence: ['pulso', 'networking-club', 'cs-chat'] },
      { name: 'TypeScript', evidence: ['pulso', 'networking-club'] },
      { name: 'Fastify', evidence: ['pulso', 'networking-club'] },
      { name: 'Express', evidence: ['cs-chat'] },
      { name: 'NestJS' },
      { name: 'Zod', evidence: ['pulso', 'networking-club'] },
      { name: 'JWT · refresh tokens', evidence: ['pulso', 'cs-chat'] },
      { name: 'Socket.io', evidence: ['cs-chat'] },
    ],
  },
  {
    id: 'domain',
    items: [
      { name: 'Use cases', evidence: ['pulso', 'networking-club'] },
      { name: 'Repository pattern', evidence: ['pulso', 'networking-club'] },
      {
        name: { 'pt-BR': 'Monólito modular', en: 'Modular monolith' },
        evidence: ['networking-club'],
      },
      { name: { 'pt-BR': 'Idempotência', en: 'Idempotency' }, evidence: ['networking-club'] },
      { name: 'SOLID', evidence: ['pulso'] },
      { name: 'Design patterns' },
      { name: 'Factory · Abstract Factory · Builder' },
      { name: 'Strategy · Observer · Template Method' },
      { name: 'Adapter · Decorator · Facade' },
      { name: 'DRY · KISS · YAGNI' },
      { name: 'DDD' },
    ],
  },
  {
    id: 'data',
    items: [
      { name: 'PostgreSQL', evidence: ['pulso', 'networking-club'] },
      { name: 'Prisma', evidence: ['pulso', 'networking-club'] },
      { name: 'Redis · BullMQ', evidence: ['networking-club'] },
      { name: 'MongoDB', evidence: ['cs-chat'] },
      { name: 'SQLite' },
      { name: 'Knex' },
    ],
  },
  {
    id: 'quality',
    items: [
      { name: 'Vitest', evidence: ['pulso', 'networking-club'] },
      { name: 'Supertest · E2E', evidence: ['pulso'] },
      { name: 'GitHub Actions', evidence: ['pulso'] },
      { name: 'OpenTelemetry', evidence: ['networking-club'] },
      { name: 'TDD' },
      { name: 'BDD' },
      { name: { 'pt-BR': 'Mocks · stubs · spies', en: 'Mocks · stubs · spies' } },
      { name: 'Jest' },
      { name: 'Mocha · Chai' },
    ],
  },
  {
    id: 'runtime',
    items: [
      { name: 'Node.js Streams' },
      { name: 'Worker threads' },
      { name: 'Child processes' },
      { name: 'Cluster' },
      { name: { 'pt-BR': 'Benchmarking · memory leaks', en: 'Benchmarking · memory leaks' } },
      { name: 'Error handling' },
      { name: 'CLI · NPM' },
    ],
  },
  {
    id: 'interface',
    items: [
      { name: 'React', evidence: ['pulso', 'cs-chat'] },
      { name: 'TanStack Query', evidence: ['pulso'] },
      { name: 'Vite', evidence: ['pulso'] },
      { name: 'Tailwind CSS', evidence: ['pulso', 'cs-chat'] },
      { name: 'Next.js' },
      { name: 'HTML · CSS' },
    ],
  },
]

export function stackLabel(name: Label, locale: Locale): string {
  return typeof name === 'string' ? name : name[locale]
}
