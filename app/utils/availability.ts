/**
 * Calendar-day countdown for the interim contract.
 * `untilDate` is the last inclusive day in `timeZone`. Availability starts
 * at the first instant of the next calendar day.
 */
export function daysUntilAvailable(untilDate: string, timeZone: string, now: number): number {
  const [year, month, day] = dateParts(untilDate)
  const untilIndex = Math.floor(Date.UTC(year, month - 1, day) / 86400000)
  const todayIndex = calendarIndex(now, timeZone)

  return (untilIndex + 1) - todayIndex
}

/**
 * Format the contract end date. Noon UTC keeps the calendar day stable.
 */
export function formatContractDate(untilDate: string, locale: string): string {
  const [year, month, day] = dateParts(untilDate)
  const tag = locale === 'en' ? 'en-GB' : 'fr-FR'

  return new Intl.DateTimeFormat(tag, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC'
  }).format(new Date(Date.UTC(year, month - 1, day, 12)))
}

function dateParts(value: string): [number, number, number] {
  const [year = 0, month = 0, day = 0] = value.split('-').map(Number)

  return [year, month, day]
}

function calendarIndex(now: number, timeZone: string): number {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).formatToParts(new Date(now))

  const year = Number(parts.find(part => part.type === 'year')?.value)
  const month = Number(parts.find(part => part.type === 'month')?.value)
  const day = Number(parts.find(part => part.type === 'day')?.value)

  return Math.floor(Date.UTC(year, month - 1, day) / 86400000)
}
