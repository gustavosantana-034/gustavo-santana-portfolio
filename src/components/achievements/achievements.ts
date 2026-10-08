/** Achievement ids, in display order. Their text lives in src/i18n/content. */
export const achievementIds = [
  'inspector',
  'unhappy-path',
  'full-stack',
  'side-quest',
  'konami',
  'eof',
] as const

export type AchievementId = (typeof achievementIds)[number]
