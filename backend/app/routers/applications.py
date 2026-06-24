import json
from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func
from sqlalchemy.orm import Session

from .. import models, schemas
from ..database import get_db
from ..risk_engine import build_score_snapshot

router = APIRouter(prefix='/applications', tags=['applications'])


def _serialize_list(value):
    if not value:
        return json.dumps([])
    if isinstance(value, list):
        return json.dumps(value)
    return json.dumps([value])


def _deserialize_list(value):
    if not value:
        return []
    if isinstance(value, list):
        return value
    if isinstance(value, str):
        try:
            parsed = json.loads(value)
            return parsed if isinstance(parsed, list) else [parsed]
        except json.JSONDecodeError:
            return [value]
    return [value]


def _application_payload(application: models.LoanApplication) -> dict:
    return {
        'id': application.id,
        'applicant_id': application.applicant_id,
        'loan_type': application.loan_type,
        'amount': application.amount,
        'annual_income': application.annual_income,
        'employment_type': application.employment_type,
        'purpose': application.purpose,
        'risk_score': application.risk_score,
        'status': application.status,
        'created_at': application.created_at,
        'consent_provided': application.consent_provided,
        'manual_review': application.manual_review,
        'approval_probability': application.approval_probability,
        'readiness_score': application.readiness_score,
        'credit_score': application.credit_score,
        'trust_score': application.trust_score,
        'approval_reasons': _deserialize_list(application.approval_reasons),
        'rejection_reasons': _deserialize_list(application.rejection_reasons),
        'improvement_suggestions': _deserialize_list(application.improvement_suggestions),
        'education_signal': application.education_signal,
        'career_signal': application.career_signal,
        'monthly_income': application.monthly_income,
        'monthly_expenses': application.monthly_expenses,
        'cash_flow_stability': application.cash_flow_stability,
        'co_applicant_name': application.co_applicant_name,
        'co_applicant_relationship': application.co_applicant_relationship,
        'co_applicant_income': application.co_applicant_income,
        'co_applicant_credit_score': application.co_applicant_credit_score,
    }


@router.post('', response_model=schemas.LoanApplicationRead)
def create_application(application: schemas.LoanApplicationCreate, db: Session = Depends(get_db)):
    applicant = db.query(models.User).filter(models.User.id == application.applicant_id).first()
    if not applicant:
        raise HTTPException(status_code=404, detail='Applicant user not found')

    snapshot = build_score_snapshot(
        amount=application.amount,
        annual_income=application.annual_income,
        employment_type=application.employment_type,
        education_signal=application.education_signal,
        career_signal=application.career_signal,
        monthly_income=application.monthly_income,
        monthly_expenses=application.monthly_expenses,
        co_applicant_credit_score=application.co_applicant_credit_score,
    )

    db_application = models.LoanApplication(
        **application.dict(),
        risk_score=snapshot['risk_score'],
        status='PENDING',
        consent_provided=True,
        manual_review=application.amount < 10000 and snapshot['readiness_score'] < 70,
        approval_probability=snapshot['approval_probability'],
        readiness_score=snapshot['readiness_score'],
        credit_score=snapshot['credit_score'],
        trust_score=snapshot['trust_score'],
        approval_reasons=_serialize_list(snapshot['reasons']),
        rejection_reasons=json.dumps([]),
        improvement_suggestions=_serialize_list(snapshot['recommendations']),
        cash_flow_surplus=(application.monthly_income or 0) - (application.monthly_expenses or 0),
    )
    db.add(db_application)
    db.commit()
    db.refresh(db_application)

    score_record = models.ApplicationScore(
        application_id=db_application.id,
        readiness_score=db_application.readiness_score,
        credit_score=db_application.credit_score,
        trust_score=db_application.trust_score,
        approval_probability=db_application.approval_probability,
        reasons=db_application.approval_reasons,
        recommendations=db_application.improvement_suggestions,
        breakdown=json.dumps(snapshot),
    )
    db.add(score_record)

    history_entry = models.StatusHistory(application_id=db_application.id, status='PENDING', note='Application created')
    db.add(history_entry)
    db.commit()

    return schemas.LoanApplicationRead(**_application_payload(db_application))


@router.get('', response_model=List[schemas.LoanApplicationRead])
def list_applications(db: Session = Depends(get_db)):
    items = db.query(models.LoanApplication).order_by(models.LoanApplication.created_at.desc()).all()
    return [schemas.LoanApplicationRead(**_application_payload(item)) for item in items]


@router.get('/{application_id}', response_model=schemas.LoanApplicationRead)
def get_application(application_id: int, db: Session = Depends(get_db)):
    application = db.query(models.LoanApplication).filter(models.LoanApplication.id == application_id).first()
    if not application:
        raise HTTPException(status_code=404, detail='Loan application not found')
    return schemas.LoanApplicationRead(**_application_payload(application))


@router.put('/{application_id}/status', response_model=schemas.LoanApplicationRead)
def update_application_status(application_id: int, status_update: schemas.LoanApplicationStatusUpdate, db: Session = Depends(get_db)):
    application = db.query(models.LoanApplication).filter(models.LoanApplication.id == application_id).first()
    if not application:
        raise HTTPException(status_code=404, detail='Loan application not found')

    application.status = status_update.status
    db.add(models.StatusHistory(application_id=application.id, status=status_update.status, note='Status updated'))
    db.commit()
    db.refresh(application)
    return schemas.LoanApplicationRead(**_application_payload(application))


@router.get('/{application_id}/readiness', response_model=schemas.ReadinessScoreResponse)
def get_readiness_score(application_id: int, db: Session = Depends(get_db)):
    application = db.query(models.LoanApplication).filter(models.LoanApplication.id == application_id).first()
    if not application:
        raise HTTPException(status_code=404, detail='Loan application not found')
    return schemas.ReadinessScoreResponse(
        application_id=application.id,
        readiness_score=application.readiness_score or 0,
        credit_score=application.credit_score or 0,
        trust_score=application.trust_score or 0,
        approval_probability=application.approval_probability or 0,
        reasons=_deserialize_list(application.approval_reasons),
        recommendations=_deserialize_list(application.improvement_suggestions),
    )


@router.get('/{application_id}/score-breakdown', response_model=schemas.ApplicationScoreRead)
def get_score_breakdown(application_id: int, db: Session = Depends(get_db)):
    application = db.query(models.LoanApplication).filter(models.LoanApplication.id == application_id).first()
    if not application:
        raise HTTPException(status_code=404, detail='Loan application not found')

    score_entry = db.query(models.ApplicationScore).filter(models.ApplicationScore.application_id == application_id).first()
    if not score_entry:
        raise HTTPException(status_code=404, detail='Score breakdown not found')

    return schemas.ApplicationScoreRead(
        application_id=application.id,
        readiness_score=score_entry.readiness_score,
        credit_score=score_entry.credit_score,
        trust_score=score_entry.trust_score,
        approval_probability=score_entry.approval_probability,
        reasons=_deserialize_list(score_entry.reasons),
        recommendations=_deserialize_list(score_entry.recommendations),
        breakdown=json.loads(score_entry.breakdown or '{}'),
        created_at=score_entry.created_at,
    )


@router.get('/{application_id}/status-history', response_model=List[schemas.StatusHistoryRead])
def get_status_history(application_id: int, db: Session = Depends(get_db)):
    application = db.query(models.LoanApplication).filter(models.LoanApplication.id == application_id).first()
    if not application:
        raise HTTPException(status_code=404, detail='Loan application not found')
    return db.query(models.StatusHistory).filter(models.StatusHistory.application_id == application_id).order_by(models.StatusHistory.created_at.asc()).all()


@router.post('/{application_id}/documents', response_model=schemas.DocumentRead)
def upload_document_metadata(application_id: int, document: schemas.DocumentCreate, db: Session = Depends(get_db)):
    application = db.query(models.LoanApplication).filter(models.LoanApplication.id == application_id).first()
    if not application:
        raise HTTPException(status_code=404, detail='Loan application not found')

    db_document = models.Document(**document.dict(), application_id=application_id)
    db.add(db_document)
    db.commit()
    db.refresh(db_document)
    return db_document


@router.post('/{application_id}/review', response_model=schemas.ReviewRead)
def submit_review_decision(application_id: int, review: schemas.ReviewCreate, db: Session = Depends(get_db)):
    application = db.query(models.LoanApplication).filter(models.LoanApplication.id == application_id).first()
    if not application:
        raise HTTPException(status_code=404, detail='Loan application not found')

    officer = db.query(models.User).filter(models.User.id == review.officer_id).first()
    if not officer:
        raise HTTPException(status_code=404, detail='Review officer not found')

    db_review = models.Review(**review.dict(), application_id=application_id)
    db.add(db_review)
    application.status = review.decision
    application.manual_review = review.decision == 'UNDER_REVIEW' or review.decision == 'MORE_INFO_REQUIRED'
    db.add(models.StatusHistory(application_id=application.id, status=review.decision, note=review.remarks))
    db.commit()
    db.refresh(db_review)
    return db_review


@router.post('/{application_id}/request-more-info')
def request_more_information(application_id: int, payload: dict, db: Session = Depends(get_db)):
    application = db.query(models.LoanApplication).filter(models.LoanApplication.id == application_id).first()
    if not application:
        raise HTTPException(status_code=404, detail='Loan application not found')

    application.status = 'MORE_INFO_REQUIRED'
    application.manual_review = True
    db.add(models.ApplicationNote(application_id=application.id, note_type='request-info', body=payload.get('message', 'More information requested')))
    db.add(models.StatusHistory(application_id=application.id, status='MORE_INFO_REQUIRED', note=payload.get('message', 'More information requested')))
    db.commit()
    return {'message': 'More information requested'}


@router.post('/{application_id}/approve')
def approve_application(application_id: int, payload: dict | None = None, db: Session = Depends(get_db)):
    application = db.query(models.LoanApplication).filter(models.LoanApplication.id == application_id).first()
    if not application:
        raise HTTPException(status_code=404, detail='Loan application not found')

    application.status = 'APPROVED'
    application.manual_review = False
    db.add(models.StatusHistory(application_id=application.id, status='APPROVED', note=(payload or {}).get('message', 'Approved by officer')))
    db.commit()
    return {'message': 'Application approved'}


@router.post('/{application_id}/reject')
def reject_application(application_id: int, payload: dict | None = None, db: Session = Depends(get_db)):
    application = db.query(models.LoanApplication).filter(models.LoanApplication.id == application_id).first()
    if not application:
        raise HTTPException(status_code=404, detail='Loan application not found')

    application.status = 'REJECTED'
    application.manual_review = False
    db.add(models.StatusHistory(application_id=application.id, status='REJECTED', note=(payload or {}).get('message', 'Rejected by officer')))
    db.commit()
    return {'message': 'Application rejected'}


@router.get('/analytics', response_model=schemas.AnalyticsResponse)
def analytics(db: Session = Depends(get_db)):
    total = db.query(func.count(models.LoanApplication.id)).scalar() or 0
    pending = db.query(func.count(models.LoanApplication.id)).filter(models.LoanApplication.status == 'PENDING').scalar() or 0
    under_review = db.query(func.count(models.LoanApplication.id)).filter(models.LoanApplication.status == 'UNDER_REVIEW').scalar() or 0
    approved = db.query(func.count(models.LoanApplication.id)).filter(models.LoanApplication.status == 'APPROVED').scalar() or 0
    rejected = db.query(func.count(models.LoanApplication.id)).filter(models.LoanApplication.status == 'REJECTED').scalar() or 0
    more_info_required = db.query(func.count(models.LoanApplication.id)).filter(models.LoanApplication.status == 'MORE_INFO_REQUIRED').scalar() or 0
    average_readiness = float(db.query(func.coalesce(func.avg(models.LoanApplication.readiness_score), 0)).scalar() or 0)
    average_credit = float(db.query(func.coalesce(func.avg(models.LoanApplication.credit_score), 0)).scalar() or 0)
    average_trust = float(db.query(func.coalesce(func.avg(models.LoanApplication.trust_score), 0)).scalar() or 0)

    return schemas.AnalyticsResponse(
        total_applications=total,
        pending=pending,
        under_review=under_review,
        approved=approved,
        rejected=rejected,
        more_info_required=more_info_required,
        average_readiness_score=round(average_readiness, 2),
        average_credit_score=round(average_credit, 2),
        average_trust_score=round(average_trust, 2),
    )