'use client'

import { useState, useEffect, useRef } from 'react'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import type { DayTask, Timeframe } from '@/lib/types'
import { cn } from '@/lib/utils'

interface TaskFormProps {
  onSubmit: (tasks: DayTask[]) => void
  timeframe?: Timeframe
}

function getTimeframeText(timeframe: Timeframe = 'day'): {
  title: string
  description: string
  resetText: string
} {
  switch (timeframe) {
    case 'day':
      return {
        title: 'What are your 3 most important things today?',
        description: 'Focus on what matters most. These will reset tomorrow.',
        resetText: 'tomorrow',
      }
    case 'week':
      return {
        title: 'What are your 3 most important things this week?',
        description:
          'Focus on what matters most. These will reset next Monday.',
        resetText: 'next Monday',
      }
    case 'month':
      return {
        title: 'What are your 3 most important things this month?',
        description: 'Focus on what matters most. These will reset on the 1st.',
        resetText: 'on the 1st',
      }
    case 'year':
      return {
        title: 'What are your 3 most important things this year?',
        description:
          'Focus on what matters most. These will reset on January 1st.',
        resetText: 'on January 1st',
      }
    default:
      return {
        title: 'What are your 3 most important things today?',
        description: 'Focus on what matters most. These will reset tomorrow.',
        resetText: 'tomorrow',
      }
  }
}

export function TaskForm({ onSubmit, timeframe = 'day' }: TaskFormProps) {
  const [task1, setTask1] = useState('')
  const [task2, setTask2] = useState('')
  const [task3, setTask3] = useState('')
  const [completed1, setCompleted1] = useState(false)
  const [completed2, setCompleted2] = useState(false)
  const [completed3, setCompleted3] = useState(false)

  const timeframeText = getTimeframeText(timeframe)

  // Use refs to maintain stable IDs
  const taskIdsRef = useRef({
    task1: `task-${Date.now()}-1`,
    task2: `task-${Date.now()}-2`,
    task3: `task-${Date.now()}-3`,
  })

  const createdAtRef = useRef(new Date().toISOString())

  // Store the latest onSubmit callback in a ref to avoid dependency issues
  const onSubmitRef = useRef(onSubmit)
  useEffect(() => {
    onSubmitRef.current = onSubmit
  }, [onSubmit])

  // Auto-save when tasks change
  useEffect(() => {
    const tasks: DayTask[] = [
      {
        id: taskIdsRef.current.task1,
        text: task1.trim(),
        completed: completed1,
        createdAt: createdAtRef.current,
      },
      {
        id: taskIdsRef.current.task2,
        text: task2.trim(),
        completed: completed2,
        createdAt: createdAtRef.current,
      },
      {
        id: taskIdsRef.current.task3,
        text: task3.trim(),
        completed: completed3,
        createdAt: createdAtRef.current,
      },
    ]

    // Only submit if at least one task has text
    if (task1.trim() || task2.trim() || task3.trim()) {
      onSubmitRef.current(tasks)
    }
  }, [task1, task2, task3, completed1, completed2, completed3])

  return (
    <div className="w-full max-w-2xl mx-auto space-y-10 animate-in fade-in-0 duration-300">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-semibold text-foreground tracking-tight">
          {timeframeText.title}
        </h2>
        <p className="text-lg text-muted-foreground">
          {timeframeText.description}
        </p>
      </div>

      <div className="space-y-5">
        {/* Task 1 */}
        <div className="flex items-start gap-5 group">
          <Checkbox
            id="task1-checkbox"
            checked={completed1}
            onCheckedChange={(checked) => setCompleted1(checked === true)}
            className="mt-2 size-6"
            disabled={!task1.trim()}
          />
          <div className="flex-1">
            <Input
              id="task1"
              type="text"
              placeholder="Enter your first important task..."
              value={task1}
              onChange={(e) => setTask1(e.target.value)}
              className={cn(
                'h-16 text-lg border-2 rounded-xl transition-all',
                'focus:border-primary/60 focus:ring-2 focus:ring-primary/20',
                'bg-background/50 hover:bg-background',
                completed1 && 'opacity-60 line-through decoration-2'
              )}
              autoFocus
            />
          </div>
        </div>

        {/* Task 2 */}
        <div className="flex items-start gap-5 group">
          <Checkbox
            id="task2-checkbox"
            checked={completed2}
            onCheckedChange={(checked) => setCompleted2(checked === true)}
            className="mt-2 size-6"
            disabled={!task2.trim()}
          />
          <div className="flex-1">
            <Input
              id="task2"
              type="text"
              placeholder="Enter your second important task..."
              value={task2}
              onChange={(e) => setTask2(e.target.value)}
              className={cn(
                'h-16 text-lg border-2 rounded-xl transition-all',
                'focus:border-primary/60 focus:ring-2 focus:ring-primary/20',
                'bg-background/50 hover:bg-background',
                completed2 && 'opacity-60 line-through decoration-2'
              )}
            />
          </div>
        </div>

        {/* Task 3 */}
        <div className="flex items-start gap-5 group">
          <Checkbox
            id="task3-checkbox"
            checked={completed3}
            onCheckedChange={(checked) => setCompleted3(checked === true)}
            className="mt-2 size-6"
            disabled={!task3.trim()}
          />
          <div className="flex-1">
            <Input
              id="task3"
              type="text"
              placeholder="Enter your third important task..."
              value={task3}
              onChange={(e) => setTask3(e.target.value)}
              className={cn(
                'h-16 text-lg border-2 rounded-xl transition-all',
                'focus:border-primary/60 focus:ring-2 focus:ring-primary/20',
                'bg-background/50 hover:bg-background',
                completed3 && 'opacity-60 line-through decoration-2'
              )}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
