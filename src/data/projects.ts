import type { LayerKind } from './types'

const repo = (name: string) => `https://github.com/gustavosantana-034/${name}`

export const projectSlugs = ['pulso', 'networking-club', 'cs-chat'] as const
export type ProjectSlug = (typeof projectSlugs)[number]

export interface ProjectMeta {
  slug: ProjectSlug
  year: string
  repoUrl: string
  links: { kind: 'app' | 'repo' | 'docs'; href: string }[]
  stack: string[]
  /** Layer of each node in the request flow diagram. */
  flowKinds: LayerKind[]
  /** File behind each engineering decision, in the same order as the copy. */
  references: (string | null)[]
  /** Flow nodes (by index) each decision lives in, highlighted on hover. */
  decisionNodes: number[][]
  /** A screenshot of the live product, shown in a browser frame. */
  preview?: { src: string; width: number; height: number; url: string }
}

/**
 * The three featured projects, picked from the public GitHub account for
 * architecture, test coverage and the decisions behind them. Their text lives
 * in src/i18n/content; every number and path there comes from the repositories.
 */
export const projectMeta: ProjectMeta[] = [
  {
    slug: 'pulso',
    year: '2025 — 2026',
    repoUrl: repo('GYM-API'),
    links: [
      { kind: 'app', href: 'https://gym-api-three.vercel.app' },
      { kind: 'repo', href: repo('GYM-API') },
      { kind: 'docs', href: `${repo('GYM-API')}/blob/main/backend/docs/API.md` },
    ],
    stack: [
      'Node.js',
      'TypeScript',
      'Fastify',
      'Prisma',
      'PostgreSQL',
      'Zod',
      'JWT',
      'Vitest',
      'Supertest',
      'React',
      'Vite',
      'Leaflet',
      'GitHub Actions',
    ],
    flowKinds: ['client', 'edge', 'domain', 'data', 'data'],
    references: [
      'backend/src/http/error-handler.ts',
      'backend/src/repositories/',
      'backend/src/repositories/prisma/prisma-gyms-repository.ts',
      'frontend/src/api/client.ts',
    ],
    // error handler: controller + use case · repositories · SQL distance · session
    decisionNodes: [[1, 2], [3], [4], [0, 1]],
    preview: {
      src: '/projects/pulso-login.webp',
      width: 1600,
      height: 1000,
      url: 'https://gym-api-three.vercel.app',
    },
  },
  {
    slug: 'networking-club',
    year: '2026',
    repoUrl: repo('Networking-Club-Backend'),
    links: [{ kind: 'repo', href: repo('Networking-Club-Backend') }],
    stack: [
      'Node.js',
      'TypeScript',
      'Fastify',
      'Prisma',
      'PostgreSQL',
      'BullMQ',
      'Redis',
      'OpenTelemetry',
      'Zod',
      'Vitest',
      'FFmpeg',
    ],
    flowKinds: ['client', 'edge', 'application', 'external', 'application'],
    references: [
      'src/modules/webhooks/use-cases/ingest-kirvano-webhook.ts',
      'src/shared/lib/transaction-manager.ts',
      'src/modules/downloader/services/assert-safe-source-url.ts',
      'src/modules/billing/services/credits-service.ts',
    ],
    // webhooks + billing · transactions · SSRF check before the job · credits
    decisionNodes: [[1], [1, 2], [2, 3], [1]],
  },
  {
    slug: 'cs-chat',
    year: '2025',
    repoUrl: repo('cs-chat'),
    links: [{ kind: 'repo', href: repo('cs-chat') }],
    stack: [
      'Node.js',
      'Express',
      'Socket.io',
      'MongoDB',
      'JWT',
      'React',
      'Zustand',
      'Tailwind CSS',
    ],
    flowKinds: ['client', 'edge', 'data', 'external'],
    references: ['backend/src/controllers/message.controller.js', null],
    // persist then emit · images handled by the API
    decisionNodes: [[2, 3], [1]],
  },
]

export { repo as repoUrl }
