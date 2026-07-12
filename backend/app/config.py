from pydantic_settings import BaseSettings
from pathlib import Path


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
        if self.database_url:
            return self.database_url
        if self.is_debug:
            return "sqlite+aiosqlite:///./database.sqlite"
        raise RuntimeError("DATABASE_URL required in production")

    @property
    def cors_list(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]


settings = Settings()
