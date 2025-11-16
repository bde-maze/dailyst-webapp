'use client';

import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import type { DayTask } from '@/lib/types';
import { cn } from '@/lib/utils';

interface TaskFormProps {
  onSubmit: (tasks: DayTask[]) => void;
}

export function TaskForm({ onSubmit }: TaskFormProps) {
  const [task1, setTask1] = useState('');
  const [task2, setTask2] = useState('');
  const [task3, setTask3] = useState('');
  const [completed1, setCompleted1] = useState(false);
  const [completed2, setCompleted2] = useState(false);
  const [completed3, setCompleted3] = useState(false);
  
  // Use refs to maintain stable IDs
  const taskIdsRef = useRef({
    task1: `task-${Date.now()}-1`,
    task2: `task-${Date.now()}-2`,
    task3: `task-${Date.now()}-3`,
  });
  
  const createdAtRef = useRef(new Date().toISOString());

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
    ];

    // Only submit if at least one task has text
    if (task1.trim() || task2.trim() || task3.trim()) {
      onSubmit(tasks);
    }
  }, [task1, task2, task3, completed1, completed2, completed3, onSubmit]);

  return (
    <div className="w-full max-w-2xl mx-auto space-y-10 animate-in fade-in-0 duration-300">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-semibold text-foreground tracking-tight">
          What are your 3 most important things today?
        </h2>
        <p className="text-lg text-muted-foreground">
          Focus on what matters most. These will reset tomorrow.
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
  );
}
