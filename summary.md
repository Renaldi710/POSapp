# POSapp — Point of Sale Kasir UMKM VarcaTech

## Stack

 | Layer | Teknologi |
|-------|-----------|
| Mobile | React Native (Expo SDK 57) + NativeWind (Tailwind CSS) |
| Backend | FastAPI + SQLAlchemy 2.0 (async) |
| Database | SQLite (local) / Neon Postgres (production) |
| Auth | Bearer token via `expo-secure-store` |
| State | Zustand + TanStack Query |
| Icons | lucide-react-native |
| Font | Inter (@expo-google-fonts/inter) |
| PDF | expo-print + expo-sharing |
| Image | expo-image-picker + expo-image-manipulator (camera, kompresi, base64) |
| File | expo-file-system + expo-document-picker (export CSV, import CSV) |

## Struktur

```
POSapp/
├── frontend/                    # React Native (Expo Router)
│   ├── app/
│   │   ├── (auth)/              # Login screen
│   │   ├── (tabs)/              # Main screens (POS, Dashboard, Laporan, Inventaris, User)
│   │   ├── product/             # Product detail/create/edit
│   │   ├── scan.tsx             # Barcode scanner
│   │   └── transaction/         # Transaction detail
│   ├── src/
│   │   ├── api/                 # Axios client, endpoints, types
│   │   ├── components/
│   │   │   ├── layout/          # ScreenLayout, Sidebar, SidebarOverlay, TopHeader, ProgressBar
│   │   │   └── ui/              # Button, Input, Badge, DataTable, StatCard, ProductCard
│   │   ├── features/            # Per-module hooks, store, components
│   │   │   ├── auth/            # useAuth, useAuthStore
│   │   │   ├── cart/            # useCartStore, CartBar, CartPanel
│   │   │   ├── products/        # useProducts, ProductCard
│   │   │   ├── inventory/       # useInventory, useStockMutation, useProductMutation, ProductForm, useImportProducts
│   │   │   ├── transactions/    # useCheckout, useTransactions, PaymentDialog
│   │   │   ├── users/           # useUsers (planned)
│   │   │   └── reports/         # useReports
│   │   └── lib/                 # printer.ts, invoice.ts, storage.ts, queryClient.ts, image.ts, export.ts
│   └── design-system/posapp/    # Design tokens & rules (MASTER.md)
├── backend/                     # FastAPI
│   └── app/
│       ├── models/              # SQLAlchemy models (User, Product, Category, Transaction, dll)
│       ├── schemas/             # Pydantic V2 request/response
│       └── routers/             # Route handlers (products, transactions)
├── design-system/               # Design docs
├── API_CONTRACT-2.md            # API contract version 2
├── PRD-frontend.md              # PRD frontend
├── revisi.md                    # Checklist item
└── summary.md                   # Dokumen ini
```

## Cara Run

**Backend:**
```bash
cd backend
cp .env.example .env
uvicorn app.main:app --reload
# Docs: http://localhost:8000/docs
```

**Frontend:**
```bash
cd frontend
npm install
npx expo start
# Scan QR dengan Expo Go, atau tekan 'a' / 'i' / 'w'
```

**TypeScript check:**
```bash
cd frontend
npx tsc --noEmit    # harus zero errors
npx expo-doctor     # project health check
```

**EAS Build (APK):**
```bash
cd frontend
npx eas build --profile preview --platform android --non-interactive
```

## Endpoint API

Backend live: https://backend-gold-sigma-21.vercel.app

| Group | Endpoint | Status |
|-------|----------|--------|
| Health | `GET /health`, `GET /api/health` | ✅ |
| Auth | `POST /api/tokens/create`, `GET /api/user` | ✅ |
| Categories | `GET /api/categories`, `POST /api/categories` | ✅ |
| Products | CRUD `/api/products` | ✅ |
| Transactions | `POST /api/transactions`, `GET /api/transactions`, `GET /api/transactions/{id}`, `GET .../{id}/receipt` | ✅ |
| Reports | `GET /api/reports/daily?date=` | ✅ |

**Role-based access:**
| Role | Create/Edit Produk | Create/Edit Kategori | Transaksi |
|------|-------------------|---------------------|-----------|
| admin | ✅ | ✅ | ✅ |
| kasir | ❌ (403) | ❌ (403) | ✅ |

## Screens

| Screen | Route | Fungsi |
|--------|-------|--------|
| Login | `/(auth)/login` | Auth Email + Password, card 480px, lucide icons |
| POS/Kasir | `/(tabs)` | Product grid, filter kategori, cart panel responsive, search prefix sort, checkout |
| Dashboard | `/(tabs)/dashboard` | 4 stat cards, bar chart 7 hari, low‑stock products real‑time (useProducts), tap → inventaris with highlight |
| Laporan | `/(tabs)/laporan` | Period toggle (hari/minggu/bulan), payment breakdown, transaksi table, top produk, **export CSV** |
| Inventaris | `/(tabs)/inventaris` | 4 stat cards, stock progress bar, CRUD produk (admin) / view‑only (kasir), **Import CSV (admin)**, `?highlight=` auto‑scroll + blue row |
| User Management | `/(tabs)/user-management` | User table (mock), security info, activity log |
| Scan | `/scan` | Barcode scanner (QR, EAN, Code128, Code39) |
| Product Detail | `/product/{id}` | Item info, **image**, stock control, quick mutation, history |
| Product Create | `/product/create` | Form tambah produk (admin only) — **kamera/galeri + kompresi otomatis** |
| Product Edit | `/product/edit/{id}` | Form edit produk (admin only) — **upload/replace image** |

## Role-Based Sidebar

| Menu | Admin | Kasir |
|------|-------|-------|
| Home | ✅ | ✅ |
| Laporan | ✅ | ✅ |
| Dashboard | ✅ | ✅ |
| Produk (→ Inventaris) | ✅ | ❌ |
| Inventaris | ✅ | ✅ |
| User Management | ✅ | ❌ |

## Design Tokens

```
Primary:    #004AC6 (dark) / #2563EB (light)
Page BG:    #F7F9FB
Card BG:    #FFFFFF
Border:     #C3C6D7
Input BG:   #F2F4F6
Search BG:  #ECEEF0
Text:       #191C1E (dark) / #434655 (medium) / #737686 (light)
Sidebar:    active bg #D0E1FB
Font:       Inter (400/600/700)
Radius:     xl=12px, 2xl=16px, 3xl=24px, full=9999px
```

## Responsive Layout

- **Tablet (≥768px):** Sidebar kiri 280px + TopHeader + konten
- **Phone (<768px):** TopHeader dengan hamburger menu + sidebar overlay slide kiri (animated)
- **POS cart:** Tablet → right panel 380px; Phone → overlay slide dari kanan via Modal
- **Payment:** Full-screen modal overlay dengan method cards (Tunai/QRIS/Kartu)

## Payment Flow

1. User tap "Bayar Sekarang"
2. Pilih metode (Tunai/QRIS/Kartu)
3. Input uang diterima (jika tunai) → lihat kembalian real-time
4. Toggle Cetak Struk (thermal printer — console.log, butuh EAS Build)
5. Toggle Cetak Invoice PDF (expo-print → auto download/share)
6. Konfirmasi → API checkout → PDF otomatis (jika diaktifkan) → cart clear

## Fitur Baru (v2)

### 1. Export Transaksi CSV
- Tombol **Ekspor** di Laporan → download semua transaksi sebagai CSV
- Filter berdasarkan date range
- File dibuka via share sheet (Save to Files / Share / Print)
- `src/lib/export.ts` — fetch → FileSystem → Sharing

### 2. Image Produk (Camera + Kompresi)
- Tombol **"Ambil Foto"** (kamera) dan **"Pilih Galeri"** di form tambah/edit produk
- Kompresi otomatis: resize 800px + quality 0.5 → ~50-100KB (`expo-image-manipulator`)
- Disimpan sebagai base64 di field `image_url`
- Tampil di card produk (`ProductCard`) dan detail produk (`product/[id]`)
- `src/lib/image.ts` — pickFromCamera / pickFromGallery / compressImage / uriToBase64

### 3. Import CSV Produk (Admin Only)
- Tombol **"Import CSV"** di Inventaris (admin only, sebelah "+ Tambah Baru")
- Pilih file CSV → upload via `POST /api/products/import` → Alert hasil (created/skipped/errors)
- `src/features/inventory/hooks/useImportProducts.ts` — DocumentPicker → FormData → API

### 4. Efisiensi APK
- Hapus `expo-location` + `src/lib/location.ts` (dead code — tidak dipanggil screen manapun)
- Enable `hermesBytecode: true` di EAS Build (JS bundle ~40% lebih kecil)
- **Ukuran APK turun ~300KB native + 40% JS bundle**

## Catatan

- Backend deployed di Vercel: `https://backend-gold-sigma-21.vercel.app`
- Auth, Categories, Reports endpoint **sudah live** di production
- User management screen masih **mock data** (CRUD API belum ada)
- Invoice PDF otomatis auto-download via share sheet setelah checkout
- Checkout mengirim `uang_diterima` ke API
- Repro APK via EAS: `npx eas build --profile preview --platform android`
