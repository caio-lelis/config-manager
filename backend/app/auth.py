from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from jose import JWTError, jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from . import models, schemas, database
import hashlib

# Configurações de segurança
SECRET_KEY = "SPFC_O_MAIOR"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# OAuth2 scheme
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

def verify_password(plain_password, hashed_password):
    """Verifica a senha usando SHA256 (simplificado para demo)"""
    return get_password_hash(plain_password) == hashed_password

def get_password_hash(password):
    """Gera hash da senha usando SHA256"""
    return hashlib.sha256(password.encode()).hexdigest()

def get_user(db: Session, username: str):
    return db.query(models.User).filter(models.User.username == username).first()

def authenticate_user(db: Session, username: str, password: str):
    user = get_user(db, username)
    if not user:
        return False
    if not verify_password(password, user.hashed_password):
        return False
    return user

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire, "sub": data["sub"]})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(database.get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    user = get_user(db, username=username)
    if user is None:
        raise credentials_exception
    return user

# CRUD operations
def create_config(db: Session, config: schemas.ConfigCreate):
    db_config = models.Config(**config.dict())
    db.add(db_config)
    db.commit()
    db.refresh(db_config)
    return db_config

def get_configs(db: Session, skip: int = 0, limit: int = 100, environment: str = None, service: str = None):
    query = db.query(models.Config)
    if environment:
        query = query.filter(models.Config.environment == environment)
    if service:
        query = query.filter(models.Config.service == service)
    return query.offset(skip).limit(limit).all()

def get_config(db: Session, config_id: int):
    return db.query(models.Config).filter(models.Config.id == config_id).first()

def update_config(db: Session, config_id: int, config: schemas.ConfigCreate):
    db_config = db.query(models.Config).filter(models.Config.id == config_id).first()
    if db_config:
        for key, value in config.dict().items():
            setattr(db_config, key, value)
        db.commit()
        db.refresh(db_config)
    return db_config

def delete_config(db: Session, config_id: int):
    db_config = db.query(models.Config).filter(models.Config.id == config_id).first()
    if db_config:
        db.delete(db_config)
        db.commit()
    return db_config