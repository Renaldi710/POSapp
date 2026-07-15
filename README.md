# POSapp — VarcaTech

Aplikasi **Point of Sale (POS)** untuk UMKM. Kelola penjualan, stok, dan laporan secara real-time.

## Stack

| Layer | Teknologi |
|-------|-----------|
| **Backend** | Python / FastAPI, asyncpg, Neon PostgreSQL |
| **Mobile** | React Native / Expo SDK 57, NativeWind (Tailwind), Zustand, TanStack Query |
| **Icons** | lucide-react-native |
| **Font** | Inter |
| **PDF** | expo-print + expo-sharing |
| **Images** | expo-image-picker + expo-image-manipulator (camera, compress, base64) |
| **Files** | expo-file-system + expo-document-picker (export/import CSV) |
| **Build** | EAS Build (Android APK, Hermes) |

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
│   ├── app/                   # Expo Router screens (auth, tabs, product, scan)
│   ├── src/
│   │   ├── api/               # Axios client, endpoints, types
│   │   ├── components/        # Reusable UI + layout components
│   │   ├── features/          # Per-module hooks/store/components
│   │   └── lib/               # printer, invoice, storage, queryClient
│   └── design-system/         # Design tokens & rules
├── PRD-frontend.md
└── README.md
```

## Frontend Screens

| Screen | Deskripsi |
|--------|-----------|
| **Login** | Auth Email + Password, card 480px, lucide icons, Inter font |
| **POS / Kasir** | Product grid, kategori filter, cart panel responsive (tablet sidebar / phone overlay), search prefix sort |
| **Dashboard** | 4 KPI cards, bar chart 7 hari, low‑stock products (real‑time from API), tap → inventaris with auto‑scroll |
| **Laporan** | Period toggle (hari/minggu/bulan), payment breakdown, transaksi table, top produk, **export CSV** |
| **Inventaris** | 4 stat cards, stock progress bar, CRUD produk (admin) / view‑only (kasir), **Import CSV (admin)**, `?highlight=` param auto‑scrolls to row |
| **User Management** | User table (mock data), security info cards, activity log |
| **Product Detail** | Item info, **image**, stock control, quick stock mutation, mutation history |
| **Product Create** | Form tambah produk (admin only) — **kamera/galeri + kompresi otomatis** |
| **Product Edit** | Form edit produk (admin only) — **upload/replace image** |
| **Scan** | Barcode scanner (QR, EAN, Code128, Code39) → add to cart |

## Role-Based Access

| Menu Sidebar | Admin | Kasir |
|-------------|-------|-------|
| Home | ✅ | ✅ |
| Laporan | ✅ | ✅ |
| Dashboard | ✅ | ✅ |
| Produk (→ Inventaris) | ✅ | ❌ |
| Inventaris | ✅ | ✅ |
| User Management | ✅ | ❌ |
| Tambah/Edit Produk | ✅ | ❌ (redirect) |

## New Features (v2)

### Export Transaksi CSV
- Tombol **Ekspor** di Laporan → download CSV langsung ke share sheet
- Filter otomatis berdasarkan date range yang dipilih

### Image Produk (Camera + Kompresi)
- "Ambil Foto" (kamera) / "Pilih Galeri" di form tambah/edit produk
- Kompresi otomatis: 800px + quality 0.5 → ~50-100KB (`expo-image-manipulator`)
- Disimpan sebagai base64 di field `image_url`

### Import CSV (Admin Only)
- Tombol "Import CSV" di Inventaris (admin only)
- Pilih file CSV → upload → hasil (created/skipped/errors)

### Efisiensi APK
- Hapus `expo-location` (dead code)
- Hermes bytecode enabled
- **Ukuran APK turun ~300KB native + 40% JS bundle**

## Invoice PDF

Setelah checkout sukses, jika toggle "Cetak Invoice" aktif:
1. Generate HTML invoice (kop toko, items table, total, metode, uang diterima, kembalian)
2. Konversi ke PDF via `expo-print`
3. Buka share sheet → user bisa Save to Files / Share / Print

## Backend

```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env.local
uvicorn app.main:app --reload
# → http://localhost:8000/docs
```

## Frontend

```bash
cd frontend
npm install
npx expo start
# w → web, i → iOS, a → Android

# TypeScript check
npx tsc --noEmit

# Expo health check
npx expo-doctor

# Build APK
npx eas build --profile preview --platform android
```

## Desain

Responsive layout — sidebar 280px di tablet (≥768px), hamburger menu di phone.  
Warna primer `#004AC6`, page bg `#F7F9FB`, font Inter, icons lucide-react-native.  
Detail design tokens: `frontend/design-system/posapp/MASTER.md`

## Login (development)

```
Email:    admin@pos.app
Password: password

Email:    kasir@pos.app
Password: password
```
*(auto-seeded saat `APP_ENV=local` atau `development`)*

## Deploy

- Backend: https://backend-gold-sigma-21.vercel.app
- APK: Build via EAS → `npx eas build --profile preview --platform android`

## Lisensi

MIT
