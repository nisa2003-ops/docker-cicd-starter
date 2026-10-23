"""Activity and platform audit service."""

import uuid
from datetime import datetime, timezone
from typing import List, Optional

from ..models.activity import ActivityItem, ActivityListResponse


class ActivityService:
    """Maintains an audit trail of genuine platform events."""

    def __init__(self):
        # Initial boot event
        boot_time = datetime.now(timezone.utc).isoformat()
        self._activities: List[ActivityItem] = [
            ActivityItem(
                id=f"act-{uuid.uuid4().hex[:8]}",
                timestamp=boot_time,
                type="system",
                title="FastAPI Backend Initialized",
                description="FastAPI application process started with CORS and structured logging enabled.",
                author="System Daemon",
                status="success",
                metadata_badge="v0.2.0",
            ),
            ActivityItem(
                id=f"act-{uuid.uuid4().hex[:8]}",
                timestamp=boot_time,
                type="system",
                title="psutil Telemetry Collector Online",
                description="Hardware and resource monitoring initialized for CPU, RAM, and Disk metrics.",
                author="psutil Provider",
                status="info",
                metadata_badge="Telemetry",
            ),
        ]

    def record_activity(
        self,
        event_type: str,
        title: str,
        description: str,
        author: str = "System",
        status: str = "info",
        metadata_badge: Optional[str] = None,
    ) -> ActivityItem:
        """Record a new genuine audit activity."""
        item = ActivityItem(
            id=f"act-{uuid.uuid4().hex[:8]}",
            timestamp=datetime.now(timezone.utc).isoformat(),
            type=event_type,
            title=title,
            description=description,
            author=author,
            status=status,
            metadata_badge=metadata_badge,
        )
        self._activities.insert(0, item)
        # Cap list to 200 items in memory
        if len(self._activities) > 200:
            self._activities = self._activities[:200]
        return item

    def get_activities(self, limit: int = 50, offset: int = 0) -> ActivityListResponse:
        """Fetch list of recorded activities with pagination."""
        total = len(self._activities)
        items = self._activities[offset : offset + limit]
        return ActivityListResponse(
            total=total,
            page=(offset // limit) + 1 if limit > 0 else 1,
            page_size=limit,
            items=items,
            timestamp=datetime.now(timezone.utc).isoformat(),
        )


activity_service = ActivityService()
