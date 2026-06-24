import { cn } from '@/lib/utils'
import { statusLabels, type LoanStatus } from '@/lib/data'

const styles: Record<LoanStatus, string> = {
  draft: 'bg-muted text-muted-foreground ring-border',
  submitted: 'bg-sky-50 text-sky-700 ring-sky-200',
  'under-review': 'bg-amber-50 text-amber-700 ring-amber-200',
  'manual-review': 'bg-fuchsia-50 text-fuchsia-700 ring-fuchsia-200',
  'more-info-required': 'bg-violet-50 text-violet-700 ring-violet-200',
  approved: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  rejected: 'bg-red-50 text-red-700 ring-red-200',
  disbursed: 'bg-indigo-50 text-indigo-700 ring-indigo-200',
}

const dots: Record<LoanStatus, string> = {
  draft: 'bg-muted-foreground',
  submitted: 'bg-sky-500',
  'under-review': 'bg-amber-500',
  'manual-review': 'bg-fuchsia-500',
  'more-info-required': 'bg-violet-500',
  approved: 'bg-emerald-500',
  rejected: 'bg-red-500',
  disbursed: 'bg-indigo-500',
}

export function StatusBadge({
  status,
  className,
}: {
  status: LoanStatus
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset',
        styles[status],
        className,
      )}
    >
      <span className={cn('size-1.5 rounded-full', dots[status])} />
      {statusLabels[status]}
    </span>
  )
}