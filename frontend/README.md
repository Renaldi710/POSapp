<!-- Banner -->
<div align="center">
  <img src="https://img.shields.io/badge/POS-Frontend%20App-4F46E5?style=for-the-badge&logo=shoppingcart&logoColor=white" alt="POS Frontend Banner"/>
  <h1>POSapp Frontend</h1>
  <p>Aplikasi Point of Sale berbasis React Native & Expo untuk tablets dan mobile devices</p>

  <!-- Badges -->
  ![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
  ![Expo](https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=FFF)
  ![React Navigation](https://img.shields.io/badge/React%20Navigation-61DAFB?style=for-the-badge&logo=react&logoColor=FFF)
  ![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)
</div>

---

## 📋 Daftar Isi

- [Gambaran Umum](#gambaran-umum)
- [Fitur](#fitur)
- [Tech Stack](#tech-stack)
- [Persyaratan](#persyaratan)
- [Instalasi](#instalasi)
  - [Clone Repository](#1-clone-repository)
  - [Install Dependencies](#2-install-dependencies)
  - [Konfigurasi Environment](#3-konfigurasi-environment)
  - [Jalankan Development Server](#4-jalankan-development-server)
- [Struktur Proyek](#struktur-proyek)
- [Build untuk Produksi](#build-untuk-produksi)
- [Dokumentasi](#dokumentasi)
- [Kontribusi](#kontribusi)
- [Lisensi](#lisensi)

---

## 🎯 Gambaran Umum

Aplikasi mobile POS (Point of Sale) yang dibangun dengan React Native dan Expo. Aplikasi ini terhubung ke Laravel API backend untuk mengelola transaksi penjualan, produk, kategori, dan autentikasi user.

### Target Pengguna

- 🏪 **Toko Retail** — Minimarket, warung, toko kelontong
- 🍔 **F&B** — Rumah makan, café, kantin
- 👔 **Service Business** — Laundry, barber shop, salon

---

## ✨ Fitur

### 🔐 Autentikasi & Authorization
- Login dengan email/password
- Role-based access: **Admin** dan **Cashier**
- Session management dengan token (Laravel Sanctum)
- Auto-logout saat token expire

### 📊 Dashboard
- Statistik lengkap: total produk, kategori, transaksi, pendapatan
- Daftar transaksi terakhir (5 transaksi terbaru)

### 💳 Point of Sale (Kasir)
- Grid produk dengan pencarian dan filter kategori
- Tampilan stok real-time
- Keranjang belanja interaktif
- Proses checkout dengan validasi stok
- Modal receipt dengan fitur print

### 📦 Manajemen Produk (Admin)
- Daftar produk lengkap dengan kategori & stok
- CRUD produk: nama, kategori, harga, stok
- Validasi stok real-time
- Hapus produk dengan konfirmasi

### 🏷️ Manajemen Kategori (Admin)
- Daftar kategori dengan jumlah produk
- CRUD kategori
- Delete dengan validasi

### 📜 Riwayat Transaksi
- Daftar transaksi dengan tanggal, kasir, total, status
- Detail transaksi via modal receipt

---

## 🛠️ Tech Stack

### Core Technologies

| Teknologi | Version | Deskripsi |
|-----------|---------|-----------|
| React Native | 0.72.6 | Mobile UI Framework |
| Expo | ~49.0.0 | Development Platform |
| React | 18.2.0 | UI Library |
| React Navigation | ^6.1.9 | Navigation |
| Axios | ^1.6.2 | HTTP Client |

### State & Storage

| Teknologi | Version | Deskripsi |
|-----------|---------|-----------|
| Context API | - | State Management |
| Async Storage | 1.18.2 | Local Storage |
| React Hooks | - | State handling |

### Dependencies

```json
{
  "expo": "~49.0.0",
  "react": "18.2.0",
  "react-native": "0.72.6",
  "@react-navigation/native": "^6.1.9",
  "@react-navigation/bottom-tabs": "^6.5.11",
  "@react-navigation/native-stack": "^6.9.17",
  "react-native-screens": "~3.22.0",
  "react-native-safe-area-context": "4.6.3",
  "axios": "^1.6.2",
  "@react-native-async-storage/async-storage": "1.18.2",
  "@expo/vector-icons": "^13.0.0"
}
```

---

## 📌 Persyaratan

Sebelum memulai, pastikan sudah memenuhi:

| Software | Minimum Version | Purpose |
|----------|----------------|---------|
| Node.js | >= 18.x | Runtime |
| pnpm | >= 8.x | Package manager (recommended) |
| npm | >= 9.x | Package manager (alternative) |
| Expo CLI | - | Dev tools (via npx) |
| Backend Laravel | - | API Server di `localhost:8000` |
| Android Studio | - | Android emulator |
| Expo Go | - | Device testing |
| Xcode | - | iOS simulator (macOS only) |

---

## 🚀 Instalasi

### 1. Clone Repository

```bash
git clone https://github.com/Renaldi710/POSapp.git
cd POSapp/frontend
```

### 2. Install Dependencies

Menggunakan pnpm (direkomendasikan):

```bash
pnpm install
```

Atau menggunakan npm:

```bash
npm install
```

### 3. Konfigurasi Environment

Salin file contoh environment:

```bash
cp .env.example .env
```

Edit file `.env` dan sesuaikan dengan konfigurasi backend kamu:

```env
# API Base URL
API_URL=http://10.0.2.2:8000/api
```

### Platform Configuration

| Platform | API_URL | Keterangan |
|----------|---------|------------|
| Android Emulator | `http://10.0.2.2:8000/api` | 10.0.2.2 = localhost host |
| iOS Simulator | `http://localhost:8000/api` | localhost mapping |
| Web | `http://localhost:8000/api` | Browser dev |
| Device Fisik | `http://192.168.x.x:8000/api` | IP lokal komputer |

> ⚠️ **Catatan:** Untuk device fisik, pastikan firewall允许 koneksi dan backend CORS dikonfigurasi dengan benar.

### 4. Jalankan Development Server

```bash
pnpm start
# atau
npx expo start
```

Setelah itu akan muncul menu:

| Command | Platform | Keterangan |
|---------|----------|------------|
| Press `a` | Android | Buka di emulator/device Android |
| Press `i` | iOS | Buka di iOS Simulator |
| Press `w` | Web | Buka di browser web |
| Scan QR | Device | Scan dengan Expo Go app |

---

## 📂 Struktur Proyek

```
frontend/
├── App.js                     # Entry point (Expo)
├── app.json                   # Expo configuration
├── babel.config.js            # Babel configuration
├── index.html                 # Web entry point
├── package.json               # Dependencies
├── vite.config.js             # Vite configuration
├── .env.example               # Environment template
│
├── src/
│   ├── App.jsx                # Main app component
│   ├── main.jsx               # React entry point
│   ├── index.css              # Global styles
│   │
│   ├── components/            # Reusable UI components
│   │   ├── AdminRoute.jsx     # Admin route guard
│   │   ├── CartItem.jsx       # Cart item component
│   │   ├── Layout.jsx         # App layout wrapper
│   │   ├── Navbar.jsx         # Navigation bar
│   │   ├── ProductCard.jsx    # Product card component
│   │   ├── ProtectedRoute.jsx # Auth route guard
│   │   └── ReceiptModal.jsx   # Receipt display modal
│   │
│   ├── context/               # React Context providers
│   │   ├── AuthContext.jsx    # Authentication state
│   │   └── POSContext.jsx    # POS/Cart state
│   │
│   ├── navigation/            # Navigation configuration
│   │   └── MainTabs.js        # Bottom tab navigator
│   │
│   ├── pages/                 # Screen/page components
│   │   ├── Categories.jsx     # Category management (Admin)
│   │   ├── Dashboard.jsx      # Dashboard page
│   │   ├── Login.jsx          # Login page
│   │   ├── POS.jsx            # Point of Sale page
│   │   ├── Products.jsx       # Product management (Admin)
│   │   └── Transactions.jsx   # Transaction history
│   │
│   ├── screens/               # Legacy/variant screens
│   │   ├── CategoriesScreen.js
│   │   ├── DashboardScreen.js
│   │   ├── POSScreen.js
│   │   ├── ProductsScreen.js
│   │   └── TransactionsScreen.js
│   │
│   └── services/              # API service modules
│       ├── api.js             # Axios instance & interceptors
│       ├── auth.js            # Authentication API
│       ├── categories.js      # Categories API
│       ├── health.js          # Health check API
│       ├── products.js        # Products API
│       ├── reports.js         # Reports API
│       └── transactions.js    # Transactions API
│
└── public/                     # Static assets
```

### Key Files

| File | Deskripsi |
|------|-----------|
| `src/context/AuthContext.jsx` | Authentication state management |
| `src/context/POSContext.jsx` | Cart & POS state management |
| `src/services/api.js` | Axios instance dengan interceptors |
| `src/pages/POS.jsx` | Halaman kasir utama |

---

## 📱 Build untuk Produksi

### Android

```bash
# Build APK (local)
pnpm build:android

# Atau dengan EAS Build (recommended)
eas build --platform android
```

### iOS

```bash
# Build untuk iOS Simulator
pnpm build:ios

# Atau dengan EAS Build (recommended)
eas build --platform ios
```

### Prebuild Native Code

```bash
# Generate native code
npx expo prebuild

# Lalu build manual
# Android: cd android && ./gradlew assembleRelease
# iOS: cd ios && xcodebuild
```

---

## ⚙️ Konfigurasi

### Environment Variables

| Variable | Default | Deskripsi |
|----------|---------|-----------|
| `API_URL` | `http://10.0.2.2:8000/api` | Base URL untuk Laravel API |

### Expo Configuration

File `app.json`:

```json
{
  "expo": {
    "name": "POSapp",
    "slug": "posapp",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain"
    }
  }
}
```

---

## 📚 Dokumentasi

| Document | Lokasi | Deskripsi |
|----------|--------|-----------|
| Main README | `../README.md` | Dokumentasi project utama |
| Backend README | `../backend/README.md` | Dokumentasi API |
| API Contract | `../backend/API_CONTRACT.md` | Dokumentasi lengkap API |
| PRD | `./PRD.md` | Product Requirements |

---

## 🤝 Kontribusi

Kontribusi sangat diterima! Ikuti langkah berikut:

1. **Fork** repository ini
2. Buat **Branch** baru (`git checkout -b feature/AmazingFeature`)
3. **Commit** perubahan (`git commit -m 'Add AmazingFeature'`)
4. **Push** ke branch (`git push origin feature/AmazingFeature`)
5. Buka **Pull Request**

### Guidelines

- ✅ Ikuti React Native best practices
- ✅ Gunakan functional components dengan hooks
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
