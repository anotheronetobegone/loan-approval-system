from datetime import datetime
from typing import List, Literal, Optional

from pydantic import BaseModel, ConfigDict, EmailStr

StatusType = Literal['PENDING', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'MORE_INFO_REQUIRED']


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
    loan_type: str
    amount: float
    annual_income: float
    employment_type: str
    purpose: str
    education_signal: Optional[str] = None
    career_signal: Optional[str] = None
    monthly_income: Optional[float] = None
    monthly_expenses: Optional[float] = None
    cash_flow_stability: Optional[str] = None
    co_applicant_name: Optional[str] = None
    co_applicant_relationship: Optional[str] = None
    co_applicant_income: Optional[float] = None
    co_applicant_credit_score: Optional[int] = None


class LoanApplicationCreate(LoanApplicationBase):
    pass


class LoanApplicationRead(LoanApplicationBase):
    id: int
    risk_score: int
    status: StatusType
    created_at: datetime
    consent_provided: bool = False
    manual_review: bool = False
    approval_probability: Optional[int] = None
    readiness_score: Optional[int] = None
    credit_score: Optional[int] = None
    trust_score: Optional[int] = None
    approval_reasons: List[str] = []
    rejection_reasons: List[str] = []
    improvement_suggestions: List[str] = []
    model_config = ConfigDict(from_attributes=True)


class LoanApplicationStatusUpdate(BaseModel):
    status: StatusType


class DocumentBase(BaseModel):
    application_id: int
    document_type: str
    file_url: str
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
    breakdown: dict = {}
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