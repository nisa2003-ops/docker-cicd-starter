"""Health check router."""

import time
from datetime import datetime, timezone
from fastapi import APIRouter, status
from fastapi.responses import JSONResponse

from ..models.health import HealthResponse
from ..config import settings
from ..logging_config import logger

router = APIRouter(tags=["Health"])

START_TIME = time.time()


def _format_duration(seconds: float) -> str:
    days, rem = divmod(int(seconds), 86400)
    hours, rem = divmod(rem, 3600)
    minutes, secs = divmod(rem, 60)
    if days > 0:
        return f"{days}d {hours}h {minutes}m {secs}s"
    if hours > 0:
        return f"{hours}h {minutes}m {secs}s"
    return f"{minutes}m {secs}s"


@router.get(
    "/health",
    response_model=HealthResponse,
    summary="System and API Health Check",
    description="Returns current operational status, uptime duration, and component health.",
)
async def get_health():
    """Verify application availability and component state."""
    try:
        uptime_sec = round(time.time() - START_TIME, 2)
        return HealthResponse(
            status="healthy",
            timestamp=datetime.now(timezone.utc).isoformat(),
            uptime_seconds=uptime_sec,
            uptime_formatted=_format_duration(uptime_sec),
            environment=settings.ENVIRONMENT,
            services={
                "api": "operational",
                "telemetry": "operational",
                "cors": "configured",
            },
        )
    except Exception as e:
        logger.error(f"Health check execution failed: {e}", exc_info=True)
        return JSONResponse(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            content={
                "status": "unhealthy",
                "timestamp": datetime.now(timezone.utc).isoformat(),
                "error": str(e),
                "environment": settings.ENVIRONMENT,
            },
        )
