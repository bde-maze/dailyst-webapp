/**
 * Type definitions for the Dailyst app
 */

export type Timeframe = 'day' | 'week' | 'month' | 'year'

export interface DayTask {
  id: string // UUID or timestamp-based
  text: string // Task description
  completed: boolean // Completion status
  createdAt: string // ISO date string
}

export interface CurrentDay {
  date: string // YYYY-MM-DD format (local timezone)
  tasks: DayTask[] // Array of 3 tasks
  completedAt?: string // ISO timestamp when all tasks completed
}

export interface HistoryEntry {
  date: string // Period identifier (YYYY-MM-DD for day, YYYY-MM-DD for week Monday, YYYY-MM for month, YYYY for year)
  timeframe: Timeframe // Type of period
  tasks: DayTask[]
  completed: boolean // Whether all tasks were completed
  completedAt?: string // ISO timestamp
}

export type History = HistoryEntry[]
