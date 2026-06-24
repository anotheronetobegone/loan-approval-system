import Link from 'next/link'
import { FilePlus2, Wallet, Percent, CalendarClock, FileText } from 'lucide-react'
import { DashboardShell } from '@/components/dashboard-shell'
import { StatCard } from '@/components/stat-card'
import { StatusBadge } from '@/components/status-badge'
import { Timeline } from '@/components/timeline'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { ApplicationsTable } from '@/components/applications-table'
import { getApplications } from '@/lib/api'
import { currency } from '@/lib/data'

export default async function ApplicantDashboardPage() {
  const applications = await getApplications(1)
  const active = applications[0]
  const totalBalance = applications.reduce((sum, app) => sum + app.amount, 0)
  const avgRate = applications.length
    ? `${(applications.reduce((sum, app) => sum + app.rate, 0) / applications.length).toFixed(1)}%`
    : '0.0%'
  const nextPayment = applications.length
    ? currency(Math.round(totalBalance / Math.max(applications.length, 1) / 12))
    : currency(0)
  const applicantName = active?.applicant.split(' ')[0] ?? 'Borrower'

  return (
    <DashboardShell
      title={`Welcome back, ${applicantName}`}
      description="Here's a snapshot of your lending activity."
      actions={
        <Button render={<Link href="/apply" />}>
          <FilePlus2 data-icon="inline-start" />
          New application
        </Button>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Active balance"
          value={currency(totalBalance)}
          icon={Wallet}
          delta="On track"
          hint="Across current loans"
        />
        <StatCard
          label="Avg. interest rate"
          value={avgRate}
          icon={Percent}
          hint="Weighted across loans"
        />
        <StatCard
          label="Next payment"
          value={nextPayment}
          icon={CalendarClock}
          hint="Estimate"
        />
        <StatCard
          label="Credit score"
          value={active ? String(active.creditScore) : '—'}
          icon={FileText}
          delta="+8 pts"
          hint="Most recent"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Your applications</CardTitle>
            <CardDescription>
              Track the status of every loan you&apos;ve requested.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {applications.map((app) => (
              <div
                key={app.id}
                className="flex flex-col gap-4 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-4">
                  <span className="flex size-11 items-center justify-center rounded-lg bg-secondary text-primary">
                    <FileText className="size-5" />
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{app.type} Loan</p>
                      <span className="font-mono text-xs text-muted-foreground">
                        {app.id}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {currency(app.amount)} · {app.termMonths} mo · {app.rate}% APR
                    </p>
                  </div>
                </div>
                <StatusBadge status={app.status} />
              </div>
            ))}

            <div className="rounded-lg border bg-secondary/40 p-4">
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="font-medium">Application progress</span>
                <span className="text-muted-foreground">3 of 5 steps</span>
              </div>
              <Progress value={60} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Status timeline</CardTitle>
            <CardDescription>
              {active?.type ?? 'Loan'} loan · {active?.id}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {active ? <Timeline events={active.timeline} /> : <p>No active application.</p>}
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  )
}