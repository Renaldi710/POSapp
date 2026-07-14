from datetime import date, datetime

from fastapi import APIRouter, Depends, Query
from fastapi.responses import JSONResponse
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.transaction import Transaction, TransactionItem

router = APIRouter(prefix="/api/reports", tags=["reports"])


@router.get("/daily")
async def daily_report(
    date_str: date = Query(alias="date"),
    db: AsyncSession = Depends(get_db),
):
    start = datetime.combine(date_str, datetime.min.time())
    end = datetime.combine(date_str, datetime.max.time())

    # total transaksi & revenue
    stats = await db.execute(
        select(
            func.count(Transaction.id).label("total_transactions"),
            func.coalesce(func.sum(Transaction.total_amount), 0).label("total_revenue"),
        ).where(Transaction.created_at >= start, Transaction.created_at <= end)
    )
    row = stats.one()
    total_transactions = row.total_transactions
    total_revenue = float(row.total_revenue)

    # top products
    top_items = await db.execute(
        select(
            TransactionItem.product_id,
            func.sum(TransactionItem.quantity).label("total_qty"),
            func.sum(TransactionItem.subtotal).label("total_subtotal"),
        )
        .join(Transaction)
        .where(Transaction.created_at >= start, Transaction.created_at <= end)
        .group_by(TransactionItem.product_id)
        .order_by(func.sum(TransactionItem.quantity).desc())
        .limit(10)
    )

    return JSONResponse(
        content={
            "date": date_str.isoformat(),
            "total_transactions": total_transactions,
            "total_revenue": total_revenue,
            "top_products": [
                {
                    "product_id": r.product_id,
                    "total_quantity": r.total_qty,
                    "total_subtotal": float(r.total_subtotal),
                }
                for r in top_items.all()
            ],
        },
        headers={"Cache-Control": "public, max-age=300"},
    )
