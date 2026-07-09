# Project Summary — POSapp

## Overview

Point of Sale aplikasi untuk UMKM. 3 stack independen: Laravel API backend, React Native (Expo) frontend untuk iOS/Web, dan Kotlin Android native.

## Stack

```
Backend:     Laravel 11 / PHP 8.5 / SQLite / Sanctum
Cross-Platform: React Native / Expo SDK 49 (iOS + Android + Web)
Android:     Kotlin 1.9.22 / Jetpack Compose / Material3 / Hilt / Room
```

## Key Decisions

- **Not KMP** — each platform has independent codebase
- **Android orientation:** sensorLandscape (tablet-optimized)
- **Database:** SQLite (no MySQL requirement)
- **API:** REST via Retrofit, auth via Sanctum bearer tokens

## Build Status

- `./gradlew :app:assembleDebug` → BUILD SUCCESSFUL (5-26s)
- Gradle 8.4 + JDK 21 (JBR) + AGP 8.2.2

## Quick Start

```bash
# Backend
cd backend && php artisan serve

# Android Native
cd front/android && ./gradlew :app:installDebug

# Expo
cd frontend && npx expo start --ios
```

## Login

`admin@pos.app` / `password`

## Issues Fixed

| Issue | Fix |
|-------|-----|
| `local.properties` missing | Created with `sdk.dir` |
| JDK 26 incompatibility | Force Gradle to use JBR 21 via `gradle.properties` |
| Orientation default portrait | Changed to `sensorLandscape` in manifest |
| Dashboard nav button clipping | Added `horizontalScroll` to Row |
