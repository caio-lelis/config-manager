#!/usr/bin/env python3
import sys
import os
import time

# Adiciona o diretório atual ao path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database import SessionLocal, engine
from app.models import User, Base

def get_password_hash(password):
    """Função simplificada para hash de senha"""
    import hashlib
    # Usando SHA256 como fallback simples
    return hashlib.sha256(password.encode()).hexdigest()

def create_initial_user():
    # Aguarda um pouco para garantir que o banco está pronto
    time.sleep(2)
    
    # Cria todas as tabelas
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    try:
        # Verifica se o usuário já existe
        existing_user = db.query(User).filter(User.username == "admin").first()
        if existing_user:
            print("User 'admin' already exists")
            return
        
        # Cria novo usuário
        user = User(
            username="admin",
            hashed_password=get_password_hash("admin123")
        )
        db.add(user)
        db.commit()
        print("User 'admin' created successfully!")
        print("Username: admin")
        print("Password: admin123")
        
    except Exception as e:
        print(f"Error creating user: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    create_initial_user()