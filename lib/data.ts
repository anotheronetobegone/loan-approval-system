export type LoanStatus =
  | 'draft'
  | 'submitted'
  | 'under-review'
  | 'manual-review'
  | 'more-info-required'
  | 'approved'
  | 'rejected'
  | 'disbursed'

export type LoanType = 'Personal' | 'Home' | 'Auto' | 'Business' | 'Education'

export interface TimelineEvent {
  id: string
  label: string
  description: string
  date: string
  status: 'complete' | 'current' | 'upcoming'
}

export interface ChecklistItem {
  id: string
  label: string
  done: boolean
  hint: string
}

export interface CoApplicant {
  name: string
  relationship: string
  income: number
  creditScore: number
}

export interface CashFlowSnapshot {
  monthlyIncome: number
  monthlyExpenses: number
  surplus: number
  stability: 'stable' | 'tight' | 'variable'
}

export interface LoanApplication {
  id: string
  applicant: string
  email: string
  type: LoanType
  amount: number
  termMonths: number
  rate: number
  status: LoanStatus
  creditScore: number
  trustScore: number
  readinessScore: number
  approvalProbability: number
  income: number
  submittedAt: string
  purpose: string
  officer: string
  riskScore: number
  timeline: TimelineEvent[]
  approvalReasons: string[]
  rejectionReasons: string[]
  improvementSuggestions: string[]
  manualReview: boolean
  profileType: 'first-time' | 'salaried' | 'freelancer' | 'borderline' | 'rejected'
  coApplicant?: CoApplicant
  cashFlow: CashFlowSnapshot
  educationSignal: string
  careerSignal: string
  documentChecklist: ChecklistItem[]
  consent: boolean
}

export const currency = (value: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)

export const statusLabels: Record<LoanStatus, string> = {
  draft: 'Draft',
  submitted: 'Submitted',
  'under-review': 'Under Review',
  'manual-review': 'Manual Review',
  'more-info-required': 'More Info Needed',
  approved: 'Approved',
  rejected: 'Rejected',
  disbursed: 'Disbursed',
}

function makeTimeline(stage: number): TimelineEvent[] {
  const base: Omit<TimelineEvent, 'status'>[] = [
    {
      id: 't1',
      label: 'Consent and onboarding',
      description: 'Borrower shared consent and explained the purpose of the loan.',
      date: 'Mar 02, 2025',
    },
    {
      id: 't2',
      label: 'Document check',
      description: 'Pay stubs, identity, and support signals were reviewed.',
      date: 'Mar 04, 2025',
    },
    {
      id: 't3',
      label: 'Scorecard review',
      description: 'Readiness, credit, and trust signals were combined into a scorecard.',
      date: 'Mar 06, 2025',
    },
    {
      id: 't4',
      label: 'Officer review',
      description: 'A reviewer checked the borderline case and suggested improvements.',
      date: 'Mar 08, 2025',
    },
    {
      id: 't5',
      label: 'Decision ready',
      description: 'Borrower receives explainable reasons and next steps.',
      date: 'Pending',
    },
  ]

  return base.map((e, i) => ({
    ...e,
    status: i < stage ? 'complete' : i === stage ? 'current' : 'upcoming',
  }))
}

const checklistBase: ChecklistItem[] = [
  { id: 'c1', label: 'Consent shared', done: true, hint: 'Borrower agreed to transparent underwriting.' },
  { id: 'c2', label: 'Income proof uploaded', done: true, hint: 'Recent payslip or invoice included.' },
  { id: 'c3', label: 'Identity verified', done: true, hint: 'Government ID and selfie reviewed.' },
  { id: 'c4', label: 'Career signal added', done: false, hint: 'Add offer letter or training evidence.' },
]

export const applications: LoanApplication[] = [
  {
    id: 'YN-48213',
    applicant: 'Amara Okafor',
    email: 'amara.okafor@example.com',
    type: 'Education',
    amount: 5200,
    termMonths: 24,
    rate: 8.4,
    status: 'manual-review',
    creditScore: 712,
    trustScore: 84,
    readinessScore: 81,
    approvalProbability: 74,
    income: 3200,
    submittedAt: 'Mar 02, 2025',
    purpose: 'Career transition and first credit support',
    officer: 'J. Mensah',
    riskScore: 38,
    timeline: makeTimeline(3),
    approvalReasons: ['Strong early-career signal', 'Stable cash flow after rent', 'First-loan mode supported'],
    rejectionReasons: [],
    improvementSuggestions: ['Share internship offer letter', 'Add a guarantor statement'],
    manualReview: true,
    profileType: 'first-time',
    coApplicant: { name: 'Mina Okafor', relationship: 'Sister', income: 3600, creditScore: 748 },
    cashFlow: { monthlyIncome: 3200, monthlyExpenses: 2450, surplus: 750, stability: 'stable' },
    educationSignal: 'Coding bootcamp graduate',
    careerSignal: 'Operations analyst role starting next month',
    documentChecklist: checklistBase.map((item, index) => ({ ...item, done: index < 3 })),
    consent: true,
  },
  {
    id: 'YN-48190',
    applicant: 'Daniel Reyes',
    email: 'daniel.reyes@example.com',
    type: 'Personal',
    amount: 8400,
    termMonths: 18,
    rate: 9.2,
    status: 'approved',
    creditScore: 781,
    trustScore: 88,
    readinessScore: 89,
    approvalProbability: 91,
    income: 4200,
    submittedAt: 'Feb 27, 2025',
    purpose: 'Relocation and certification',
    officer: 'L. Chen',
    riskScore: 21,
    timeline: makeTimeline(4),
    approvalReasons: ['Salaried income with clear surplus', 'Low debt burden', 'Education support evidence'],
    rejectionReasons: [],
    improvementSuggestions: [],
    manualReview: false,
    profileType: 'salaried',
    cashFlow: { monthlyIncome: 4200, monthlyExpenses: 2680, surplus: 1520, stability: 'stable' },
    educationSignal: 'Certified digital marketer',
    careerSignal: 'Full-time customer success role',
    documentChecklist: checklistBase.map((item) => ({ ...item, done: true })),
    consent: true,
  },
  {
    id: 'YN-48155',
    applicant: 'Priya Nair',
    email: 'priya.nair@example.com',
    type: 'Business',
    amount: 11800,
    termMonths: 24,
    rate: 10.1,
    status: 'under-review',
    creditScore: 693,
    trustScore: 74,
    readinessScore: 68,
    approvalProbability: 62,
    income: 2800,
    submittedAt: 'Mar 05, 2025',
    purpose: 'Freelance equipment and client tooling',
    officer: 'Unassigned',
    riskScore: 57,
    timeline: makeTimeline(2),
    approvalReasons: ['Cash-flow signal is improving', 'Recent invoices show consistent work'],
    rejectionReasons: ['Income varies month to month'],
    improvementSuggestions: ['Add 3 months of invoice history', 'Add a guarantor or co-applicant'],
    manualReview: false,
    profileType: 'freelancer',
    cashFlow: { monthlyIncome: 2800, monthlyExpenses: 2400, surplus: 400, stability: 'variable' },
    educationSignal: 'Design certificate in progress',
    careerSignal: 'Independent design projects',
    documentChecklist: checklistBase.map((item, index) => ({ ...item, done: index < 2 })),
    consent: true,
  },
  {
    id: 'YN-48099',
    applicant: 'Marcus Bauer',
    email: 'marcus.bauer@example.com',
    type: 'Personal',
    amount: 13200,
    termMonths: 30,
    rate: 12.1,
    status: 'more-info-required',
    creditScore: 618,
    trustScore: 61,
    readinessScore: 49,
    approvalProbability: 38,
    income: 2600,
    submittedAt: 'Feb 20, 2025',
    purpose: 'Short-term gap funding',
    officer: 'J. Mensah',
    riskScore: 77,
    timeline: makeTimeline(4),
    approvalReasons: [],
    rejectionReasons: ['Borderline cash-flow coverage', 'Limited credit history'],
    improvementSuggestions: ['Add co-applicant', 'Upload a recent offer letter', 'Reduce requested amount'],
    manualReview: true,
    profileType: 'borderline',
    cashFlow: { monthlyIncome: 2600, monthlyExpenses: 2550, surplus: 50, stability: 'tight' },
    educationSignal: 'Part-time college student',
    careerSignal: 'Contract support role',
    documentChecklist: checklistBase.map((item, index) => ({ ...item, done: index < 1 })),
    consent: true,
  },
  {
    id: 'YN-48041',
    applicant: 'Sofia Russo',
    email: 'sofia.russo@example.com',
    type: 'Education',
    amount: 9600,
    termMonths: 24,
    rate: 9.8,
    status: 'rejected',
    creditScore: 645,
    trustScore: 58,
    readinessScore: 42,
    approvalProbability: 26,
    income: 2100,
    submittedAt: 'Feb 12, 2025',
    purpose: 'Credential upgrade and relocation',
    officer: 'L. Chen',
    riskScore: 83,
    timeline: makeTimeline(5),
    approvalReasons: [],
    rejectionReasons: ['Trust signals below threshold', 'No savings cushion', 'Application lacked improvement evidence'],
    improvementSuggestions: ['Build a 3-month cash-flow record', 'Add guarantor support', 'Reapply after 90 days'],
    manualReview: false,
    profileType: 'rejected',
    cashFlow: { monthlyIncome: 2100, monthlyExpenses: 2300, surplus: -200, stability: 'tight' },
    educationSignal: 'Career certificate pending',
    careerSignal: 'Not employed yet',
    documentChecklist: checklistBase.map((item, index) => ({ ...item, done: index < 1 })),
    consent: true,
  },
]

export const currentApplicant = {
  name: 'Amara Okafor',
  email: 'amara.okafor@example.com',
  memberSince: '2021',
  applications: applications.filter((a) => a.email === 'amara.okafor@example.com'),
}

export const monthlyVolume = [
  { month: 'Sep', approved: 42, rejected: 11, volume: 4.2 },
  { month: 'Oct', approved: 48, rejected: 9, volume: 5.1 },
  { month: 'Nov', approved: 51, rejected: 14, volume: 5.6 },
  { month: 'Dec', approved: 39, rejected: 8, volume: 4.0 },
  { month: 'Jan', approved: 58, rejected: 12, volume: 6.4 },
  { month: 'Feb', approved: 64, rejected: 10, volume: 7.2 },
  { month: 'Mar', approved: 71, rejected: 13, volume: 8.1 },
]

export const loanMix = [
  { type: 'Education', value: 38, fill: 'var(--color-home)' },
  { type: 'Personal', value: 22, fill: 'var(--color-auto)' },
  { type: 'Business', value: 18, fill: 'var(--color-business)' },
  { type: 'Auto', value: 14, fill: 'var(--color-education)' },
  { type: 'Home', value: 8, fill: 'var(--color-other)' },
]

export const approvalTrend = [
  { month: 'Nov', approval: 74, firstTime: 66 },
  { month: 'Dec', approval: 78, firstTime: 70 },
  { month: 'Jan', approval: 80, firstTime: 74 },
  { month: 'Feb', approval: 84, firstTime: 78 },
  { month: 'Mar', approval: 87, firstTime: 82 },
]