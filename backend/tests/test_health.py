"""Tests for /api/health endpoint."""

def test_health_endpoint_success(client):
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "timestamp" in data
    assert isinstance(data["uptime_seconds"], (int, float))
    assert data["uptime_seconds"] >= 0
    assert "uptime_formatted" in data
    assert "services" in data
    assert data["services"]["api"] == "operational"
    assert data["services"]["telemetry"] == "operational"


def test_health_v1_alias(client):
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"
