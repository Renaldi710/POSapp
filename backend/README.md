<!-- Banner -->
<div align="center">
  <img src="https://img.shields.io/badge/POS-Backend%20API-FF2D20?style=for-the-badge&logo=laravel&logoColor=white" alt="POS Backend Banner"/>
  <h1>POSapp Backend</h1>
  <p>REST API Backend untuk aplikasi Point of Sale - dibangun dengan Laravel 13</p>

  <!-- Badges -->
  ![Laravel](https://img.shields.io/badge/Laravel-FF2D20?style=for-the-badge&logo=laravel&logoColor=FFF)
  ![PHP](https://img.shields.io/badge/PHP-777BB4?style=for-the-badge&logo=php&logoColor=FFF)
  ![Sanctum](https://img.shields.io/badge/Sanctum-FF2D20?style=for-the-badge&logo=laravel&logoColor=FFF)
  ![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)
</div>

---

## 📋 Daftar Isi

- [Gambaran Umum](#gambaran-umum)
- [Tech Stack](#tech-stack)
- [Persyaratan](#persyaratan)
- [Instalasi](#instalasi)
  - [Clone Repository](#1-clone-repository)
  - [Install Dependencies](#2-install-dependencies)
  - [Konfigurasi Environment](#3-konfigurasi-environment)
  - [Setup Database](#4-setup-database)
  - [Jalankan Server](#5-jalankan-server)
- [Struktur Proyek](#struktur-proyek)
- [API Endpoints](#api-endpoints)
- [API Contract](#api-contract)
- [Testing](#testing)
- [Build untuk Produksi](#build-untuk-produksi)
- [Dokumentasi](#dokumentasi)
- [Kontribusi](#kontribusi)
- [Lisensi](#lisensi)

---

## 🎯 Gambaran Umum

POSapp Backend adalah REST API yang dibangun dengan Laravel 13 untuk mendukung aplikasi Point of Sale mobile. API ini menangani autentikasi, manajemen produk, kategori, dan transaksi dengan menggunakan Laravel Sanctum untuk token-based authentication.

### Fitur Utama

- 🔐 **Autentikasi** — Token-based auth dengan Laravel Sanctum
- 📦 **Produk** — CRUD lengkap dengan validasi
- 🏷️ **Kategori** — Manajemen kategori produk
- 💳 **Transaksi** — Proses penjualan dan receipt
- 📊 **Reports** — Statistik dashboard

---

## 🛠️ Tech Stack

| Teknologi | Version | Deskripsi |
|-----------|---------|-----------|
| Laravel | ^13.8 | PHP Framework |
| PHP | ^8.3 | Runtime |
| Laravel Sanctum | ^4.3 | API Authentication |
| MySQL/SQLite | - | Database |
| Composer | ^2.x | Package Manager |

### Dependencies

```json
{
  "laravel/framework": "^13.8",
  "laravel/sanctum": "^4.3",
  "laravel/tinker": "^3.0"
}
```

### Dev Dependencies

```json
{
  "fakerphp/faker": "^1.23",
  "laravel/pint": "^1.27",
  "mockery/mockery": "^1.6",
  "phpunit/phpunit": "^12.5.12"
}
```

---

## 📌 Persyaratan

Sebelum memulai, pastikan sudah memenuhi:

| Software | Minimum Version | Purpose |
|----------|----------------|---------|
| PHP | 8.3+ | Runtime |
| Composer | 2.x | Package Manager |
| MySQL | 8.0+ | Database (production) |
| SQLite | 3.x | Database (development) |
| Node.js | 18.x+ | Optional (frontend assets) |

---

## 🚀 Instalasi

### 1. Clone Repository

```bash
git clone https://github.com/Renaldi710/POSapp.git
cd POSapp/backend
```

### 2. Install Dependencies

```bash
composer install
```

### 3. Konfigurasi Environment

Salin file contoh environment:

```bash
cp .env.example .env
```

Edit file `.env`:

```env
# Application
APP_NAME=POSapp
APP_ENV=local
APP_KEY=
APP_DEBUG=true
APP_URL=http://localhost:8000

# Database (Development - SQLite)
DB_CONNECTION=sqlite
DB_DATABASE=/path/to/database.sqlite

# Database (Production - MySQL)
# DB_CONNECTION=mysql
# DB_HOST=127.0.0.1
# DB_PORT=3306
# DB_DATABASE=posapp
# DB_USERNAME=root
# DB_PASSWORD=

# Sanctum
SANCTUM_STATEFUL_DOMAINS=localhost,localhost:8000,127.0.0.1,127.0.0.1:8000
```

### 4. Setup Database

```bash
# Generate application key
php artisan key:generate

# Run migrations
php artisan migrate

# Seed initial data (admin & cashier user)
php artisan db:seed

# Atau gunakan command setup single-step
composer setup
```

### 5. Jalankan Server

```bash
php artisan serve
```

Backend akan berjalan di `http://localhost:8000`

---

## 📂 Struktur Proyek

```
backend/
├── app/
│   ├── Http/
│   │   ├── Controllers/        # API Controllers
│   │   └── Middleware/         # Auth middleware
│   └── Models/                 # Eloquent Models
├── config/
│   ├── app.php
│   ├── sanctum.php
│   └── database.php
├── database/
│   ├── migrations/             # Database migrations
│   └── seeders/                # Database seeders
├── routes/
│   └── api.php                 # API routes
├── tests/
│   └── Unit/                   # Unit tests
├── composer.json
├── .env.example
└── README.md
```

### Key Files

| File | Deskripsi |
|------|-----------|
| `routes/api.php` | Definisi semua API endpoints |
| `app/Models/` | Model Eloquent (User, Product, Category, Transaction) |
| `database/migrations/` | Schema database |
| `database/seeders/` | Sample data untuk testing |

---

## 🔌 API Endpoints

### Authentication

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| POST | `/api/tokens/create` | Login user |
| GET | `/api/user` | Get current user |

### Products

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/api/products` | List all products |
| POST | `/api/products` | Create product |
| GET | `/api/products/{id}` | Get product detail |
| PUT | `/api/products/{id}` | Update product |
| DELETE | `/api/products/{id}` | Delete product |

### Categories

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/api/categories` | List all categories |
| POST | `/api/categories` | Create category |
| PUT | `/api/categories/{id}` | Update category |
| DELETE | `/api/categories/{id}` | Delete category |

### Transactions

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/api/transactions` | List all transactions |
| POST | `/api/transactions` | Create new transaction |

### Reports

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/api/health` | Health check |
| GET | `/api/reports` | Dashboard statistics |

---

## 📄 API Contract

Dokumentasi lengkap API tersedia di [API_CONTRACT.md](./API_CONTRACT.md)

### Contoh Request

**Login:**
```bash
curl -X POST http://localhost:8000/api/tokens/create \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@example.com", "password": "password"}'
```

**Get Products:**
```bash
curl -X GET http://localhost:8000/api/products \
  -H "Authorization: Bearer {token}"
```

**Create Transaction:**
```bash
curl -X POST http://localhost:8000/api/transactions \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"items": [{"product_id": 1, "quantity": 2}], "payment_method": "cash"}'
```

---

## 🧪 Testing

```bash
# Run all tests
composer test

# Run specific test
php artisan test --filter=ProductTest
```

### Test Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@example.com | password |
| Cashier | cashier@example.com | password |

---

## 📦 Build untuk Produksi

### Environment Production

```bash
# Set environment
APP_ENV=production
APP_DEBUG=false

# Generate key
php artisan key:generate

# Cache config
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Optimasi
composer install --optimize-autoloader --no-dev
```

### Deployment

```bash
# Deploy ke server
php artisan migrate --force
php artisan db:seed --force
```

---

## 📚 Dokumentasi

| Document | Lokasi | Deskripsi |
|----------|--------|-----------|
| API Contract | `API_CONTRACT.md` | Dokumentasi lengkap API |
| Main README | `../README.md` | Dokumentasi project utama |
| Frontend README | `../frontend/README.md` | Dokumentasi mobile app |

---

## 🤝 Kontribusi

Kontribusi sangat diterima! Ikuti langkah berikut:

1. **Fork** repository ini
2. Buat **Branch** baru (`git checkout -b feature/AmazingFeature`)
3. **Commit** perubahan (`git commit -m 'Add AmazingFeature'`)
4. **Push** ke branch (`git push origin feature/AmazingFeature`)
5. Buka **Pull Request**

### Guidelines

- ✅ Ikuti Laravel best practices
- ✅ Jalankan `composer pint` untuk code style
- ✅ Test sebelum submit PR
- 📖 Update dokumentasi jika perlu

---

## 📄 Lisensi

Project ini dilisensikan di bawah MIT License. Lihat file [../LICENSE](../LICENSE) untuk informasi lebih lanjut.

---

## 👨‍💻 Author

**Renaldi**

- GitHub: [@Renaldi710](https://github.com/Renaldi710)
- Project Link: [POSapp](https://github.com/Renaldi710/POSapp)

---

<div align="center">
  <p>Made with ❤️ for Indonesian MSMEs</p>
</div>
