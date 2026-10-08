/**
 * Technology name (as written on the page) → Simple Icons slug, served from
 * public/tech/. Concepts such as SOLID or use cases have no logo on purpose,
 * and neither do tools Simple Icons does not cover (BullMQ, Zustand).
 */
const icons: Record<string, string> = {
  'Node.js': 'nodedotjs',
  'Node.js Streams': 'nodedotjs',
  'CLI · NPM': 'npm',
  TypeScript: 'typescript',
  Fastify: 'fastify',
  Express: 'express',
  NestJS: 'nestjs',
  Zod: 'zod',
  JWT: 'jsonwebtokens',
  'JWT · refresh tokens': 'jsonwebtokens',
  'Socket.io': 'socketdotio',
  PostgreSQL: 'postgresql',
  Prisma: 'prisma',
  Redis: 'redis',
  'Redis · BullMQ': 'redis',
  MongoDB: 'mongodb',
  SQLite: 'sqlite',
  Knex: 'knexdotjs',
  Vitest: 'vitest',
  'GitHub Actions': 'githubactions',
  OpenTelemetry: 'opentelemetry',
  Jest: 'jest',
  'Mocha · Chai': 'mocha',
  React: 'react',
  'TanStack Query': 'reactquery',
  Vite: 'vite',
  'Tailwind CSS': 'tailwindcss',
  'Next.js': 'nextdotjs',
  'HTML · CSS': 'html5',
  Leaflet: 'leaflet',
  FFmpeg: 'ffmpeg',
  Python: 'python',
  JavaScript: 'javascript',
  CSS3: 'css',
  Git: 'git',
  Django: 'django',
  Go: 'go',
  n8n: 'n8n',
}

export function techIconSlug(name: string): string | null {
  return icons[name] ?? null
}
