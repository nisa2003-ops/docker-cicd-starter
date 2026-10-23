"""CI/CD Pipeline response and request models."""

from typing import List, Optional
from pydantic import BaseModel, Field


class PipelineStageStepModel(BaseModel):
    id: str
    name: str
    status: str  # success, running, failed, queued
    duration_seconds: float = 0.0


class PipelineStageModel(BaseModel):
    id: str
    name: str
    group: str  # Fast Feedback, Extended Test, Production
    status: str
    duration_seconds: float = 0.0
    steps: List[PipelineStageStepModel] = Field(default_factory=list)


class PipelineRunItem(BaseModel):
    id: str
    pipeline_name: str
    run_number: int
    status: str  # success, running, failed, queued, unconfigured
    branch: str
    commit_hash: str
    commit_message: str
    author: str
    trigger_type: str  # Push, Manual, Scheduled, PR
    started_at: str
    duration: str
    stages: List[PipelineStageModel] = Field(default_factory=list)


class PipelineStatusResponse(BaseModel):
    configured: bool = Field(
        ...,
        description="Whether an active CI/CD runner or provider is connected"
    )
    status: str = Field(
        ...,
        description="Pipeline system state: unconfigured, idle, running, or unavailable"
    )
    provider: Optional[str] = Field(
        default=None,
        description="Active CI provider (e.g. github-actions, local-runner, or null if unconfigured)"
    )
    repository: Optional[str] = Field(
        default=None,
        description="Linked public repository slug if configured (never exposes access tokens)"
    )
    message: str = Field(
        ...,
        description="Descriptive status message explaining current runner connectivity"
    )
    total_runs: int = Field(default=0, description="Total recorded pipeline executions")
    latest_run: Optional[PipelineRunItem] = Field(
        default=None,
        description="Most recent pipeline run if available, or null"
    )
    runs: List[PipelineRunItem] = Field(
        default_factory=list,
        description="List of recorded pipeline runs"
    )


class PipelineDispatchRequest(BaseModel):
    pipeline_name: str = Field(default="Golden-pipeline-12", description="Name of the pipeline workflow")
    branch: str = Field(default="main", description="Git branch to execute on")
    environment: str = Field(default="development", description="Target deployment environment")


class PipelineDispatchResponse(BaseModel):
    id: str
    pipeline_name: str
    run_number: int
    status: str
    branch: str
    commit_hash: str
    message: str
    started_at: str
