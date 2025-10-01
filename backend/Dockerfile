FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Criar usuário inicial após garantir que as tabelas existem
CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port 8000 & sleep 5 && python create_user.py && wait"]