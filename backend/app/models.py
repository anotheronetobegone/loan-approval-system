from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Text
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

    applications = relationship('LoanApplication', back_populates='applicant', cascade='all, delete-orphan')
    reviews = relationship('Review', back_populates='officer', cascade='all, delete-orphan')


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

    applicant = relationship('User', back_populates='applications')
    documents = relationship('Document', back_populates='application', cascade='all, delete-orphan')
    reviews = relationship('Review', back_populates='application', cascade='all, delete-orphan')


class Document(Base):
    __tablename__ = 'documents'

    id = Column(Integer, primary_key=True, index=True)
    application_id = Column(Integer, ForeignKey('loan_applications.id'), nullable=False)
    document_type = Column(String(100), nullable=False)
    file_url = Column(String(500), nullable=False)

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
