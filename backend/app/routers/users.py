from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from .. import models, schemas
from ..database import get_db

router = APIRouter(prefix='/users', tags=['users'])


@router.post('/profiles', response_model=schemas.UserRead)
def create_borrower_profile(user: schemas.UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(models.User).filter(models.User.email == user.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail='Email already registered')

    db_user = models.User(**user.dict(), role='applicant')
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


@router.post('/consent', response_model=schemas.ConsentRead)
def submit_consent(consent: schemas.ConsentSubmit, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == consent.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail='User not found')

    application = None
    if consent.application_id:
        application = db.query(models.LoanApplication).filter(models.LoanApplication.id == consent.application_id).first()
        if not application:
            raise HTTPException(status_code=404, detail='Loan application not found')

    db_consent = models.ConsentRecord(
        user_id=consent.user_id,
        application_id=consent.application_id,
        consent_text=consent.consent_text,
        consented=consent.consented,
    )
    db.add(db_consent)
    if application:
        application.consent_provided = consent.consented

    db.commit()
    db.refresh(db_consent)
    return db_consent


@router.get('', response_model=List[schemas.UserRead])
def list_users(db: Session = Depends(get_db)):
    return db.query(models.User).all()