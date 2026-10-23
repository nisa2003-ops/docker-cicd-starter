"""Pytest fixtures for backend test suite."""

import pytest
from fastapi.testclient import TestClient

from app.main import app


@pytest.fixture(scope="session")
def client():
    """Reusable TestClient instance."""
    with TestClient(app) as test_client:
        yield test_client
