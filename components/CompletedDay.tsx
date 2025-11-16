'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { CheckCircle2 } from 'lucide-react';
import type { DayTask } from '@/lib/types';
import { cn } from '@/lib/utils';

interface CompletedDayProps {
  tasks: DayTask[];
  onToggle: (taskId: string) => void;
}

export function CompletedDay({ tasks, onToggle }: CompletedDayProps) {
  return (
    <div className="w-full max-w-2xl mx-auto space-y-10 animate-in fade-in-0 zoom-in-95 duration-300">
      <div className="text-center space-y-5">
        <div className="flex justify-center animate-in zoom-in-50 duration-500">
          <div className="rounded-full bg-gradient-to-br from-primary/25 to-primary/15 p-8 shadow-lg">
            <CheckCircle2 className="size-20 text-primary" />
          </div>
        </div>
        <h2 className="text-5xl font-semibold text-foreground tracking-tight">
          Day Completed!
        </h2>
        <p className="text-xl text-muted-foreground">
          You've completed all 3 important tasks today. Great work!
        </p>
      </div>

      <div className="space-y-4">
        {tasks.map((task, index) => (
          <div
            key={task.id}
            className={cn(
              'flex items-start gap-5 p-6 rounded-xl transition-all',
              'bg-gradient-to-br from-primary/10 via-primary/5 to-primary/10',
              'border-2 border-primary/25',
              'hover:border-primary/40 hover:shadow-xl hover:scale-[1.01]'
            )}
          >
            <Checkbox
              id={task.id}
              checked={task.completed}
              onCheckedChange={() => onToggle(task.id)}
              className="mt-1 size-6"
              aria-label={`Mark task ${index + 1} as incomplete`}
            />
            <label
              htmlFor={task.id}
              className={cn(
                'flex-1 text-lg leading-relaxed cursor-pointer select-none py-1',
                'line-through decoration-2 text-muted-foreground'
              )}
            >
              {task.text}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}
