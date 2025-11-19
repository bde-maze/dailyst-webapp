'use client'

import { useState, useEffect, useCallback } from 'react'
import { getStorageItem, setStorageItem } from '@/lib/storage'
import { getTodayDate, isToday } from '@/lib/dateUtils'
import { STORAGE_KEYS } from '@/lib/constants'
import type { CurrentDay, DayTask } from '@/lib/types'

/**
 * Hook for managing daily tasks with automatic reset logic
 */
export function useDailyTasks(onArchive?: (day: CurrentDay) => void) {
  const [currentDay, setCurrentDay] = useState<CurrentDay | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)

  // Initialize and check for daily reset
  useEffect(() => {
    const today = getTodayDate()
    const lastResetDate = getStorageItem<string>(STORAGE_KEYS.LAST_RESET_DATE)
    const storedDay = getStorageItem<CurrentDay>(STORAGE_KEYS.CURRENT_DAY)

    // Check if we need to reset (new day)
    if (!lastResetDate || lastResetDate !== today) {
      // If previous day exists, archive it to history (regardless of completion status)
      if (storedDay && storedDay.date !== today && onArchive) {
        onArchive(storedDay)
      }

      // Reset for new day
      setStorageItem(STORAGE_KEYS.LAST_RESET_DATE, today)
      setTimeout(() => {
        setCurrentDay(null)
      }, 0)
    } else if (storedDay && isToday(storedDay.date)) {
      // Load today's tasks
      setTimeout(() => {
        setCurrentDay(storedDay)
      }, 0)
    } else {
      // No tasks for today
      setTimeout(() => {
        setCurrentDay(null)
      }, 0)
    }

    setTimeout(() => {
      setIsInitialized(true)
    }, 0)
  }, [onArchive])

  // Save current day to localStorage whenever it changes and update history
  useEffect(() => {
    if (!isInitialized) return

    if (currentDay) {
      setStorageItem(STORAGE_KEYS.CURRENT_DAY, currentDay)
      // Update history with current day (will add or update entry)
      if (onArchive) {
        onArchive(currentDay)
      }
    } else {
      // Clear if null
      const storedDay = getStorageItem<CurrentDay>(STORAGE_KEYS.CURRENT_DAY)
      if (storedDay && !isToday(storedDay.date)) {
        // Only clear if it's not today's data
        setStorageItem(STORAGE_KEYS.CURRENT_DAY, null)
      }
    }
  }, [currentDay, isInitialized, onArchive])

  const setTasks = useCallback((tasks: DayTask[]) => {
    const today = getTodayDate()
    const allCompleted = tasks.every((task) => task.completed)

    setCurrentDay({
      date: today,
      tasks,
      completedAt: allCompleted ? new Date().toISOString() : undefined,
    })
  }, [])

  const updateTask = useCallback(
    (taskId: string, updates: Partial<DayTask>) => {
      if (!currentDay) return

      const updatedTasks = currentDay.tasks.map((task) =>
        task.id === taskId ? { ...task, ...updates } : task
      )

      const allCompleted = updatedTasks.every((task) => task.completed)

      setCurrentDay({
        ...currentDay,
        tasks: updatedTasks,
        completedAt: allCompleted ? new Date().toISOString() : undefined,
      })
    },
    [currentDay]
  )

  const toggleTask = useCallback(
    (taskId: string) => {
      if (!currentDay) return

      const updatedTasks = currentDay.tasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )

      const allCompleted = updatedTasks.every((task) => task.completed)

      setCurrentDay({
        ...currentDay,
        tasks: updatedTasks,
        completedAt: allCompleted ? new Date().toISOString() : undefined,
      })
    },
    [currentDay]
  )

  const updateTaskText = useCallback(
    (taskId: string, text: string) => {
      if (!currentDay) return

      const updatedTasks = currentDay.tasks.map((task) =>
        task.id === taskId ? { ...task, text } : task
      )

      setCurrentDay({
        ...currentDay,
        tasks: updatedTasks,
      })
    },
    [currentDay]
  )

  const isCompleted = currentDay
    ? currentDay.tasks.every((task) => task.completed)
    : false

  const resetDay = useCallback(() => {
    setCurrentDay(null)
    setStorageItem(STORAGE_KEYS.CURRENT_DAY, null)
  }, [])

  return {
    tasks: currentDay?.tasks ?? null,
    setTasks,
    updateTask,
    toggleTask,
    updateTaskText,
    isCompleted,
    resetDay,
    isInitialized,
  }
}
