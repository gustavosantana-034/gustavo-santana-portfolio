// Builds a static snapshot of public GitHub data used by the site.
// Runs before every build; the site never calls the GitHub API at runtime.
//
//   node scripts/sync-github.mjs          fails loudly if GitHub is unreachable
//   node scripts/sync-github.mjs --soft   keeps the previous snapshot on failure
//
// Set GITHUB_TOKEN to avoid the 60 requests/hour anonymous rate limit.

import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const USERNAME = 'gustavosantana-034'
const RECENT_COMMIT_REPOS = 4
const COMMITS_PER_REPO = 4

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const outputFile = resolve(root, 'src/data/generated/github.json')
const soft = process.argv.includes('--soft')

const headers = {
  Accept: 'application/vnd.github+json',
  'User-Agent': `${USERNAME}-portfolio`,
  ...(process.env.GITHUB_TOKEN && {
    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
  }),
}

async function gh(path) {
  const response = await fetch(`https://api.github.com${path}`, { headers })

  if (!response.ok) {
    throw new Error(`GitHub ${response.status} on ${path}`)
  }

  return response.json()
}

async function buildSnapshot() {
  const [user, allRepos] = await Promise.all([
    gh(`/users/${USERNAME}`),
    gh(`/users/${USERNAME}/repos?per_page=100&sort=pushed`),
  ])

  const repos = allRepos.filter((repo) => !repo.fork && repo.name !== USERNAME)

  // Primary language per repository, grouped by the year it was created.
  // Byte counts are avoided on purpose: one committed virtualenv would
  // outweigh every hand-written line in the account.
  const languagesByYear = {}
  for (const repo of repos) {
    if (!repo.language) continue
    const year = repo.created_at.slice(0, 4)
    languagesByYear[year] ??= {}
    languagesByYear[year][repo.language] = (languagesByYear[year][repo.language] ?? 0) + 1
  }

  const recentRepos = repos.slice(0, RECENT_COMMIT_REPOS)
  const commitsPerRepo = await Promise.all(
    recentRepos.map(async (repo) => {
      const commits = await gh(
        `/repos/${USERNAME}/${repo.name}/commits?per_page=${COMMITS_PER_REPO}&author=${USERNAME}`,
      ).catch(() => [])

      return commits
        .filter((commit) => commit.parents.length < 2) // skip merge commits
        .map((commit) => ({
          repo: repo.name,
          sha: commit.sha.slice(0, 7),
          message: commit.commit.message
            .split('\n')[0]
            .replace(/:[a-z0-9_+-]+:\s*/g, '') // gitmoji shortcodes render as noise
            .trim(),
          date: commit.commit.author.date,
          url: commit.html_url,
        }))
    }),
  )

  return {
    syncedAt: new Date().toISOString(),
    profile: {
      login: user.login,
      url: user.html_url,
      avatarUrl: user.avatar_url,
      publicRepos: user.public_repos,
      followers: user.followers,
      memberSince: user.created_at,
    },
    languagesByYear: Object.entries(languagesByYear)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([year, counts]) => ({
        year: Number(year),
        languages: Object.entries(counts)
          .map(([name, repos]) => ({ name, repos }))
          .sort((a, b) => b.repos - a.repos),
      })),
    recentCommits: commitsPerRepo
      .flat()
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, 6),
  }
}

try {
  const snapshot = await buildSnapshot()
  await mkdir(dirname(outputFile), { recursive: true })
  await writeFile(outputFile, `${JSON.stringify(snapshot, null, 2)}\n`)
  console.log(`GitHub snapshot updated (${snapshot.recentCommits.length} commits)`)
} catch (error) {
  if (!soft) throw error
  console.warn(`GitHub sync skipped, keeping previous snapshot: ${error.message}`)
}
