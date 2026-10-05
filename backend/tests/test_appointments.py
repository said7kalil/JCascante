"""Backend tests for /api/appointments (Citas)."""
import os
import pytest
import requests
from datetime import date, timedelta

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "").rstrip("/") or \
           "https://prevention-first-2.preview.emergentagent.com"
API = f"{BASE_URL}/api"


def _future_weekday_iso(offset_start=7):
    d = date.today() + timedelta(days=offset_start)
    while d.weekday() >= 5:  # 5=Sat,6=Sun
        d += timedelta(days=1)
    return d.isoformat()


@pytest.fixture(scope="module")
def token():
    r = requests.post(f"{API}/auth/login",
                      json={"username": "jcascante", "password": "Cardio2026"},
                      timeout=30)
    assert r.status_code == 200, r.text
    return r.json()["token"]


@pytest.fixture(scope="module")
def auth(token):
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture(scope="module")
def created_ids():
    ids = []
    yield ids


def test_requires_auth():
    r = requests.get(f"{API}/appointments", timeout=15)
    assert r.status_code == 401

    r2 = requests.post(f"{API}/appointments", json={"name": "x", "date": "2099-01-01", "time": "09:00"}, timeout=15)
    assert r2.status_code == 401


def test_create_appointment(auth, created_ids):
    payload = {
        "name": "TEST_Juan Perez",
        "phone": "+593999111222",
        "email": "test@example.com",
        "cedula": "1234567890",
        "service": "Consulta general",
        "date": _future_weekday_iso(14),
        "time": "09:00",
        "reason": "Chequeo",
    }
    r = requests.post(f"{API}/appointments", headers=auth, json=payload, timeout=60)
    assert r.status_code == 200, r.text
    data = r.json()
    assert data["name"] == payload["name"]
    assert data["date"] == payload["date"]
    assert data["time"] == payload["time"]
    assert data["status"] == "pendiente"
    assert "email_sent" in data and isinstance(data["email_sent"], bool)
    assert "id" in data
    assert "_id" not in data
    created_ids.append(data["id"])


def test_list_sorted(auth, created_ids):
    # add a second earlier-time appointment
    payload = {
        "name": "TEST_Earlier",
        "date": _future_weekday_iso(14),
        "time": "08:00",
    }
    r = requests.post(f"{API}/appointments", headers=auth, json=payload, timeout=60)
    assert r.status_code == 200
    created_ids.append(r.json()["id"])

    lst = requests.get(f"{API}/appointments", headers=auth, timeout=15).json()
    # verify sorted by (date, time)
    keys = [(a["date"], a["time"]) for a in lst]
    assert keys == sorted(keys)


def test_status_update(auth, created_ids):
    aid = created_ids[0]
    r = requests.put(f"{API}/appointments/{aid}/status", headers=auth, json={"status": "confirmada"}, timeout=15)
    assert r.status_code == 200
    assert r.json()["status"] == "confirmada"


def test_status_invalid(auth, created_ids):
    aid = created_ids[0]
    r = requests.put(f"{API}/appointments/{aid}/status", headers=auth, json={"status": "bogus"}, timeout=15)
    assert r.status_code == 400


def test_update_appointment(auth, created_ids):
    aid = created_ids[0]
    payload = {
        "name": "TEST_Juan Updated",
        "phone": "+593999111222",
        "email": "test@example.com",
        "cedula": "1234567890",
        "service": "Ecocardiograma",
        "date": _future_weekday_iso(14),
        "time": "09:00",
        "reason": "cambio",
        "status": "confirmada",
    }
    r = requests.put(f"{API}/appointments/{aid}", headers=auth, json=payload, timeout=15)
    assert r.status_code == 200, r.text
    d = r.json()
    assert d["name"] == "TEST_Juan Updated"
    assert d["service"] == "Ecocardiograma"
    assert d["status"] == "confirmada"


def test_delete_appointment(auth, created_ids):
    for aid in created_ids:
        r = requests.delete(f"{API}/appointments/{aid}", headers=auth, timeout=15)
        assert r.status_code == 200
    # verify not in list anymore
    lst = requests.get(f"{API}/appointments", headers=auth, timeout=15).json()
    live_ids = [a["id"] for a in lst]
    for aid in created_ids:
        assert aid not in live_ids
