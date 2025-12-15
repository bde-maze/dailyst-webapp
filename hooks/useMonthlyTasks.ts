'use client'

import { useState, useEffect, useCallback } from 'react'
import { getStorageItem, setStorageItem } from '@/lib/storage'
import { getCurrentMonth, isNewMonth } from '@/lib/dateUtils'
import { STORAGE_KEYS } from '@/lib/constants'
import type { CurrentDay, DayTask } from '@/lib/types'

/**
 * Hook for managing monthly tasks with automatic reset logic (1st of month reset)
 */
export function useMonthlyTasks(onArchive?: (day: CurrentDay) => void) {
  const [currentMonth, setCurrentMonth] = useState<CurrentDay | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)

  // Initialize and check for monthly reset
  useEffect(() => {
    const currentMonthId = getCurrentMonth()
    const lastResetMonth = getStorageItem<string>(STORAGE_KEYS.LAST_RESET_MONTH)
    const storedMonth = getStorageItem<CurrentDay>(STORAGE_KEYS.CURRENT_MONTH)

    // Check if we need to reset (new month - 1st)
    if (!lastResetMonth || isNewMonth(lastResetMonth)) {
      // If previous month exists, archive it to history (regardless of completion status)
      if (storedMonth && storedMonth.date !== currentMonthId && onArchive) {
        onArchive(storedMonth)
      }

      // Reset for new month
      setStorageItem(STORAGE_KEYS.LAST_RESET_MONTH, currentMonthId)
      setTimeout(() => {
        setCurrentMonth(null)
      }, 0)
    } else if (storedMonth && storedMonth.date === currentMonthId) {
      // Load current month's tasks
      setTimeout(() => {
        setCurrentMonth(storedMonth)
      }, 0)
    } else {
      // No tasks for current month
      setTimeout(() => {
        setCurrentMonth(null)
      }, 0)
    }

    setTimeout(() => {
      setIsInitialized(true)
    }, 0)
  }, [onArchive])

  // Save current month to localStorage whenever it changes and update history
  useEffect(() => {
    if (!isInitialized) return

    if (currentMonth) {
      setStorageItem(STORAGE_KEYS.CURRENT_MONTH, currentMonth)
      // Update history with current month (will add or update entry)
      if (onArchive) {
        onArchive(currentMonth)
      }
    } else {
      // Clear if null
      const storedMonth = getStorageItem<CurrentDay>(STORAGE_KEYS.CURRENT_MONTH)
      const currentMonthId = getCurrentMonth()
      if (storedMonth && storedMonth.date !== currentMonthId) {
        // Only clear if it's not current month's data
        setStorageItem(STORAGE_KEYS.CURRENT_MONTH, null)
      }
    }
  }, [currentMonth, isInitialized, onArchive])

  const setTasks = useCallback((tasks: DayTask[]) => {
    const currentMonthId = getCurrentMonth()
    const allCompleted = tasks.every((task) => task.completed)

    setCurrentMonth({
      date: currentMonthId,
      tasks,
      completedAt: allCompleted ? new Date().toISOString() : undefined,
    })
  }, [])

  const updateTask = useCallback(
    (taskId: string, updates: Partial<DayTask>) => {
      if (!currentMonth) return

      const updatedTasks = currentMonth.tasks.map((task) =>
        task.id === taskId ? { ...task, ...updates } : task
      )

      const allCompleted = updatedTasks.every((task) => task.completed)

      setCurrentMonth({
        ...currentMonth,
        tasks: updatedTasks,
        completedAt: allCompleted ? new Date().toISOString() : undefined,
      })
    },
    [currentMonth]
  )

  const toggleTask = useCallback(
    (taskId: string) => {
      if (!currentMonth) return

      const updatedTasks = currentMonth.tasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )

      const allCompleted = updatedTasks.every((task) => task.completed)

      setCurrentMonth({
        ...currentMonth,
        tasks: updatedTasks,
        completedAt: allCompleted ? new Date().toISOString() : undefined,
      })
    },
    [currentMonth]
  )

  const updateTaskText = useCallback(
    (taskId: string, text: string) => {
      if (!currentMonth) return

      const updatedTasks = currentMonth.tasks.map((task) =>
        task.id === taskId ? { ...task, text } : task
      )

      setCurrentMonth({
        ...currentMonth,
        tasks: updatedTasks,
      })
    },
    [currentMonth]
  )

  const isCompleted = currentMonth
    ? currentMonth.tasks.every((task) => task.completed)
    : false

  const resetMonth = useCallback(() => {
    setCurrentMonth(null)
    setStorageItem(STORAGE_KEYS.CURRENT_MONTH, null)
  }, [])

  return {
    tasks: currentMonth?.tasks ?? null,
    setTasks,
    updateTask,
    toggleTask,
    updateTaskText,
    isCompleted,
    resetMonth,
    isInitialized,
  }
}
