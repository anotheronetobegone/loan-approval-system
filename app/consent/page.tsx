// app/consent/page.tsx
import { DashboardShell } from '@/components/dashboard-shell'
import { BorrowerOnboarding } from '@/components/borrower-journey'

export default function ConsentPage() {
  return (
    <DashboardShell title="Borrower onboarding" description="Review the consent terms and understand how your score is built.">
      <BorrowerOnboarding />
    </DashboardShell>
  )
}