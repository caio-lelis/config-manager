from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
from datetime import timedelta

from . import models, schemas, database, auth

app = FastAPI(title="Config Manager API")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database
models.Base.metadata.create_all(bind=database.engine)

@app.post("/configs/", response_model=schemas.Config)
def create_config(
    config: schemas.ConfigCreate,
    db: Session = Depends(database.get_db),
    current_user: schemas.User = Depends(auth.get_current_user)
):
    return auth.create_config(db=db, config=config)

@app.get("/configs/", response_model=List[schemas.Config])
def read_configs(
    skip: int = 0,
    limit: int = 100,
    environment: str = None,
    service: str = None,
    db: Session = Depends(database.get_db),
    current_user: schemas.User = Depends(auth.get_current_user)
):
    return auth.get_configs(db, skip=skip, limit=limit, environment=environment, service=service)

@app.get("/configs/{config_id}", response_model=schemas.Config)
def read_config(
    config_id: int,
    db: Session = Depends(database.get_db),
    current_user: schemas.User = Depends(auth.get_current_user)
):
    db_config = auth.get_config(db, config_id=config_id)
    if db_config is None:
        raise HTTPException(status_code=404, detail="Config not found")
    return db_config

@app.put("/configs/{config_id}", response_model=schemas.Config)
def update_config(
    config_id: int,
    config: schemas.ConfigCreate,
    db: Session = Depends(database.get_db),
    current_user: schemas.User = Depends(auth.get_current_user)
):
    return auth.update_config(db=db, config_id=config_id, config=config)

@app.delete("/configs/{config_id}")
def delete_config(
    config_id: int,
    db: Session = Depends(database.get_db),
    current_user: schemas.User = Depends(auth.get_current_user)
):
    auth.delete_config(db=db, config_id=config_id)
    return {"message": "Config deleted successfully"}

@app.post("/token", response_model=schemas.Token)
def login_for_access_token(form_data: schemas.TokenRequest, db: Session = Depends(database.get_db)):
    user = auth.authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

# Endpoint para criar usuário inicial (remover em produção)
@app.post("/users/", response_model=schemas.User)
def create_user(user: schemas.UserCreate, db: Session = Depends(database.get_db)):
    db_user = auth.get_user(db, username=user.username)
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    hashed_password = auth.get_password_hash(user.password)
    db_user = models.User(username=user.username, hashed_password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user