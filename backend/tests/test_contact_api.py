"""Backend API tests for Dr. Julio Cascante landing.
Covers /api/ root and /api/contact (POST/GET) endpoints.
"""
import os
import time
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://prevention-first-2.preview.emergentagent.com").rstrip("/")
API = f"{BASE_URL}/api"


@pytest.fixture(scope="module")
def api_client():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


# ---------------- Root ----------------
class TestRoot:
    def test_api_root(self, api_client):
        r = api_client.get(f"{API}/")
        assert r.status_code == 200, r.text
        data = r.json()
        assert "message" in data
        assert isinstance(data["message"], str)
        assert len(data["message"]) > 0


# ---------------- Contact ----------------
class TestContact:
    def test_create_contact_valid(self, api_client):
        payload = {
            "name": "TEST_Paciente Uno",
            "email": "test_paciente@example.com",
            "phone": "+593999999999",
            "service": "Electrocardiograma",
            "message": "Necesito una valoración cardiaca preventiva.",
        }
        r = api_client.post(f"{API}/contact", json=payload)
        assert r.status_code == 200, r.text
        data = r.json()
        assert data.get("status") in ("success", "stored")
        assert "message" in data and isinstance(data["message"], str) and len(data["message"]) > 0

        # allow write propagation
        time.sleep(0.5)

        # verify persistence
        r2 = api_client.get(f"{API}/contact")
        assert r2.status_code == 200
        items = r2.json()
        assert isinstance(items, list)
        match = [x for x in items if x.get("email") == payload["email"] and x.get("name") == payload["name"]]
        assert len(match) >= 1, "Newly created contact not found in listing"
        rec = match[0]
        assert rec["phone"] == payload["phone"]
        assert rec["service"] == payload["service"]
        assert rec["message"] == payload["message"]
        assert "id" in rec and isinstance(rec["id"], str)
        assert "created_at" in rec
        # No mongo _id leaking
        assert "_id" not in rec

    def test_create_contact_missing_email(self, api_client):
        payload = {"name": "TEST_NoEmail", "message": "hola"}
        r = api_client.post(f"{API}/contact", json=payload)
        assert r.status_code == 422, r.text

    def test_create_contact_invalid_email(self, api_client):
        payload = {
            "name": "TEST_BadEmail",
            "email": "not-an-email",
            "message": "prueba",
        }
        r = api_client.post(f"{API}/contact", json=payload)
        assert r.status_code == 422, r.text

    def test_create_contact_missing_name(self, api_client):
        payload = {"email": "x@example.com", "message": "hola"}
        r = api_client.post(f"{API}/contact", json=payload)
        assert r.status_code == 422, r.text

    def test_list_contacts_shape(self, api_client):
        r = api_client.get(f"{API}/contact")
        assert r.status_code == 200
        items = r.json()
        assert isinstance(items, list)
        if items:
            item = items[0]
            for key in ("id", "name", "email", "message", "created_at"):
                assert key in item, f"Missing key {key} in contact record"
            assert "_id" not in item
