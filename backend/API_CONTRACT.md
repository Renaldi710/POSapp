# POS API Contract

Base URL local: `http://localhost:8000`  
Base URL production: `https://backend-gold-sigma-21.vercel.app`  
Format: JSON

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

## Products

```http
GET    /api/products
POST   /api/products
GET    /api/products/{id}
PUT    /api/products/{id}
DELETE /api/products/{id}
```

### Create

```http
POST /api/products
Content-Type: application/json
```

Body:
```json
{
  "category_id": 1,
  "name": "Es Teh",
  "price": 5000,
  "stock": 100
}
```

Response `201`:
```json
{
  "id": 1,
  "category_id": 1,
  "name": "Es Teh",
  "price": 5000,
  "stock": 100,
  "category": { "id": 1, "name": "Minuman" }
}
```

### Update

```http
PUT /api/products/{id}
Content-Type: application/json
```

Body (any subset):
```json
{ "name": "Es Teh Manis", "price": 6000 }
```

Response `200`: same shape as create response.

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
    "category_id": 1,
    "name": "Es Teh",
    "price": 5000,
    "stock": 100,
    "category": { "id": 1, "name": "Minuman" }
  }
]
```

### Get by ID

```http
GET /api/products/1
```

Response `200`: single product object.  
Response `404`: `{ "detail": "Product not found" }`

### Delete

```http
DELETE /api/products/1
```

Response `204` (no content).  
Response `404`: `{ "detail": "Product not found" }`

---

## Transactions

```http
GET    /api/transactions
POST   /api/transactions
GET    /api/transactions/{id}
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
  ]
}
```

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
  ]
}
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
      "status": "completed",
      "created_at": "2026-07-12T10:00:00"
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

---

## Status Codes

| Code | Meaning |
|------|---------|
| `200` | OK |
| `201` | Created |
| `204` | Deleted (no content) |
| `400` | Bad request (invalid category, no fields to update) |
| `404` | Not found |
| `409` | Conflict (duplicate SKU) |
| `422` | Validation error / insufficient stock |

Response body on error:
```json
{ "detail": "Insufficient stock for 'Es Teh': have 5, need 99" }
```

---

## Notes

- No auth implemented yet — `user_id` defaults to `1` (admin).
- Categories, auth (login/token), user, and reports endpoints are not yet implemented.
- SKU is auto-generated on create; not required in request body.
- All money values are in **IDR (rupiah)**.
- Timestamps are ISO 8601 (`YYYY-MM-DDTHH:MM:SS`).
