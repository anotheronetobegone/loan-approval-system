from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import engine
from . import models
from .routers import applications, documents, reviews, users

app = FastAPI(title='Youth Loan Approval API')

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

models.Base.metadata.create_all(bind=engine)

app.include_router(users.router)
app.include_router(applications.router)
app.include_router(documents.router)
app.include_router(reviews.router)


@app.get('/')
def root():
    return {'message': 'Loan Approval API Running'}