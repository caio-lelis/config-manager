
from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

Base = declarative_base()

class Config(Base):
    __tablename__ = "configs"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    environment = Column(String, index=True)
    service = Column(String, index=True)
    key = Column(String, index=True)
    value = Column(Text)
    description = Column(Text, nullable=True)
    is_encrypted = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)
