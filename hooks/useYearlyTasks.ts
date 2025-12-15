'use client'

import { useState, useEffect, useCallback } from 'react'
import { getStorageItem, setStorageItem } from '@/lib/storage'
import { getCurrentYear, isNewYear } from '@/lib/dateUtils'
import { STORAGE_KEYS } from '@/lib/constants'
import type { CurrentDay, DayTask } from '@/lib/types'

/**
 * Hook for managing yearly tasks with automatic reset logic (January 1st reset)
 */
export function useYearlyTasks(onArchive?: (day: CurrentDay) => void) {
  const [currentYear, setCurrentYear] = useState<CurrentDay | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)

  // Initialize and check for yearly reset
  useEffect(() => {
    const currentYearId = getCurrentYear()
    const lastResetYear = getStorageItem<string>(STORAGE_KEYS.LAST_RESET_YEAR)
    const storedYear = getStorageItem<CurrentDay>(STORAGE_KEYS.CURRENT_YEAR)

    // Check if we need to reset (new year - January 1st)
    if (!lastResetYear || isNewYear(lastResetYear)) {
      // If previous year exists, archive it to history (regardless of completion status)
      if (storedYear && storedYear.date !== currentYearId && onArchive) {
        onArchive(storedYear)
      }

      // Reset for new year
      setStorageItem(STORAGE_KEYS.LAST_RESET_YEAR, currentYearId)
      setTimeout(() => {
        setCurrentYear(null)
      }, 0)
    } else if (storedYear && storedYear.date === currentYearId) {
      // Load current year's tasks
      setTimeout(() => {
        setCurrentYear(storedYear)
      }, 0)
    } else {
      // No tasks for current year
      setTimeout(() => {
        setCurrentYear(null)
      }, 0)
    }

    setTimeout(() => {
      setIsInitialized(true)
    }, 0)
  }, [onArchive])

  // Save current year to localStorage whenever it changes and update history
  useEffect(() => {
    if (!isInitialized) return

    if (currentYear) {
      setStorageItem(STORAGE_KEYS.CURRENT_YEAR, currentYear)
      // Update history with current year (will add or update entry)
      if (onArchive) {
        onArchive(currentYear)
      }
    } else {
      // Clear if null
      const storedYear = getStorageItem<CurrentDay>(STORAGE_KEYS.CURRENT_YEAR)
      const currentYearId = getCurrentYear()
      if (storedYear && storedYear.date !== currentYearId) {
        // Only clear if it's not current year's data
        setStorageItem(STORAGE_KEYS.CURRENT_YEAR, null)
      }
    }
  }, [currentYear, isInitialized, onArchive])

  const setTasks = useCallback((tasks: DayTask[]) => {
    const currentYearId = getCurrentYear()
    const allCompleted = tasks.every((task) => task.completed)

    setCurrentYear({
      date: currentYearId,
      tasks,
      completedAt: allCompleted ? new Date().toISOString() : undefined,
    })
  }, [])

  const updateTask = useCallback(
    (taskId: string, updates: Partial<DayTask>) => {
      if (!currentYear) return

      const updatedTasks = currentYear.tasks.map((task) =>
        task.id === taskId ? { ...task, ...updates } : task
      )

      const allCompleted = updatedTasks.every((task) => task.completed)

      setCurrentYear({
        ...currentYear,
        tasks: updatedTasks,
        completedAt: allCompleted ? new Date().toISOString() : undefined,
      })
    },
    [currentYear]
  )

  const toggleTask = useCallback(
    (taskId: string) => {
      if (!currentYear) return

      const updatedTasks = currentYear.tasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )

      const allCompleted = updatedTasks.every((task) => task.completed)

      setCurrentYear({
        ...currentYear,
        tasks: updatedTasks,
        completedAt: allCompleted ? new Date().toISOString() : undefined,
      })
    },
    [currentYear]
  )

  const updateTaskText = useCallback(
    (taskId: string, text: string) => {
      if (!currentYear) return

      const updatedTasks = currentYear.tasks.map((task) =>
        task.id === taskId ? { ...task, text } : task
      )

      setCurrentYear({
        ...currentYear,
        tasks: updatedTasks,
      })
    },
    [currentYear]
  )

  const isCompleted = currentYear
    ? currentYear.tasks.every((task) => task.completed)
    : false

  const resetYear = useCallback(() => {
    setCurrentYear(null)
    setStorageItem(STORAGE_KEYS.CURRENT_YEAR, null)
  }, [])

  return {
    tasks: currentYear?.tasks ?? null,
    setTasks,
    updateTask,
    toggleTask,
    updateTaskText,
    isCompleted,
    resetYear,
    isInitialized,
  }
}
