"""CI/CD pipeline router."""

from fastapi import APIRouter, HTTPException, status

from ..models.pipeline import (
    PipelineStatusResponse,
    PipelineDispatchRequest,
    PipelineDispatchResponse,
)
from ..services.pipeline_service import pipeline_service
from ..services.activity_service import activity_service
from ..logging_config import logger

router = APIRouter(tags=["Pipeline"])


@router.get(
    "/pipeline",
    response_model=PipelineStatusResponse,
    summary="CI/CD Pipeline Status",
    description="Returns pipeline execution history or explicit unconfigured status when no CI/CD runner is active.",
)
async def get_pipeline_status():
    """Retrieve current CI/CD status or unconfigured state."""
    try:
        return pipeline_service.get_pipeline_status()
    except Exception as e:
        logger.error(f"Error fetching pipeline status: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Pipeline status lookup failed: {str(e)}",
        )


@router.post(
    "/pipeline/dispatch",
    response_model=PipelineDispatchResponse,
    status_code=status.HTTP_202_ACCEPTED,
    summary="Dispatch Pipeline Execution Test",
    description="Manually dispatch a workflow run across connected runners or local test dispatcher.",
)
async def dispatch_pipeline(request: PipelineDispatchRequest):
    """Trigger a new pipeline test run."""
    try:
        res = pipeline_service.dispatch_run(
            pipeline_name=request.pipeline_name,
            branch=request.branch,
            environment=request.environment,
        )
        activity_service.record_activity(
            event_type="pipeline",
            title=f"Workflow {request.pipeline_name} Dispatched",
            description=f"Manual execution triggered on {request.branch} (Target: {request.environment})",
            author="DevOps Engineer",
            status="info",
            metadata_badge=f"#{res.run_number}",
        )
        return res
    except Exception as e:
        logger.error(f"Pipeline dispatch failed: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to dispatch pipeline: {str(e)}",
        )
