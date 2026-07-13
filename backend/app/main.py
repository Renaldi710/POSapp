import hashlib
from contextlib import asynccontextmanager
from datetime import datetime

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import Base, engine, SessionLocal
from app.models import User, Category  # noqa: F401 — ensure models registered
from app.models.product import Product
from app.routers import auth, categories, products, reports, transactions
from app.seed_data import seed_makanan, seed_minuman, seed_snack, seed_lainnya


def hash_password(password: str):
    return hashlib.sha256(password.encode()).hexdigest()


@asynccontextmanager
async def lifespan(app: FastAPI):
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    # seed admin + categories + 200+ products if empty
    if settings.is_debug:
        async with SessionLocal() as db:
            from sqlalchemy import select
            result = await db.execute(select(User).limit(1))
            if not result.scalar_one_or_none():
                now = datetime.utcnow()
                admin = User(
                    name="Admin POS",
                    email="admin@pos.app",
                    password_hash=hash_password("password"),
                    role="admin",
                    created_at=now,
                )
                db.add(admin)
                await db.flush()

                category_map = {}
                for name in ["Makanan", "Minuman", "Snack", "Lainnya"]:
                    cat = Category(name=name, created_at=now, updated_at=now)
                    db.add(cat)
                    await db.flush()
                    category_map[name] = cat.id

                kasir = User(
                    name="Kasir Utama",
                    email="kasir@pos.app",
                    password_hash=hash_password("password"),
                    role="kasir",
                    created_at=now,
                )
                db.add(kasir)

                food_cat_id = category_map["Makanan"]
                drink_cat_id = category_map["Minuman"]
                snack_cat_id = category_map["Snack"]
                lain_cat_id = category_map["Lainnya"]

                for prod in seed_makanan(now):
                    db.add(Product(**prod, category_id=food_cat_id))
                for prod in seed_minuman(now):
                    db.add(Product(**prod, category_id=drink_cat_id))
                for prod in seed_snack(now):
                    db.add(Product(**prod, category_id=snack_cat_id))
                for prod in seed_lainnya(now):
                    db.add(Product(**prod, category_id=lain_cat_id))

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
