// Dates are formatted at build time, so they are absolute: a relative
// "há 2 dias" would silently go stale on a statically exported page.

const timeZone = 'America/Sao_Paulo'

export function formatShortDate(date: string, locale: string): string {
  return new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone,
  })
    .format(new Date(date))
    .replace(/\./g, '')
    .replace(/ de /g, ' ')
}

export function formatMonthYear(date: string, locale: string): string {
  return new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric', timeZone }).format(
    new Date(date),
  )
}
