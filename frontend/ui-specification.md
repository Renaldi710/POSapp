# UI Specification — POSapp Frontend (React Native / Expo)

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React Native via Expo SDK 49 |
| Language | JavaScript (ES6+) |
| Navigation | React Navigation (sidebar drawer) |
| State | Context API (AuthContext, POSContext) |
| Styling | StyleSheet (no external UI library) |

## Theme

| Token | Value |
|-------|-------|
| Primary | `#D4A843` (Gold) |
| Background | `#F5F5F5` |
| Surface | `#FFFFFF` |
| Text | `#333333` |

## Layout

- Tablet-first, landscape-oriented design
- Dashboard: 4 stat cards row, 6 navigation buttons, recent transactions list
- POS: split screen (product grid left 65% / cart panel right 35%)
- Payment: method selector + denomination grid + change calculator

## Screens

| Screen | Layout |
|--------|--------|
| Login | Center card, email + password fields |
| Dashboard | ScrollView: stat cards → nav buttons → recent transactions |
| POS | Split: LHS product grid (search + category filter) → RHS cart panel |
| Payment | Modal: method tabs → denomination grid → total/change |
| Products | LazyColumn with FAB for add/edit |
| Categories | LazyColumn with FAB for add/edit |
| Customers | LazyColumn with FAB for add/edit |
| Transactions | LazyColumn with filter/search |
| Settings | Section list: profile, store, server URL, printer |
| Bluetooth | Device list + scan + connect |

## Color Palette

```json
{
  "gold": "#D4A843",
  "goldLight": "#F5E6C8",
  "white": "#FFFFFF",
  "background": "#F5F5F5",
  "textPrimary": "#333333",
  "textSecondary": "#666666",
  "error": "#E53935",
  "success": "#43A047"
}
```

## Typography

| Role | Size | Weight |
|------|------|--------|
| Heading | 20sp | Bold |
| Subheading | 16sp | SemiBold |
| Body | 14sp | Regular |
| Label | 12sp | Medium |
| Button | 14sp | SemiBold |
