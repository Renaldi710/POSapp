# POSapp — VarcaTech

Aplikasi **Point of Sale (POS)** untuk UMKM. Kelola penjualan, stok, dan laporan secara real-time.

## Stack

| Layer | Teknologi |
|-------|-----------|
| **Backend** | Python / FastAPI, asyncpg, Neon PostgreSQL |
| **Mobile** | React Native / Expo, NativeWind |

## Struktur Proyek

```
POSapp/
├── backend/                   # FastAPI API
│   ├── app/
│   │   ├── main.py            # Entrypoint
│   │   ├── config.py          # pydantic-settings
│   │   ├── database.py        # async engine + get_db
│   │   ├── models/            # SQLAlchemy 2.0 models
│   │   ├── schemas/           # Pydantic V2 schemas
│   │   └── routers/           # Route handlers
│   ├── tests/
│   ├── requirements.txt
│   ├── .env.example
│   └── vercel.json
├── frontend/                  # Expo / React Native
├── PRD.md
├── PRD-frontend.md
└── README.md
```

## Backend

```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env.local
uvicorn app.main:app --reload
# → http://localhost:8000/docs
```

Dokumentasi: [`backend/API_CONTRACT.md`](backend/API_CONTRACT.md)

## Frontend

```bash
cd frontend
npm install
npx expo start
```

## Login (development)

```
Email:    admin@pos.app
Password: password
```
*(auto-seeded saat `APP_ENV=local` atau `development`)*

## Deploy

Backend live di Vercel: https://backend-gold-sigma-21.vercel.app

## Lisensi

MIT
