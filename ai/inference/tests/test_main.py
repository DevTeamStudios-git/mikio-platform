from app.main import app
from fastapi.testclient import TestClient

client = TestClient(app)


def test_get_status_returns_ok() -> None:
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"status": "ok", "service": "mikio-ai-inference"}
