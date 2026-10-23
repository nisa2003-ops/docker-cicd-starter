"""Structured logging configuration."""

import logging
import sys
from datetime import datetime, timezone


class StructuredFormatter(logging.Formatter):
    """Custom formatter producing readable structured logs with UTC timestamps and severity."""

    def format(self, record: logging.LogRecord) -> str:
        timestamp = datetime.now(timezone.utc).isoformat()
        request_id = getattr(record, "request_id", "-")
        log_record = {
            "timestamp": timestamp,
            "level": record.levelname,
            "logger": record.name,
            "message": record.getMessage(),
            "request_id": request_id,
        }
        if record.exc_info:
            log_record["exception"] = self.formatException(record.exc_info)

        return (
            f"[{timestamp}] [{record.levelname:<5}] [{record.name}] "
            f"[req:{request_id}] {record.getMessage()}"
        )


def setup_logging(log_level: str = "INFO") -> logging.Logger:
    """Setup root and application loggers."""
    level = getattr(logging, log_level.upper(), logging.INFO)

    handler = logging.StreamHandler(sys.stdout)
    handler.setFormatter(StructuredFormatter())

    root_logger = logging.getLogger()
    root_logger.setLevel(level)

    # Remove existing handlers to avoid duplicate log outputs
    for h in list(root_logger.handlers):
        root_logger.removeHandler(h)
    root_logger.addHandler(handler)

    # Quiet external loggers slightly
    logging.getLogger("uvicorn.access").setLevel(logging.WARNING)

    logger = logging.getLogger("docker_cicd_api")
    logger.setLevel(level)
    return logger


logger = logging.getLogger("docker_cicd_api")
