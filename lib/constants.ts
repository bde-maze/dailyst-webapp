export const STORAGE_KEYS = {
  CURRENT_DAY: 'daylist:current-day',
  CURRENT_WEEK: 'daylist:current-week',
  CURRENT_MONTH: 'daylist:current-month',
  CURRENT_YEAR: 'daylist:current-year',
  HISTORY: 'daylist:history',
  LAST_RESET_DATE: 'daylist:last-reset-date',
  LAST_RESET_WEEK: 'daylist:last-reset-week',
  LAST_RESET_MONTH: 'daylist:last-reset-month',
  LAST_RESET_YEAR: 'daylist:last-reset-year',
} as const

export const MAX_HISTORY_DAYS = 90
