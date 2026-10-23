"""Tests for CORS, custom exception handlers, and tracing middleware."""

def test_cors_headers(client):
    headers = {
        "Origin": "http://localhost:5173",
        "Access-Control-Request-Method": "GET",
    }
    response = client.options("/api/health", headers=headers)
    assert response.status_code == 200
    assert response.headers.get("access-control-allow-origin") == "http://localhost:5173"


def test_404_structured_error(client):
    response = client.get("/api/non-existent-route")
    assert response.status_code == 404
    data = response.json()
    assert "error" in data
    assert data["error"]["status_code"] == 404
    assert "request_id" in data
    assert "timestamp" in data


def test_request_id_and_process_time_headers(client):
    response = client.get("/api/health")
    assert response.status_code == 200
    assert "x-request-id" in response.headers
    assert "x-process-time" in response.headers
