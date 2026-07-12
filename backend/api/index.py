from datetime import date, datetime
import hashlib
import os
import secrets
from enum import StrEnum
from typing import Annotated

from dotenv import load_dotenv
load_dotenv()

from fastapi import Depends, FastAPI, Header, HTTPException, Query, Response, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from sqlalchemy import DateTime, ForeignKey, String, delete, func, select, update
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship, selectinload

DATABASE_URL = os.environ.get("DATABASE_URL", "")
if not DATABASE_URL:
    raise RuntimeError("DATABASE_URL is required")
if ":6543" in DATABASE_URL:
    raise RuntimeError("Use Supabase Direct Connection port 5432, not Transaction Pooler 6543")
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql+asyncpg://", 1)
elif DATABASE_URL.startswith("postgresql://"):
    DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+asyncpg://", 1)

engine = create_async_engine(DATABASE_URL, pool_size=5, max_overflow=10, pool_recycle=300, pool_pre_ping=True)
SessionLocal = async_sessionmaker(engine, expire_on_commit=False)

app = FastAPI(title="POSapp API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin for origin in os.getenv("CORS_ORIGINS", "*").split(",") if origin],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


class Base(DeclarativeBase):
    pass


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(255))
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    password_hash: Mapped[str] = mapped_column(String(255))
    role: Mapped[str] = mapped_column(String(50), default="kasir")
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    tokens: Mapped[list["Token"]] = relationship(back_populates="user", cascade="all, delete-orphan")
    transactions: Mapped[list["Transaction"]] = relationship(back_populates="user")


class Token(Base):
    __tablename__ = "tokens"

    token: Mapped[str] = mapped_column(String(255), primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True)
    device_name: Mapped[str] = mapped_column(String(100))
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    user: Mapped[User] = relationship(back_populates="tokens")


class Category(Base):
    __tablename__ = "categories"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(255))
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    products: Mapped[list["Product"]] = relationship(back_populates="category", cascade="all, delete-orphan")


class Product(Base):
    __tablename__ = "products"

    id: Mapped[int] = mapped_column(primary_key=True)
    category_id: Mapped[int] = mapped_column(ForeignKey("categories.id", ondelete="CASCADE"), index=True)
    name: Mapped[str] = mapped_column(String(255))
    price: Mapped[float]
    stock: Mapped[int] = mapped_column(default=0)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    category: Mapped[Category] = relationship(back_populates="products")
    items: Mapped[list["TransactionItem"]] = relationship(back_populates="product")


class Transaction(Base):
    __tablename__ = "transactions"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True)
    total_amount: Mapped[float]
    status: Mapped[str] = mapped_column(String(50), default="completed")
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    user: Mapped[User] = relationship(back_populates="transactions")
    items: Mapped[list["TransactionItem"]] = relationship(back_populates="transaction", cascade="all, delete-orphan")


class TransactionItem(Base):
    __tablename__ = "transaction_items"

    id: Mapped[int] = mapped_column(primary_key=True)
    transaction_id: Mapped[int] = mapped_column(ForeignKey("transactions.id", ondelete="CASCADE"), index=True)
    product_id: Mapped[int] = mapped_column(ForeignKey("products.id", ondelete="CASCADE"), index=True)
    quantity: Mapped[int]
    price: Mapped[float]
    subtotal: Mapped[float]
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    transaction: Mapped[Transaction] = relationship(back_populates="items")
    product: Mapped[Product] = relationship(back_populates="items")


class TransactionStatus(StrEnum):
    pending = "pending"
    completed = "completed"
    cancelled = "cancelled"


class LoginIn(BaseModel):
    email: str = Field(min_length=3, max_length=255)
    password: str = Field(min_length=1)
    device_name: str = Field(min_length=1, max_length=100)


class CategoryIn(BaseModel):
    name: str = Field(min_length=1, max_length=255)


class ProductIn(BaseModel):
    category_id: int = Field(gt=0)
    name: str = Field(min_length=1, max_length=255)
    price: float = Field(ge=0)
    stock: int = Field(ge=0)


class ProductPatch(BaseModel):
    category_id: int | None = Field(default=None, gt=0)
    name: str | None = Field(default=None, min_length=1, max_length=255)
    price: float | None = Field(default=None, ge=0)
    stock: int | None = Field(default=None, ge=0)


class TransactionItemIn(BaseModel):
    product_id: int = Field(gt=0)
    quantity: int = Field(gt=0)


class TransactionIn(BaseModel):
    items: list[TransactionItemIn] = Field(min_length=1)


class TransactionPatch(BaseModel):
    status: TransactionStatus


async def get_db():
    async with SessionLocal() as session:
        yield session


def hash_password(password: str):
    return hashlib.sha256(password.encode()).hexdigest()


def user_out(user: User):
    return {"id": user.id, "name": user.name, "email": user.email, "role": user.role, "created_at": user.created_at.isoformat()}


def category_out(category: Category):
    return {
        "id": category.id,
        "name": category.name,
        "created_at": category.created_at.isoformat(),
        "updated_at": category.updated_at.isoformat(),
        "products_count": len(category.products),
    }


def product_out(product: Product):
    return {
        "id": product.id,
        "category_id": product.category_id,
        "name": product.name,
        "price": product.price,
        "stock": product.stock,
        "created_at": product.created_at.isoformat(),
        "updated_at": product.updated_at.isoformat(),
        "category": {"id": product.category.id, "name": product.category.name},
    }


def transaction_out(transaction: Transaction):
    return {
        "id": transaction.id,
        "user_id": transaction.user_id,
        "total_amount": transaction.total_amount,
        "status": transaction.status,
        "created_at": transaction.created_at.isoformat(),
        "updated_at": transaction.updated_at.isoformat(),
        "user": user_out(transaction.user),
        "items": [
            {
                "id": item.id,
                "product_id": item.product_id,
                "quantity": item.quantity,
                "price": item.price,
                "subtotal": item.subtotal,
                "created_at": item.created_at.isoformat(),
                "updated_at": item.updated_at.isoformat(),
                "product": {"id": item.product.id, "name": item.product.name},
            }
            for item in transaction.items
        ],
    }


async def current_user(authorization: Annotated[str | None, Header()] = None, db: AsyncSession = Depends(get_db)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Unauthenticated")
    token = authorization.removeprefix("Bearer ").strip()
    result = await db.execute(select(Token).options(selectinload(Token.user)).where(Token.token == token))
    token_row = result.scalar_one_or_none()
    if not token_row:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Unauthenticated")
    return token_row.user


@app.get("/api/health")
async def health():
    return {"status": "ok"}


@app.post("/api/tokens/create")
async def login(body: LoginIn, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == body.email))
    user = result.scalar_one_or_none()
    if not user or user.password_hash != hash_password(body.password):
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Invalid credentials")
    token = Token(token=secrets.token_urlsafe(32), user_id=user.id, device_name=body.device_name)
    db.add(token)
    await db.commit()
    return {"token": token.token}


@app.get("/api/user")
async def me(user: User = Depends(current_user)):
    return user_out(user)


@app.get("/api/categories")
async def list_categories(_: User = Depends(current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Category).options(selectinload(Category.products)).order_by(Category.id))
    return [category_out(category) for category in result.scalars().all()]


@app.post("/api/categories", status_code=201)
async def create_category(body: CategoryIn, _: User = Depends(current_user), db: AsyncSession = Depends(get_db)):
    category = Category(name=body.name, updated_at=datetime.utcnow())
    db.add(category)
    await db.commit()
    await db.refresh(category, ["products"])
    return category_out(category)


@app.get("/api/categories/{category_id}")
async def get_category(category_id: int, _: User = Depends(current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Category).options(selectinload(Category.products)).where(Category.id == category_id))
    category = result.scalar_one_or_none()
    if not category:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Not found")
    return category_out(category)


@app.put("/api/categories/{category_id}")
async def update_category(category_id: int, body: CategoryIn, _: User = Depends(current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Category).options(selectinload(Category.products)).where(Category.id == category_id))
    category = result.scalar_one_or_none()
    if not category:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Not found")
    category.name = body.name
    category.updated_at = datetime.utcnow()
    await db.commit()
    return category_out(category)


@app.delete("/api/categories/{category_id}", status_code=204)
async def delete_category(category_id: int, _: User = Depends(current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(delete(Category).where(Category.id == category_id))
    if result.rowcount == 0:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Not found")
    await db.commit()
    return Response(status_code=204)


@app.get("/api/products")
async def list_products(_: User = Depends(current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Product).options(selectinload(Product.category)).order_by(Product.id))
    return [product_out(product) for product in result.scalars().all()]


@app.post("/api/products", status_code=201)
async def create_product(body: ProductIn, _: User = Depends(current_user), db: AsyncSession = Depends(get_db)):
    category = await db.get(Category, body.category_id)
    if not category:
        raise HTTPException(status.HTTP_422_UNPROCESSABLE_ENTITY, "category_id not found")
    product = Product(category_id=body.category_id, name=body.name, price=body.price, stock=body.stock, updated_at=datetime.utcnow())
    db.add(product)
    await db.commit()
    result = await db.execute(select(Product).options(selectinload(Product.category)).where(Product.id == product.id))
    return product_out(result.scalar_one())


@app.get("/api/products/{product_id}")
async def get_product(product_id: int, _: User = Depends(current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Product).options(selectinload(Product.category)).where(Product.id == product_id))
    product = result.scalar_one_or_none()
    if not product:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Not found")
    return product_out(product)


@app.put("/api/products/{product_id}")
async def update_product(product_id: int, body: ProductPatch, _: User = Depends(current_user), db: AsyncSession = Depends(get_db)):
    data = body.model_dump(exclude_none=True)
    if "category_id" in data and not await db.get(Category, data["category_id"]):
        raise HTTPException(status.HTTP_422_UNPROCESSABLE_ENTITY, "category_id not found")
    result = await db.execute(update(Product).where(Product.id == product_id).values(**data, updated_at=datetime.utcnow()).returning(Product.id))
    if not result.scalar_one_or_none():
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Not found")
    await db.commit()
    result = await db.execute(select(Product).options(selectinload(Product.category)).where(Product.id == product_id))
    return product_out(result.scalar_one())


@app.delete("/api/products/{product_id}", status_code=204)
async def delete_product(product_id: int, _: User = Depends(current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(delete(Product).where(Product.id == product_id))
    if result.rowcount == 0:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Not found")
    await db.commit()
    return Response(status_code=204)


@app.get("/api/transactions")
async def list_transactions(_: User = Depends(current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Transaction)
        .options(selectinload(Transaction.items).selectinload(TransactionItem.product), selectinload(Transaction.user))
        .order_by(Transaction.id.desc())
    )
    return [transaction_out(transaction) for transaction in result.scalars().all()]


@app.post("/api/transactions", status_code=201)
async def create_transaction(body: TransactionIn, user: User = Depends(current_user), db: AsyncSession = Depends(get_db)):
    try:
        product_ids = [item.product_id for item in body.items]
        result = await db.execute(select(Product).where(Product.id.in_(product_ids)).with_for_update())
        products = {product.id: product for product in result.scalars().all()}
        total = 0.0
        transaction_items = []
        for item in body.items:
            product = products.get(item.product_id)
            if not product:
                raise HTTPException(status.HTTP_422_UNPROCESSABLE_ENTITY, f"Invalid product_id {item.product_id}")
            if product.stock < item.quantity:
                raise HTTPException(status.HTTP_422_UNPROCESSABLE_ENTITY, f"Insufficient stock for {product.name}")
            subtotal = product.price * item.quantity
            total += subtotal
            product.stock -= item.quantity
            product.updated_at = datetime.utcnow()
            transaction_items.append(TransactionItem(product_id=product.id, quantity=item.quantity, price=product.price, subtotal=subtotal, updated_at=datetime.utcnow()))
        transaction = Transaction(user_id=user.id, total_amount=total, status="completed", items=transaction_items, updated_at=datetime.utcnow())
        db.add(transaction)
        await db.commit()
        result = await db.execute(
            select(Transaction)
            .options(selectinload(Transaction.items).selectinload(TransactionItem.product), selectinload(Transaction.user))
            .where(Transaction.id == transaction.id)
        )
        return transaction_out(result.scalar_one())
    except HTTPException:
        await db.rollback()
        raise
    except (IntegrityError, SQLAlchemyError):
        await db.rollback()
        raise HTTPException(status.HTTP_500_INTERNAL_SERVER_ERROR, "Database error")


@app.get("/api/transactions/{transaction_id}")
async def get_transaction(transaction_id: int, _: User = Depends(current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Transaction)
        .options(selectinload(Transaction.items).selectinload(TransactionItem.product), selectinload(Transaction.user))
        .where(Transaction.id == transaction_id)
    )
    transaction = result.scalar_one_or_none()
    if not transaction:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Not found")
    return transaction_out(transaction)


@app.put("/api/transactions/{transaction_id}")
async def update_transaction(transaction_id: int, body: TransactionPatch, _: User = Depends(current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(update(Transaction).where(Transaction.id == transaction_id).values(status=body.status.value, updated_at=datetime.utcnow()).returning(Transaction.id))
    if not result.scalar_one_or_none():
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Not found")
    await db.commit()
    return await get_transaction(transaction_id, _, db)


@app.delete("/api/transactions/{transaction_id}", status_code=204)
async def delete_transaction(transaction_id: int, _: User = Depends(current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(delete(Transaction).where(Transaction.id == transaction_id))
    if result.rowcount == 0:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Not found")
    await db.commit()
    return Response(status_code=204)


@app.get("/api/reports/daily")
async def daily_report(_: User = Depends(current_user), selected_date: Annotated[date | None, Query(alias="date")] = None, db: AsyncSession = Depends(get_db)):
    d = selected_date or date.today()
    summary = await db.execute(
        select(func.count(Transaction.id), func.coalesce(func.sum(Transaction.total_amount), 0)).where(func.date(Transaction.created_at) == d)
    )
    total_transactions, total_revenue = summary.one()
    items_sold = await db.execute(
        select(func.coalesce(func.sum(TransactionItem.quantity), 0)).join(Transaction).where(func.date(Transaction.created_at) == d)
    )
    top = await db.execute(
        select(TransactionItem.product_id, func.sum(TransactionItem.quantity), func.sum(TransactionItem.subtotal), Product.name)
        .join(Transaction)
        .join(Product)
        .where(func.date(Transaction.created_at) == d)
        .group_by(TransactionItem.product_id, Product.name)
        .order_by(func.sum(TransactionItem.quantity).desc())
        .limit(5)
    )
    return {
        "date": d.isoformat(),
        "total_transactions": total_transactions,
        "total_revenue": float(total_revenue),
        "total_items_sold": int(items_sold.scalar_one()),
        "top_products": [
            {"product_id": product_id, "total_qty": int(total_qty), "total": float(total), "product": {"id": product_id, "name": name}}
            for product_id, total_qty, total, name in top.all()
        ],
    }
