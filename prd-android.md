# PRD — Android Native (Kotlin + Jetpack Compose)

## Product Requirements Document

### 1. Overview

**App:** POS (Point of Sale) for UMKM  
**Platform:** Android (tablet, landscape)  
**Tech:** Kotlin 1.9.22, Jetpack Compose, Material3  
**Architecture:** MVVM with Hilt DI, Room DB, Retrofit networking  
**Min SDK:** 24 | **Target SDK:** 34 | **Compile SDK:** 34  

### 2. Build Configuration

| Item | Value |
|------|-------|
| AGP | 8.2.2 |
| Kotlin | 1.9.22 |
| Gradle | 8.4 |
| JDK | 21 (JBR Android Studio) |
| Compose BOM | 2024.02.00 |
| Compose Compiler | 1.5.8 |
| Hilt | 2.50 |
| Room | 2.6.1 |
| Retrofit | 2.9.0 / OkHttp 4.12.0 |
| Navigation | 2.7.7 |
| KSP | 1.9.22-1.0.17 |
| Orientation | sensorLandscape |

### 3. Setup Requirements

- `local.properties` → `sdk.dir` pointing to Android SDK
- JDK 17+ (tested with JBR 21 from Android Studio)
- `org.gradle.java.home` set in `gradle.properties` if system JDK > 21

### 4. Screens & Features

| Screen | Description |
|--------|-------------|
| **Login** | Email/password auth, role-based (Admin/Staff) |
| **Dashboard** | 4 stat cards (total products, categories, transactions, revenue), 6 nav buttons (horizontalScroll), recent transactions list |
| **POS** | Product grid (GridCells.Adaptive 140dp) + search + category filter + cart panel (320dp) + subtotal/tax/total + checkout |
| **Payment** | 3 methods (Cash/QRIS/Card), cash denomination grid, change calculator |
| **Products** | List + CRUD (name, SKU, price, stock, category, image) |
| **Categories** | List + CRUD |
| **Customers** | List + CRUD |
| **Transactions** | List + receipt dialog |
| **Settings** | Profile, store info, Bluetooth printer, server URL |
| **Bluetooth** | Device scan + pair + connect + print receipt |

### 5. API

- Base URL: `http://10.0.2.2:8000/api/` (emulator → host)
- Auth: Bearer token (Sanctum)
- All requests via Retrofit + OkHttp interceptor

### 6. Dependencies

```
compose-bom:2024.02.00
material3
navigation-compose:2.7.7
hilt-android:2.50
room-runtime:2.6.1 + ksp
retrofit:2.9.0 + gson
okhttp:4.12.0 + logging-interceptor
coil:2.5.0
kotlinx-coroutines:1.7.3
security-crypto
work-manager
opencsv
accompanist
```

### 7. Notes

- BUKAN Kotlin Multiplatform — Android native standalone
- iOS handled via separate React Native (Expo) frontend
- Backend: Laravel 11 / SQLite / Sanctum Auth
