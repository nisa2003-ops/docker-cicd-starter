"""Activity and audit event router."""

from fastapi import APIRouter, Query, HTTPException, status

from ..models.activity import ActivityListResponse
from ..services.activity_service import activity_service
from ..logging_config import logger

router = APIRouter(tags=["Activity"])


@router.get(
    "/activity",
    response_model=ActivityListResponse,
    summary="Platform Audit and Activity Trail",
    description="Returns chronological audit logs of deployments, automated scans, and pipeline events.",
)
async def get_activity(
    limit: int = Query(default=50, ge=1, le=100, description="Number of activity entries to return"),
    offset: int = Query(default=0, ge=0, description="Offset for pagination"),
):
    """Retrieve platform activities."""
    try:
        return activity_service.get_activities(limit=limit, offset=offset)
    except Exception as e:
        logger.error(f"Error fetching platform activity: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch activities: {str(e)}",
        )
