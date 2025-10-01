from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class ConfigBase(BaseModel):
    name: str
    environment: str
    service: str
    key: str
    value: str
    description: Optional[str] = None
    is_encrypted: bool = True

class ConfigCreate(ConfigBase):
    pass

class Config(ConfigBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class UserBase(BaseModel):
    username: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    is_active: bool

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenRequest(BaseModel):
    username: str
    password: str