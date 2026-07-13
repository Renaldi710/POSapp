# POSapp Backend

FastAPI backend untuk POS UMKM. Deployed on **Vercel + Neon PostgreSQL**.

Production URL: https://backend-gold-sigma-21.vercel.app  
Swagger docs: https://backend-gold-sigma-21.vercel.app/docs

## Stack
- Python 3.12+
- FastAPI + uvicorn
- Async SQLAlchemy 2.0 + asyncpg
- aiosqlite (local dev)
- pydantic-settings

## Local Setup
```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env.local
uvicorn app.main:app --reload
# → http://localhost:8000/docs
```

SQLite auto-created — zero external deps needed. Seed data (admin + kasir users, 4 categories, 200+ products) otomatis saat `APP_ENV=local`.

## Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `APP_ENV` | No | `development` | `development`/`local` → SQLite + seed data, `production` → Neon |
| `DATABASE_URL` | Prod only | — | Neon Direct Connection (`postgresql+asyncpg://...:5432/...`) |
| `CORS_ORIGINS` | No | `*` | Comma-separated allowed origins |

## Production (Vercel + Neon)

### Required Vercel Env Vars
```
APP_ENV=production
DATABASE_URL=postgresql://neondb_owner:...@ep-xxx-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
CORS_ORIGINS=https://your-frontend.vercel.app
```

Config otomatis:
- convert `postgresql://` → `postgresql+asyncpg://`
- strip parameter `sslmode` & `channel_binding` (libpq-only, asyncpg reject)
- reject port `6543` (gunakan direct connection port `5432`)

### Seed Data (Production)
Seed data tidak otomatis di production. Jalankan script manual:
```bash
python app/seed_data.py  # atau via koneksi langsung ke Neon
```

### Auto-deploy
Push/merge ke `main` → Vercel auto-deploys.

### Cold-start note
Vercel free/Hobby tier cold-starts ~5–10s. Set monitoring ping tiap 5 menit (UptimeRobot) untuk keep warm, atau upgrade Pro.

### Rollback
Vercel Dashboard → Deployments → ⋮ → Promote to Production.

## Deploy Manual
```bash
vercel deploy --prod --cwd backend
```

## Tests
```bash
cd backend
python -m pytest tests/ -v
```

## API Contract
[`API_CONTRACT.md`](./API_CONTRACT.md)

## Seeded Credentials
| Role  | Email              | Password  |
|-------|--------------------|-----------|
| Admin | admin@pos.app      | password  |
| Kasir | kasir@pos.app      | password  |

## Role-Based Access
| Role  | Products (CRUD) | Categories (CRUD) | Transactions |
|-------|-----------------|-------------------|--------------|
| Admin | ✅ Full access   | ✅ Create + List   | ✅           |
| Kasir | ✅ View only     | ✅ List only       | ✅           |
