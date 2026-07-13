import pytest_asyncio
from httpx import AsyncClient
from sqlalchemy import select

from app.database import Base
from app.models.user import User
from app.models.category import Category
from app.models.product import Product


@pytest_asyncio.fixture(autouse=True)
async def seed_user_and_product(db):
    user = User(name="Admin", email="admin@test.com", password_hash="x", role="admin")
    db.add(user)
    cat = Category(name="Makanan")
    db.add(cat)
    await db.flush()
    product = Product(category_id=cat.id, sku="TST-01", name="Test Item", price=10_000, stock=5)
    db.add(product)
    await db.commit()
    return {"user_id": user.id, "product_id": product.id, "price": product.price}


class TestCheckout:
    async def test_success(self, client: AsyncClient, seed_user_and_product):
        pid = seed_user_and_product["product_id"]
        r = await client.post("/api/transactions", json={
            "items": [{"product_id": pid, "quantity": 2}],
            "payment_method": "tunai",
        })
        assert r.status_code == 201
        data = r.json()
        assert data["total_amount"] == 20_000
        assert data["payment_method"] == "tunai"
        assert data["status"] == "completed"
        assert len(data["items"]) == 1
        assert data["items"][0]["price"] == 10_000
        assert data["items"][0]["subtotal"] == 20_000
        assert data["items"][0]["product"]["name"] == "Test Item"

    async def test_payment_methods(self, client: AsyncClient, seed_user_and_product):
        pid = seed_user_and_product["product_id"]
        for method in ("qris", "debit_kredit"):
            r = await client.post("/api/transactions", json={
                "items": [{"product_id": pid, "quantity": 1}],
                "payment_method": method,
            })
            assert r.status_code == 201, f"{method} failed"
            assert r.json()["payment_method"] == method

    async def test_invalid_payment_method(self, client: AsyncClient, seed_user_and_product):
        pid = seed_user_and_product["product_id"]
        r = await client.post("/api/transactions", json={
            "items": [{"product_id": pid, "quantity": 1}],
            "payment_method": "bitcoin",
        })
        assert r.status_code == 422

    async def test_insufficient_stock(self, client: AsyncClient, seed_user_and_product):
        pid = seed_user_and_product["product_id"]
        r = await client.post("/api/transactions", json={
            "items": [{"product_id": pid, "quantity": 99}]
        })
        assert r.status_code == 422
        assert "Insufficient stock" in r.json()["detail"]

    async def test_product_not_found(self, client: AsyncClient):
        r = await client.post("/api/transactions", json={
            "items": [{"product_id": 999, "quantity": 1}]
        })
        assert r.status_code == 422
        assert "not found" in r.json()["detail"]

    async def test_stock_rollback_on_failure(
        self, client: AsyncClient, seed_user_and_product, db
    ):
        # first checkout with valid items
        pid = seed_user_and_product["product_id"]
        r = await client.post("/api/transactions", json={
            "items": [
                {"product_id": pid, "quantity": 3},
                {"product_id": 999, "quantity": 1},  # this will fail
            ]
        })
        assert r.status_code == 422

        # product stock should still be 5 (rolled back)
        result = await db.execute(select(Product).where(Product.id == pid))
        product = result.scalar_one()
        assert product.stock == 5

    async def test_multiple_items(self, client: AsyncClient, seed_user_and_product, db):
        pid = seed_user_and_product["product_id"]
        product2 = Product(category_id=1, sku="TST-02", name="Item 2", price=5_000, stock=10)
        db.add(product2)
        await db.commit()

        r = await client.post("/api/transactions", json={
            "items": [
                {"product_id": pid, "quantity": 2},
                {"product_id": product2.id, "quantity": 3},
            ]
        })
        assert r.status_code == 201
        assert r.json()["total_amount"] == (2 * 10_000) + (3 * 5_000)  # 35_000
        assert len(r.json()["items"]) == 2

        # stock deducted
        result = await db.execute(select(Product).where(Product.id == pid))
        assert result.scalar_one().stock == 3  # 5 - 2


class TestListTransactions:
    async def test_pagination(self, client: AsyncClient, seed_user_and_product):
        pid = seed_user_and_product["product_id"]
        for _ in range(5):
            await client.post("/api/transactions", json={
                "items": [{"product_id": pid, "quantity": 1}]
            })

        r = await client.get("/api/transactions", params={"page": 1, "per_page": 2})
        assert r.status_code == 200
        data = r.json()
        assert len(data["data"]) == 2
        assert data["total"] == 5
        assert data["page"] == 1
        assert data["per_page"] == 2

    async def test_filter_by_user(self, client: AsyncClient, seed_user_and_product):
        pid = seed_user_and_product["product_id"]
        await client.post("/api/transactions", json={
            "items": [{"product_id": pid, "quantity": 1}]
        })

        r = await client.get("/api/transactions", params={"user_id": 999})
        assert r.json()["total"] == 0

        r = await client.get("/api/transactions", params={"user_id": 1})
        assert r.json()["total"] >= 1


class TestGetTransaction:
    async def test_success(self, client: AsyncClient, seed_user_and_product):
        pid = seed_user_and_product["product_id"]
        cr = await client.post("/api/transactions", json={
            "items": [{"product_id": pid, "quantity": 1}]
        })
        txn_id = cr.json()["id"]

        r = await client.get(f"/api/transactions/{txn_id}")
        assert r.status_code == 200
        assert r.json()["id"] == txn_id
        assert len(r.json()["items"]) == 1

    async def test_not_found(self, client: AsyncClient):
        r = await client.get("/api/transactions/999")
        assert r.status_code == 404


class TestReceipt:
    async def test_success(self, client: AsyncClient, seed_user_and_product):
        pid = seed_user_and_product["product_id"]
        cr = await client.post("/api/transactions", json={
            "items": [{"product_id": pid, "quantity": 2}],
            "payment_method": "qris",
        })
        txn_id = cr.json()["id"]

        r = await client.get(f"/api/transactions/{txn_id}/receipt")
        assert r.status_code == 200
        data = r.json()
        assert data["transaction_id"] == txn_id
        assert data["payment_method"] == "qris"
        assert data["total_amount"] == 20_000
        assert len(data["items"]) == 1
        assert data["items"][0]["name"] == "Test Item"
        assert data["items"][0]["quantity"] == 2
        assert data["items"][0]["price"] == 10_000
        assert data["items"][0]["subtotal"] == 20_000
        assert "created_at" in data

    async def test_not_found(self, client: AsyncClient):
        r = await client.get("/api/transactions/999/receipt")
        assert r.status_code == 404
