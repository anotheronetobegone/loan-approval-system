from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from .. import models, schemas
from ..database import get_db

router = APIRouter(prefix='/reviews', tags=['reviews'])


@router.post('', response_model=schemas.ReviewRead)
def create_review(review: schemas.ReviewCreate, db: Session = Depends(get_db)):
    application = db.query(models.LoanApplication).filter(models.LoanApplication.id == review.application_id).first()
    if not application:
        raise HTTPException(status_code=404, detail='Loan application not found')

    officer = db.query(models.User).filter(models.User.id == review.officer_id).first()
    if not officer:
        raise HTTPException(status_code=404, detail='Review officer not found')

    db_review = models.Review(**review.dict())
    db.add(db_review)
    db.commit()
    db.refresh(db_review)
    return db_review


@router.get('/{application_id}', response_model=List[schemas.ReviewRead])
def get_reviews(application_id: int, db: Session = Depends(get_db)):
    return db.query(models.Review).filter(models.Review.application_id == application_id).order_by(models.Review.created_at.desc()).all()
