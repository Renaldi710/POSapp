# Final Plan — Integrasi API_CONTRACT-2.md

## BACKEND (11 file)

| File | Action | Detail |
|---|---|---|
| `app/models/transaction.py` | Edit | Tambah kolom `payment_method: str` |
| `app/schemas/auth.py` | New | `LoginRequest`, `LoginResponse` (token+user_id+name), `UserResponse` |
| `app/schemas/product.py` | Edit | `ProductResponse`: +sku, +created_at, +updated_at. `ProductCreate`/`Update`: +image_url |
| `app/schemas/transaction.py` | Edit | +payment_method di Create/Response/ListItem. Baru: `ReceiptResponse` |
| `app/dependencies.py` | New | `get_current_user` (token → user) + `require_admin` (403 jika bukan admin) |
| `app/routers/auth.py` | New | `POST /tokens/create` (login), `GET /user` (current user), `DELETE /tokens` (logout 204) |
| `app/routers/categories.py` | New | `GET /categories` (public), `POST /categories` (admin-only, 201) |
| `app/routers/products.py` | Edit | POST/PUT/DELETE: +require_admin. GET tetap publik |
| `app/routers/transactions.py` | Edit | user_id dari token (bukan hardcode 1). +payment_method. New: `GET /{id}/receipt` |
| `app/routers/reports.py` | New | `GET /reports/daily?date=` — aggregate. `top_products` include `product_name` |
| `app/main.py` | Edit | Register 3 router baru. Seed: `+kasir@pos.app` / password (role: kasir) |