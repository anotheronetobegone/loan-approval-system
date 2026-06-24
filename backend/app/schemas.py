from datetime import datetime
from typing import List, Literal

from pydantic import BaseModel, EmailStr

StatusType = Literal['PENDING', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'MORE_INFO_REQUIRED']


class UserBase(BaseModel):
    name: str
    email: EmailStr
    role: str


class UserCreate(UserBase):
    password: str


class UserRead(UserBase):
    id: int

    class Config:
        orm_mode = True


class LoanApplicationBase(BaseModel):
    applicant_id: int
    loan_type: str
    amount: float
    annual_income: float
    employment_type: str
    purpose: str


class LoanApplicationCreate(LoanApplicationBase):
    pass


class LoanApplicationRead(LoanApplicationBase):
    id: int
    risk_score: int
    status: StatusType
    created_at: datetime

    class Config:
        orm_mode = True


class LoanApplicationStatusUpdate(BaseModel):
    status: StatusType


class DocumentBase(BaseModel):
    application_id: int
    document_type: str
    file_url: str


class DocumentCreate(DocumentBase):
    pass


class DocumentRead(DocumentBase):
    id: int

    class Config:
        orm_mode = True


class ReviewBase(BaseModel):
    application_id: int
    officer_id: int
    decision: StatusType
    remarks: str


class ReviewCreate(ReviewBase):
    pass


class ReviewRead(ReviewBase):
    id: int
    created_at: datetime

    class Config:
        orm_mode = True


class AnalyticsResponse(BaseModel):
    total_applications: int
    pending: int
    under_review: int
    approved: int
    rejected: int
    more_info_required: int
    average_risk_score: float
