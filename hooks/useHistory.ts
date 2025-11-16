'use client';

import { useState, useEffect, useCallback } from 'react';
import { getStorageItem, setStorageItem } from '@/lib/storage';
import { STORAGE_KEYS, MAX_HISTORY_DAYS } from '@/lib/constants';
import { compareDates } from '@/lib/dateUtils';
import type { History, HistoryEntry, CurrentDay } from '@/lib/types';

/**
 * Hook for managing history of past days
 */
export function useHistory() {
  const [history, setHistory] = useState<History>([]);

  // Load history on mount
  useEffect(() => {
    const storedHistory = getStorageItem<History>(STORAGE_KEYS.HISTORY) ?? [];
    // Sort by date DESC (newest first)
    const sortedHistory = [...storedHistory].sort((a, b) => compareDates(a.date, b.date));
    setHistory(sortedHistory);
  }, []);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    if (history.length > 0) {
      setStorageItem(STORAGE_KEYS.HISTORY, history);
    }
  }, [history]);

  const addToHistory = useCallback((day: CurrentDay) => {
    const allCompleted = day.tasks.every((task) => task.completed);
    
    const entry: HistoryEntry = {
      date: day.date,
      tasks: day.tasks,
      completed: allCompleted,
      completedAt: day.completedAt,
    };

    setHistory((prev) => {
      // Check if entry for this date already exists
      const existingIndex = prev.findIndex((e) => e.date === entry.date);
      
      let updated: History;
      if (existingIndex >= 0) {
        // Update existing entry
        updated = [...prev];
        updated[existingIndex] = entry;
      } else {
        // Add new entry
        updated = [entry, ...prev];
      }

      // Sort by date DESC
      updated.sort((a, b) => compareDates(a.date, b.date));

      // Limit to MAX_HISTORY_DAYS
      if (updated.length > MAX_HISTORY_DAYS) {
        updated = updated.slice(0, MAX_HISTORY_DAYS);
      }

      return updated;
    });
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    setStorageItem(STORAGE_KEYS.HISTORY, []);
  }, []);

  // Archive current day to history (called on daily reset)
  const archiveCurrentDay = useCallback(() => {
    const storedDay = getStorageItem<CurrentDay>(STORAGE_KEYS.CURRENT_DAY);
    if (storedDay) {
      addToHistory(storedDay);
    }
  }, [addToHistory]);

  return {
    history,
    addToHistory,
    clearHistory,
    archiveCurrentDay,
  };
}

