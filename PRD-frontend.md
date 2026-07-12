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
