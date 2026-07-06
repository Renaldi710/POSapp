# POS Frontend (React Native / Expo)

A React Native Point of Sale application for tablets and mobile devices.

## Setup

1. Install dependencies:
   ```
   pnpm install
   ```

2. Start development server:
   ```
   pnpm start
   ```
   Then press `a` to open on Android emulator/device, `i` for iOS simulator, or scan QR code with Expo Go app.

3. Ensure the Laravel backend is running at the configured API_URL (default http://10.0.2.2:8000/api for Android emulator). For real device, set API_URL to your machine's local network IP.

## Build for Production

- Android APK/AAB: `pnpm build:android`
- iOS: `pnpm build:ios`

## Configuration

Edit `.env` to set `API_URL` for your backend server.

## Login

Use credentials with role `admin` or `cashier` created in the backend.
