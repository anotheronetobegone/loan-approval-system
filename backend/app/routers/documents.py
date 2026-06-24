from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from .. import models, schemas
from ..database import get_db

router = APIRouter(prefix='/documents', tags=['documents'])


@router.post('', response_model=schemas.DocumentRead)
def create_document(document: schemas.DocumentCreate, db: Session = Depends(get_db)):
    application = db.query(models.LoanApplication).filter(models.LoanApplication.id == document.application_id).first()
    if not application:
        raise HTTPException(status_code=404, detail='Loan application not found')

    db_document = models.Document(**document.dict())
    db.add(db_document)
    db.commit()
    db.refresh(db_document)
    return db_document


@router.get('/{application_id}', response_model=List[schemas.DocumentRead])
def get_documents(application_id: int, db: Session = Depends(get_db)):
    return db.query(models.Document).filter(models.Document.application_id == application_id).all()
