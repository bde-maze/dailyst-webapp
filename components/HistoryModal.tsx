'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { History } from 'lucide-react'
import { formatDate, getRelativeDate } from '@/lib/dateUtils'
import type { HistoryEntry } from '@/lib/types'
import { cn } from '@/lib/utils'

interface HistoryModalProps {
  history: HistoryEntry[]
}

export function HistoryModal({ history }: HistoryModalProps) {
  const [open, setOpen] = useState(false)
  const [expandedDate, setExpandedDate] = useState<string | null>(null)

  const toggleExpand = (date: string) => {
    setExpandedDate(expandedDate === date ? null : date)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="size-9"
          aria-label="View history"
        >
          <History className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>History</DialogTitle>
          <DialogDescription>
            View your past days and completion status
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto pr-2 space-y-3">
          {history.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No history yet.</p>
              <p className="text-sm mt-2">Complete days will appear here.</p>
            </div>
          ) : (
            history.map((entry) => (
              <Card
                key={entry.date}
                className={cn(
                  'cursor-pointer transition-all hover:shadow-md',
                  expandedDate === entry.date && 'ring-2 ring-ring'
                )}
                onClick={() => toggleExpand(entry.date)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-medium">
                      {getRelativeDate(entry.date)}
                    </CardTitle>
                    <Badge
                      variant={entry.completed ? 'default' : 'outline'}
                      className={cn(
                        entry.completed
                          ? 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20'
                          : 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20'
                      )}
                    >
                      {entry.completed ? 'Completed' : 'Incomplete'}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {formatDate(entry.date)}
                  </div>
                </CardHeader>
                {expandedDate === entry.date && (
                  <CardContent className="pt-0 space-y-2">
                    {entry.tasks.map((task, index) => (
                      <div
                        key={task.id}
                        className={cn(
                          'flex items-start gap-2 p-2 rounded text-sm',
                          task.completed && 'opacity-60'
                        )}
                      >
                        <span className="text-muted-foreground min-w-[20px]">
                          {index + 1}.
                        </span>
                        <span
                          className={cn(
                            'flex-1',
                            task.completed &&
                              'line-through text-muted-foreground'
                          )}
                        >
                          {task.text}
                        </span>
                        {task.completed && (
                          <span className="text-green-600 dark:text-green-400 text-xs">
                            ✓
                          </span>
                        )}
                      </div>
                    ))}
                  </CardContent>
                )}
              </Card>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
