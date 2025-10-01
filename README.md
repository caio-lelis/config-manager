## Config Manager

Um sistema moderno e seguro para gerenciamento de senhas/variáveis de ambiente, desenvolvido com FastAPI e React.

## Tecnologias Utilizadas

### Backend

- FastAPI -> Framework web moderno e rápido para construir APIs com Python.
- SQLAlchemy -> ORM para interagir com o banco de dados.
- SQLite -> Banco de dados leve e fácil de usar.
- Pydantic -> Validação de dados e gerenciamento de configurações.
- JWT -> Autenticação segura com tokens.
- Uvicorn -> Servidor ASGI rápido para rodar a aplicação.

### Frontend

- React -> Biblioteca JavaScript para construir interfaces de usuário.
- Axios -> Cliente HTTP para fazer requisições à API.
- CSS3 -> Estilização da interface.
- React Router -> Navegação entre páginas.

### Infraestrutura

- Docker -> Containerização da aplicação para facilitar o deploy.
- Docker Compose -> Orquestração de múltiplos containers.

## Como Usar

Execute o sistema (usando docker):

```bash
docker-compose up --build
```

## Acesse a Aplicação

- Backend: [http://localhost:8000](http://localhost:8000)
- Frontend: [http://localhost:3000](http://localhost:3000)

## Adicionar um usuário inicial (execute no Backend)

```bash
# script para criar usuário inicial
from app.database import SessionLocal
from app.auth import get_password_hash
from app.models import User

db = SessionLocal()
user = User(
    username="admin",
    hashed_password=get_password_hash("admin123")
)
db.add(user)
db.commit()
db.close()
```

## Funcionalidades

[x] Autenticação segura
[x] CRUD de configurações
[x] Interface amigável
[x] Filtros por ambiente e serviço
[x] Dockerizado
[x] Documentação automática com Swagger
[x] Dados persistidos
[x] Categorização por serviços
