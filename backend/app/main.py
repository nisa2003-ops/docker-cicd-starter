"""FastAPI application entrypoint for Docker CI/CD Starter Platform."""

from contextlib import asynccontextmanager
from datetime import datetime, timezone
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException

from .config import settings
from .logging_config import setup_logging, logger
from .middleware import RequestTracingMiddleware
from .routers import health, version, metrics, pipeline, activity


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan context manager."""
    setup_logging(settings.LOG_LEVEL)
    logger.info(
        f"Starting {settings.APP_NAME} v{settings.APP_VERSION} [{settings.ENVIRONMENT}]"
    )
    logger.info(f"CORS origins configured: {settings.cors_origins_list}")
    yield
    logger.info(f"Shutting down {settings.APP_NAME}")


app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="DevOps Infrastructure Dashboard Backend API providing genuine system metrics and CI/CD observability.",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

# 1. Request tracing and access logging middleware
app.add_middleware(RequestTracingMiddleware)

# 2. CORS configuration via environment variables
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# 3. Standardized Exception Handlers
@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request: Request, exc: StarletteHTTPException):
    request_id = getattr(request.state, "request_id", "unknown")
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": {
                "status_code": exc.status_code,
                "message": exc.detail,
            },
            "request_id": request_id,
            "timestamp": datetime.now(timezone.utc).isoformat(),
        },
    )


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    request_id = getattr(request.state, "request_id", "unknown")
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "error": {
                "status_code": status.HTTP_422_UNPROCESSABLE_ENTITY,
                "message": "Input validation error",
                "details": exc.errors(),
            },
            "request_id": request_id,
            "timestamp": datetime.now(timezone.utc).isoformat(),
        },
    )


@app.exception_handler(Exception)
async def generic_exception_handler(request: Request, exc: Exception):
    request_id = getattr(request.state, "request_id", "unknown")
    logger.error(f"Internal server error: {exc}", exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "error": {
                "status_code": status.HTTP_500_INTERNAL_SERVER_ERROR,
                "message": "Internal server error occurred",
            },
            "request_id": request_id,
            "timestamp": datetime.now(timezone.utc).isoformat(),
        },
    )


# 4. Include Endpoint Routers under /api
app.include_router(health.router, prefix="/api")
app.include_router(version.router, prefix="/api")
app.include_router(metrics.router, prefix="/api")
app.include_router(pipeline.router, prefix="/api")
app.include_router(activity.router, prefix="/api")

# Also include under /api/v1 for backward compatibility
app.include_router(health.router, prefix="/api/v1")
app.include_router(version.router, prefix="/api/v1")
app.include_router(metrics.router, prefix="/api/v1")
app.include_router(pipeline.router, prefix="/api/v1")
app.include_router(activity.router, prefix="/api/v1")


@app.get("/", tags=["Root"])
async def root():
    """Root endpoint for quick health check and documentation reference."""
    return {
        "name": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "status": "operational",
        "docs_url": "/docs",
        "endpoints": [
            "/api/health",
            "/api/version",
            "/api/metrics",
            "/api/pipeline",
            "/api/activity",
        ],
    }
