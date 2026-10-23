"""Tests for /api/version endpoint."""

def test_version_endpoint_success(client):
    response = client.get("/api/version")
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Docker CI/CD Starter Platform API"
    assert data["version"] == "0.2.0"
    assert data["environment"] in ["development", "staging", "production", "test"]
    assert "python_version" in data
    assert data["api_prefix"] == "/api"
    assert "timestamp" in data

    # Verify no secret variables are leaked
    sensitive_keys = ["secret", "password", "token", "key", "credential", "auth"]
    for key in data.keys():
        assert not any(s in key.lower() for s in sensitive_keys)
