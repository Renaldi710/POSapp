# POSapp — Product Requirements Document

> **Versi:** 1.0.0  
> **Tanggal:** 2026-07-10  
> **Author:** Renaldi  
> **Repo:** [github.com/Renaldi710/POSapp](https://github.com/Renaldi710/POSapp)

---

## 1. Gambaran Umum

### 1.1 Apa itu POSapp?

POSapp adalah aplikasi Point of Sale (Kasir) berbasis mobile dengan backend REST API, dirancang khusus untuk kebutuhan **UMKM di Indonesia**.

### 1.2 Tujuan Produk

- Mempermudah proses penjualan di toko/usaha kecil
- Manajemen produk dan stok yang efisien
- Multi-role user (Admin & Cashier) dalam satu aplikasi
- Riwayat transaksi lengkap untuk laporan harian

### 1.3 Target Pengguna

| Sektor | Contoh |
|--------|--------|
| 🏪 Retail | Minimarket, warung, toko kelontong |
| 🍔 F&B | Rumah makan, café, kantin |
| 👔 Service | Laundry, barber shop, salon |

---

## 2. User Roles

| Role | Akses |
|------|-------|
| **Admin** | Semua fitur — Dashboard, POS, Manajemen Produk, Manajemen Kategori, Riwayat Transaksi |
| **Cashier** | Dashboard, POS, Riwayat Transaksi |

---

## 3. Fitur

### 3.1 Autentikasi

| Fitur | Deskripsi |
|-------|-----------|
| Login | Email + password |
| Session | Token-based via Laravel Sanctum |
| Storage | Token disimpan di AsyncStorage |
| Auto-logout | Otomatis logout saat token expire atau 401 |
| Device name | Kirim `device_name: "mobile-app"` saat login |

**Test Credentials:**

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@example.com | password |
| Cashier | cashier@example.com | password |

---

### 3.2 Dashboard

- **Statistik KPI:**
  - Total Produk
  - Total Kategori
  - Total Transaksi
  - Total Pendapatan
- **Transaksi Terakhir:** 5 transaksi terbaru

---

### 3.3 Point of Sale (POS)

| Fitur | Deskripsi |
|-------|-----------|
| Grid Produk | Tampilan 2 kolom dengan search & filter kategori |
| Real-time Stok | Tampilkan stok produk saat ini |
| Keranjang | Tambah item, ubah jumlah (+/-), hapus item |
| Validasi Stok | Tidak bisa tambah melebihi stok tersedia |
| Checkout | Buat transaksi, kurangi stok otomatis |
| Struk/Receipt | Modal receipt dengan detail transaksi + tombol print (placeholder) |

---

### 3.4 Manajemen Produk (Admin Only)

| Fitur | Deskripsi |
|-------|-----------|
| List Produk | Tampilkan semua produk dengan kategori & stok |
| Create | Tambah produk baru (nama, kategori, harga, stok) |
| Update | Edit produk (nama, kategori, harga, stok) |
| Delete | Hapus produk dengan konfirmasi |
| Category Picker | Modal picker untuk pilih kategori |
| Real-time Refresh | List refresh otomatis setelah perubahan |

---

### 3.5 Manajemen Kategori (Admin Only)

| Fitur | Deskripsi |
|-------|-----------|
| List Kategori | Tampilkan semua kategori + jumlah produk |
| Create | Tambah kategori baru (nama) |
| Update | Edit nama kategori |
| Delete | Hapus kategori dengan konfirmasi |

---

### 3.6 Riwayat Transaksi

| Fitur | Deskripsi |
|-------|-----------|
| List Transaksi | Semua transaksi (ID, tanggal, kasir, total, status) |
| Detail | View receipt modal dengan item, jumlah, dan detail |
| Status | Selalu `"completed"` saat checkout berhasil |

---

## 4. Tech Stack

### 4.1 Frontend (Mobile App)

```
┌────────────────────────────────────────────────────┐
│                    FRONTEND                        │
├────────────────────────────────────────────────────┤
│  React Native (Expo SDK 49)                       │
│  React Navigation v6 (Stack + Bottom Tabs)        │
│  Axios (HTTP Client)                              │
│  AsyncStorage (Token Persistence)                 │
│  MaterialCommunityIcons (Icons)                   │
│  Context API (State Management)                   │
└────────────────────────────────────────────────────┘
```

### 4.2 Backend (REST API)

```
┌────────────────────────────────────────────────────┐
│                     BACKEND                        │
├────────────────────────────────────────────────────┤
│  Laravel 13                                       │
│  PHP 8.3+                                         │
│  Laravel Sanctum 4.3 (API Token Auth)             │
│  MySQL / SQLite (Database)                       │
└────────────────────────────────────────────────────┘
```

---

## 5. Arsitektur & Struktur Proyek

```
POSapp/
├── README.md                # Dokumentasi utama
├── LICENSE                  # MIT License
│
├── backend/                 # Laravel REST API
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/  # API Controllers
│   │   │   └── Middleware/   # Auth Middleware
│   │   └── Models/          # Eloquent Models
│   ├── config/              # Laravel Config
│   ├── database/
│   │   ├── migrations/      # Schema Database
│   │   └── seeders/         # Sample Data
│   ├── routes/
│   │   └── api.php          # API Routes
│   ├── composer.json
│   ├── .env.example
│   ├── API_CONTRACT.md
│   └── README.md
│
└── frontend/                # React Native Mobile App
    ├── App.js               # Root Component
    ├── package.json
    ├── app.json             # Expo Config
    ├── .env.example
    ├── API_CONTRACT.md
    ├── PRD.md
    ├── summary.md
    ├── README.md
    │
    └── src/
        ├── utils/
        │   └── constants.js       # API_URL config
        ├── services/
        │   ├── api.js             # Axios instance + interceptors
        │   ├── auth.js            # login(), getUser()
        │   ├── products.js        # CRUD products
        │   ├── categories.js      # CRUD categories
        │   └── transactions.js    # getAll(), getById(), create()
        ├── context/
        │   ├── AuthContext.js     # Auth state management
        │   └── POSContext.js      # POS/Cart state management
        ├── navigation/
        │   ├── AppNavigator.js    # Root navigation
        │   ├── AuthStack.js       # Login stack
        │   └── MainTabs.js        # Bottom tabs (role-based)
        ├── screens/
        │   ├── LoginScreen.js
        │   ├── DashboardScreen.js
        │   ├── POSScreen.js
        │   ├── ProductsScreen.js
        │   ├── CategoriesScreen.js
        │   └── TransactionsScreen.js
        └── components/
            ├── ProductCard.js
            ├── CartItem.js
            └── ReceiptModal.js
```

---

## 6. API Endpoints

### 6.1 Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/tokens/create` | Login user |
| GET | `/api/user` | Get current user (auth required) |

### 6.2 Products

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | List all products |
| POST | `/api/products` | Create product |
| GET | `/api/products/{id}` | Get product detail |
| PUT | `/api/products/{id}` | Update product |
| DELETE | `/api/products/{id}` | Delete product |

### 6.3 Categories

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/categories` | List all categories |
| POST | `/api/categories` | Create category |
| PUT | `/api/categories/{id}` | Update category |
| DELETE | `/api/categories/{id}` | Delete category |

### 6.4 Transactions

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/transactions` | List all transactions |
| POST | `/api/transactions` | Create transaction |
| GET | `/api/transactions/{id}` | Get transaction detail |

### 6.5 Reports

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/reports` | Dashboard statistics |
| GET | `/api/reports/daily?date=YYYY-MM-DD` | Daily report |

---

## 7. Data Models

### 7.1 User
| Field | Type | Description |
|-------|------|-------------|
| id | integer | Primary key |
| name | string | User name |
| email | string | User email (unique) |
| role | string | "admin" or "cashier" |
| password | string | Hashed password |
| created_at | timestamp | Creation date |

### 7.2 Category
| Field | Type | Description |
|-------|------|-------------|
| id | integer | Primary key |
| name | string | Category name |
| created_at | timestamp | Creation date |

### 7.3 Product
| Field | Type | Description |
|-------|------|-------------|
| id | integer | Primary key |
| category_id | integer | Foreign key to categories |
| name | string | Product name |
| price | decimal | Product price |
| stock | integer | Stock quantity |
| created_at | timestamp | Creation date |

### 7.4 Transaction
| Field | Type | Description |
|-------|------|-------------|
| id | integer | Primary key |
| user_id | integer | Foreign key to users (kasir) |
| total_amount | decimal | Total transaction amount |
| status | string | "completed" |
| created_at | timestamp | Transaction date |

### 7.5 TransactionItem
| Field | Type | Description |
|-------|------|-------------|
| id | integer | Primary key |
| transaction_id | integer | Foreign key to transactions |
| product_id | integer | Foreign key to products |
| quantity | integer | Quantity sold |
| price | decimal | Price at time of sale |
| subtotal | decimal | quantity × price |

---

## 8. Non-Functional Requirements

### 8.1 Performance
- Responsive UI untuk tablet/mobile
- Real-time stock validation
- Optimistic UI updates where applicable

### 8.2 Security
- Token-based authentication (Laravel Sanctum)
- Auto-logout on 401/unauthorized
- HTTPS recommended for production
- Role-based access control di backend

### 8.3 Error Handling
- User-friendly error messages
- Graceful handling of network errors
- Validation errors from API displayed to user

---

## 9. Future Enhancements

- [ ] Shift management (open/close shift)
- [ ] Void/cancel transaction dengan stock reversal
- [ ] Customer management
- [ ] Discounts/promotions
- [ ] Offline mode dengan queue
- [ ] Barcode scanning (camera)
- [ ] Print receipt via Bluetooth thermal printer
- [ ] Multi-language support

---

## 10. Instalasi & Setup

### Backend
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan db:seed
php artisan serve
```

### Frontend
```bash
cd frontend
pnpm install
cp .env.example .env
# Edit .env - set API_URL
pnpm start
```

### Environment Configuration

**Frontend (.env):**
```env
# Android Emulator
API_URL=http://10.0.2.2:8000/api

# iOS Simulator
API_URL=http://localhost:8000/api

# Physical Device
API_URL=http://<YOUR_IP>:8000/api
```

---

## 11. Dependencies

### Frontend
| Package | Version | Purpose |
|---------|---------|---------|
| react-native | 0.72.6 | UI Framework |
| expo | ~49.0.0 | Dev Platform |
| @react-navigation/native | ^6.1.9 | Navigation |
| @react-navigation/bottom-tabs | ^6.5.11 | Tab Navigation |
| @react-navigation/stack | ^6.3.20 | Stack Navigation |
| axios | ^1.6.2 | HTTP Client |
| @react-native-async-storage/async-storage | 1.18.2 | Local Storage |
| @expo/vector-icons | * | Icons |

### Backend
| Package | Version | Purpose |
|---------|---------|---------|
| laravel/framework | ^13.8 | PHP Framework |
| laravel/sanctum | ^4.3 | API Authentication |
| laravel/tinker | ^3.0 | REPL |
| fakerphp/faker | ^1.23 | Fake Data |
| phpunit/phpunit | ^12.5.12 | Testing |

---

## 12. Glossary

| Term | Definition |
|------|------------|
| POS | Point of Sale — Sistem kasir |
| KPI | Key Performance Indicator |
| CRUD | Create, Read, Update, Delete |
| Sanctum | Laravel's API token authentication |
| Stock | Jumlah stok barang |
| Receipt | Struk transaksi |
| Cashier | Kasir (role) |
| Admin | Administrator (role) |

---

*Document ini dibuat untuk dokumentasi produk POSapp. Untuk detail API, lihat `backend/API_CONTRACT.md` dan `frontend/API_CONTRACT.md`.*
