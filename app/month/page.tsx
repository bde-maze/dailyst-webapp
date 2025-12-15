'use client'

import { useCallback } from 'react'
import { TaskForm } from '@/components/TaskForm'
import { TaskList } from '@/components/TaskList'
import { CompletedDay } from '@/components/CompletedDay'
import { Footer } from '@/components/Footer'
import { useMonthlyTasks } from '@/hooks/useMonthlyTasks'
import { useHistory } from '@/hooks/useHistory'

export default function MonthPage() {
  const { addToHistory } = useHistory()

  const handleArchive = useCallback(
    (day: Parameters<typeof addToHistory>[0]) => {
      addToHistory(day, 'month')
    },
    [addToHistory]
  )

  const {
    tasks,
    setTasks,
    toggleTask,
    updateTaskText,
    isCompleted,
    isInitialized,
  } = useMonthlyTasks(handleArchive)

  // Show loading state while initializing
  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Main Content */}
      <main className="container mx-auto px-4 pt-8 md:pt-12 flex-1">
        <div className="flex flex-col items-center">
          {!tasks ? (
            <TaskForm onSubmit={setTasks} timeframe="month" />
          ) : isCompleted ? (
            <CompletedDay tasks={tasks} onToggle={toggleTask} />
          ) : (
            <TaskList
              tasks={tasks}
              onToggle={toggleTask}
              onUpdate={updateTaskText}
              timeframe="month"
            />
          )}
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}
