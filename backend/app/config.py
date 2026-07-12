import os
from dotenv import load_dotenv

load_dotenv()

APP_ENV = os.getenv("APP_ENV", "development")
DEBUG = APP_ENV in ("development", "local")

if DEBUG:
    DATABASE_URL = os.getenv("DATABASE_URL", "sqlite+aiosqlite:///./database.sqlite")
else:
    DATABASE_URL = os.getenv("DATABASE_URL", "")
    if not DATABASE_URL:
        raise RuntimeError("DATABASE_URL is required in production")
    if ":6543" in DATABASE_URL:
        raise RuntimeError("Use Supabase Direct Connection port 5432, not Transaction Pooler 6543")
    if DATABASE_URL.startswith("postgres://"):
        DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql+asyncpg://", 1)
    elif DATABASE_URL.startswith("postgresql://"):
        DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+asyncpg://", 1)

CORS_ORIGINS = [o.strip() for o in os.getenv("CORS_ORIGINS", "*").split(",") if o.strip()]
