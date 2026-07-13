from datetime import datetime
from secrets import token_hex

from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.token import Token
from app.models.user import User
from app.schemas.auth import LoginRequest, LoginResponse, UserResponse
from app.dependencies import get_current_user

router = APIRouter(prefix="/api", tags=["auth"])


@router.post("/tokens/create", response_model=LoginResponse)
async def create_token(body: LoginRequest, db: AsyncSession = Depends(get_db)):
    import hashlib
    password_hash = hashlib.sha256(body.password.encode()).hexdigest()
    result = await db.execute(select(User).where(User.email == body.email))
    user = result.scalar_one_or_none()
    if not user or user.password_hash != password_hash:
        raise HTTPException(401, "Invalid email or password")
    token_key = token_hex(32)
    token = Token(token=token_key, user_id=user.id, device_name="api", created_at=datetime.utcnow())
    db.add(token)
    await db.commit()
    return LoginResponse(token=token_key, user_id=user.id, name=user.name)


@router.get("/user", response_model=UserResponse)
async def get_user(user: User = Depends(get_current_user)):
    return user


@router.delete("/tokens", status_code=204)
async def logout(
    authorization: str | None = Header(None),
    db: AsyncSession = Depends(get_db),
):
    if not authorization or not authorization.startswith("Bearer "):
        return
    token_key = authorization[7:]
    result = await db.execute(select(Token).where(Token.token == token_key))
    token = result.scalar_one_or_none()
    if token:
        await db.delete(token)
        await db.commit()
