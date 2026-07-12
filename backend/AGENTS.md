# AGENTS.md - POS Kasir UMKM (FastAPI Backend)

## Context
- `backend/` sekarang Python FastAPI API untuk app POS internal/native.
- Target deploy: Vercel Python serverless; jangan tambah ulang Laravel/PHP flow.
- DB dummy/internal: SQLite. Untuk Vercel, data filesystem tidak persistent; aman hanya untuk demo/internal sementara.

## Commands
- Install: `cd backend && pip install -r requirements.txt`
- Local dev: `cd backend && uvicorn api.index:app --reload`
- Smoke check: `cd backend && python -m py_compile api/index.py`
- Vercel entrypoint: `backend/api/index.py` exports `app`.

## Constraints
- Keep API paths compatible with mobile contract: `/api/health`, `/api/tokens/create`, `/api/user`, `/api/categories`, `/api/products`, `/api/transactions`, `/api/reports/daily`.
- Use stdlib `sqlite3` unless pain is real; no SQLAlchemy/Alembic for this dummy backend.
- Token auth stays simple Bearer token. No OAuth, no Supabase Auth, no session cookies.
- Keep schema small: users, categories, products, transactions, transaction_items, tokens.

## POS Rules
- Transaction creation must be atomic: validate all items, check stock, decrement stock, insert transaction/items in one DB transaction.
- Save item `price` at sale time; reports must use `transaction_items.subtotal`, not current product price.
- Seed default admin if DB empty: `admin@pos.app` / `password`.

## Do Not Add
- Laravel/PHP files for new backend work.
- Repository/service layers for CRUD.
- Paid DB assumptions.
- Admin panels, queues, workers, or codegen unless explicitly asked.
