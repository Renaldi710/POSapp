from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy.pool import NullPool

from app.config import settings

# ponytail: NullPool for serverless. Ceiling: Adds ~20ms TCP handshake per request. Upgrade: Move to VPS/Railway if traffic exceeds 1000 req/min.
engine = create_async_engine(
    settings.db_url,
    echo=False,
    poolclass=NullPool,
    connect_args={"server_settings": {"jit": "off"}},
)
SessionLocal = async_sessionmaker(engine, expire_on_commit=False)


class Base(DeclarativeBase):
    pass


async def get_db():
    async with SessionLocal() as session:
        yield session
