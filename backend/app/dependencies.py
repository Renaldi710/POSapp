from fastapi import Depends, HTTPException, Header
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.token import Token
from app.models.user import User


async def get_current_user(
    authorization: str | None = Header(None),
    db: AsyncSession = Depends(get_db),
) -> User:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(401, "Invalid token")
    token_key = authorization[7:]
    result = await db.execute(select(Token).where(Token.token == token_key))
    token = result.scalar_one_or_none()
    if not token:
        raise HTTPException(401, "Invalid token")
    user = await db.get(User, token.user_id)
    if not user:
        raise HTTPException(401, "Invalid token")
    return user


async def require_admin(user: User = Depends(get_current_user)) -> User:
    if user.role != "admin":
        raise HTTPException(403, "Admin access required")
    return user
