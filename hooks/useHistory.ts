'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { getStorageItem, setStorageItem } from '@/lib/storage'
import { STORAGE_KEYS, MAX_HISTORY_DAYS } from '@/lib/constants'
import {
  compareDates,
  isToday,
  getCurrentWeek,
  getCurrentMonth,
  getCurrentYear,
} from '@/lib/dateUtils'
import type { History, HistoryEntry, CurrentDay, Timeframe } from '@/lib/types'

/**
 * Hook for managing history of past periods (day/week/month/year)
 */
export function useHistory() {
  const [history, setHistory] = useState<History>([])

  // Load history on mount and migrate old entries
  useEffect(() => {
    const storedHistory = getStorageItem<History>(STORAGE_KEYS.HISTORY) ?? []
    // Migrate old entries without timeframe to 'day'
    const migratedHistory = storedHistory.map((entry) => {
      if (!('timeframe' in entry)) {
        return {
          ...(entry as HistoryEntry),
          timeframe: 'day' as Timeframe,
        }
      }
      return entry
    })
    // Sort by date DESC (newest first)
    const sortedHistory = [...migratedHistory].sort((a, b) =>
      compareDates(a.date, b.date)
    )
    setTimeout(() => {
      setHistory(sortedHistory)
    }, 0)
  }, [])

  // Save history to localStorage whenever it changes
  useEffect(() => {
    if (history.length > 0) {
      setStorageItem(STORAGE_KEYS.HISTORY, history)
    }
  }, [history])

  const addToHistory = useCallback(
    (day: CurrentDay, timeframe: Timeframe = 'day') => {
      const allCompleted = day.tasks.every((task) => task.completed)

      const entry: HistoryEntry = {
        date: day.date,
        timeframe,
        tasks: day.tasks,
        completed: allCompleted,
        completedAt: day.completedAt,
      }

      setHistory((prev) => {
        // Check if entry for this date and timeframe already exists
        const existingIndex = prev.findIndex(
          (e) => e.date === entry.date && e.timeframe === entry.timeframe
        )

        let updated: History
        if (existingIndex >= 0) {
          // Update existing entry
          updated = [...prev]
          updated[existingIndex] = entry
        } else {
          // Add new entry
          updated = [entry, ...prev]
        }

        // Sort by date DESC
        updated.sort((a, b) => compareDates(a.date, b.date))

        // Limit to MAX_HISTORY_DAYS
        if (updated.length > MAX_HISTORY_DAYS) {
          updated = updated.slice(0, MAX_HISTORY_DAYS)
        }

        return updated
      })
    },
    []
  )

  const clearHistory = useCallback(() => {
    setHistory([])
    setStorageItem(STORAGE_KEYS.HISTORY, [])
  }, [])

  // Archive current day to history (called on daily reset)
  const archiveCurrentDay = useCallback(() => {
    const storedDay = getStorageItem<CurrentDay>(STORAGE_KEYS.CURRENT_DAY)
    if (storedDay) {
      addToHistory(storedDay, 'day')
    }
  }, [addToHistory])

  // Filter history to show only past periods (exclude current period)
  const pastHistory = useMemo(() => {
    const currentWeek = getCurrentWeek()
    const currentMonth = getCurrentMonth()
    const currentYear = getCurrentYear()

    return history.filter((entry) => {
      switch (entry.timeframe) {
        case 'day':
          return !isToday(entry.date)
        case 'week':
          return entry.date !== currentWeek
        case 'month':
          return entry.date !== currentMonth
        case 'year':
          return entry.date !== currentYear
        default:
          return true
      }
    })
  }, [history])

  return {
    history,
    pastHistory,
    addToHistory,
    clearHistory,
    archiveCurrentDay,
  }
}
