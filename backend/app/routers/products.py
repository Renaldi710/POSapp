from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.product import Product
from app.models.category import Category
from app.schemas.product import ProductCreate, ProductUpdate, ProductResponse

router = APIRouter(prefix="/api/products", tags=["products"])


@router.get("", response_model=list[ProductResponse])
async def list_products(
    q: str | None = Query(None, min_length=1),
    category_id: int | None = None,
    db: AsyncSession = Depends(get_db),
):
    stmt = select(Product).options(selectinload(Product.category))
    if category_id is not None:
        stmt = stmt.where(Product.category_id == category_id)
    if q:
        stmt = stmt.where(
            Product.name.ilike(f"%{q}%") | Product.sku.ilike(f"%{q}%")
        )
    stmt = stmt.order_by(Product.created_at.desc())
    result = await db.execute(stmt)
    products = result.scalars().all()
    return [
        ProductResponse(
            id=p.id,
            category_id=p.category_id,
            category_name=p.category.name if p.category else None,
            sku=p.sku,
            name=p.name,
            price=p.price,
            stock=p.stock,
            created_at=p.created_at,
            updated_at=p.updated_at,
        )
        for p in products
    ]


@router.get("/{product_id}", response_model=ProductResponse)
async def get_product(product_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Product).options(selectinload(Product.category)).where(Product.id == product_id)
    )
    p = result.scalar_one_or_none()
    if not p:
        raise HTTPException(404, "Product not found")
    return ProductResponse(
        id=p.id,
        category_id=p.category_id,
        category_name=p.category.name if p.category else None,
        sku=p.sku,
        name=p.name,
        price=p.price,
        stock=p.stock,
        created_at=p.created_at,
        updated_at=p.updated_at,
    )


@router.post("", response_model=ProductResponse, status_code=201)
async def create_product(body: ProductCreate, db: AsyncSession = Depends(get_db)):
    cat = await db.get(Category, body.category_id)
    if not cat:
        raise HTTPException(400, "Category not found")
    existing = await db.execute(select(Product).where(Product.sku == body.sku))
    if existing.scalar_one_or_none():
        raise HTTPException(409, f"SKU '{body.sku}' already exists")
    now = datetime.utcnow()
    p = Product(**body.model_dump(), created_at=now, updated_at=now)
    db.add(p)
    await db.commit()
    await db.refresh(p)
    return ProductResponse(
        id=p.id,
        category_id=p.category_id,
        category_name=cat.name,
        sku=p.sku,
        name=p.name,
        price=p.price,
        stock=p.stock,
        created_at=p.created_at,
        updated_at=p.updated_at,
    )


@router.put("/{product_id}", response_model=ProductResponse)
async def update_product(
    product_id: int, body: ProductUpdate, db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Product).options(selectinload(Product.category)).where(Product.id == product_id)
    )
    p = result.scalar_one_or_none()
    if not p:
        raise HTTPException(404, "Product not found")
    if body.category_id is not None:
        cat = await db.get(Category, body.category_id)
        if not cat:
            raise HTTPException(400, "Category not found")
    updates = body.model_dump(exclude_unset=True)
    if not updates:
        raise HTTPException(400, "No fields to update")
    for field, value in updates.items():
        setattr(p, field, value)
    p.updated_at = datetime.utcnow()
    await db.commit()
    await db.refresh(p)
    return ProductResponse(
        id=p.id,
        category_id=p.category_id,
        category_name=p.category.name if p.category else None,
        sku=p.sku,
        name=p.name,
        price=p.price,
        stock=p.stock,
        created_at=p.created_at,
        updated_at=p.updated_at,
    )


@router.delete("/{product_id}", status_code=204)
async def delete_product(product_id: int, db: AsyncSession = Depends(get_db)):
    p = await db.get(Product, product_id)
    if not p:
        raise HTTPException(404, "Product not found")
    await db.delete(p)
    await db.commit()
