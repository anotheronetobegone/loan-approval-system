import { DashboardShell } from '@/components/dashboard-shell'
import { FixAndResubmit } from '@/components/borrower-journey'
import { getApplications } from '@/lib/api'

export default async function FixPage() {
  const applications = await getApplications(1)
  const application = applications[0]

  return (
    <DashboardShell title="Fix and resubmit" description="Review your most recent application and update the signal areas that matter most.">
      {application ? (
        <FixAndResubmit application={application} />
      ) : (
        <div className="rounded-2xl border bg-card p-6 text-sm text-muted-foreground">
          No submitted application found.
        </div>
      )}
    </DashboardShell>
  )
}