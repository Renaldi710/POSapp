# POSapp Backend

REST API POS internal untuk mobile app. Backend ini pakai **Python FastAPI + SQLite**, bukan Laravel.

## Stack

- Python 3.11+
- FastAPI
- SQLite
- Vercel Python serverless

## Setup Lokal

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn api.index:app --reload
```

API lokal jalan di:

```text
http://localhost:8000/api
```

## Environment

Optional:

```env
DATABASE_PATH=./database.sqlite
```

Default DB lokal: `backend/database.sqlite`.

Seed default dibuat otomatis kalau DB kosong:

```text
Email: admin@pos.app
Password: password
```

## Deploy Vercel

Root directory: `backend`

Vercel butuh file:

```text
api/index.py
requirements.txt
vercel.json
```

Environment optional:

```env
DATABASE_PATH=/tmp/database.sqlite
```

Catatan: SQLite di Vercel serverless **tidak persistent**. Cocok buat dummy/internal demo, bukan data penting.

## Commands

```bash
# install deps
pip install -r requirements.txt

# dev server
uvicorn api.index:app --reload

# smoke check
python -m py_compile api/index.py
```

## API

Contract lengkap: [`API_CONTRACT.md`](./API_CONTRACT.md)

Endpoint utama:

| Method | Endpoint | Auth | Fungsi |
|---|---|---|---|
| GET | `/api/health` | No | Health check |
| POST | `/api/tokens/create` | No | Login token |
| GET | `/api/user` | Yes | Current user |
| GET/POST | `/api/categories` | Yes | Category CRUD |
| GET/POST | `/api/products` | Yes | Product CRUD |
| GET/POST | `/api/transactions` | Yes | Transaction CRUD |
| GET | `/api/reports/daily` | Yes | Daily report |

Auth pakai header:

```http
Authorization: Bearer <token>
```

## POS Rules

- Checkout wajib atomik: cek stok, kurangi stok, simpan transaction/items dalam satu DB transaction.
- Simpan `price` saat transaksi; report jangan pakai harga produk terbaru.
- Keep simple: stdlib `sqlite3`, tanpa SQLAlchemy/Alembic sampai benar-benar perlu.
