import { DashboardShell } from '@/components/dashboard-shell'
import { DocumentChecklist } from '@/components/borrower-journey'
import { getApplications } from '@/lib/api'

export default async function ChecklistPage() {
  const applications = await getApplications(1)
  const application = applications[0]

  return (
    <DashboardShell title="Document checklist" description="Track what is complete and what still needs attention before review.">
      {application ? (
        <DocumentChecklist application={application} />
      ) : (
        <div className="rounded-2xl border bg-card p-6 text-sm text-muted-foreground">
          No submitted application found.
        </div>
      )}
    </DashboardShell>
  )
}