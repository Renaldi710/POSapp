import hashlib
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import Base, engine, SessionLocal
from app.models import User, Category  # noqa: F401 — ensure models registered
from app.routers import auth, categories, products, reports, transactions


def hash_password(password: str):
    return hashlib.sha256(password.encode()).hexdigest()


@asynccontextmanager
async def lifespan(app: FastAPI):
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    # seed admin if empty
    if settings.is_debug:
        async with SessionLocal() as db:
            from sqlalchemy import select
            result = await db.execute(select(User).limit(1))
            if not result.scalar_one_or_none():
                from datetime import datetime
                admin = User(name="Admin POS", email="admin@pos.app", password_hash=hash_password("password"), role="admin", created_at=datetime.utcnow())
                db.add(admin)
                for name in ["Makanan", "Minuman", "Snack", "Lainnya"]:
                    db.add(Category(name=name, updated_at=datetime.utcnow()))
                await db.commit()

    yield
    await engine.dispose()


app = FastAPI(title="POSapp API", lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_list,
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(auth.router)
app.include_router(categories.router)
app.include_router(products.router)
app.include_router(reports.router)
app.include_router(transactions.router)


@app.get("/api/health")
@app.get("/health")
async def health():
    return {"status": "ok"}
