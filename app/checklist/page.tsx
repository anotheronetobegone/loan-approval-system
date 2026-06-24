// app/checklist/page.tsx
import { DashboardShell } from '@/components/dashboard-shell'
import { DocumentChecklist } from '@/components/borrower-journey'

export default function ChecklistPage() {
  return (
    <DashboardShell title="Document checklist" description="Track what is complete and what still needs attention before review.">
      <DocumentChecklist />
    </DashboardShell>
  )
}