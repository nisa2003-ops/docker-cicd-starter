"""Version and application metadata router."""

import sys
from datetime import datetime, timezone
from fastapi import APIRouter

from ..models.version import VersionResponse
from ..config import settings
from ..logging_config import logger

router = APIRouter(tags=["Metadata"])


@router.get(
    "/version",
    response_model=VersionResponse,
    summary="Application Version and Metadata",
    description="Returns public application version, environment, and Python runtime info without exposing sensitive variables.",
)
async def get_version():
    """Return safe public version metadata."""
    logger.debug("Handling version metadata request")
    python_ver = f"{sys.version_info.major}.{sys.version_info.minor}.{sys.version_info.micro}"
    return VersionResponse(
        name=settings.APP_NAME,
        version=settings.APP_VERSION,
        environment=settings.ENVIRONMENT,
        python_version=python_ver,
        api_prefix=settings.API_PREFIX,
        docs_url="/docs",
        timestamp=datetime.now(timezone.utc).isoformat(),
    )
