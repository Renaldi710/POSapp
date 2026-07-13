from datetime import datetime

from pydantic import BaseModel, Field


class TransactionItemCreate(BaseModel):
    product_id: int
    quantity: int = Field(gt=0)


class TransactionCreate(BaseModel):
    items: list[TransactionItemCreate] = Field(min_length=1)
    payment_method: str = Field(default="tunai", pattern="^(tunai|qris|debit_kredit)$")


class ItemProductInfo(BaseModel):
    id: int
    name: str

    model_config = {"from_attributes": True}


class TransactionItemResponse(BaseModel):
    id: int
    product_id: int
    quantity: int
    price: float
    subtotal: float
    product: ItemProductInfo

    model_config = {"from_attributes": True}


class TransactionResponse(BaseModel):
    id: int
    user_id: int
    total_amount: float
    payment_method: str
    status: str
    items: list[TransactionItemResponse]
    created_at: datetime

    model_config = {"from_attributes": True}


class TransactionListItem(BaseModel):
    id: int
    user_id: int
    total_amount: float
    payment_method: str
    status: str
    created_at: datetime

    model_config = {"from_attributes": True}
