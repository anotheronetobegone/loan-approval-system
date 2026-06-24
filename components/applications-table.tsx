'use client'

import { useState } from 'react'
import { MoreHorizontal, ArrowUpDown } from 'lucide-react'
import {
  applications as allApplications,
  currency,
  type LoanApplication,
} from '@/lib/data'
import { StatusBadge } from '@/components/status-badge'
import { ApplicationDetail } from '@/components/application-detail'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

function initials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
}

function ReadinessMeter({ score }: { score: number }) {
  const tone =
    score < 50 ? 'bg-amber-500' : score < 80 ? 'bg-emerald-500' : 'bg-primary'

  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-muted">
        <div className={`h-full rounded-full ${tone}`} style={{ width: `${score}%` }} />
      </div>
      <span className="text-xs tabular-nums text-muted-foreground">{score}</span>
    </div>
  )
}

export function ApplicationsTable({
  data = allApplications,
  showOfficer = true,
}: {
  data?: LoanApplication[]
  showOfficer?: boolean
}) {
  const [selected, setSelected] = useState<LoanApplication | null>(null)
  const [open, setOpen] = useState(false)

  function openDetail(app: LoanApplication) {
    setSelected(app)
    setOpen(true)
  }

  return (
    <>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="min-w-[180px]">
                <span className="inline-flex items-center gap-1">
                  Applicant <ArrowUpDown className="size-3 text-muted-foreground" />
                </span>
              </TableHead>
              <TableHead>ID</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden md:table-cell">Readiness</TableHead>
              {showOfficer && (
                <TableHead className="hidden lg:table-cell">Officer</TableHead>
              )}
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>

          <TableBody>
            {data.map((app) => (
              <TableRow
                key={app.id}
                className="cursor-pointer"
                onClick={() => openDetail(app)}
              >
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="size-8">
                      <AvatarFallback className="bg-secondary text-xs font-medium text-secondary-foreground">
                        {initials(app.applicant)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="leading-tight">
                      <p className="text-sm font-medium">{app.applicant}</p>
                      <p className="text-xs text-muted-foreground">{app.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="font-mono text-xs text-muted-foreground">
                  {app.id}
                </TableCell>
                <TableCell className="text-sm">{app.type}</TableCell>
                <TableCell className="text-right text-sm font-medium tabular-nums">
                  {currency(app.amount)}
                </TableCell>
                <TableCell>
                  <StatusBadge status={app.status} />
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <ReadinessMeter score={app.readinessScore} />
                </TableCell>
                {showOfficer && (
                  <TableCell className="hidden text-sm text-muted-foreground lg:table-cell">
                    {app.officer}
                  </TableCell>
                )}
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8"
                    aria-label="Row actions"
                    onClick={(e) => {
                      e.stopPropagation()
                      openDetail(app)
                    }}
                  >
                    <MoreHorizontal className="size-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <ApplicationDetail
        application={selected}
        open={open}
        onOpenChange={setOpen}
      />
    </>
  )
}