# POSapp Backend

FastAPI backend untuk app POS internal/native. Deploy target: **Vercel + Supabase PostgreSQL direct connection**.

## Stack
- Python 3.11+
- FastAPI
- Async SQLAlchemy + asyncpg
- Alembic migrations
- Supabase PostgreSQL

## Setup
```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
# edit .env -> isi DATABASE_URL
alembic upgrade head
uvicorn api.index:app --reload
```

## Environment Variables
Copy `.env.example` ke `.env`, lalu isi:

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | Supabase direct connection (`postgresql+asyncpg://...:5432/...`) |
| `CORS_ORIGINS` | No | Comma-separated origins (default: `*`) |
| `APP_ENV` | No | `local` or `production` |
| `APP_DEBUG` | No | `true` or `false` |

**Penting:** Gunakan port **5432** (Direct Connection), bukan 6543 (Transaction Pooler).

## Commands
```bash
# syntax check
python -m py_compile api/index.py

# apply migrations
alembic upgrade head
```

## Vercel
Root directory: `backend`

Required env vars:
```
DATABASE_URL=postgresql+asyncpg://...
CORS_ORIGINS=https://your-app.vercel.app
```

## Contract
[`API_CONTRACT.md`](./API_CONTRACT.md)
