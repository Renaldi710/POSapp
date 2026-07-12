from datetime import date, datetime
import hashlib
import os
import secrets
import sqlite3
from typing import Annotated, Any

from fastapi import Depends, FastAPI, Header, HTTPException, Query, Response, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

DB_PATH = os.getenv("DATABASE_PATH", os.path.join(os.path.dirname(__file__), "..", "database.sqlite"))
app = FastAPI(title="POSapp API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


def db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    return conn


def now():
    return datetime.utcnow().isoformat(timespec="seconds")


def hash_password(password: str):
    return hashlib.sha256(password.encode()).hexdigest()


def row_dict(row):
    return dict(row) if row else None


def init_db():
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    with db() as conn:
        conn.executescript(
            """
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT NOT NULL UNIQUE,
                password_hash TEXT NOT NULL,
                role TEXT NOT NULL DEFAULT 'kasir',
                created_at TEXT NOT NULL
            );
            CREATE TABLE IF NOT EXISTS tokens (
                token TEXT PRIMARY KEY,
                user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                device_name TEXT NOT NULL,
                created_at TEXT NOT NULL
            );
            CREATE TABLE IF NOT EXISTS categories (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL
            );
            CREATE TABLE IF NOT EXISTS products (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
                name TEXT NOT NULL,
                price REAL NOT NULL CHECK(price >= 0),
                stock INTEGER NOT NULL DEFAULT 0 CHECK(stock >= 0),
                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL
            );
            CREATE TABLE IF NOT EXISTS transactions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                total_amount REAL NOT NULL,
                status TEXT NOT NULL DEFAULT 'completed',
                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL
            );
            CREATE TABLE IF NOT EXISTS transaction_items (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                transaction_id INTEGER NOT NULL REFERENCES transactions(id) ON DELETE CASCADE,
                product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
                quantity INTEGER NOT NULL CHECK(quantity > 0),
                price REAL NOT NULL,
                subtotal REAL NOT NULL,
                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL
            );
            """
        )
        if not conn.execute("SELECT 1 FROM users WHERE email = ?", ("admin@pos.app",)).fetchone():
            t = now()
            conn.execute(
                "INSERT INTO users (name, email, password_hash, role, created_at) VALUES (?, ?, ?, ?, ?)",
                ("Admin POS", "admin@pos.app", hash_password("password"), "admin", t),
            )
            for name in ["Makanan", "Minuman", "Snack", "Lainnya"]:
                conn.execute("INSERT INTO categories (name, created_at, updated_at) VALUES (?, ?, ?)", (name, t, t))


@app.on_event("startup")
def startup():
    init_db()


class LoginIn(BaseModel):
    email: str
    password: str
    device_name: str


class CategoryIn(BaseModel):
    name: str = Field(min_length=1, max_length=255)


class ProductIn(BaseModel):
    category_id: int
    name: str = Field(min_length=1, max_length=255)
    price: float = Field(ge=0)
    stock: int = Field(ge=0)


class ProductPatch(BaseModel):
    category_id: int | None = None
    name: str | None = Field(default=None, min_length=1, max_length=255)
    price: float | None = Field(default=None, ge=0)
    stock: int | None = Field(default=None, ge=0)


class TransactionItemIn(BaseModel):
    product_id: int
    quantity: int = Field(gt=0)


class TransactionIn(BaseModel):
    items: list[TransactionItemIn] = Field(min_length=1)


class TransactionPatch(BaseModel):
    status: str = Field(pattern="^(pending|completed|cancelled)$")


def current_user(authorization: Annotated[str | None, Header()] = None):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Unauthenticated")
    token = authorization.removeprefix("Bearer ").strip()
    with db() as conn:
        row = conn.execute(
            "SELECT users.id, users.name, users.email, users.role, users.created_at FROM tokens JOIN users ON users.id = tokens.user_id WHERE tokens.token = ?",
            (token,),
        ).fetchone()
    if not row:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Unauthenticated")
    return row_dict(row)


def require_category(conn, category_id: int):
    if not conn.execute("SELECT 1 FROM categories WHERE id = ?", (category_id,)).fetchone():
        raise HTTPException(status.HTTP_422_UNPROCESSABLE_ENTITY, "category_id not found")


def category_out(conn, category_id: int):
    row = conn.execute(
        "SELECT c.*, (SELECT COUNT(*) FROM products p WHERE p.category_id = c.id) products_count FROM categories c WHERE c.id = ?",
        (category_id,),
    ).fetchone()
    if not row:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Not found")
    return row_dict(row)


def product_out(conn, product_id: int):
    row = conn.execute("SELECT * FROM products WHERE id = ?", (product_id,)).fetchone()
    if not row:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Not found")
    product = row_dict(row)
    product["category"] = row_dict(conn.execute("SELECT id, name FROM categories WHERE id = ?", (product["category_id"],)).fetchone())
    return product


def transaction_out(conn, transaction_id: int):
    row = conn.execute("SELECT * FROM transactions WHERE id = ?", (transaction_id,)).fetchone()
    if not row:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Not found")
    trx = row_dict(row)
    trx["user"] = row_dict(conn.execute("SELECT id, name, email, role FROM users WHERE id = ?", (trx["user_id"],)).fetchone())
    items = conn.execute("SELECT * FROM transaction_items WHERE transaction_id = ?", (transaction_id,)).fetchall()
    trx["items"] = []
    for item in items:
        item_data = row_dict(item)
        item_data["product"] = row_dict(conn.execute("SELECT id, name FROM products WHERE id = ?", (item_data["product_id"],)).fetchone())
        trx["items"].append(item_data)
    return trx


@app.get("/api/health")
def health():
    return {"status": "ok"}


@app.post("/api/tokens/create")
def login(body: LoginIn):
    init_db()
    with db() as conn:
        user = conn.execute("SELECT * FROM users WHERE email = ?", (body.email,)).fetchone()
        if not user or user["password_hash"] != hash_password(body.password):
            raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Invalid credentials")
        token = secrets.token_urlsafe(32)
        conn.execute("INSERT INTO tokens (token, user_id, device_name, created_at) VALUES (?, ?, ?, ?)", (token, user["id"], body.device_name, now()))
        return {"token": token}


@app.get("/api/user")
def me(user: Annotated[dict[str, Any], Depends(current_user)]):
    return user


@app.get("/api/categories")
def list_categories(_: Annotated[dict[str, Any], Depends(current_user)]):
    with db() as conn:
        rows = conn.execute("SELECT c.*, (SELECT COUNT(*) FROM products p WHERE p.category_id = c.id) products_count FROM categories c ORDER BY c.id").fetchall()
        return [row_dict(row) for row in rows]


@app.post("/api/categories", status_code=201)
def create_category(body: CategoryIn, _: Annotated[dict[str, Any], Depends(current_user)]):
    with db() as conn:
        t = now()
        cur = conn.execute("INSERT INTO categories (name, created_at, updated_at) VALUES (?, ?, ?)", (body.name, t, t))
        return category_out(conn, cur.lastrowid)


@app.get("/api/categories/{category_id}")
def get_category(category_id: int, _: Annotated[dict[str, Any], Depends(current_user)]):
    with db() as conn:
        return category_out(conn, category_id)


@app.put("/api/categories/{category_id}")
def update_category(category_id: int, body: CategoryIn, _: Annotated[dict[str, Any], Depends(current_user)]):
    with db() as conn:
        if not conn.execute("SELECT 1 FROM categories WHERE id = ?", (category_id,)).fetchone():
            raise HTTPException(status.HTTP_404_NOT_FOUND, "Not found")
        conn.execute("UPDATE categories SET name = ?, updated_at = ? WHERE id = ?", (body.name, now(), category_id))
        return category_out(conn, category_id)


@app.delete("/api/categories/{category_id}", status_code=204)
def delete_category(category_id: int, _: Annotated[dict[str, Any], Depends(current_user)]):
    with db() as conn:
        cur = conn.execute("DELETE FROM categories WHERE id = ?", (category_id,))
        if cur.rowcount == 0:
            raise HTTPException(status.HTTP_404_NOT_FOUND, "Not found")
    return Response(status_code=204)


@app.get("/api/products")
def list_products(_: Annotated[dict[str, Any], Depends(current_user)]):
    with db() as conn:
        rows = conn.execute("SELECT id FROM products ORDER BY id").fetchall()
        return [product_out(conn, row["id"]) for row in rows]


@app.post("/api/products", status_code=201)
def create_product(body: ProductIn, _: Annotated[dict[str, Any], Depends(current_user)]):
    with db() as conn:
        require_category(conn, body.category_id)
        t = now()
        cur = conn.execute(
            "INSERT INTO products (category_id, name, price, stock, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)",
            (body.category_id, body.name, body.price, body.stock, t, t),
        )
        return product_out(conn, cur.lastrowid)


@app.get("/api/products/{product_id}")
def get_product(product_id: int, _: Annotated[dict[str, Any], Depends(current_user)]):
    with db() as conn:
        return product_out(conn, product_id)


@app.put("/api/products/{product_id}")
def update_product(product_id: int, body: ProductPatch, _: Annotated[dict[str, Any], Depends(current_user)]):
    data = body.model_dump(exclude_none=True)
    with db() as conn:
        if not conn.execute("SELECT 1 FROM products WHERE id = ?", (product_id,)).fetchone():
            raise HTTPException(status.HTTP_404_NOT_FOUND, "Not found")
        if "category_id" in data:
            require_category(conn, data["category_id"])
        if data:
            fields = ", ".join(f"{key} = ?" for key in data)
            conn.execute(f"UPDATE products SET {fields}, updated_at = ? WHERE id = ?", (*data.values(), now(), product_id))
        return product_out(conn, product_id)


@app.delete("/api/products/{product_id}", status_code=204)
def delete_product(product_id: int, _: Annotated[dict[str, Any], Depends(current_user)]):
    with db() as conn:
        cur = conn.execute("DELETE FROM products WHERE id = ?", (product_id,))
        if cur.rowcount == 0:
            raise HTTPException(status.HTTP_404_NOT_FOUND, "Not found")
    return Response(status_code=204)


@app.get("/api/transactions")
def list_transactions(_: Annotated[dict[str, Any], Depends(current_user)]):
    with db() as conn:
        rows = conn.execute("SELECT id FROM transactions ORDER BY id DESC").fetchall()
        return [transaction_out(conn, row["id"]) for row in rows]


@app.post("/api/transactions", status_code=201)
def create_transaction(body: TransactionIn, user: Annotated[dict[str, Any], Depends(current_user)]):
    with db() as conn:
        try:
            conn.execute("BEGIN IMMEDIATE")
            total = 0.0
            items = []
            for item in body.items:
                product = conn.execute("SELECT * FROM products WHERE id = ?", (item.product_id,)).fetchone()
                if not product:
                    raise HTTPException(status.HTTP_422_UNPROCESSABLE_ENTITY, f"Invalid product_id {item.product_id}")
                if product["stock"] < item.quantity:
                    raise HTTPException(status.HTTP_422_UNPROCESSABLE_ENTITY, f"Insufficient stock for {product['name']}")
                subtotal = float(product["price"]) * item.quantity
                total += subtotal
                items.append((product["id"], item.quantity, float(product["price"]), subtotal))
            t = now()
            cur = conn.execute(
                "INSERT INTO transactions (user_id, total_amount, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?)",
                (user["id"], total, "completed", t, t),
            )
            transaction_id = cur.lastrowid
            for product_id, quantity, price, subtotal in items:
                conn.execute("UPDATE products SET stock = stock - ?, updated_at = ? WHERE id = ?", (quantity, t, product_id))
                conn.execute(
                    "INSERT INTO transaction_items (transaction_id, product_id, quantity, price, subtotal, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
                    (transaction_id, product_id, quantity, price, subtotal, t, t),
                )
            conn.commit()
            return transaction_out(conn, transaction_id)
        except Exception:
            conn.rollback()
            raise


@app.get("/api/transactions/{transaction_id}")
def get_transaction(transaction_id: int, _: Annotated[dict[str, Any], Depends(current_user)]):
    with db() as conn:
        return transaction_out(conn, transaction_id)


@app.put("/api/transactions/{transaction_id}")
def update_transaction(transaction_id: int, body: TransactionPatch, _: Annotated[dict[str, Any], Depends(current_user)]):
    with db() as conn:
        if not conn.execute("SELECT 1 FROM transactions WHERE id = ?", (transaction_id,)).fetchone():
            raise HTTPException(status.HTTP_404_NOT_FOUND, "Not found")
        conn.execute("UPDATE transactions SET status = ?, updated_at = ? WHERE id = ?", (body.status, now(), transaction_id))
        return transaction_out(conn, transaction_id)


@app.delete("/api/transactions/{transaction_id}", status_code=204)
def delete_transaction(transaction_id: int, _: Annotated[dict[str, Any], Depends(current_user)]):
    with db() as conn:
        cur = conn.execute("DELETE FROM transactions WHERE id = ?", (transaction_id,))
        if cur.rowcount == 0:
            raise HTTPException(status.HTTP_404_NOT_FOUND, "Not found")
    return Response(status_code=204)


@app.get("/api/reports/daily")
def daily_report(_: Annotated[dict[str, Any], Depends(current_user)], selected_date: Annotated[date | None, Query(alias="date")] = None):
    d = (selected_date or date.today()).isoformat()
    with db() as conn:
        summary = conn.execute(
            "SELECT COUNT(*) total_transactions, COALESCE(SUM(total_amount), 0) total_revenue FROM transactions WHERE DATE(created_at) = ?",
            (d,),
        ).fetchone()
        items_sold = conn.execute(
            "SELECT COALESCE(SUM(ti.quantity), 0) total FROM transaction_items ti JOIN transactions t ON t.id = ti.transaction_id WHERE DATE(t.created_at) = ?",
            (d,),
        ).fetchone()["total"]
        rows = conn.execute(
            """
            SELECT ti.product_id, SUM(ti.quantity) total_qty, SUM(ti.subtotal) total, p.name
            FROM transaction_items ti
            JOIN transactions t ON t.id = ti.transaction_id
            JOIN products p ON p.id = ti.product_id
            WHERE DATE(t.created_at) = ?
            GROUP BY ti.product_id, p.name
            ORDER BY total_qty DESC
            LIMIT 5
            """,
            (d,),
        ).fetchall()
        return {
            "date": d,
            "total_transactions": summary["total_transactions"],
            "total_revenue": summary["total_revenue"],
            "total_items_sold": items_sold,
            "top_products": [
                {"product_id": row["product_id"], "total_qty": row["total_qty"], "total": row["total"], "product": {"id": row["product_id"], "name": row["name"]}}
                for row in rows
            ],
        }
