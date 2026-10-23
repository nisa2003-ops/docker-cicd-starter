"""Version and application metadata response models."""

from typing import Optional
from pydantic import BaseModel, Field


class VersionResponse(BaseModel):
    name: str = Field(..., description="Platform service name")
    version: str = Field(..., description="Semantic application version string")
    environment: str = Field(..., description="Current environment (development, staging, production)")
    python_version: str = Field(..., description="Python runtime version")
    api_prefix: str = Field(..., description="Root API route prefix")
    docs_url: Optional[str] = Field(default="/docs", description="Interactive OpenAPI documentation URL")
    timestamp: str = Field(..., description="Current server UTC timestamp")
