import Link from 'next/link'
import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  Circle,
  FileText,
  FileWarning,
  MessageSquareQuote,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Wallet2,
} from 'lucide-react'
import { type LoanApplication } from '@/lib/data'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Timeline } from '@/components/timeline'

export function LoanReadinessScreen({ application }: { application: LoanApplication }) {
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BadgeCheck className="size-5 text-primary" />
              Your loan readiness score
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5">
              <p className="text-sm text-muted-foreground">Current readiness</p>
              <p className="mt-2 text-4xl font-semibold">{application.readinessScore}/100</p>
              <p className="mt-2 text-sm text-muted-foreground">
                This score blends cash flow, education/career signals, and your first-loan profile.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <ScoreCard label="Credit score" value={String(application.creditScore)} hint="Strong but still building history" tone="good" />
              <ScoreCard label="Trust / fraud score" value={String(application.trustScore)} hint="Healthy digital and document trust" tone="good" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Why this score moved</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <ReasonChip label="Stable monthly surplus" tone="good" />
            <ReasonChip label="Career signal improving" tone="good" />
            <ReasonChip label="First-loan support available" tone="good" />
            <ReasonChip label="Document checklist nearly complete" tone="warning" />
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <RecommendationPanel title="Suggested next actions" items={application.improvementSuggestions} />
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="size-4 text-primary" />
              What improves your score
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>Upload a signed offer letter or training completion badge.</p>
            <p>Add a co-applicant or guarantor and show 2–3 months of consistent income.</p>
            <p>Keep the requested amount close to your surplus so underwriting stays comfortable.</p>
            <Button className="w-full" render={<Link href="/fix" />}>
              Open fix-and-resubmit <ArrowRight className="size-4" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export function DecisionResults({ application }: { application: LoanApplication }) {
  return (
    <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="size-5 text-primary" />
              Explainable decision
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
              <p className="text-sm text-emerald-700">Status</p>
              <p className="mt-2 text-3xl font-semibold">{application.status}</p>
              <p className="mt-3 text-sm text-emerald-700">Approval probability: {application.approvalProbability}%</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <ScoreCard label="Readiness score" value={`${application.readinessScore}/100`} hint="Built for first-loan support" tone="good" />
              <ScoreCard label="Approval probability" value={`${application.approvalProbability}%`} hint="Transparent underwriting" tone="good" />
            </div>
            <div className="flex flex-wrap gap-2">
              {application.approvalReasons.map((reason) => (
                <ReasonChip key={reason} label={reason} tone="good" />
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileWarning className="size-4 text-amber-600" />
              Why we may still ask for more info
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {application.rejectionReasons.length > 0 ? (
              application.rejectionReasons.map((reason) => <ReasonChip key={reason} label={reason} tone="warning" />)
            ) : (
              <p className="text-sm text-muted-foreground">No blockers at the moment.</p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <RecommendationPanel title="Improvement suggestions" items={application.improvementSuggestions} />
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquareQuote className="size-4 text-primary" />
              Decision timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Timeline events={application.timeline} />
          </CardContent>
        </Card>
        <Button className="w-full" render={<Link href="/fix" />}>
          Fix and resubmit
        </Button>
      </div>
    </div>
  )
}

export function FixAndResubmit({ application }: { application: LoanApplication }) {
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="size-5 text-primary" />
            Fix and resubmit journey
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
            <p className="text-sm font-medium text-amber-700">We found a few areas to strengthen</p>
            <p className="mt-2 text-sm text-amber-700">
              Your case is still reviewable and the system gives targeted guidance instead of a dead end.
            </p>
          </div>
          <div className="space-y-3">
            {application.improvementSuggestions.map((item) => (
              <ChecklistItem key={item} label={item} done={false} hint="Add evidence and try again" />
            ))}
          </div>
          <Button className="w-full" render={<Link href="/checklist" />}>
            Review document checklist <ArrowRight className="size-4" />
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <RecommendationPanel
          title="Why this helps"
          items={[
            'Stronger support signals make manual review easier',
            'Lower requested amount improves affordability',
            'A guarantor can boost trust score',
          ]}
        />
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="size-4 text-primary" />
              Transparency built in
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>We show the exact reasons that moved the score and what to change next.</p>
            <p>Your application can be updated without starting from scratch.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export function DocumentChecklist({ application }: { application: LoanApplication }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="size-5 text-primary" />
          Document checklist
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
          <div className="flex items-center gap-2 text-emerald-700">
            <CheckCircle2 className="size-4" />
            <p className="text-sm font-medium">Your file is nearly ready for review</p>
          </div>
        </div>

        <div className="space-y-3">
          {application.documentChecklist.map((item) => (
            <ChecklistItem key={item.id} label={item.label} done={item.done} hint={item.hint} />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}