/**
 * Get today's date in YYYY-MM-DD format (local timezone)
 */
export function getTodayDate(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Check if stored date matches today
 */
export function isToday(date: string): boolean {
  return date === getTodayDate();
}

/**
 * Compare dates for sorting (returns negative if a < b, positive if a > b, 0 if equal)
 */
export function compareDates(a: string, b: string): number {
  return b.localeCompare(a); // DESC order (newest first)
}

/**
 * Format date for display (e.g., "Mon, Jan 15")
 */
export function formatDate(date: string): string {
  const d = new Date(date + 'T00:00:00');
  return d.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Get relative date string (e.g., "2 days ago", "Yesterday", "Today")
 */
export function getRelativeDate(date: string): string {
  const today = getTodayDate();
  if (date === today) return 'Today';
  
  const todayDate = new Date(today + 'T00:00:00');
  const targetDate = new Date(date + 'T00:00:00');
  const diffTime = todayDate.getTime() - targetDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 1) return 'Yesterday';
  if (diffDays <= 7) return `${diffDays} days ago`;
  return formatDate(date);
}

