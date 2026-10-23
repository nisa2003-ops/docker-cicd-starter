"""Health check response models."""

from typing import Dict
from pydantic import BaseModel, Field


class ServiceStatus(BaseModel):
    status: str = Field(..., description="Operational status of the service (e.g. operational, degraded)")
    latency_ms: float = Field(default=0.0, description="Ping/query latency in milliseconds")


class HealthResponse(BaseModel):
    status: str = Field(..., description="Overall system health status (healthy, degraded, unhealthy)")
    timestamp: str = Field(..., description="ISO 8601 UTC timestamp")
    uptime_seconds: float = Field(..., description="Application process uptime in seconds")
    uptime_formatted: str = Field(..., description="Human-readable uptime duration")
    environment: str = Field(..., description="Active runtime environment name")
    services: Dict[str, str] = Field(
        default_factory=dict,
        description="Dictionary of individual component statuses"
    )
