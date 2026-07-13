from datetime import datetime

from pydantic import BaseModel, Field


class CategoryInfo(BaseModel):
    id: int
    name: str

    model_config = {"from_attributes": True}


class ProductCreate(BaseModel):
    category_id: int
    name: str = Field(min_length=1, max_length=255)
    price: float = Field(gt=0)
    stock: int = Field(ge=0, default=0)
    image_url: str | None = None


class ProductUpdate(BaseModel):
    category_id: int | None = None
    name: str | None = Field(None, min_length=1, max_length=255)
    price: float | None = Field(None, gt=0)
    stock: int | None = Field(None, ge=0)
    image_url: str | None = None


class ProductResponse(BaseModel):
    id: int
    sku: str
    category_id: int
    name: str
    price: float
    stock: int
    image_url: str | None
    created_at: datetime
    updated_at: datetime
    category: CategoryInfo

    model_config = {"from_attributes": True}
