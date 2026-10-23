"""HTTP request middleware for tracing and access metrics."""

import time
import uuid
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response

from .logging_config import logger


class RequestTracingMiddleware(BaseHTTPMiddleware):
    """Injects unique request ID and logs request processing latency."""

    async def dispatch(self, request: Request, call_next) -> Response:
        start_time = time.time()
        request_id = request.headers.get("X-Request-ID") or uuid.uuid4().hex[:12]

        # Attach request_id to request state
        request.state.request_id = request_id

        try:
            response = await call_next(request)
            duration_ms = round((time.time() - start_time) * 1000, 2)

            response.headers["X-Request-ID"] = request_id
            response.headers["X-Process-Time"] = f"{duration_ms}ms"

            # Access log
            logger.info(
                f"{request.method} {request.url.path} -> {response.status_code} ({duration_ms}ms)",
                extra={"request_id": request_id},
            )
            return response
        except Exception as e:
            duration_ms = round((time.time() - start_time) * 1000, 2)
            logger.error(
                f"Unhandled exception during {request.method} {request.url.path}: {e}",
                exc_info=True,
                extra={"request_id": request_id},
            )
            raise e
