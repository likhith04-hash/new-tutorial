/** Shared date helpers. All app dates are ISO `YYYY-MM-DD` strings. */

export function toISODate(d: Date): string {
  return d.toISOString().slice(0, 10)
}

export function todayISO(): string {
  return toISODate(new Date())
}

export function daysAgoISO(n: number): string {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return toISODate(d)
}

/** ISO dates for the last `count` days, oldest first, ending today. */
export function lastNDays(count: number): string[] {
  return Array.from({ length: count }, (_, i) => daysAgoISO(count - 1 - i))
}

/** Parses an ISO date at midday so timezone offsets cannot shift the day. */
export function parseISODate(date: string): Date {
  return new Date(`${date}T12:00:00`)
}

export function shortWeekday(date: string): string {
  return parseISODate(date).toLocaleDateString('en-US', { weekday: 'short' })
}

export function longDateLabel(date: string): string {
  return parseISODate(date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
}

export function shiftISODate(date: string, days: number): string {
  const d = parseISODate(date)
  d.setDate(d.getDate() + days)
  return toISODate(d)
}

export function firstName(fullName: string): string {
  return (fullName || '').trim().split(/\s+/)[0] || 'Friend'
}
