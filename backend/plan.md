# POS Kasir UMKM - Backend Blueprint (Laravel Edition)

## 1. Overview
Sistem backend untuk POS (Point of Sale) kasir mobile targeting UMKM. 
Fokus pada *core loop*: Manajemen produk, transaksi offline-first (sync), dan pelaporan dasar. Arsitektur *Modular Monolith* dengan *strict API boundary*.

## 2. Tech Stack & Architecture
- **Framework:** Laravel 11/12 (API-focused).
- **Database:** Supabase Postgres (Managed).
- **ORM:** Eloquent (Native).
- **Authentication:** Laravel Sanctum (Token-based untuk Mobile App).
- **Admin UI:** Supabase Table Editor (Zero-code untuk tim QA/Data).

**Data Flow Rule:** 
`[Mobile App]` -> `[Laravel API]` -> `[Supabase DB]`. 
Mobile app **DILARANG** query langsung ke DB.

## 3. Execution Phases

### Phase 1: Foundation & Database (Week 1)
- [x] Setup Laravel project (`laravel new pos-backend`).
- [x] Konfigurasi `.env` untuk koneksi ke **Postgres** (`DB_CONNECTION=pgsql`).
- [x] Buat Models & Migrations: `users`, `products`, `categories`, `transactions`, `transaction_items`.
- [x] Setup **Laravel Sanctum** untuk API Token Authentication.
- [x] Setup API Rate Limiting bawaan Laravel.

### Phase 2: Core Business Logic (Week 2)
- [ ] **Products & Categories:** API Resource Controllers dengan validasi bawaan (`$request->validate()`).
- [ ] **Stock Management:** Logic *auto-decrement* stok saat checkout menggunakan `DB::transaction()` dan `lockForUpdate()` (Pessimistic Locking untuk cegah race condition).
- [ ] **Transactions:** Endpoint `POST /api/transactions` dengan validasi stok.
- [ ] **Reporting:** Endpoint agregasi (`GET /api/reports/daily`) menggunakan Eloquent `withSum` / `withCount` atau Query Builder.

### Phase 3: Security & Operations (Week 3)
- [ ] **Auth Middleware:** Protect routes dengan `auth:sanctum`.
- [ ] **CORS:** Konfigurasi `config/cors.php` untuk allow Expo Dev Server.
- [ ] **Observability:** Laravel Log channels (daily logs).
- [ ] **Health Check:** Endpoint `GET /api/health`.

## 4. Strict Boundaries (YAGNI & Anti-Patterns)
**JANGAN lakukan hal berikut untuk MVP:**
1. **No Spatie Packages:** Jangan install `spatie/laravel-permission` atau `media-library`. Pakai role kolom biasa di `users`.
2. **No Admin Panels (Filament/Nova):** Jangan buang waktu bikin UI admin. Fadli tetap pakai Supabase Table Editor.
3. **No Service/Repository Overkill:** Jangan bikin folder `App/Services` kalau logic-nya bisa masuk di Controller/Model.
4. **No N+1 Queries:** Wajib pakai `with()` (Eager Loading) di setiap query relasi.
5. **No Soft Deletes:** Skip `SoftDeletes` trait di MVP biar query gak berat dan gak perlu filter `whereNull('deleted_at')`.

## 5. File Structure
```text
backend/
├── app/
│   ├── Http/
│   │   ├── Controllers/Api/  # API Controllers
│   │   └── Middleware/       # Custom middleware (jika ada)
│   └── Models/               # Eloquent Models
├── database/
│   ├── migrations/           # Schema migrations
│   └── seeders/              # Dummy data seeder (Tugas Fadli)
├── routes/
│   └── api.php               # API Routes
├── .env                      # Supabase DB credentials, Sanctum config
└── composer.json