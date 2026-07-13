# POSapp Frontend — Development Guide

## Commands

```bash
# Start dev server
npm start

# TypeScript check
npx tsc --noEmit

# iOS
npm run ios

# Android
npm run android

# Web
npm run web
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

## Design Tokens

See `tailwind.config.js` and `design-system/posapp/MASTER.md`:
- Primary: `#004AC6` / `#2563EB`
- BG: `#F7F9FB`, Cards: white
- Border: `#C3C6D7`, Input: `#F2F4F6`
- Text: `#191C1E` / `#434655` / `#737686`
