"""Tests for the expanded clinical patient endpoints (iteration 3)."""
import os
import uuid
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://prevention-first-2.preview.emergentagent.com").rstrip("/")
API = f"{BASE_URL}/api"


@pytest.fixture(scope="module")
def token():
    r = requests.post(f"{API}/auth/login", json={"username": "jcascante", "password": "Cardio2026"}, timeout=30)
    assert r.status_code == 200, r.text
    return r.json()["token"]


@pytest.fixture(scope="module")
def auth_headers(token):
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture(scope="module")
def created_ids():
    return []


FULL_BODY_FIELDS = [
    "name", "cedula", "birthdate", "age", "sex", "blood_type", "phone", "email",
    "city", "address", "marital_status", "occupation", "insurance",
    "emergency_contact", "emergency_phone", "allergies", "history", "medications", "notes",
]


def _full_body(suffix=""):
    uniq = uuid.uuid4().hex[:8]
    return {
        "name": f"TEST_Paciente {uniq}{suffix}",
        "cedula": f"TEST-{uniq}",
        "birthdate": "1990-05-20",
        "age": "34",
        "sex": "Masculino",
        "blood_type": "O+",
        "phone": "+506 8888-0000",
        "email": "paciente@test.com",
        "city": "San Jose",
        "address": "Av Central 123",
        "marital_status": "Casado/a",
        "occupation": "Ingeniero",
        "insurance": "INS",
        "emergency_contact": "Maria",
        "emergency_phone": "+506 7777-1111",
        "allergies": "Penicilina",
        "history": "HTA",
        "medications": "Losartan 50mg",
        "notes": "Nota de prueba",
    }


class TestPatientsExpanded:
    def test_create_full_body(self, auth_headers, created_ids):
        body = _full_body()
        r = requests.post(f"{API}/patients", json=body, headers=auth_headers, timeout=30)
        assert r.status_code == 200, r.text
        data = r.json()
        for f in FULL_BODY_FIELDS:
            assert data.get(f) == body[f], f"field {f} mismatch: {data.get(f)} vs {body[f]}"
        assert "id" in data
        created_ids.append(data["id"])

    def test_list_contains_created(self, auth_headers, created_ids):
        r = requests.get(f"{API}/patients", headers=auth_headers, timeout=30)
        assert r.status_code == 200
        ids = {p["id"] for p in r.json()}
        assert created_ids[0] in ids

    def test_duplicate_cedula_rejected(self, auth_headers, created_ids):
        # fetch cedula from created
        r = requests.get(f"{API}/patients", headers=auth_headers, timeout=30)
        orig = next(p for p in r.json() if p["id"] == created_ids[0])
        dup = _full_body("-dup")
        dup["cedula"] = orig["cedula"]
        r2 = requests.post(f"{API}/patients", json=dup, headers=auth_headers, timeout=30)
        assert r2.status_code == 400, r2.text
        assert "cédula" in r2.json().get("detail", "").lower()

    def test_update_patient(self, auth_headers, created_ids):
        pid = created_ids[0]
        r = requests.get(f"{API}/patients", headers=auth_headers, timeout=30)
        orig = next(p for p in r.json() if p["id"] == pid)
        upd = {**{k: orig.get(k, "") for k in FULL_BODY_FIELDS}, "occupation": "Cardiologo"}
        r2 = requests.put(f"{API}/patients/{pid}", json=upd, headers=auth_headers, timeout=30)
        assert r2.status_code == 200, r2.text
        assert r2.json()["occupation"] == "Cardiologo"
        # GET verify
        r3 = requests.get(f"{API}/patients", headers=auth_headers, timeout=30)
        got = next(p for p in r3.json() if p["id"] == pid)
        assert got["occupation"] == "Cardiologo"

    def test_create_with_name_only_required(self, auth_headers, created_ids):
        # name is the only pydantic-required. phone omitted.
        r = requests.post(f"{API}/patients", json={"name": f"TEST_Minimal {uuid.uuid4().hex[:6]}"},
                          headers=auth_headers, timeout=30)
        assert r.status_code == 200, r.text
        created_ids.append(r.json()["id"])

    def test_empty_body_rejected(self, auth_headers):
        r = requests.post(f"{API}/patients", json={}, headers=auth_headers, timeout=30)
        assert r.status_code == 422

    def test_soft_delete(self, auth_headers, created_ids):
        pid = created_ids[0]
        r = requests.delete(f"{API}/patients/{pid}", headers=auth_headers, timeout=30)
        assert r.status_code == 200
        r2 = requests.get(f"{API}/patients", headers=auth_headers, timeout=30)
        assert pid not in {p["id"] for p in r2.json()}

    def test_auth_required(self):
        r = requests.get(f"{API}/patients", timeout=30)
        assert r.status_code == 401

    def test_cleanup_remaining(self, auth_headers, created_ids):
        for pid in created_ids[1:]:
            requests.delete(f"{API}/patients/{pid}", headers=auth_headers, timeout=30)
