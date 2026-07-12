# POS API Contract

Base URL local: `http://localhost:8000/api`  
Base URL Vercel: `https://<project>.vercel.app/api`  
Format: JSON

## Auth

### Login
```http
POST /api/tokens/create
Content-Type: application/json
```

```json
{
  "email": "admin@pos.app",
  "password": "password",
  "device_name": "mobile-app"
}
```

Response `200`:
```json
{ "token": "abc123" }
```

Response `401`:
```json
{ "detail": "Invalid credentials" }
```

## Health

```http
GET /api/health
```

Response `200`:
```json
{ "status": "ok" }
```

## Authenticated Requests

All endpoints below require:
```http
Authorization: Bearer <token>
```

Unauthenticated response:
```json
{ "detail": "Unauthenticated" }
```

## User

```http
GET /api/user
```

Response:
```json
{
  "id": 1,
  "name": "Admin POS",
  "email": "admin@pos.app",
  "role": "admin",
  "created_at": "2026-07-06T09:19:25"
}
```

## Categories

```http
GET /api/categories
POST /api/categories
GET /api/categories/{id}
PUT /api/categories/{id}
DELETE /api/categories/{id}
```

Create/update body:
```json
{ "name": "Minuman" }
```

List response item:
```json
{ "id": 1, "name": "Minuman", "products_count": 0 }
```

## Products

```http
GET /api/products
POST /api/products
GET /api/products/{id}
PUT /api/products/{id}
DELETE /api/products/{id}
```

Create body:
```json
{
  "category_id": 1,
  "name": "Es Teh",
  "price": 5000,
  "stock": 100
}
```

Update body: any subset of `category_id`, `name`, `price`, `stock`.

Response item:
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

## Transactions

```http
GET /api/transactions
POST /api/transactions
GET /api/transactions/{id}
PUT /api/transactions/{id}
DELETE /api/transactions/{id}
```

Create body:
```json
{
  "items": [
    { "product_id": 1, "quantity": 2 }
  ]
}
```

Create behavior:
- checks stock
- decrements stock atomically
- saves sale-time `price` and `subtotal`
- sets `status` to `completed`

Create response:
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

## Reports

```http
GET /api/reports/daily?date=2026-07-06
```

`date` optional; defaults to today.

Response:
```json
{
  "date": "2026-07-06",
  "total_transactions": 1,
  "total_revenue": 10000,
  "total_items_sold": 2,
  "top_products": [
    {
      "product_id": 1,
      "total_qty": 2,
      "total": 10000,
      "product": { "id": 1, "name": "Es Teh" }
    }
  ]
}
```

## Status Codes

- `200` OK
- `201` Created
- `204` Deleted
- `401` Unauthenticated / invalid login
- `404` Not found
- `422` Validation or insufficient stock
