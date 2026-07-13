# Design System Master File — POSapp

> Override: Layout light-mode, blue-primary, Inter font, dari referensi Figma.

---

**Project:** POSapp
**Generated:** 2026-07-13
**Category:** POS Kasir / Retail Dashboard

---

## Global Rules

### Color Palette

| Role | Hex | CSS Variable | Usage |
|------|-----|--------------|-------|
| Primary | `#004AC6` | `primary` | Buttons, active states, headers |
| Primary Light | `#2563EB` | `primary-light` | Hover states, links |
| Background | `#F7F9FB` | `bg-page` | Page background |
| Card BG | `#FFFFFF` | — | Cards, modals, sidebar |
| Border | `#C3C6D7` | `border` | Borders, dividers |
| Input BG | `#F2F4F6` | `bg-input` | Input fields |
| Search BG | `#ECEEF0` | `bg-search` | Search bar |
| Sidebar Active | `#D0E1FB` | `sidebar-active` | Active nav item |
| Text Dark | `#191C1E` | — | Headings, primary text |
| Text Medium | `#434655` | — | Secondary text, labels |
| Text Light | `#737686` | — | Muted text, placeholders |
| Success | `#22C55E` | — | Stock ok, positive trends |
| Warning | `#F59E0B` | — | Low stock warning |
| Danger | `#EF4444` | — | Out of stock, errors |

### Typography

- **Font:** Inter (400 Regular, 600 SemiBold, 700 Bold)
- **Headings:** Inter SemiBold/Bold
- **Body:** Inter Regular
- **Labels/Stats:** Inter SemiBold
- **Mood:** Professional, clean, modern, business

### Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `rounded-xl` | 12px | Cards, inputs, buttons |
| `rounded-2xl` | 16px | Larger cards |
| `rounded-3xl` | 24px | Modals, login card |
| `rounded-full` | 9999px | Pills, search bar, avatars |

### Shadow Depths

| Level | Usage |
|-------|-------|
| `shadow-sm` | Subtle card lift |
| `shadow-md` | Cards, dropdowns |
| `shadow-lg` | Modals |
| `shadow-xl` | Featured cards |

---

## Component Specs

### Buttons

```
Primary:   bg-primary (#004AC6), text-white, rounded-xl, py-3 px-6
Outline:   border border-border, text-text-dark, rounded-xl
Ghost:     bg-transparent, text-text-medium
Danger:    bg-red-600, text-white, rounded-xl
Disabled:  opacity-50
Loading:   ActivityIndicator white
```

### Inputs

```
bg-input (#F2F4F6), border border-border (#C3C6D7), rounded-xl, px-4 py-3.5
Placeholder: text-text-light (#737686)
Icon slot:   left-4 absolute, lucide icon
```

### Cards

```
bg-white, rounded-xl, border border-border, shadow-sm
padding: p-4 or p-6
```

### Data Table

```
Header bg: bg-page (#F7F9FB), text-xs font-semibold uppercase
Row:       border-b border-border, py-3 px-3
Hover:     bg-gray-50
```

### Badge (Pill)

```
Success: bg-green-100 text-green-700
Warning: bg-amber-100 text-amber-700
Danger:  bg-red-100 text-red-700
Default: bg-gray-100 text-gray-700
rounded-full, px-2.5 py-0.5, text-xs font-medium
```

---

## Style Guidelines

**Style:** Clean Professional Light Mode
**Pattern:** Dashboard + POS Kasir
**BG:** `bg-bg-page` (#F7F9FB)
**Key Effects:** Subtle shadows, border-based cards (no heavy elevation), backdrop blur on modals

---

## Anti-Patterns (Do NOT Use)

- ❌ Emojis as icons — Use lucide-react-native
- ❌ Dark mode default — This app is light mode
- ❌ Scale transforms on hover (layout shift)
- ❌ Instant state changes — Always use transitions
- ❌ Missing cursor-pointer on TouchableOpacity (handled natively)

---

## Pre-Delivery Checklist

- [ ] No emojis used as icons (lucide-react-native)
- [ ] All icons consistent set
- [ ] cursor-pointer on all touchables (native)
- [ ] Smooth transitions (150-300ms) via Animated API
- [ ] Light mode text contrast 4.5:1 minimum
- [ ] Focus states visible
- [ ] Responsive: 375px, 768px, 1024px+
- [ ] No horizontal scroll on phone
