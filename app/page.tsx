'use client'

import { lazy, Suspense } from 'react'
import Image from 'next/image'
import { TaskForm } from '@/components/TaskForm'
import { TaskList } from '@/components/TaskList'
import { CompletedDay } from '@/components/CompletedDay'
import { ThemeToggle } from '@/components/ThemeToggle'
import { Footer } from '@/components/Footer'
import { useDailyTasks } from '@/hooks/useDailyTasks'
import { useHistory } from '@/hooks/useHistory'

// Lazy load HistoryModal as it's not critical for initial render
const HistoryModal = lazy(() =>
  import('@/components/HistoryModal').then((mod) => ({
    default: mod.HistoryModal,
  }))
)

export default function Home() {
  const { pastHistory, addToHistory } = useHistory()

  const {
    tasks,
    setTasks,
    toggleTask,
    updateTaskText,
    isCompleted,
    isInitialized,
  } = useDailyTasks(addToHistory)

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
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image
              src="/assets/images/logo-dailyst.png"
              alt="Dailyst"
              width={150}
              height={150}
              className="h-10 w-10 rounded-full"
              priority
            />
            <h1 className="text-xl font-semibold">DayList</h1>
          </div>
          <div className="flex items-center gap-2">
            <Suspense fallback={null}>
              <HistoryModal history={pastHistory} />
            </Suspense>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 pt-8 md:pt-12 flex-1">
        <div className="flex flex-col items-center">
          {!tasks ? (
            <TaskForm onSubmit={setTasks} />
          ) : isCompleted ? (
            <CompletedDay tasks={tasks} onToggle={toggleTask} />
          ) : (
            <TaskList
              tasks={tasks}
              onToggle={toggleTask}
              onUpdate={updateTaskText}
            />
          )}
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}
