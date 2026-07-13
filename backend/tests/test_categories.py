import pytest_asyncio
from httpx import AsyncClient


class TestCategories:
    async def test_list_empty(self, client: AsyncClient):
        r = await client.get("/api/categories")
        assert r.status_code == 200
        assert isinstance(r.json(), list)

    async def test_create_and_list(self, client: AsyncClient):
        r = await client.post("/api/categories", json={"name": "Minuman Segar"})
        assert r.status_code == 201
        data = r.json()
        assert data["name"] == "Minuman Segar"
        cat_id = data["id"]

        r = await client.get("/api/categories")
        assert r.status_code == 200
        names = [c["name"] for c in r.json()]
        assert "Minuman Segar" in names

    async def test_create_without_name(self, client: AsyncClient):
        r = await client.post("/api/categories", json={})
        assert r.status_code == 422

    async def test_duplicate_name_allowed(self, client: AsyncClient):
        # DB doesn't enforce unique name at model level
        await client.post("/api/categories", json={"name": "Double"})
        r = await client.post("/api/categories", json={"name": "Double"})
        assert r.status_code == 201
