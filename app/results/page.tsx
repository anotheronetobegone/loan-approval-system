// app/results/page.tsx
import { DashboardShell } from '@/components/dashboard-shell'
import { DecisionResults } from '@/components/borrower-journey'

export default function ResultsPage() {
  return (
    <DashboardShell title="Decision results" description="Understand the reasons behind your result and the next actions available.">
      <DecisionResults />
    </DashboardShell>
  )
}