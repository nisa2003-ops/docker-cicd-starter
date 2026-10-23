"""Platform activity and audit response models."""

from typing import List, Optional
from pydantic import BaseModel, Field


class ActivityItem(BaseModel):
    id: str = Field(..., description="Unique event identifier")
    timestamp: str = Field(..., description="Timestamp of the event in ISO 8601 UTC")
    type: str = Field(..., description="Event category: system, deploy, pipeline, container, security, user")
    title: str = Field(..., description="Short summary title of the activity")
    description: str = Field(..., description="Detailed description of the operation or event")
    author: str = Field(..., description="Actor or system service responsible")
    status: str = Field(default="info", description="Outcome status: info, success, warning, error")
    metadata_badge: Optional[str] = Field(default=None, description="Optional chip or tag label")


class ActivityListResponse(BaseModel):
    total: int = Field(..., description="Total number of logged activity events")
    page: int = Field(default=1, description="Current page number")
    page_size: int = Field(default=50, description="Items per page")
    items: List[ActivityItem] = Field(default_factory=list, description="List of activity events")
    timestamp: str = Field(..., description="Current response generation timestamp")
