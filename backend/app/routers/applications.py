from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func
from sqlalchemy.orm import Session

from .. import models, schemas
from ..database import get_db
from ..risk_engine import calculate_risk_score

router = APIRouter(prefix='/applications', tags=['applications'])


@router.post('', response_model=schemas.LoanApplicationRead)
def create_application(application: schemas.LoanApplicationCreate, db: Session = Depends(get_db)):
    applicant = db.query(models.User).filter(models.User.id == application.applicant_id).first()
    if not applicant:
        raise HTTPException(status_code=404, detail='Applicant user not found')

    risk_score = calculate_risk_score(application.amount, application.annual_income, application.employment_type)
    db_application = models.LoanApplication(**application.dict(), risk_score=risk_score)
    db.add(db_application)
    db.commit()
    db.refresh(db_application)
    return db_application


@router.get('', response_model=List[schemas.LoanApplicationRead])
def list_applications(db: Session = Depends(get_db)):
    return db.query(models.LoanApplication).order_by(models.LoanApplication.created_at.desc()).all()


@router.get('/{application_id}', response_model=schemas.LoanApplicationRead)
def get_application(application_id: int, db: Session = Depends(get_db)):
    application = db.query(models.LoanApplication).filter(models.LoanApplication.id == application_id).first()
    if not application:
        raise HTTPException(status_code=404, detail='Loan application not found')
    return application


@router.put('/{application_id}/status', response_model=schemas.LoanApplicationRead)
def update_application_status(application_id: int, status_update: schemas.LoanApplicationStatusUpdate, db: Session = Depends(get_db)):
    application = db.query(models.LoanApplication).filter(models.LoanApplication.id == application_id).first()
    if not application:
        raise HTTPException(status_code=404, detail='Loan application not found')

    application.status = status_update.status
    db.commit()
    db.refresh(application)
    return application


@router.get('/analytics', response_model=schemas.AnalyticsResponse)
def analytics(db: Session = Depends(get_db)):
    total = db.query(func.count(models.LoanApplication.id)).scalar() or 0
    pending = db.query(func.count(models.LoanApplication.id)).filter(models.LoanApplication.status == 'PENDING').scalar() or 0
    under_review = db.query(func.count(models.LoanApplication.id)).filter(models.LoanApplication.status == 'UNDER_REVIEW').scalar() or 0
    approved = db.query(func.count(models.LoanApplication.id)).filter(models.LoanApplication.status == 'APPROVED').scalar() or 0
    rejected = db.query(func.count(models.LoanApplication.id)).filter(models.LoanApplication.status == 'REJECTED').scalar() or 0
    more_info_required = db.query(func.count(models.LoanApplication.id)).filter(models.LoanApplication.status == 'MORE_INFO_REQUIRED').scalar() or 0
    average_risk_score = float(db.query(func.coalesce(func.avg(models.LoanApplication.risk_score), 0)).scalar() or 0)

    return schemas.AnalyticsResponse(
        total_applications=total,
        pending=pending,
        under_review=under_review,
        approved=approved,
        rejected=rejected,
        more_info_required=more_info_required,
        average_risk_score=round(average_risk_score, 2),
    )
