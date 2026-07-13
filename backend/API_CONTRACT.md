# POS API Contract

Base URL local: `http://localhost:8000`  
Base URL production: `https://backend-gold-sigma-21.vercel.app`  
Format: JSON  
Auth: Bearer token via `Authorization` header

---

## Health

```http
GET /health
GET /api/health
```

Response `200`:
```json
{ "status": "ok" }
```

---

## Authentication

### Login

```http
POST /api/tokens/create
Content-Type: application/json
```

Body:
```json
{ "email": "admin@pos.app", "password": "password" }
```

Response `200`:
```json
{
  "token": "7154e2a651e4e7959e6821c8eaa8a454",
  "user_id": 1,
  "name": "Admin POS"
}
```

Response `401`: `{ "detail": "Invalid email or password" }`

### Get Current User

```http
GET /api/user
Authorization: Bearer <token>
```

Response `200`:
```json
{ "id": 1, "name": "Admin POS", "email": "admin@pos.app", "role": "admin" }
```

Response `401`: `{ "detail": "Invalid token" }`

### Logout

```http
DELETE /api/tokens
Authorization: Bearer <token>
```

Response `204` (no content). Idempotent — invalid token also returns `204`.

---

## Role-Based Access

| Role   | Can create/edit products & categories | Can run transactions |
|--------|--------------------------------------|----------------------|
| admin  | ✅                                    | ✅                   |
| kasir  | ❌ (403)                              | ✅                   |

Protected endpoints require `Authorization: Bearer <token>` header.  
Non-admin gets `403`: `{ "detail": "Admin access required" }`

---

## Categories

```http
GET  /api/categories
POST /api/categories       🔒 admin only
```

### List

```http
GET /api/categories
```

Response `200`:
```json
[
  { "id": 1, "name": "Makanan", "created_at": "...", "updated_at": "..." }
]
```

### Create

```http
POST /api/categories
Content-Type: application/json
Authorization: Bearer <admin-token>
```

Body:
```json
{ "name": "Minuman Segar" }
```

Response `201`:
```json
{ "id": 2, "name": "Minuman Segar", "created_at": "...", "updated_at": "..." }
```

Response `422`: Validation error (empty name, too long)

---

## Products

```http
GET    /api/products
POST   /api/products       🔒 admin only
GET    /api/products/{id}
PUT    /api/products/{id}  🔒 admin only
DELETE /api/products/{id}  🔒 admin only
```

### List (with search & filter)

```http
GET /api/products
GET /api/products?q=teh
GET /api/products?category_id=1
GET /api/products?q=teh&category_id=1
```

| Query | Type | Description |
|-------|------|-------------|
| `q` | string | Search by name or SKU (case-insensitive) |
| `category_id` | int | Filter by category |

Response `200`:
```json
[
  {
    "id": 1,
    "sku": "PRD-9E377BB1",
    "category_id": 1,
    "name": "Es Teh",
    "price": 5000,
    "stock": 100,
    "image_url": null,
    "created_at": "2026-07-13T12:00:00",
    "updated_at": "2026-07-13T12:00:00",
    "category": { "id": 1, "name": "Minuman" }
  }
]
```

### Get by ID

```http
GET /api/products/1
```

Response `200`: single product object (same shape as list item).  
Response `404`: `{ "detail": "Product not found" }`

### Create

```http
POST /api/products
Content-Type: application/json
Authorization: Bearer <admin-token>
```

Body:
```json
{
  "category_id": 1,
  "name": "Es Teh",
  "price": 5000,
  "stock": 100,
  "image_url": "https://example.com/img.jpg"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `category_id` | int | ✅ | Must reference existing category |
| `name` | string | ✅ | 1–255 chars |
| `price` | float | ✅ | Must be > 0 |
| `stock` | int | No (default 0) | Must be >= 0 |
| `image_url` | string | No | Nullable, max 500 chars |

SKU is auto-generated — not required in request.

Response `201`:
```json
{
  "id": 1,
  "sku": "PRD-9E377BB1",
  "category_id": 1,
  "name": "Es Teh",
  "price": 5000,
  "stock": 100,
  "image_url": "https://example.com/img.jpg",
  "created_at": "2026-07-13T12:00:00",
  "updated_at": "2026-07-13T12:00:00",
  "category": { "id": 1, "name": "Minuman" }
}
```

### Update

```http
PUT /api/products/{id}
Content-Type: application/json
Authorization: Bearer <admin-token>
```

Body (any subset):
```json
{ "name": "Es Teh Manis", "price": 6000, "image_url": "https://example.com/new.jpg" }
```

Response `200`: same shape as create response.  
Response `400`: `{ "detail": "No fields to update" }`

### Delete

```http
DELETE /api/products/{id}
Authorization: Bearer <admin-token>
```

Response `204` (no content).  
Response `404`: `{ "detail": "Product not found" }`

---

## Transactions

```http
GET    /api/transactions
POST   /api/transactions
GET    /api/transactions/{id}
GET    /api/transactions/{id}/receipt
```

### Checkout

```http
POST /api/transactions
Content-Type: application/json
```

Body:
```json
{
  "items": [
    { "product_id": 1, "quantity": 2 }
  ],
  "payment_method": "tunai"
}
```

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `items` | array | ✅ | — | Min 1 item |
| `payment_method` | string | No | `"tunai"` | One of: `tunai`, `qris`, `debit_kredit` |

Behavior:
- validates each product exists
- validates stock >= quantity
- snapshots `price` from product price at time of sale
- deducts stock atomically in a single transaction
- rollbacks fully on any failure (no partial stock changes)

Response `201`:
```json
{
  "id": 1,
  "user_id": 1,
  "total_amount": 10000,
  "payment_method": "qris",
  "status": "completed",
  "items": [
    {
      "id": 1,
      "product_id": 1,
      "quantity": 2,
      "price": 5000,
      "subtotal": 10000,
      "product": { "id": 1, "name": "Es Teh" }
    }
  ],
  "created_at": "2026-07-13T12:00:00"
}
```

Response `422`:
```json
{ "detail": "Insufficient stock for 'Es Teh': have 5, need 99" }
```

### List (paginated & filterable)

```http
GET /api/transactions
GET /api/transactions?page=1&per_page=20
GET /api/transactions?date_from=2026-07-01&date_to=2026-07-12
GET /api/transactions?user_id=1
```

| Query | Type | Default | Description |
|-------|------|---------|-------------|
| `page` | int | 1 | Page number |
| `per_page` | int | 20 | Items per page (max 100) |
| `date_from` | date | — | Filter: created_at >= date |
| `date_to` | date | — | Filter: created_at <= date |
| `user_id` | int | — | Filter by cashier |

Response `200`:
```json
{
  "data": [
    {
      "id": 1,
      "user_id": 1,
      "total_amount": 10000,
      "payment_method": "qris",
      "status": "completed",
      "created_at": "2026-07-13T12:00:00"
    }
  ],
  "total": 42,
  "page": 1,
  "per_page": 20
}
```

### Get by ID

```http
GET /api/transactions/1
```

Response `200`: full transaction object with items (same shape as checkout response).  
Response `404`: `{ "detail": "Transaction not found" }`

### Receipt

```http
GET /api/transactions/1/receipt
```

Response `200`:
```json
{
  "transaction_id": 1,
  "total_amount": 10000,
  "payment_method": "qris",
  "status": "completed",
  "created_at": "2026-07-13T12:00:00",
  "items": [
    { "name": "Es Teh", "quantity": 2, "price": 5000, "subtotal": 10000 }
  ]
}
```

Response `404`: `{ "detail": "Transaction not found" }`

---

## Reports

### Daily Report

```http
GET /api/reports/daily?date=2026-07-13
```

| Query | Type | Required | Description |
|-------|------|----------|-------------|
| `date` | date | ✅ | Date in YYYY-MM-DD format |

Response `200`:
```json
{
  "date": "2026-07-13",
  "total_transactions": 5,
  "total_revenue": 150000,
  "top_products": [
    { "product_id": 1, "total_quantity": 3, "total_subtotal": 45000 }
  ]
}
```

---

## Status Codes

| Code | Meaning |
|------|---------|
| `200` | OK |
| `201` | Created |
| `204` | Deleted / Logout (no content) |
| `400` | Bad request (invalid category, no fields to update) |
| `401` | Unauthorized (missing/invalid token) |
| `403` | Forbidden (admin role required) |
| `404` | Not found |
| `422` | Validation error / insufficient stock |

Response body on error:
```json
{ "detail": "Insufficient stock for 'Es Teh': have 5, need 99" }
```

---

## Notes

- SKU is auto-generated on create; not required in request body.
- All money values are in **IDR (rupiah)**.
- Timestamps are ISO 8601 (`YYYY-MM-DDTHH:MM:SS`).
- Products & transactions list ordered by `created_at` descending (newest first).
- Seed users: `admin@pos.app` / `password` (role: admin), `kasir@pos.app` / `password` (role: kasir).
