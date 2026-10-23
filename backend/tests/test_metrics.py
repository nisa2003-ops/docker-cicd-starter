"""Tests for /api/metrics endpoint."""

def test_metrics_endpoint_structure(client):
    response = client.get("/api/metrics")
    assert response.status_code == 200
    data = response.json()

    # Core response envelope
    assert data["status"] in ["available", "degraded"]
    assert "timestamp" in data
    assert data["is_live_data"] is True

    # CPU metrics
    cpu = data["cpu"]
    assert isinstance(cpu["percent"], (int, float))
    assert 0 <= cpu["percent"] <= 100
    assert isinstance(cpu["cores_logical"], int)
    assert cpu["cores_logical"] >= 1
    assert cpu["status"] == "available"

    # Memory metrics
    memory = data["memory"]
    assert memory["total_bytes"] > 0
    assert memory["used_bytes"] >= 0
    assert memory["total_gb"] > 0
    assert 0 <= memory["percent"] <= 100
    assert memory["status"] == "available"

    # Disk metrics
    disk = data["disk"]
    assert disk["total_bytes"] > 0
    assert disk["used_bytes"] >= 0
    assert disk["total_gb"] > 0
    assert 0 <= disk["percent"] <= 100
    assert disk["status"] == "available"

    # Network metrics
    network = data["network"]
    assert network["bytes_sent"] >= 0
    assert network["bytes_recv"] >= 0
    assert network["status"] == "available"

    # Host info
    host = data["host"]
    assert isinstance(host["platform"], str)
    assert host["uptime_seconds"] >= 0
    assert "uptime_formatted" in host
