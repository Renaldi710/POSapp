<!-- Banner -->
<p align="center">
  <img src="https://img.shields.io/badge/POS-App-4F46E5?style=for-the-badge&logo=shoppingcart&logoColor=white" alt="POS App Banner"/>
</p>

<h1 align="center">POSapp</h1>

<p align="center">
  💰 Aplikasi Point of Sale untuk UMKM Indonesia
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React%20Native-61DAFB?style=flat-square&logo=react" alt="React Native"/>
  <img src="https://img.shields.io/badge/Expo-000020?style=flat-square&logo=expo" alt="Expo"/>
  <img src="https://img.shields.io/badge/Laravel-FF2D20?style=flat-square&logo=laravel" alt="Laravel"/>
  <img src="https://img.shields.io/badge/License-MIT-green?style=flat-square" alt="License"/>
</p>

---

## 📋 Daftar Isi

- [Tentang Project](#tentang-project)
- [Fitur](#fitur)
- [Tech Stack](#tech-stack)
- [Struktur Proyek](#struktur-proyek)
- [Persyaratan](#persyaratan)
- [Instalasi](#instalasi)
  - [Clone Repository](#1-clone-repository)
  - [Backend Setup](#2-backend-setup)
  - [Frontend Setup](#3-frontend-setup)
  - [Menjalankan Aplikasi](#4-menjalankan-aplikasi)
- [KCredentials Testing](#credentials-testing)
- [API Endpoints](#api-endpoints)
- [Screenshot](#screenshot)
- [Dokumentasi](#dokumentasi)
- [Kontribusi](#kontribusi)
- [Lisensi](#lisensi)

---

## 🎯 Tentang Project

POSapp adalah aplikasi Point of Sale (Kasir) berbasis mobile dengan backend API, dirancang khusus untuk kebutuhan UMKM di Indonesia. Aplikasi ini memungkinkan:

- ✅ Manajemen produk dan kategori
- ✅ Proses penjualan (POS) yang cepat
- ✅ Manajemen stok barang
- ✅ Riwayat transaksi lengkap
- ✅ Multi-role user (Admin & Cashier)

### Target Pengguna

| Sektor | Contoh |
|--------|--------|
| 🏪 Retail | Minimarket, warung, toko kelontong |
| 🍔 F&B | Rumah makan, café, kantin |
| 👔 Service | Laundry, barber shop, salon |

---

## ✨ Fitur

### 🔐 Autentikasi & Role
- Login dengan email/password
- Role-based access control (Admin & Cashier)
- Token-based session (Laravel Sanctum)
- Auto-logout saat token expire

### 📊 Dashboard
- Statistik lengkap: produk, kategori, transaksi, pendapatan
- Transaksi terakhir (5 terbaru)

### 💳 Point of Sale
- Grid produk dengan search & filter
- Keranjang interaktif
- Validasi stok real-time
- Checkout & receipt

### 📦 Manajemen Produk (Admin)
- CRUD produk lengkap
- Filter & pencarian
- Update stok

### 🏷️ Manajemen Kategori (Admin)
- CRUD kategori
- Relasi dengan produk

### 📜 Transaksi
- Riwayat lengkap
- Detail via receipt modal

---

## 🛠️ Tech Stack

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐│
│  │   React     │  │    Expo     │  │  React Navigation   ││
│  │   Native    │  │             │  │                     ││
│  └─────────────┘  └─────────────┘  └─────────────────────┘│
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐│
│  │    Axios    │  │   Async     │  │     Tailwind        ││
│  │             │  │   Storage   │  │       CSS           ││
│  └─────────────┘  └─────────────┘  └─────────────────────┘│
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼ API (REST)
┌─────────────────────────────────────────────────────────────┐
│                         BACKEND                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐│
│  │   Laravel   │  │  Laravel    │  │      MySQL /         ││
│  │     13      │  │  Sanctum    │  │      SQLite          ││
│  └─────────────┘  └─────────────┘  └─────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

### Frontend Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| react-native | 0.72.6 | UI Framework |
| expo | ~49.0.0 | Dev Platform |
| @react-navigation | ^6.1.9 | Navigation |
| axios | ^1.6.2 | HTTP Client |
| @react-native-async-storage | 1.18.2 | Local Storage |

### Backend Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| laravel/framework | ^13.8 | PHP Framework |
| laravel/sanctum | ^4.3 | API Authentication |
| laravel/tinker | ^3.0 | REPL |

---

## 📂 Struktur Proyek

```
POSapp/
├── README.md              # Dokumentasi utama
├── LICENSE                # MIT License
│
├── backend/               # Laravel API Backend
│   ├── app/               # Application code
│   ├── config/            # Configuration files
│   ├── database/          # Migrations & Seeders
│   ├── routes/            # API Routes
│   ├── composer.json      # PHP Dependencies
│   ├── .env               # Environment config
│   └── README.md          # Backend docs
│
└── frontend/              # React Native Mobile App
    ├── src/
    │   ├── components/     # UI Components
    │   ├── context/       # State Management
    │   ├── navigation/    # Navigation Config
    │   ├── pages/         # Screen Components
    │   ├── screens/       # Legacy Screens
    │   └── services/      # API Services
    ├── package.json       # Node Dependencies
    ├── .env.example       # Environment template
    └── README.md          # Frontend docs
```

---

## 📌 Persyaratan

### Software

| Software | Minimum Version | Purpose |
|----------|----------------|---------|
| Node.js | >= 18.x | Frontend runtime |
| PHP | >= 8.3 | Backend runtime |
| Composer | >= 2.x | PHP package manager |
| pnpm / npm | >= 8.x / >= 9.x | JS package manager |
| MySQL | 8.0+ | Database (production) |
| SQLite | 3.x | Database (development) |

### Hardware

- RAM minimum 4GB
- Storage 500MB+
- Android Studio / Xcode (untuk emulator)

---

## 🚀 Instalasi

### 1. Clone Repository

```bash
git clone https://github.com/Renaldi710/POSapp.git
cd POSapp
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
composer install

# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate

# Run migrations
php artisan migrate

# Seed initial data (optional)
php artisan db:seed

# Start development server
php artisan serve
```

Backend akan berjalan di `http://localhost:8000`

### 3. Frontend Setup

Buka terminal baru:

```bash
cd frontend

# Install dependencies
pnpm install
# atau
npm install

# Copy environment file
cp .env.example .env

# Edit .env - sesuaikan API_URL
# Untuk Android Emulator: API_URL=http://10.0.2.2:8000/api
# Untuk iOS Simulator:    API_URL=http://localhost:8000/api
# Untuk Device Fisik:     API_URL=http://<IP_KOMPUTER>:8000/api
```

### 4. Menjalankan Aplikasi

#### Development Server

**Frontend:**
```bash
cd frontend
pnpm start
```
Pilih platform: `a` (Android), `i` (iOS), `w` (Web)

**Backend:**
```bash
cd backend
php artisan serve
```

#### Production Build

**Android APK:**
```bash
cd frontend
eas build --platform android
```

**iOS:**
```bash
cd frontend
eas build --platform ios
```

---

## 🔑 Credentials Testing

Gunakan credentials berikut setelah menjalankan seed:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@example.com | password |
| Cashier | cashier@example.com | password |

---

## 🔌 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/tokens/create` | Login user |
| GET | `/api/user` | Get current user |

### Products
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | List all products |
| POST | `/api/products` | Create product |
| GET | `/api/products/{id}` | Get product detail |
| PUT | `/api/products/{id}` | Update product |
| DELETE | `/api/products/{id}` | Delete product |

### Categories
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/categories` | List all categories |
| POST | `/api/categories` | Create category |
| PUT | `/api/categories/{id}` | Update category |
| DELETE | `/api/categories/{id}` | Delete category |

### Transactions
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/transactions` | List transactions |
| POST | `/api/transactions` | Create transaction |

### Additional
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/reports` | Dashboard stats |

Lihat [API_CONTRACT.md](./backend/API_CONTRACT.md) untuk detail lengkap.

---

## 🖼️ Screenshot

| POS Screen | Dashboard |
|:---:|:---:|
| ![POS](https://via.placeholder.com/300x500?text=POS+Screen) | ![Dashboard](https://via.placeholder.com/300x500?text=Dashboard) |

| Products | Transactions |
|:---:|:---:|
| ![Products](https://via.placeholder.com/300x500?text=Products) | ![Transactions](https://via.placeholder.com/300x500?text=Transactions) |

---

## 📚 Dokumentasi

| Document | Location | Description |
|----------|----------|-------------|
| API Contract | `backend/API_CONTRACT.md` | Complete API documentation |
| Backend README | `backend/README.md` | Laravel-specific setup |
| Frontend README | `frontend/README.md` | Mobile app setup |
| PRD | `frontend/PRD.md` | Product Requirements |

---

## 🤝 Kontribusi

Kontribusi sangat diterima! Ikuti langkah berikut:

1. **Fork** repository ini
2. Buat **Branch** baru (`git checkout -b feature/AmazingFeature`)
3. **Commit** perubahan (`git commit -m 'Add AmazingFeature'`)
4. **Push** ke branch (`git push origin feature/AmazingFeature`)
5. Buka **Pull Request**

### Guidelines

- 📝 Ikuti code style project
- ✅ Test sebelum submit PR
- 📖 Update dokumentasi jika perlu
- 💬 Diskusikan fitur besar dulu via Issue

---

## 📄 Lisensi

Project ini dilisensikan di bawah MIT License. Lihat file [LICENSE](./LICENSE) untuk informasi lebih lanjut.

---

## 👨‍💻 Author

**Renaldi**

- GitHub: [@Renaldi710](https://github.com/Renaldi710)
- Project: [POSapp](https://github.com/Renaldi710/POSapp)

---

<div align="center">
  <p>Made with ❤️ for Indonesian MSMEs</p>
</div>
