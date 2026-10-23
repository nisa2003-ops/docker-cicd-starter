"""Tests for /api/activity endpoint."""

def test_activity_list_structure(client):
    response = client.get("/api/activity")
    assert response.status_code == 200
    data = response.json()

    assert "total" in data
    assert isinstance(data["total"], int)
    assert data["total"] >= 1
    assert "items" in data
    assert isinstance(data["items"], list)
    assert len(data["items"]) >= 1

    first_item = data["items"][0]
    assert "id" in first_item
    assert "timestamp" in first_item
    assert "type" in first_item
    assert "title" in first_item
    assert "description" in first_item
    assert "author" in first_item
    assert first_item["status"] in ["info", "success", "warning", "error"]


def test_activity_pagination(client):
    response = client.get("/api/activity?limit=1&offset=0")
    assert response.status_code == 200
    data = response.json()
    assert len(data["items"]) <= 1
    assert data["page_size"] == 1
