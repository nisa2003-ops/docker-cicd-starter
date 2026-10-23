"""System metrics router returning genuine psutil telemetry."""

from fastapi import APIRouter, HTTPException, status

from ..models.metrics import MetricsResponse
from ..services.metrics_service import metrics_service
from ..logging_config import logger

router = APIRouter(tags=["Metrics"])


@router.get(
    "/metrics",
    response_model=MetricsResponse,
    summary="Genuine Host Resource Telemetry",
    description="Returns genuine real-time metrics for CPU, RAM, Disk partitions, and Network traffic collected via psutil.",
)
async def get_system_metrics():
    """Retrieve genuine host hardware metrics."""
    try:
        metrics = metrics_service.collect_all_metrics()
        return metrics
    except Exception as e:
        logger.error(f"Failed collecting system metrics: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Unable to read host telemetry: {str(e)}",
        )
