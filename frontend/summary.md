# POS Frontend - Project Summary

## Overview
Point of Sale (POS) frontend application built with **React Native (Expo)** for Android/iOS tablets. Integrates with a Laravel REST API backend.

**Goal:** Provide a smooth, role-based POS experience for cashiers and admins with product management, cart processing, and transaction history.

---

## Tech Stack

**Frontend:**
- React Native (Expo SDK 49)
- React Navigation v6 (stack + bottom tabs)
- Axios (API client)
- AsyncStorage (token persistence)
- MaterialCommunityIcons (icon set)
- Context API (state management)

**Backend (Laravel – already provided):**
- Laravel 10+
- Sanctum (API token authentication)
- Eloquent ORM (Models: User, Product, Category, Transaction, TransactionItem)
- RESTful controllers (Category, Product, Transaction)

---

## Architecture & Structure

```
frontend/
├── App.js                          # Root component, NavigationContainer
├── package.json                    # Dependencies (Expo, React Native)
├── app.json                        # Expo config (name, slug, iOS/Android bundle IDs)
├── babel.config.js                # Babel preset: expo
├── .env.example                   # Environment variables template
├── .gitignore                     # Node modules, .env, etc.
├── README.md                      # Setup & run instructions
│
└── src/
    ├── utils/
    │   └── constants.js           # API_URL (default: http://10.0.2.2:8000/api for Android emulator)
    │
    ├── services/
    │   ├── api.js                 # Axios instance + interceptors (Auth header, 401 handler)
    │   ├── auth.js                # login(), getUser()
    │   ├── products.js            # CRUD operations for products
    │   ├── categories.js          # CRUD operations for categories
    │   └── transactions.js        # getAll(), getById(), create(items)
    │
    ├── context/
    │   ├── AuthContext.js         # Auth state: user, login(), logout(), loading
    │   └── POSContext.js          # POS state: cart, addToCart(), updateQuantity(), removeFromCart(), total, checkout(), receipt
    │
    ├── navigation/
    │   ├── AppNavigator.js        # Routes: if authenticated → MainTabs else AuthStack
    │   ├── AuthStack.js           # Login screen (no header)
    │   └── MainTabs.js            # Bottom tab navigator, role-based tabs (admin only sees Products & Categories)
    │
    ├── screens/
    │   ├── LoginScreen.js         # Email/password login, error handling
    │   ├── DashboardScreen.js     # Stat cards (products, categories, transactions, revenue) + recent transactions list
    │   ├── POSScreen.js           # Main POS UI: product grid, search, category filter, cart panel, checkout, receipt modal
    │   ├── ProductsScreen.js      # Product CRUD with category picker modal (admin only)
    │   ├── CategoriesScreen.js    # Category CRUD (admin only)
    │   └── TransactionsScreen.js  # List all transactions (date, cashier, total, status)
    │
    └── components/
        ├── ProductCard.js         # Product display: name, category, price, stock, add button
        ├── CartItem.js            # Cart row: name, price, qty +/- , delete, subtotal
        └── ReceiptModal.js        # Receipt popup: transaction details, print button (placeholder)

```

---

## Features

### 1. Authentication
- Login via `/tokens/create` (Sanctum)
- Token stored in AsyncStorage, sent as `Authorization: Bearer <token>`
- Auto redirect to login on 401
- User object includes `name`, `email`, `role`

### 2. Role-Based Access
- **Cashier**: can access Dashboard, POS, Transactions
- **Admin**: all cashier features + Products & Categories management
- Role check via `user.role === 'admin'` (must exist in backend User model)

### 3. Dashboard
- KPI cards: total products, categories, transactions, revenue
- Recent transactions (last 5)

### 4. POS (Point of Sale)
- Product grid: 2 columns, search by name, filter by category (modal picker)
- Real-time stock display
- Cart: add items, adjust quantity, remove item
- Validation: cannot add beyond stock; backend double-checks at checkout
- Checkout creates transaction via `POST /transactions` with `{ items: [{product_id, quantity}] }`
- On success: receipt modal with transaction details and print button

### 5. Product Management (Admin)
- List all products with category and stock
- Create/Update: name, category (picker), price, stock
- Delete with confirmation
- Real-time list refresh

### 6. Category Management (Admin)
- List categories with product count
- Create/Update: name only
- Delete with confirmation

### 7. Transaction History
- List all transactions: ID, date, cashier name, total, status
- Details view via receipt modal (same as checkout)

---

## API Integration

| Resource | Endpoints (Laravel) | Methods |
|----------|---------------------|---------|
| Auth      | `/tokens/create`    | POST |
| User      | `/user`             | GET |
| Categories| `/categories`       | GET, POST, PUT, DELETE |
| Products  | `/products`         | GET, POST, PUT, DELETE |
| Transactions | `/transactions`   | GET, POST |

All requests include `Authorization: Bearer <token>` (except login). Responses are JSON.

---

## Setup & Installation

### Prerequisites
- Node.js + pnpm
- Expo CLI (optional, `pnpm start` sufficient)
- Android device/emulator **or** iOS simulator (Mac only)
- Laravel backend up and running

### Steps
1. Install dependencies:
   ```bash
   cd frontend
   pnpm install
   ```

2. Configure environment (optional):
   - Copy `.env.example` to `.env`
   - Set `API_URL` to your backend URL (default for Android emulator: `http://10.0.2.2:8000/api`)

3. Start Expo:
   ```bash
   pnpm start
   ```
   - Press `a` for Android emulator
   - Press `i` for iOS simulator
   - Or scan QR code with Expo Go app on physical device

4. Ensure backend is running and CORS is configured to allow requests from Expo dev server (origin `http://localhost:19000` or device IP).

5. Login with a user that has `role` set to `admin` or `cashier` in the backend.

---

## Testing on Android

### Option A: Physical Device (Recommended – simpler)
1. Install **Expo Go** from Play Store.
2. Ensure phone and computer on same Wi-Fi network.
3. Run `pnpm start` → scan QR code.
4. Set `.env` with `API_URL=http://<YOUR_COMPUTER_IP>:8000/api`
   - Find your IP: `ifconfig` (Mac/Linux) or `ipconfig` (Windows)
   - Example: `192.168.1.100`
5. Test connectivity: open phone browser → `http://192.168.1.100:8000/api/categories` should return JSON (may require auth).

### Option B: Android Emulator
1. Install **Android Studio** → SDK Manager → install Android SDK.
2. Set environment variables:
   ```bash
   export ANDROID_HOME=$HOME/Library/Android/sdk
   export PATH=$PATH:$ANDROID_HOME/emulator
   export PATH=$PATH:$ANDROID_HOME/platform-tools
   ```
3. Start emulator from AVD Manager.
4. Run `pnpm start` → press `a`.
5. API_URL default `http://10.0.2.2:8000/api` works for emulator (host machine's localhost).

---

## Common Issues & Solutions

### 1. `Failed to resolve the Android SDK path`
- Cause: Android SDK not installed or `ANDROID_HOME` not set.
- Fix: Use physical device (Expo Go) or install Android Studio + configure env vars.

### 2. CORS errors
- Backend must allow origins from Expo dev server (`http://localhost:19000`) or device IP.
- In Laravel, install `fruitcake/laravel-cors` and set `allowed_origins` to `['*']` for development.

### 3. Network request failed (device cannot reach backend)
- Check computer firewall allows port 8000.
- Use same Wi-Fi network.
- Ensure backend is running (`php artisan serve --host=0.0.0.0 --port=8000`) to listen on all interfaces.
- Test with `curl` from another device: `curl http://<IP>:8000/api/categories`

### 4. Login fails even with correct credentials
- Ensure backend user has a `role` field (string) set to `admin` or `cashier`.
- Check that sanctum token is created and returned properly.

### 5. Stale data after checkout
- After successful checkout, product list is refreshed automatically (POSScreen calls `fetchProducts()`).

---

## Production Build

```bash
# Build APK/AAB for Android
pnpm build:android

# Build for iOS (Mac only)
pnpm build:ios
```

For easier distribution and OTA updates, consider using **EAS Build**:

```bash
pnpm install -g eas-cli
eas build --platform android
```

Update `app.json` with correct bundle identifiers and version before building.

---

## Backend Requirements (Checklist)

- [x] Laravel project with Sanctum installed
- [x] Database tables: users, products, categories, transactions, transaction_items, personal_access_tokens
- [x] User model has `role` attribute (string, e.g. 'admin', 'cashier')
- [x] API routes defined as per `routes/api.php`:
  - `POST /tokens/create`
  - `GET /user` (auth:sanctum)
  - `apiResource` for categories, products, transactions
- [x] Controllers return JSON and handle stock validation in `TransactionController@store`
- [x] CORS enabled for development
- [ ] (Optional) HTTPS in production

---

## Security Notes
- Tokens stored in AsyncStorage (secure enough for POS on dedicated device; consider Keychain/Keystore for higher security).
- All API calls authenticated via Bearer token.
- Backend should enforce authorization based on user role (e.g., only admin can delete products).
- Use HTTPS in production.

---

## Future Enhancements
- Add shift management (open/close shift)
- Add void/cancel transaction with stock reversal
- Add customer management
- Add discounts/promotions
- Add offline mode with queue
- Add barcode scanning (camera)
- Print receipt via Bluetooth thermal printer

---

## Key Files Reference
- Entry: `App.js`
- Navigation: `src/navigation/AppNavigator.js`
- API: `src/services/api.js`
- Auth: `src/context/AuthContext.js`
- POS Logic: `src/context/POSContext.js`
- POS UI: `src/screens/POSScreen.js`
- Product Management: `src/screens/ProductsScreen.js`
- Category Management: `src/screens/CategoriesScreen.js`
- Backend Integration: `src/services/*.js`

---

**Note:** This frontend is designed to work with the provided Laravel backend API. All API calls match the routes and response structures defined in the backend.
