import pytest
import pytest_asyncio
from httpx import AsyncClient
from sqlalchemy import select

from app.models.category import Category


@pytest_asyncio.fixture(autouse=True)
async def seed_categories(db):
    cats = [Category(name="Makanan"), Category(name="Minuman")]
    for c in cats:
        db.add(c)
    await db.commit()
    for c in cats:
        await db.refresh(c)
    return {c.name: c.id for c in cats}


class TestCreateProduct:
    async def test_success(self, client: AsyncClient, seed_categories):
        cat_id = seed_categories["Makanan"]
        r = await client.post("/api/products", json={
            "category_id": cat_id, "sku": "FOO-001", "name": "Foo", "price": 10.0, "stock": 5,
        })
        assert r.status_code == 201
        data = r.json()
        assert data["sku"] == "FOO-001"
        assert data["stock"] == 5
        assert data["category_name"] == "Makanan"

    async def test_duplicate_sku(self, client: AsyncClient, seed_categories):
        cat_id = seed_categories["Makanan"]
        await client.post("/api/products", json={
            "category_id": cat_id, "sku": "DUP", "name": "A", "price": 1.0, "stock": 1,
        })
        r = await client.post("/api/products", json={
            "category_id": cat_id, "sku": "DUP", "name": "B", "price": 2.0, "stock": 2,
        })
        assert r.status_code == 409

    async def test_negative_stock(self, client: AsyncClient, seed_categories):
        r = await client.post("/api/products", json={
            "category_id": seed_categories["Makanan"], "sku": "NEG", "name": "Neg", "price": 1.0, "stock": -1,
        })
        assert r.status_code == 422

    async def test_invalid_category(self, client: AsyncClient):
        r = await client.post("/api/products", json={
            "category_id": 999, "sku": "NOCAT", "name": "No Cat", "price": 1.0, "stock": 1,
        })
        assert r.status_code == 400


class TestListProducts:
    async def test_empty(self, client: AsyncClient):
        r = await client.get("/api/products")
        assert r.status_code == 200
        assert r.json() == []

    async def test_with_search(self, client: AsyncClient, seed_categories):
        cat_id = seed_categories["Makanan"]
        await client.post("/api/products", json={
            "category_id": cat_id, "sku": "ABC", "name": "Ayam Goreng", "price": 15.0, "stock": 10,
        })
        await client.post("/api/products", json={
            "category_id": cat_id, "sku": "XYZ", "name": "Es Teh", "price": 5.0, "stock": 10,
        })
        r = await client.get("/api/products", params={"q": "ayam"})
        assert len(r.json()) == 1

    async def test_filter_by_category(self, client: AsyncClient, seed_categories):
        m_id = seed_categories["Makanan"]
        min_id = seed_categories["Minuman"]
        await client.post("/api/products", json={
            "category_id": m_id, "sku": "M1", "name": "Makanan1", "price": 1.0, "stock": 1,
        })
        await client.post("/api/products", json={
            "category_id": min_id, "sku": "MIN1", "name": "Minuman1", "price": 1.0, "stock": 1,
        })
        r = await client.get("/api/products", params={"category_id": m_id})
        assert len(r.json()) == 1
        assert r.json()[0]["category_name"] == "Makanan"


class TestGetProduct:
    async def test_not_found(self, client: AsyncClient):
        r = await client.get("/api/products/999")
        assert r.status_code == 404

    async def test_success(self, client: AsyncClient, seed_categories):
        cat_id = seed_categories["Makanan"]
        cr = await client.post("/api/products", json={
            "category_id": cat_id, "sku": "GET1", "name": "Get Me", "price": 7.0, "stock": 3,
        })
        pid = cr.json()["id"]
        r = await client.get(f"/api/products/{pid}")
        assert r.status_code == 200
        assert r.json()["sku"] == "GET1"


class TestUpdateProduct:
    async def test_success(self, client: AsyncClient, seed_categories):
        cat_id = seed_categories["Makanan"]
        cr = await client.post("/api/products", json={
            "category_id": cat_id, "sku": "UPD1", "name": "Old", "price": 5.0, "stock": 1,
        })
        pid = cr.json()["id"]
        r = await client.put(f"/api/products/{pid}", json={"name": "New", "price": 10.0})
        assert r.status_code == 200
        assert r.json()["name"] == "New"
        assert r.json()["price"] == 10.0

    async def test_negative_stock(self, client: AsyncClient, seed_categories):
        cat_id = seed_categories["Makanan"]
        cr = await client.post("/api/products", json={
            "category_id": cat_id, "sku": "NEGUPD", "name": "X", "price": 1.0, "stock": 1,
        })
        pid = cr.json()["id"]
        r = await client.put(f"/api/products/{pid}", json={"stock": -5})
        assert r.status_code == 422

    async def test_not_found(self, client: AsyncClient):
        r = await client.put("/api/products/999", json={"name": "Nope"})
        assert r.status_code == 404


class TestDeleteProduct:
    async def test_success(self, client: AsyncClient, seed_categories):
        cat_id = seed_categories["Makanan"]
        cr = await client.post("/api/products", json={
            "category_id": cat_id, "sku": "DEL1", "name": "Delete Me", "price": 1.0, "stock": 1,
        })
        pid = cr.json()["id"]
        r = await client.delete(f"/api/products/{pid}")
        assert r.status_code == 204
        gr = await client.get(f"/api/products/{pid}")
        assert gr.status_code == 404

    async def test_not_found(self, client: AsyncClient):
        r = await client.delete("/api/products/999")
        assert r.status_code == 404
