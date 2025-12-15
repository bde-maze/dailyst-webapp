/**
 * Get today's date in YYYY-MM-DD format (local timezone)
 */
export function getTodayDate(): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * Check if stored date matches today
 */
export function isToday(date: string): boolean {
  return date === getTodayDate()
}

/**
 * Compare dates for sorting (returns negative if a < b, positive if a > b, 0 if equal)
 */
export function compareDates(a: string, b: string): number {
  return b.localeCompare(a) // DESC order (newest first)
}

/**
 * Format date for display (e.g., "Mon, Jan 15")
 */
export function formatDate(date: string): string {
  const d = new Date(date + 'T00:00:00')
  return d.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })
}

/**
 * Get relative date string (e.g., "2 days ago", "Yesterday", "Today")
 */
export function getRelativeDate(date: string): string {
  const today = getTodayDate()
  if (date === today) return 'Today'

  const todayDate = new Date(today + 'T00:00:00')
  const targetDate = new Date(date + 'T00:00:00')
  const diffTime = todayDate.getTime() - targetDate.getTime()
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays === 1) return 'Yesterday'
  if (diffDays <= 7) return `${diffDays} days ago`
  return formatDate(date)
}

/**
 * Get the Monday of the current week in YYYY-MM-DD format
 */
export function getCurrentWeek(): string {
  const now = new Date()
  const day = now.getDay() // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  const diff = now.getDate() - day + (day === 0 ? -6 : 1) // Adjust to Monday
  const monday = new Date(now.getFullYear(), now.getMonth(), diff)
  const year = monday.getFullYear()
  const month = String(monday.getMonth() + 1).padStart(2, '0')
  const date = String(monday.getDate()).padStart(2, '0')
  return `${year}-${month}-${date}`
}

/**
 * Get the current month in YYYY-MM format
 */
export function getCurrentMonth(): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  return `${year}-${month}`
}

/**
 * Get the current year in YYYY format
 */
export function getCurrentYear(): string {
  return String(new Date().getFullYear())
}

/**
 * Check if it's a new week (Monday reset)
 */
export function isNewWeek(lastWeek: string): boolean {
  return lastWeek !== getCurrentWeek()
}

/**
 * Check if it's a new month (1st reset)
 */
export function isNewMonth(lastMonth: string): boolean {
  return lastMonth !== getCurrentMonth()
}

/**
 * Check if it's a new year (January 1st reset)
 */
export function isNewYear(lastYear: string): boolean {
  return lastYear !== getCurrentYear()
}

/**
 * Format week date for display (e.g., "Week of Jan 15")
 */
export function formatWeekDate(weekId: string): string {
  const d = new Date(weekId + 'T00:00:00')
  return `Week of ${d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })}`
}

/**
 * Format month date for display (e.g., "January 2024")
 */
export function formatMonthDate(monthId: string): string {
  const [year, month] = monthId.split('-')
  const date = new Date(parseInt(year), parseInt(month) - 1, 1)
  return date.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  })
}

/**
 * Format year date for display (e.g., "2024")
 */
export function formatYearDate(yearId: string): string {
  return yearId
}
