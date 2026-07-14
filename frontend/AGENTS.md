# POSapp Frontend — Development Guide

## Commands

```bash
# Start dev server
npm start

# TypeScript check (harus zero errors)
npx tsc --noEmit

# Expo project health check
npx expo-doctor

# iOS
npm run ios

# Android
npm run android

# Web
npm run web

# EAS Build (APK)
npx eas build --profile preview --platform android --non-interactive
```

## Architecture

- **Navigation:** Stack inside (tabs)/_layout.tsx with responsive sidebar
  - Tablet (≥768px): Persistent sidebar 280px + TopHeader
  - Phone (<768px): Hamburger menu → sidebar overlay + TopHeader
- **Styling:** NativeWind (Tailwind) with custom design tokens in tailwind.config.js
- **Icons:** lucide-react-native (no emoji icons)
- **Font:** Inter (@expo-google-fonts/inter)
- **State:** Zustand (auth, cart, sidebar)
- **Data:** TanStack Query
- **PDF:** expo-print + expo-sharing (invoice after checkout)

## Key Conventions

- **Role-based sidebar:** `Sidebar.tsx` — admin gets Produk + User menu items; kasir only sees Home, Laporan, Dashboard, Inventaris
- **Route guards:** `product/create.tsx` and `product/edit/[id].tsx` redirect kasir to `/(tabs)`
- **Inventaris:** Tambah Baru button + Edit column hidden for kasir
- **Payment flow:** `PaymentDialog.tsx` sends `{ metode, uangDiterima, cetakStruk, cetakInvoice }` → `useCheckout.ts`
- **Invoice PDF:** `src/lib/invoice.ts` — generates HTML, converts via `Print.printToFileAsync`, shares via `Sharing.shareAsync`
- **SidebarOverlay:** Animated.View must have explicit `width: 280` to prevent ScrollView collapse
- **Dashboard low‑stock:** `dashboard.tsx` uses `useProducts()` to fetch all products, filters `stock < 10`, sorts ascending; tapping a product navigates to `inventaris.tsx?highlight={id}`
- **DataTable highlight:** `DataTable.tsx` accepts `highlightedKey` prop — matching row gets `bg-blue-50` and FlatList auto‑scrolls via `initialScrollIndex`

## Design Tokens

See `tailwind.config.js` and `design-system/posapp/MASTER.md`:
- Primary: `#004AC6` / `#2563EB`
- BG: `#F7F9FB`, Cards: white
- Border: `#C3C6D7`, Input: `#F2F4F6`
- Text: `#191C1E` / `#434655` / `#737686`

## File Organization

```
app/
├── (auth)/login.tsx          # Login screen
├── (tabs)/
│   ├── _layout.tsx           # Tab layout + sidebar + auth guard
│   ├── index.tsx             # POS Kasir (product grid, cart, checkout)
│   ├── dashboard.tsx         # Daily dashboard
│   ├── laporan.tsx           # Reports
│   ├── inventaris.tsx        # Inventory (role-aware)
│   └── user-management.tsx   # User management (mock)
├── scan.tsx                  # Barcode scanner
├── product/
│   ├── create.tsx            # Create product (admin only)
│   ├── [id].tsx              # Product detail
│   └── edit/[id].tsx         # Edit product (admin only)
└── transaction/[id].tsx      # Transaction detail

src/
├── api/                      # client.ts, endpoints.ts, types.ts
├── components/
│   ├── layout/               # ScreenLayout, Sidebar, SidebarOverlay, TopHeader
│   └── ui/                   # Button, Input, Badge, DataTable, StatCard, ProductCard
├── features/
│   ├── auth/                 # useAuth, useAuthStore
│   ├── cart/                 # useCartStore, CartBar, CartPanel
│   ├── products/             # useProducts, ProductCard
│   ├── inventory/            # useInventory, useStockMutation, useProductMutation, ProductForm
│   ├── transactions/         # useCheckout, useTransactions, PaymentDialog
│   └── reports/              # useReports
├── lib/                      # printer.ts, invoice.ts, storage.ts, queryClient.ts
└── stores/                   # useSidebarStore
```
