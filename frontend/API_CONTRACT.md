# POS API — Contract

Base URL: `http://localhost:8000/api`  
Format: `application/json`

---

## Auth

### Login
```
POST /api/tokens/create
Content-Type: application/json

{
  "email": "admin@pos.app",
  "password": "password",
  "device_name": "mobile-app"
}
```

**Response 200:**
```json
{ "token": "1|abc123..." }
```

**Response 401:**
```json
{ "message": "Invalid credentials" }
```

---

## Health

```
GET /api/health
```

**Response 200:**
```json
{ "status": "ok" }
```

---

## Authenticated Requests

Every request below requires:
```
Authorization: Bearer <token>
Accept: application/json
```

Unauthenticated requests return `401`:
```json
{ "message": "Unauthenticated." }
```

---

## User

### Get Current User
```
GET /api/user
```

**Response 200:**
```json
{
  "id": 1,
  "name": "Admin POS",
  "email": "admin@pos.app",
  "role": "admin",
  "created_at": "2026-07-06T09:19:25.000000Z"
}
```

---

## Categories

### List Categories
```
GET /api/categories
```

**Response 200:**
```json
[
  { "id": 1, "name": "Makanan", "products_count": 0 },
  { "id": 2, "name": "Minuman", "products_count": 0 }
]
```

### Create Category
```
POST /api/categories
Content-Type: application/json

{ "name": "Minuman" }
```

**Response 201:** Returns created category  
**Response 422:** Validation error
```json
{ "message": "The name field is required.", "errors": { "name": ["..."] } }
```

---

## Products

### List Products
```
GET /api/products
```

**Response 200:**
```json
[
  {
    "id": 1,
    "category_id": 1,
    "name": "Es Teh",
    "price": "5000.00",
    "stock": 100,
    "category": { "id": 1, "name": "Minuman" }
  }
]
```

### Create Product
```
POST /api/products
Content-Type: application/json

{
  "category_id": 1,
  "name": "Es Teh",
  "price": 5000,
  "stock": 100
}
```

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `category_id` | integer | Yes | Must exist in categories |
| `name` | string | Yes | Max 255 chars |
| `price` | numeric | Yes | Min 0 |
| `stock` | integer | Yes | Min 0 |

**Response 201:** Returns created product  
**Response 422:** Validation error

### Get Product
```
GET /api/products/:id
```

**Response 200:** Product with category  
**Response 404:** Not found

### Update Product
```
PUT /api/products/:id
Content-Type: application/json

{ "price": 6000, "stock": 50 }
```
All fields optional. Only passed fields are updated.

**Response 200:** Updated product  
**Response 404:** Not found

### Delete Product
```
DELETE /api/products/:id
```

**Response 204:** No content  
**Response 404:** Not found

---

## Transactions

### List Transactions
```
GET /api/transactions
```

**Response 200:**
```json
[
  {
    "id": 1,
    "user_id": 1,
    "total_amount": "12000.00",
    "status": "completed",
    "created_at": "2026-07-06T09:20:29.000000Z"
  }
]
```

### Create Transaction
```
POST /api/transactions
Content-Type: application/json

{
  "items": [
    { "product_id": 1, "quantity": 2 }
  ]
}
```

**Behavior:**
- Stock decremented automatically
- `total_amount` = sum of (`price` × `quantity`)
- `status` always `"completed"`

**Response 201:**
```json
{
  "id": 1,
  "user_id": 1,
  "total_amount": 12000,
  "status": "completed",
  "items": [
    {
      "id": 1,
      "product_id": 1,
      "quantity": 2,
      "price": "6000.00",
      "subtotal": "12000.00",
      "product": { "id": 1, "name": "Es Teh" }
    }
  ]
}
```

**Response 422:** Insufficient stock or invalid product_id

### Get Transaction
```
GET /api/transactions/:id
```

**Response 200:** Full transaction with items, product detail, and user  
**Response 404:** Not found

---

## Reports

### Daily Report
```
GET /api/reports/daily?date=2026-07-06
```
`date` param optional. Defaults to today.

**Response 200:**
```json
{
  "date": "2026-07-06",
  "total_transactions": 1,
  "total_revenue": 12000,
  "total_items_sold": 2,
  "top_products": [
    {
      "product_id": 1,
      "total_qty": 2,
      "total": "12000.00",
      "product": { "id": 1, "name": "Es Teh" }
    }
  ]
}
```

---

## HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK |
| 201 | Created |
| 204 | No Content (delete success) |
| 401 | Unauthenticated |
| 404 | Not Found |
| 422 | Validation Error |
| 500 | Server Error |

---

## Validation Errors (422)

```json
{
  "message": "The category id field is required.",
  "errors": {
    "category_id": ["The category id field is required."],
    "name": ["The name field is required."]
  }
}
```
