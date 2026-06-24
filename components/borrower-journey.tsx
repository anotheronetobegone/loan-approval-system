// components/borrower-journey.tsx
'use client'

import Link from 'next/link'
import { ArrowRight, BadgeCheck, CheckCircle2, Circle, FileText, FileWarning, MessageSquareQuote, ShieldCheck, Sparkles, TrendingUp, Wallet2 } from 'lucide-react'
import { currentApplicant } from '@/lib/data'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Timeline } from '@/components/timeline'

function ScoreCard({ label, value, hint, tone = 'default' }: { label: string; value: string; hint?: string; tone?: 'default' | 'good' | 'warning' | 'danger' }) {
  const tones = {
    default: 'border-border bg-card',
    good: 'border-emerald-200 bg-emerald-50',
    warning: 'border-amber-200 bg-amber-50',
    danger: 'border-rose-200 bg-rose-50',
  }

  return (
    <div className={`rounded-2xl border p-4 shadow-sm ${tones[tone]}`}>
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="mt-2 text-2xl font-semibold tracking-tight">{value}</p>
        </div>
        <span className="rounded-full bg-background/70 p-2">
          <BadgeCheck className="size-4 text-muted-foreground" />
        </span>
      </div>
      {hint && <p className="mt-3 text-sm text-muted-foreground">{hint}</p>}
    </div>
  )
}

function ReasonChip({ label, tone = 'default' }: { label: string; tone?: 'default' | 'good' | 'warning' }) {
  const tones = {
    default: 'bg-muted text-muted-foreground',
    good: 'bg-emerald-50 text-emerald-700',
    warning: 'bg-amber-50 text-amber-700',
  }

  return <span className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${tones[tone]}`}>{label}</span>
}

function ChecklistItem({ label, done, hint }: { label: string; done: boolean; hint: string }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border bg-card p-3">
      {done ? <CheckCircle2 className="mt-0.5 size-5 text-emerald-600" /> : <Circle className="mt-0.5 size-5 text-muted-foreground" />}
      <div>
        <p className="text-sm font-medium">{label}</p>
        <p className="text-sm text-muted-foreground">{hint}</p>
      </div>
    </div>
  )
}

function RecommendationPanel({ title, items }: { title: string; items: string[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Sparkles className="size-4 text-primary" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        {items.map((item) => (
          <div key={item} className="rounded-lg border bg-background/70 p-3 text-sm text-muted-foreground">
            {item}
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

export function BorrowerOnboarding() {
  const steps = [
    'Consent to transparent underwriting',
    'Share work and education signals',
    'Receive a clear decision and next steps',
  ]

  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <Card>
        <CardHeader>
          <CardTitle>Welcome to BrightBridge</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="rounded-2xl border bg-gradient-to-br from-primary/10 via-background to-background p-5">
            <p className="text-sm font-medium text-primary">Youth-first lending</p>
            <h2 className="mt-2 text-2xl font-semibold">A clearer path to your first credit or first loan.</h2>
            <p className="mt-3 text-sm text-muted-foreground">We combine transparent scoring, explainable reasons, and a fix-and-resubmit workflow so young borrowers can understand and improve their outcome.</p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border bg-card p-3">
              <ShieldCheck className="size-4 text-primary" />
              <p className="mt-2 text-sm font-medium">Explainable decisions</p>
            </div>
            <div className="rounded-xl border bg-card p-3">
              <Sparkles className="size-4 text-primary" />
              <p className="mt-2 text-sm font-medium">First-loan mode</p>
            </div>
            <div className="rounded-xl border bg-card p-3">
              <Wallet2 className="size-4 text-primary" />
              <p className="mt-2 text-sm font-medium">Cash-flow underwriting</p>
            </div>
          </div>

          <div className="space-y-2">
            {steps.map((step) => (
              <ChecklistItem key={step} label={step} done={true} hint="Built for transparency and confidence" />
            ))}
          </div>

          <div className="flex flex-wrap gap-3">
            <Button render={<Link href="/apply" />}>
              Start application <ArrowRight className="size-4" />
            </Button>
            <Button variant="outline" render={<Link href="/readiness" />}>
              View readiness score
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>What you consent to</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-muted-foreground">
          <p>We use your income, education, career, and support signals to estimate readiness and explain any decision.</p>
          <p>Your credit score and trust score are shown separately so you can see what matters most.</p>
          <p>If a file needs more context, we may ask for a quick update instead of a hard rejection.</p>
          <div className="rounded-xl border bg-secondary/40 p-4">
            <p className="font-medium text-foreground">Borrower promise</p>
            <p className="mt-2">You can fix, resubmit, and receive targeted suggestions after a decision.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export function LoanReadinessScreen() {
  const app = currentApplicant.applications[0]

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
              <p className="mt-2 text-4xl font-semibold">{app.readinessScore}/100</p>
              <p className="mt-2 text-sm text-muted-foreground">This score blends cash flow, education/career signals, and your first-loan profile.</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <ScoreCard label="Credit score" value={String(app.creditScore)} hint="Strong but still building history" tone="good" />
              <ScoreCard label="Trust / fraud score" value={String(app.trustScore)} hint="Healthy digital and document trust" tone="good" />
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
        <RecommendationPanel title="Suggested next actions" items={app.improvementSuggestions} />
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

export function DecisionResults() {
  const app = currentApplicant.applications[0]

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
              <p className="mt-2 text-3xl font-semibold">{app.status}</p>
              <p className="mt-3 text-sm text-emerald-700">Approval probability: {app.approvalProbability}%</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <ScoreCard label="Readiness score" value={`${app.readinessScore}/100`} hint="Built for first-loan support" tone="good" />
              <ScoreCard label="Approval probability" value={`${app.approvalProbability}%`} hint="Transparent underwriting" tone="good" />
            </div>
            <div className="flex flex-wrap gap-2">
              {app.approvalReasons.map((reason) => (
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
            {app.rejectionReasons.length > 0 ? app.rejectionReasons.map((reason) => <ReasonChip key={reason} label={reason} tone="warning" />) : <p className="text-sm text-muted-foreground">No blockers at the moment.</p>}
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <RecommendationPanel title="Improvement suggestions" items={app.improvementSuggestions} />
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquareQuote className="size-4 text-primary" />
              Decision timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Timeline events={app.timeline} />
          </CardContent>
        </Card>
        <Button className="w-full" render={<Link href="/fix" />}>Fix and resubmit</Button>
      </div>
    </div>
  )
}

export function FixAndResubmit() {
  const app = currentApplicant.applications[0]

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
            <p className="mt-2 text-sm text-amber-700">Your case is still reviewable and the system gives targeted guidance instead of a dead end.</p>
          </div>

          <div className="space-y-3">
            {app.improvementSuggestions.map((item) => (
              <ChecklistItem key={item} label={item} done={false} hint="Add evidence and try again" />
            ))}
          </div>

          <Button className="w-full" render={<Link href="/checklist" />}>
            Review document checklist <ArrowRight className="size-4" />
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <RecommendationPanel title="Why this helps" items={["Stronger support signals make manual review easier", "Lower requested amount improves affordability", "A guarantor can boost trust score"]} />
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

export function DocumentChecklist() {
  const app = currentApplicant.applications[0]

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
          {app.documentChecklist.map((item) => (
            <ChecklistItem key={item.id} label={item.label} done={item.done} hint={item.hint} />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}