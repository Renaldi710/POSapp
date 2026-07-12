from urllib.parse import urlencode, urlparse, urlunparse

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_name: str = "POSapp"
    app_env: str = "development"
    debug: bool = True
    cors_origins: str = "*"
    database_url: str | None = None

    model_config = {"env_file": ".env.local", "env_file_encoding": "utf-8", "extra": "ignore"}

    @property
    def is_debug(self) -> bool:
        return self.app_env in ("development", "local")

    @property
    def db_url(self) -> str:
        url = self.database_url
        if not url:
            if self.is_debug:
                return "sqlite+aiosqlite:///./database.sqlite"
            raise RuntimeError("DATABASE_URL is required in production")
        if ":6543" in url:
            raise RuntimeError(
                "Use Neon Direct Connection (port 5432), not connection pooler (6543)"
            )
        # convert to asyncpg driver
        if url.startswith("postgres://"):
            url = url.replace("postgres://", "postgresql+asyncpg://", 1)
        elif url.startswith("postgresql://"):
            url = url.replace("postgresql://", "postgresql+asyncpg://", 1)
        # strip libpq-only query params that asyncpg rejects
        parsed = urlparse(url)
        if parsed.query:
            qs = {k: v for k, v in (p.split("=", 1) for p in parsed.query.split("&"))}
            for key in ("sslmode", "channel_binding"):
                qs.pop(key, None)
            url = urlunparse(parsed._replace(query=urlencode(qs)))
        return url

    @property
    def cors_list(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]


settings = Settings()
