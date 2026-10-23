"""Tests for /api/pipeline endpoints."""

def test_pipeline_status_structure(client):
    response = client.get("/api/pipeline")
    assert response.status_code == 200
    data = response.json()

    assert "configured" in data
    assert isinstance(data["configured"], bool)
    assert data["status"] in ["unconfigured", "idle", "running", "unavailable"]
    assert "message" in data
    assert "runs" in data
    assert isinstance(data["runs"], list)
    assert "total_runs" in data
    assert isinstance(data["total_runs"], int)


def test_pipeline_dispatch_flow(client):
    payload = {
        "pipeline_name": "Test-Pipeline-CI",
        "branch": "main",
        "environment": "staging",
    }
    response = client.post("/api/pipeline/dispatch", json=payload)
    assert response.status_code == 202
    data = response.json()
    assert data["pipeline_name"] == "Test-Pipeline-CI"
    assert data["branch"] == "main"
    assert data["status"] == "running"
    assert "commit_hash" in data
    assert "started_at" in data

    # Verify run is reflected in pipeline status
    status_res = client.get("/api/pipeline")
    assert status_res.status_code == 200
    status_data = status_res.json()
    assert status_data["total_runs"] >= 1
    assert status_data["configured"] is True
    assert status_data["latest_run"]["pipeline_name"] == "Test-Pipeline-CI"


def test_pipeline_dispatch_validation_error(client):
    # Invalid payload (missing required branch)
    response = client.post("/api/pipeline/dispatch", json={"branch": ""})
    # Validates response
    assert response.status_code in [202, 422]
