from datetime import datetime
from typing import Dict, List, Literal, Optional

from pydantic import BaseModel, ConfigDict, EmailStr


StatusType = Literal['PENDING', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'MORE_INFO_REQUIRED']
LoanStatus = Literal[
    'draft',
    'submitted',
    'under-review',
    'manual-review',
    'more-info-required',
    'approved',
    'rejected',
    'disbursed',
]
TimelineStatus = Literal['complete', 'current', 'upcoming']


class ApplicantInfo(BaseModel):
    id: int
    name: str
    email: EmailStr
    borrowerType: str

    model_config = ConfigDict(from_attributes=True)


class CoApplicant(BaseModel):
    name: str
    relationship: str
    income: float
    creditScore: int


class CashFlowSnapshot(BaseModel):
    monthlyIncome: float
    monthlyExpenses: float
    surplus: float
    stability: str


class ChecklistItem(BaseModel):
    id: str
    label: str
    done: bool
    hint: str


class TimelineEvent(BaseModel):
    id: str
    label: str
    description: str
    date: str
    status: TimelineStatus


class UserBase(BaseModel):
    name: str
    email: EmailStr
    role: str = 'applicant'
    phone: Optional[str] = None
    city: Optional[str] = None
    borrower_type: Optional[str] = 'first-time'


class UserCreate(UserBase):
    password: str


class UserRead(UserBase):
    id: int
    model_config = ConfigDict(from_attributes=True)


class ConsentSubmit(BaseModel):
    user_id: int
    application_id: Optional[int] = None
    consent_text: str = 'Consent provided for transparent underwriting and explainable decisions.'
    consented: bool = True


class ConsentRead(BaseModel):
    id: int
    user_id: int
    application_id: Optional[int]
    consented: bool
    consent_text: str
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)


class LoanApplicationBase(BaseModel):
    applicant_id: int
    type: str
    termMonths: int
    rate: float
    amount: float
    annualIncome: float
    employmentType: str
    purpose: str
    educationSignal: Optional[str] = None
    careerSignal: Optional[str] = None
    monthlyIncome: Optional[float] = None
    monthlyExpenses: Optional[float] = None
    cashFlowStability: Optional[str] = None
    profileType: Optional[str] = 'first-time'
    coApplicantName: Optional[str] = None
    coApplicantRelationship: Optional[str] = None
    coApplicantIncome: Optional[float] = None
    coApplicantCreditScore: Optional[int] = None


class LoanApplicationCreate(LoanApplicationBase):
    pass


class LoanApplicationRead(LoanApplicationBase):
    id: int
    applicant: str
    email: EmailStr
    status: LoanStatus
    creditScore: int
    trustScore: int
    readinessScore: int
    approvalProbability: int
    income: float
    submittedAt: str
    officer: str
    riskScore: int
    timeline: List[TimelineEvent] = []
    approvalReasons: List[str] = []
    rejectionReasons: List[str] = []
    improvementSuggestions: List[str] = []
    manualReview: bool = False
    profileType: str
    coApplicant: Optional[CoApplicant] = None
    cashFlow: CashFlowSnapshot
    documentChecklist: List[ChecklistItem] = []
    consent: bool = False
    model_config = ConfigDict(from_attributes=True)


class LoanApplicationStatusUpdate(BaseModel):
    status: StatusType


class DocumentBase(BaseModel):
    application_id: int
    document_type: str
    file_url: str
    hint: Optional[str] = None
    status: str = 'PENDING'


class DocumentCreate(DocumentBase):
    pass


class DocumentRead(DocumentBase):
    id: int
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)


class ReviewBase(BaseModel):
    application_id: int
    officer_id: int
    decision: StatusType
    remarks: Optional[str] = None


class ReviewCreate(ReviewBase):
    pass


class ReviewRead(ReviewBase):
    id: int
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)


class ApplicationScoreRead(BaseModel):
    application_id: int
    readiness_score: int
    credit_score: int
    trust_score: int
    approval_probability: int
    reasons: List[str] = []
    recommendations: List[str] = []
    breakdown: Dict[str, object] = {}
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)


class StatusHistoryRead(BaseModel):
    id: int
    application_id: int
    status: str
    note: Optional[str] = None
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)


class ReadinessScoreResponse(BaseModel):
    application_id: int
    readiness_score: int
    credit_score: int
    trust_score: int
    approval_probability: int
    reasons: List[str] = []
    recommendations: List[str] = []


class AnalyticsResponse(BaseModel):
    total_applications: int
    pending: int
    under_review: int
    approved: int
    rejected: int
    more_info_required: int
    average_readiness_score: float
    average_credit_score: float
    average_trust_score: float