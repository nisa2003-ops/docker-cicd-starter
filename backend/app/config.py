"""Application configuration managed via pydantic-settings."""

import os
from typing import List, Union
from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Safe application settings.
    Credentials and secrets must never be exposed through API responses or public methods.
    """
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    APP_NAME: str = "Docker CI/CD Starter Platform API"
    APP_VERSION: str = "0.2.0"
    ENVIRONMENT: str = Field(default="development")
    API_PREFIX: str = "/api"
    LOG_LEVEL: str = Field(default="INFO")

    # Host & Port
    API_HOST: str = "127.0.0.1"
    API_PORT: int = 8000

    # CORS configuration
    CORS_ORIGINS: Union[str, List[str]] = Field(
        default=[
            "http://localhost:5173",
            "http://127.0.0.1:5173",
            "http://localhost:3000",
            "http://127.0.0.1:3000",
        ]
    )

    # Optional CI/CD Configuration (Never contains credentials or tokens)
    CI_PROVIDER: str = Field(default="")
    CI_REPOSITORY: str = Field(default="")

    @field_validator("CORS_ORIGINS", mode="before")
    @classmethod
    def parse_cors_origins(cls, value: Union[str, List[str]]) -> List[str]:
        if isinstance(value, str):
            if value.startswith("[") and value.endswith("]"):
                # JSON format
                import json
                try:
                    return json.loads(value)
                except Exception:
                    pass
            # Comma-separated format
            return [origin.strip() for origin in value.split(",") if origin.strip()]
        return value

    @property
    def cors_origins_list(self) -> List[str]:
        if isinstance(self.CORS_ORIGINS, list):
            return self.CORS_ORIGINS
        return [str(self.CORS_ORIGINS)]


settings = Settings()
