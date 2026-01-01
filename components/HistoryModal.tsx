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
import {
  formatDate,
  getRelativeDate,
  formatWeekDate,
  formatMonthDate,
  formatYearDate,
} from '@/lib/dateUtils'
import type { HistoryEntry, Timeframe } from '@/lib/types'
import { cn } from '@/lib/utils'

interface HistoryModalProps {
  history: HistoryEntry[]
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

function getTimeframeBadgeClass(timeframe: Timeframe): string {
  switch (timeframe) {
    case 'day':
      return 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20'
    case 'week':
      return 'bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20'
    case 'month':
      return 'bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/20'
    case 'year':
      return 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20'
    default:
      return 'bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20'
  }
}

function getTimeframeLabel(timeframe: Timeframe): string {
  switch (timeframe) {
    case 'day':
      return 'Day'
    case 'week':
      return 'Week'
    case 'month':
      return 'Month'
    case 'year':
      return 'Year'
    default:
      return 'Period'
  }
}

function formatEntryDate(entry: HistoryEntry): string {
  switch (entry.timeframe) {
    case 'day':
      return formatDate(entry.date)
    case 'week':
      return formatWeekDate(entry.date)
    case 'month':
      return formatMonthDate(entry.date)
    case 'year':
      return formatYearDate(entry.date)
    default:
      return formatDate(entry.date)
  }
}

function getEntryTitle(entry: HistoryEntry): string {
  switch (entry.timeframe) {
    case 'day':
      return getRelativeDate(entry.date)
    case 'week':
      return formatWeekDate(entry.date)
    case 'month':
      return formatMonthDate(entry.date)
    case 'year':
      return formatYearDate(entry.date)
    default:
      return getRelativeDate(entry.date)
  }
}

export function HistoryModal({
  history,
  open,
  onOpenChange,
}: HistoryModalProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const isControlled = open !== undefined
  const dialogOpen = isControlled ? open : internalOpen
  const handleOpenChange = onOpenChange ?? setInternalOpen

  return (
    <Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
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
            View your past periods and completion status
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto pr-2 space-y-3 pb-2 px-1">
          {history.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No history yet.</p>
              <p className="text-sm mt-2">Past periods will appear here.</p>
            </div>
          ) : (
            history.map((entry) => (
              <Card
                key={`${entry.timeframe}-${entry.date}`}
                className="transition-all hover:shadow-md"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between gap-2">
                    <CardTitle className="text-base font-medium">
                      {getEntryTitle(entry)}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className={cn(getTimeframeBadgeClass(entry.timeframe))}
                      >
                        {getTimeframeLabel(entry.timeframe)}
                      </Badge>
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
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {formatEntryDate(entry)}
                  </div>
                </CardHeader>
                <CardContent className="pt-0 space-y-1.5">
                  {entry.tasks.map((task, index) => (
                    <div
                      key={task.id}
                      className={cn(
                        'flex items-start gap-2 text-xs',
                        task.completed && 'opacity-60'
                      )}
                    >
                      <span className="text-muted-foreground min-w-[16px]">
                        {index + 1}.
                      </span>
                      <span
                        className={cn(
                          'flex-1',
                          task.completed && 'line-through text-muted-foreground'
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
              </Card>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
