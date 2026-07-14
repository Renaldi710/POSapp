from datetime import datetime, date

from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi.responses import JSONResponse
from sqlalchemy import select, func
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.product import Product
from app.models.transaction import Transaction, TransactionItem
from app.models.user import User
from app.schemas.transaction import (
    TransactionCreate,
    TransactionResponse,
    TransactionListItem,
)
from app.dependencies import get_current_user

router = APIRouter(prefix="/api/transactions", tags=["transactions"])


@router.post("", response_model=TransactionResponse, status_code=201)
async def checkout(body: TransactionCreate, db: AsyncSession = Depends(get_db), user: User = Depends(get_current_user)):
    items_data = []
    total = 0.0

    for item in body.items:
        product = await db.get(Product, item.product_id)
        if not product:
            raise HTTPException(422, f"Product {item.product_id} not found")
        if product.stock < item.quantity:
            raise HTTPException(
                422, f"Insufficient stock for '{product.name}': have {product.stock}, need {item.quantity}"
            )

        price = product.price
        subtotal = price * item.quantity
        total += subtotal

        product.stock -= item.quantity
        items_data.append({
            "product_id": item.product_id,
            "quantity": item.quantity,
            "price_at_moment": price,
            "subtotal": subtotal,
        })

    txn = Transaction(
        user_id=user.id,
        total_amount=total,
        payment_method=body.payment_method,
        status="completed",
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow(),
    )
    db.add(txn)
    await db.flush()

    for d in items_data:
        db.add(TransactionItem(transaction_id=txn.id, **d))

    await db.commit()

    result = await db.execute(
        select(Transaction)
        .options(
            selectinload(Transaction.items).selectinload(TransactionItem.product)
        )
        .where(Transaction.id == txn.id)
    )
    txn = result.scalar_one()

    return TransactionResponse(
        id=txn.id,
        user_id=txn.user_id,
        total_amount=txn.total_amount,
        payment_method=txn.payment_method,
        status=txn.status,
        created_at=txn.created_at,
        items=[
            {
                "id": i.id,
                "product_id": i.product_id,
                "quantity": i.quantity,
                "price": i.price_at_moment,
                "subtotal": i.subtotal,
                "product": {"id": i.product.id, "name": i.product.name},
            }
            for i in txn.items
        ],
    )


@router.get("", response_model_exclude_none=True)
async def list_transactions(
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    date_from: date | None = None,
    date_to: date | None = None,
    user_id: int | None = None,
    db: AsyncSession = Depends(get_db),
):
    stmt = (
        select(Transaction)
        .options(selectinload(Transaction.items))
        .order_by(Transaction.created_at.desc())
        .offset((page - 1) * per_page)
        .limit(per_page)
    )
    count_stmt = select(func.count(Transaction.id))

    if user_id is not None:
        stmt = stmt.where(Transaction.user_id == user_id)
        count_stmt = count_stmt.where(Transaction.user_id == user_id)
    if date_from:
        stmt = stmt.where(Transaction.created_at >= datetime.combine(date_from, datetime.min.time()))
        count_stmt = count_stmt.where(Transaction.created_at >= datetime.combine(date_from, datetime.min.time()))
    if date_to:
        stmt = stmt.where(Transaction.created_at <= datetime.combine(date_to, datetime.max.time()))
        count_stmt = count_stmt.where(Transaction.created_at <= datetime.combine(date_to, datetime.max.time()))

    total_result = await db.execute(count_stmt)
    total = total_result.scalar() or 0

    result = await db.execute(stmt)
    transactions = result.scalars().all()

    payload = {
        "data": [TransactionListItem.model_validate(t).model_dump(mode="json") for t in transactions],
        "total": total,
        "page": page,
        "per_page": per_page,
    }
    return JSONResponse(content=payload, headers={"Cache-Control": "public, max-age=30"})


@router.get("/{transaction_id}", response_model=TransactionResponse)
async def get_transaction(transaction_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Transaction)
        .options(
            selectinload(Transaction.items).selectinload(TransactionItem.product)
        )
        .where(Transaction.id == transaction_id)
    )
    txn = result.scalar_one_or_none()
    if not txn:
        raise HTTPException(404, "Transaction not found")

    return TransactionResponse(
        id=txn.id,
        user_id=txn.user_id,
        total_amount=txn.total_amount,
        payment_method=txn.payment_method,
        status=txn.status,
        created_at=txn.created_at,
        items=[
            {
                "id": i.id,
                "product_id": i.product_id,
                "quantity": i.quantity,
                "price": i.price_at_moment,
                "subtotal": i.subtotal,
                "product": {"id": i.product.id, "name": i.product.name},
            }
            for i in txn.items
        ],
    )


@router.get("/{transaction_id}/receipt")
async def get_receipt(transaction_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Transaction)
        .options(
            selectinload(Transaction.items).selectinload(TransactionItem.product)
        )
        .where(Transaction.id == transaction_id)
    )
    txn = result.scalar_one_or_none()
    if not txn:
        raise HTTPException(404, "Transaction not found")
    return {
        "transaction_id": txn.id,
        "total_amount": txn.total_amount,
        "payment_method": txn.payment_method,
        "status": txn.status,
        "created_at": txn.created_at.isoformat(),
        "items": [
            {
                "name": i.product.name,
                "quantity": i.quantity,
                "price": i.price_at_moment,
                "subtotal": i.subtotal,
            }
            for i in txn.items
        ],
    }
