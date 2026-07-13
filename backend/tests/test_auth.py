import pytest_asyncio
from httpx import AsyncClient
from sqlalchemy import select

from app.models.user import User
from app.models.token import Token


class TestAuthLogin:
    async def test_login_success(self, client: AsyncClient, db):
        # seed user
        import hashlib
        u = User(
            name="Test", email="test@test.com",
            password_hash=hashlib.sha256("secret".encode()).hexdigest(),
            role="admin",
        )
        db.add(u)
        await db.commit()

        r = await client.post("/api/tokens/create", json={
            "email": "test@test.com", "password": "secret",
        })
        assert r.status_code == 200
        data = r.json()
        assert "token" in data
        assert data["user_id"] == u.id
        assert data["name"] == "Test"

    async def test_login_wrong_password(self, client: AsyncClient, db):
        import hashlib
        u = User(name="T", email="t@t.com",
                 password_hash=hashlib.sha256("right".encode()).hexdigest(), role="kasir")
        db.add(u)
        await db.commit()

        r = await client.post("/api/tokens/create", json={
            "email": "t@t.com", "password": "wrong",
        })
        assert r.status_code == 401

    async def test_login_user_not_found(self, client: AsyncClient):
        r = await client.post("/api/tokens/create", json={
            "email": "nobody@test.com", "password": "any",
        })
        assert r.status_code == 401


class TestAuthGetUser:
    async def test_get_user_requires_auth(self, client: AsyncClient):
        r = await client.get("/api/user")
        assert r.status_code == 401

    async def test_get_user_success(self, client: AsyncClient, db):
        import hashlib, secrets
        u = User(name="Me", email="me@me.com",
                 password_hash=hashlib.sha256("x".encode()).hexdigest(), role="kasir")
        db.add(u)
        await db.flush()
        token = Token(token=secrets.token_hex(16), user_id=u.id, device_name="test")
        db.add(token)
        await db.commit()

        r = await client.get("/api/user", headers={"Authorization": f"Bearer {token.token}"})
        assert r.status_code == 200
        assert r.json()["email"] == "me@me.com"
        assert r.json()["role"] == "kasir"

    async def test_get_user_invalid_token(self, client: AsyncClient):
        r = await client.get("/api/user", headers={"Authorization": "Bearer invalid"})
        assert r.status_code == 401


class TestAuthLogout:
    async def test_logout_success(self, client: AsyncClient, db):
        import hashlib, secrets
        u = User(name="Out", email="out@out.com",
                 password_hash=hashlib.sha256("x".encode()).hexdigest(), role="kasir")
        db.add(u)
        await db.flush()
        token = Token(token=secrets.token_hex(16), user_id=u.id, device_name="test")
        db.add(token)
        await db.commit()

        r = await client.delete("/api/tokens",
                                headers={"Authorization": f"Bearer {token.token}"})
        assert r.status_code == 204

        # token should be gone
        result = await db.execute(select(Token).where(Token.token == token.token))
        assert result.scalar_one_or_none() is None

    async def test_logout_invalid_token(self, client: AsyncClient):
        r = await client.delete("/api/tokens",
                                headers={"Authorization": "Bearer notexist"})
        assert r.status_code == 204  # still 204 — idempotent
