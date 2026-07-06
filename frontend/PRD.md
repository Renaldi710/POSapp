# Point of Sale (POS) Application - Product Requirements Document

## Overview
A web-based Point of Sale system for retail businesses. The frontend is a React Single Page Application (SPA) that integrates with a Laravel REST API backend.

## User Roles
- **Cashier**: Can access POS interface, process sales, view transaction history.
- **Admin**: All Cashier capabilities plus management of products and categories, and view of all transactions.

## Core Features

### 1. Authentication
- Login with email/password.
- Session management via API token (Laravel Sanctum).
- Automatic logout on token expiration/invalid.

### 2. Dashboard
- Overview statistics: total products, categories, transactions, revenue.
- Recent transactions list (last 5).

### 3. POS (Point of Sale)
- Product grid with search and category filter.
- Real-time inventory display (stock levels).
- Cart management: add items, adjust quantities, remove items.
- Checkout process: creates a transaction, deducts stock, generates receipt.
- Receipt modal with print support.

### 4. Product Management (Admin only)
- List all products with category and stock.
- Create/Edit product: name, category, price, stock.
- Delete product (with confirmation).
- Real-time stock validation.

### 5. Category Management (Admin only)
- List categories with product count.
- Create/Edit category (name).
- Delete category.

### 6. Transaction History
- List all transactions with date, cashier, total, status.
- View transaction details (items, amounts) via receipt modal.

## Technical Stack
- React 18 with React Router v6
- Axios for API calls
- Tailwind CSS (CDN) for styling
- Lucide React for icons
- Context API for state management (Auth, POS)

## API Integration
All data fetched from Laravel backend endpoints:
- `POST /api/tokens/create` (login)
- `GET /api/user` (current user)
- `GET|POST|PUT|DELETE /api/products*`
- `GET|POST|PUT|DELETE /api/categories*`
- `GET|POST /api/transactions*`

## Non-Functional
- Responsive layout for desktop (POS screen).
- Token-based auth with automatic re-login on 401.
- Error handling with user-friendly messages.
