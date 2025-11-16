/**
 * Type definitions for the Dailyst app
 */

export interface DayTask {
  id: string;           // UUID or timestamp-based
  text: string;         // Task description
  completed: boolean;   // Completion status
  createdAt: string;    // ISO date string
}

export interface CurrentDay {
  date: string;         // YYYY-MM-DD format (local timezone)
  tasks: DayTask[];     // Array of 3 tasks
  completedAt?: string; // ISO timestamp when all tasks completed
}

export interface HistoryEntry {
  date: string;         // YYYY-MM-DD
  tasks: DayTask[];
  completed: boolean;   // Whether all tasks were completed
  completedAt?: string; // ISO timestamp
}

export type History = HistoryEntry[];

