from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Integer, String, Float, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from .database import Base


class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255), nullable=False, unique=True, index=True)
    password = Column(String(255), nullable=False)
    role = Column(String(50), nullable=False, default='applicant')
    phone = Column(String(50), nullable=True)
    city = Column(String(120), nullable=True)
    borrower_type = Column(String(50), nullable=True, default='first-time')

    applications = relationship('LoanApplication', back_populates='applicant', cascade='all, delete-orphan')
    reviews = relationship('Review', back_populates='officer', cascade='all, delete-orphan')
    consent_records = relationship('ConsentRecord', back_populates='user', cascade='all, delete-orphan')


class LoanApplication(Base):
    __tablename__ = 'loan_applications'

    id = Column(Integer, primary_key=True, index=True)
    applicant_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    loan_type = Column(String(100), nullable=False)
    amount = Column(Float, nullable=False)
    annual_income = Column(Float, nullable=False)
    employment_type = Column(String(100), nullable=False)
    purpose = Column(Text, nullable=False)

    risk_score = Column(Integer, nullable=False, default=0)
    status = Column(String(50), nullable=False, default='PENDING')
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    consent_provided = Column(Boolean, nullable=False, default=False)
    manual_review = Column(Boolean, nullable=False, default=False)
    approval_probability = Column(Integer, nullable=True)
    readiness_score = Column(Integer, nullable=True)
    credit_score = Column(Integer, nullable=True)
    trust_score = Column(Integer, nullable=True)
    approval_reasons = Column(Text, nullable=True)
    rejection_reasons = Column(Text, nullable=True)
    improvement_suggestions = Column(Text, nullable=True)
    education_signal = Column(Text, nullable=True)
    career_signal = Column(Text, nullable=True)
    monthly_income = Column(Float, nullable=True)
    monthly_expenses = Column(Float, nullable=True)
    cash_flow_surplus = Column(Float, nullable=True)
    cash_flow_stability = Column(String(50), nullable=True)
    co_applicant_name = Column(String(255), nullable=True)
    co_applicant_relationship = Column(String(100), nullable=True)
    co_applicant_income = Column(Float, nullable=True)
    co_applicant_credit_score = Column(Integer, nullable=True)

    applicant = relationship('User', back_populates='applications')
    documents = relationship('Document', back_populates='application', cascade='all, delete-orphan')
    reviews = relationship('Review', back_populates='application', cascade='all, delete-orphan')
    scores = relationship('ApplicationScore', back_populates='application', cascade='all, delete-orphan')
    notes = relationship('ApplicationNote', back_populates='application', cascade='all, delete-orphan')
    consent_records = relationship('ConsentRecord', back_populates='application', cascade='all, delete-orphan')
    status_history = relationship('StatusHistory', back_populates='application', cascade='all, delete-orphan')


class Document(Base):
    __tablename__ = 'documents'

    id = Column(Integer, primary_key=True, index=True)
    application_id = Column(Integer, ForeignKey('loan_applications.id'), nullable=False)
    document_type = Column(String(100), nullable=False)
    file_url = Column(String(500), nullable=False)
    status = Column(String(50), nullable=False, default='PENDING')
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    application = relationship('LoanApplication', back_populates='documents')


class Review(Base):
    __tablename__ = 'reviews'

    id = Column(Integer, primary_key=True, index=True)
    application_id = Column(Integer, ForeignKey('loan_applications.id'), nullable=False)
    officer_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    decision = Column(String(50), nullable=False)
    remarks = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    application = relationship('LoanApplication', back_populates='reviews')
    officer = relationship('User', back_populates='reviews')


class ApplicationScore(Base):
    __tablename__ = 'application_scores'

    id = Column(Integer, primary_key=True, index=True)
    application_id = Column(Integer, ForeignKey('loan_applications.id'), nullable=False)
    readiness_score = Column(Integer, nullable=False, default=0)
    credit_score = Column(Integer, nullable=False, default=0)
    trust_score = Column(Integer, nullable=False, default=0)
    approval_probability = Column(Integer, nullable=False, default=0)
    reasons = Column(Text, nullable=True)
    recommendations = Column(Text, nullable=True)
    breakdown = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    application = relationship('LoanApplication', back_populates='scores')


class ApplicationNote(Base):
    __tablename__ = 'application_notes'

    id = Column(Integer, primary_key=True, index=True)
    application_id = Column(Integer, ForeignKey('loan_applications.id'), nullable=False)
    note_type = Column(String(50), nullable=False, default='note')
    body = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    application = relationship('LoanApplication', back_populates='notes')


class ConsentRecord(Base):
    __tablename__ = 'consent_records'

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    application_id = Column(Integer, ForeignKey('loan_applications.id'), nullable=True)
    consent_text = Column(Text, nullable=False)
    consented = Column(Boolean, nullable=False, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    user = relationship('User', back_populates='consent_records')
    application = relationship('LoanApplication', back_populates='consent_records')


class StatusHistory(Base):
    __tablename__ = 'status_history'

    id = Column(Integer, primary_key=True, index=True)
    application_id = Column(Integer, ForeignKey('loan_applications.id'), nullable=False)
    status = Column(String(50), nullable=False)
    note = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    application = relationship('LoanApplication', back_populates='status_history')