from datetime import datetime

from pydantic import BaseModel, Field


class ProductCreate(BaseModel):
    category_id: int
    sku: str = Field(min_length=1, max_length=100)
    name: str = Field(min_length=1, max_length=255)
    price: float = Field(gt=0)
    stock: int = Field(ge=0, default=0)


class ProductUpdate(BaseModel):
    category_id: int | None = None
    sku: str | None = Field(None, min_length=1, max_length=100)
    name: str | None = Field(None, min_length=1, max_length=255)
    price: float | None = Field(None, gt=0)
    stock: int | None = Field(None, ge=0)


class ProductResponse(BaseModel):
    id: int
    category_id: int
    category_name: str | None = None
    sku: str
    name: str
    price: float
    stock: int
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
