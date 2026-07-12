# AGENTS.md - POS Kasir UMKM (FastAPI Backend)

## Context
- Backend FastAPI untuk POS internal/native.
- Deploy target: Vercel Python serverless, tapi DB wajib **Supabase PostgreSQL async** (`asyncpg`).
- Use direct connection (port 5432) only; avoid 6543 transaction pooler.
- Migration via Alembic. Keep API paths contract-compatible.

## Commands
- Install: `cd backend && pip install -r requirements.txt`
- Local dev: `cd backend && DATABASE_URL=postgresql+asyncpg://user:pass@localhost:5432/postgres uvicorn api.index:app --reload`
- Schema check: `cd backend && python -m py_compile api/index.py`
- Alembic: `cd backend && alembic upgrade head`

## Constraints
- Use async SQLAlchemy + `asyncpg`. No raw SQLite runtime, no sync DB calls.
- No extra heavy packages; keep simple CRUD in route functions, not services.
- Token auth stays simple Bearer token; no Supabase auth gateway in app.

## POS Rules
- Transaction creation must be atomic and lock relevant product rows before stock decrement.
- Always save sale-time price/subtotal, never use current product price for transaction values.
- Return eager-loaded relationships for list endpoints.

## Do Not Add
- Laravel/PHP paths.
- Transaction pooler URLs.
- Soft deletes, multi-tenant abstractions, or admin panels unless explicitly requested.
