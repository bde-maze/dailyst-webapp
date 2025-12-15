'use client'

import { useState, useEffect, useCallback } from 'react'
import { getStorageItem, setStorageItem } from '@/lib/storage'
import { getCurrentWeek, isNewWeek } from '@/lib/dateUtils'
import { STORAGE_KEYS } from '@/lib/constants'
import type { CurrentDay, DayTask } from '@/lib/types'

/**
 * Hook for managing weekly tasks with automatic reset logic (Monday reset)
 */
export function useWeeklyTasks(onArchive?: (day: CurrentDay) => void) {
  const [currentWeek, setCurrentWeek] = useState<CurrentDay | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)

  // Initialize and check for weekly reset
  useEffect(() => {
    const currentWeekId = getCurrentWeek()
    const lastResetWeek = getStorageItem<string>(STORAGE_KEYS.LAST_RESET_WEEK)
    const storedWeek = getStorageItem<CurrentDay>(STORAGE_KEYS.CURRENT_WEEK)

    // Check if we need to reset (new week - Monday)
    if (!lastResetWeek || isNewWeek(lastResetWeek)) {
      // If previous week exists, archive it to history (regardless of completion status)
      if (storedWeek && storedWeek.date !== currentWeekId && onArchive) {
        onArchive(storedWeek)
      }

      // Reset for new week
      setStorageItem(STORAGE_KEYS.LAST_RESET_WEEK, currentWeekId)
      setTimeout(() => {
        setCurrentWeek(null)
      }, 0)
    } else if (storedWeek && storedWeek.date === currentWeekId) {
      // Load current week's tasks
      setTimeout(() => {
        setCurrentWeek(storedWeek)
      }, 0)
    } else {
      // No tasks for current week
      setTimeout(() => {
        setCurrentWeek(null)
      }, 0)
    }

    setTimeout(() => {
      setIsInitialized(true)
    }, 0)
  }, [onArchive])

  // Save current week to localStorage whenever it changes and update history
  useEffect(() => {
    if (!isInitialized) return

    if (currentWeek) {
      setStorageItem(STORAGE_KEYS.CURRENT_WEEK, currentWeek)
      // Update history with current week (will add or update entry)
      if (onArchive) {
        onArchive(currentWeek)
      }
    } else {
      // Clear if null
      const storedWeek = getStorageItem<CurrentDay>(STORAGE_KEYS.CURRENT_WEEK)
      const currentWeekId = getCurrentWeek()
      if (storedWeek && storedWeek.date !== currentWeekId) {
        // Only clear if it's not current week's data
        setStorageItem(STORAGE_KEYS.CURRENT_WEEK, null)
      }
    }
  }, [currentWeek, isInitialized, onArchive])

  const setTasks = useCallback((tasks: DayTask[]) => {
    const currentWeekId = getCurrentWeek()
    const allCompleted = tasks.every((task) => task.completed)

    setCurrentWeek({
      date: currentWeekId,
      tasks,
      completedAt: allCompleted ? new Date().toISOString() : undefined,
    })
  }, [])

  const updateTask = useCallback(
    (taskId: string, updates: Partial<DayTask>) => {
      if (!currentWeek) return

      const updatedTasks = currentWeek.tasks.map((task) =>
        task.id === taskId ? { ...task, ...updates } : task
      )

      const allCompleted = updatedTasks.every((task) => task.completed)

      setCurrentWeek({
        ...currentWeek,
        tasks: updatedTasks,
        completedAt: allCompleted ? new Date().toISOString() : undefined,
      })
    },
    [currentWeek]
  )

  const toggleTask = useCallback(
    (taskId: string) => {
      if (!currentWeek) return

      const updatedTasks = currentWeek.tasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )

      const allCompleted = updatedTasks.every((task) => task.completed)

      setCurrentWeek({
        ...currentWeek,
        tasks: updatedTasks,
        completedAt: allCompleted ? new Date().toISOString() : undefined,
      })
    },
    [currentWeek]
  )

  const updateTaskText = useCallback(
    (taskId: string, text: string) => {
      if (!currentWeek) return

      const updatedTasks = currentWeek.tasks.map((task) =>
        task.id === taskId ? { ...task, text } : task
      )

      setCurrentWeek({
        ...currentWeek,
        tasks: updatedTasks,
      })
    },
    [currentWeek]
  )

  const isCompleted = currentWeek
    ? currentWeek.tasks.every((task) => task.completed)
    : false

  const resetWeek = useCallback(() => {
    setCurrentWeek(null)
    setStorageItem(STORAGE_KEYS.CURRENT_WEEK, null)
  }, [])

  return {
    tasks: currentWeek?.tasks ?? null,
    setTasks,
    updateTask,
    toggleTask,
    updateTaskText,
    isCompleted,
    resetWeek,
    isInitialized,
  }
}
