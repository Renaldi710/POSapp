~Folder Struktur
posmobile/
├── app/                              # Expo Router — HANYA routing
│   ├── (auth)/
│   │   ├── login.tsx
│   │   └── _layout.tsx
│   ├── (tabs)/
│   │   ├── index.tsx                 # Kasir POS
│   │   ├── dashboard.tsx
│   │   ├── laporan.tsx
│   │   ├── inventaris.tsx
│   │   ├── user-management.tsx
│   │   └── _layout.tsx
│   ├── product/[id].tsx              # Stock Detail
│   ├── transaction/[id].tsx          # Transaction Detail
│   └── _layout.tsx
│
├── src/
│   ├── api/
│   │   ├── client.ts                 # Axios instance
│   │   ├── endpoints.ts              # URL constants
│   │   └── types.ts
│   │
│   ├── features/                     # ⭐ Vertical slice per domain
│   │   ├── auth/
│   │   │   ├── hooks/useAuth.ts
│   │   │   ├── store/useAuthStore.ts
│   │   │   └── types.ts
│   │   ├── products/
│   │   │   ├── hooks/useProducts.ts
│   │   │   ├── components/ProductCard.tsx
│   │   │   └── types.ts
│   │   ├── cart/
│   │   │   ├── store/useCartStore.ts
│   │   │   ├── components/CartBar.tsx
│   │   │   └── types.ts
│   │   ├── inventory/
│   │   │   ├── hooks/useInventory.ts
│   │   │   ├── hooks/useStockMutation.ts
│   │   │   └── types.ts
│   │   ├── transactions/
│   │   │   ├── hooks/useTransactions.ts
│   │   │   ├── hooks/useCheckout.ts
│   │   │   └── types.ts
│   │   ├── users/
│   │   │   ├── hooks/useUsers.ts
│   │   │   └── types.ts
│   │   └── reports/
│   │       ├── hooks/useReports.ts
│   │       └── types.ts
│   │
│   ├── components/ui/                # Design system
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Badge.tsx
│   │   ├── StatCard.tsx
│   │   ├── ProductCard.tsx
│   │   ├── BottomNavBar.tsx
│   │   └── DataTable.tsx
│   │
│   ├── lib/
│   │   ├── queryClient.ts
│   │   ├── storage.ts                # MMKV wrapper
│   │   ├── printer.ts                # Bluetooth printer utils
│   │   └── location.ts               # GPS utils
│   │
│   ├── constants/
│   │   ├── theme.ts
│   │   └── config.ts
│   │
│   └── utils/
│       ├── currency.ts               # formatRupiah()
│       ├── date.ts                   # formatDate(), formatTime()
│       └── validation.ts
│
├── assets/
│   ├── images/
│   └── fonts/
│
├── tailwind.config.js
├── global.css
├── babel.config.js
├── app.json
├── tsconfig.json
└── package.json

~User Journey (kasir)
1. Buka app → Login (email + password)
2. Dashboard / langsung ke Kasir POS
3. Scan barcode / tap produk → Add to cart
4. Adjust quantity (jika perlu)
5. Tap "Bayar Sekarang" → Payment Dialog
6. Pilih metode (Tunai/QRIS/Kartu)
7. Input uang diterima (jika tunai) → Lihat kembalian
8. Toggle cetak struk (ON/OFF)
9. Tap "Konfirmasi Pembayaran"
10. Sistem: deduct stock → save transaction → print struk → clear cart

~Login Screen
-User flow
Login → Validasi credentials → Capture GPS → Redirect (role-based)
-API Integration
// ✅ API Ready
POST /api/tokens/create
{
  "email": "admin@pos.app",
  "password": "password",
  "device_name": "mobile-app"
}

---

## New Features (v2)

### 1. Export Transaksi CSV
**User Flow:**
1. Buka Laporan → tap "Ekspor"
2. System: fetch transaksi → generate CSV → open share sheet
3. User: Save to Files / Share via WhatsApp / Email

**File:** `src/lib/export.ts` — `downloadTransactionsCSV(date_from, date_to)`
**Deps:** `expo-file-system` + `expo-sharing` (existing)
**Backend:** `GET /api/transactions/export?date_from=&date_to=` → return CSV

---

### 2. Image Produk (Camera + Kompresi Otomatis)
**User Flow:**
1. Tambah/Edit produk → lihat section "Foto Produk"
2. Tap "Ambil Foto" → buka kamera → ambil foto
3. Atau tap "Pilih Galeri" → pilih dari gallery
4. System: kompres otomatis (800px, quality 0.5 → ~50-100KB)
5. Konversi ke base64 → kirim ke API sebagai `image_url`
6. Tampil di card produk & detail produk

**File:** `src/lib/image.ts` — `pickFromCamera()`, `pickFromGallery()`, `compressImage()`, `uriToBase64()`
**Component:** `src/features/inventory/components/ProductForm.tsx` — image section + preview
**Deps:** `expo-image-picker` + `expo-image-manipulator`
**Backend:** Field `image_url` di Product model/schema/response

---

### 3. Import CSV Produk (Admin Only)
**User Flow:**
1. Buka Inventaris (admin) → tap "Import CSV"
2. System file picker → pilih file .csv
3. Upload via `POST /api/products/import`
4. Alert: "Berhasil: 10, Skipped: 2, Error: ..."

**File:** `src/features/inventory/hooks/useImportProducts.ts` — `useImportProducts()`
**Deps:** `expo-document-picker`
**Backend:** `POST /api/products/import` — multipart file, return `{ created, skipped, errors }`

---

### 4. Efisiensi APK
- Hapus `expo-location` (dead code) → -~300KB native
- Enable `hermesBytecode: true` di `eas.json` → JS bundle ~40% lebih kecil
- Hapus `lightningcss-linux-x64-gnu` (platform mismatch, dev dependency)
- Hapus `src/lib/location.ts`
