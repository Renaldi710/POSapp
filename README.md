# POSapp — VarcaTech

Aplikasi **Point of Sale (POS)** untuk UMKM berbasis Android. Mengelola penjualan, inventaris stok, dan laporan keuangan secara real-time.

---

## Tech Stack

| Layer | Teknologi |
|-------|-----------|
| **Backend** | Laravel 11 / PHP 8.5, SQLite, Sanctum Auth |
| **Android** | Kotlin, Jetpack Compose, Material3, Hilt, Room |

---

## Struktur Proyek

```
POSapp/
├── backend/                 # Laravel API (PHP)
│   ├── app/
│   ├── database/
│   ├── routes/
│   └── ...
├── front/                   # Android Native (Kotlin + Compose)
│   └── android/
│       ├── app/             # Module :app
│       └── build.gradle.kts
├── prd-android.md           # PRD Android
├── README.md
└── LICENSE (MIT)
```

---

## Cara Menjalankan

### 1. Backend (Laravel)

```bash
cd backend
cp .env.example .env   # sudah ada .env dengan SQLite
composer install
php artisan migrate --seed   # seeder: admin@pos.app / password
php artisan serve            # http://localhost:8000
```

### 2. Android Native (Kotlin)

```bash
cd front/android
# Pastikan local.properties ada (sdk.dir)
./gradlew :app:installDebug   # install ke emulator running
```

Atau buka `front/android/` di Android Studio → **Sync** → **Run ▶**

**Konfigurasi Android:**
- `minSdk`: 24, `targetSdk`: 34, `compileSdk`: 34
- Kotlin `1.9.22`, AGP `8.2.2`, Compose BOM `2024.02.00`
- Hilt `2.50`, Room `2.6.1`, Retrofit `2.9.0`
- **Orientation:** `sensorLandscape` (tablet landscape)
- API endpoint: `http://10.0.2.2:8000/api/` (host loopback dari emulator)

---

## Login

```
Email:    admin@pos.app
Password: password
```

---

## Fitur Android Native

| Screen | Fitur |
|--------|-------|
| **Login** | Email + password, token-based auth |
| **Dashboard** | 4 stat cards, 6 nav buttons (horizontal scroll), recent transactions |
| **POS** | Grid produk (search + kategori filter), cart panel 320dp, subtotal + pajak 11% |
| **Payment** | 3 metode (Tunai/QRIS/Kartu), grid denominasi Rp5k–Rp100k, kalkulator kembalian |
| **Products** | List produk CRUD |
| **Categories** | List kategori CRUD |
| **Customers** | List pelanggan CRUD |
| **Transactions** | Riwayat transaksi + detail receipt |
| **Settings** | Profile, store info, printer (Bluetooth), server URL |
| **Inventaris** | Stock list with green/yellow/red indicators, search, stock adjustment |
| **Laporan** | Daily report summary (transactions, revenue, top products), date picker |
| **User Management** | Current user info |
| **Bluetooth** | Scan, pair, connect thermal printer |

---

## Lisensi

MIT
