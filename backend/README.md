# POSapp Backend

FastAPI backend untuk POS UMKM. Deploy target: **Vercel + Neon PostgreSQL**.

## Stack
- Python 3.11+
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

SQLite auto-created — zero external deps needed.

## Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `APP_ENV` | No | `development` | `development`/`local` → SQLite, `production` → Neon |
| `DATABASE_URL` | Prod only | — | Neon Direct Connection (`postgresql+asyncpg://...:5432/...`) |
| `CORS_ORIGINS` | No | `*` | Comma-separated allowed origins |
| `DEBUG` | No | `true` | Seeds admin user on startup when true |

Auto-detection: `APP_ENV=development` → SQLite, `APP_ENV=production` → requires `DATABASE_URL`.

## Production (Vercel + Neon)

### Required Vercel Env Vars
```
APP_ENV=production
DATABASE_URL=postgresql+asyncpg://postgres:<password>@db.<ref>.neon.tech:5432/postgres
CORS_ORIGINS=https://your-frontend.vercel.app
```

**Gunakan port 5432** (Direct Connection), bukan 6543 (pooler). Config akan reject port 6543.

### Auto-deploy
Merge ke `main` → GitHub Actions trigger → Vercel auto-deploys.

### Cold-start note
Vercel free/Hobby tier cold-starts take **~5–10s** on first request after idle. This is normal — subsequent requests are fast. Consider:
- Use Pro plan for zero-cold-start if latency-sensitive
- Set up a monitoring ping (e.g. UptimeRobot) every 5 min to keep warm

### Rollback
Vercel Dashboard → Deployments → ⋮ → Promote to Production (previous deployment).

## Tests
```bash
cd backend
python -m pytest tests/ -v
```

## Contract
[`API_CONTRACT.md`](./API_CONTRACT.md)
