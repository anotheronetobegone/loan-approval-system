// app/readiness/page.tsx
import { DashboardShell } from '@/components/dashboard-shell'
import { LoanReadinessScreen } from '@/components/borrower-journey'

export default function ReadinessPage() {
  return (
    <DashboardShell title="Loan readiness" description="See the scorecard behind your application and what improves it.">
      <LoanReadinessScreen />
    </DashboardShell>
  )
}