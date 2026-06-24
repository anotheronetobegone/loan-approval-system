// app/fix/page.tsx
import { DashboardShell } from '@/components/dashboard-shell'
import { FixAndResubmit } from '@/components/borrower-journey'

export default function FixPage() {
  return (
    <DashboardShell title="Fix and resubmit" description="Strengthen your application with guided actions and transparent feedback.">
      <FixAndResubmit />
    </DashboardShell>
  )
}