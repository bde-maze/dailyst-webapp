'use client'

import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import type { DayTask, Timeframe } from '@/lib/types'
import { cn } from '@/lib/utils'

interface TaskListProps {
  tasks: DayTask[]
  onToggle: (taskId: string) => void
  onUpdate?: (taskId: string, text: string) => void
  timeframe?: Timeframe
}

function getFocusTitle(timeframe: Timeframe = 'day'): string {
  switch (timeframe) {
    case 'day':
      return "Today's Focus"
    case 'week':
      return "This Week's Focus"
    case 'month':
      return "This Month's Focus"
    case 'year':
      return "This Year's Focus"
    default:
      return "Today's Focus"
  }
}

export function TaskList({
  tasks,
  onToggle,
  onUpdate,
  timeframe = 'day',
}: TaskListProps) {
  const completedCount = tasks.filter((task) => task.completed).length

  return (
    <div className="w-full max-w-2xl mx-auto space-y-10 animate-in fade-in-0 duration-300">
      <div className="text-center space-y-3">
        <h2 className="text-4xl font-semibold text-foreground tracking-tight">
          {getFocusTitle(timeframe)}
        </h2>
        <p className="text-lg text-muted-foreground">
          {completedCount} of {tasks.length} completed
        </p>
      </div>

      <div className="space-y-4">
        {tasks.map((task, index) => (
          <div
            key={task.id}
            className={cn(
              'flex items-start gap-5 p-6 rounded-xl transition-all',
              'bg-linear-to-br from-background via-background to-muted/30',
              'border-2 border-transparent',
              'hover:border-primary/30 hover:shadow-lg hover:scale-[1.01]',
              task.completed && 'opacity-75'
            )}
          >
            <Checkbox
              id={task.id}
              checked={task.completed}
              onCheckedChange={() => onToggle(task.id)}
              className="mt-1 size-6"
              aria-label={`Mark task ${index + 1} as ${
                task.completed ? 'incomplete' : 'complete'
              }`}
            />
            <div className="flex-1">
              {onUpdate ? (
                <Input
                  value={task.text}
                  onChange={(e) => onUpdate(task.id, e.target.value)}
                  autoFocus={index === 0}
                  className={cn(
                    'h-auto text-lg border-0 border-b-2 border-primary/60 rounded-none bg-transparent p-0 focus-visible:ring-0 shadow-none',
                    'focus-visible:border-b-2 focus-visible:border-primary/60 focus-visible:rounded-none',
                    'focus-visible:pb-1',
                    task.completed &&
                      'line-through decoration-2 text-muted-foreground'
                  )}
                />
              ) : (
                <label
                  htmlFor={task.id}
                  className={cn(
                    'block text-lg leading-relaxed cursor-pointer select-none py-1',
                    task.completed &&
                      'line-through decoration-2 text-muted-foreground'
                  )}
                >
                  {task.text}
                </label>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
