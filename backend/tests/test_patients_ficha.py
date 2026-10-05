"""Tests for the ficha (patient full page) backend endpoints: extended fields,
GET /patients/{id}, file uploads (ekg/eco), file delete, followups, and the
guarantee that PUT does NOT wipe uploaded files/followups."""
import io
import os
import uuid

import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://prevention-first-2.preview.emergentagent.com").rstrip("/")
API = f"{BASE_URL}/api"

EXTENDED_FIELDS = [
    "consulta_place", "consulta_date", "motivo_control", "factores_riesgo", "habitos",
    "app", "apqx", "medications", "actividad_fisica", "vacuna_covid",
    "cuadro_clinico", "ex_respiratorio", "ex_cardiovascular", "igy", "sv", "imc", "ecg_reposo",
    "diagnostico", "laboratorios", "eco_desc",
]


@pytest.fixture(scope="module")
def auth():
    r = requests.post(f"{API}/auth/login", json={"username": "jcascante", "password": "Cardio2026"}, timeout=30)
    assert r.status_code == 200, r.text
    return {"Authorization": f"Bearer {r.json()['token']}"}


@pytest.fixture(scope="module")
def patient(auth):
    body = {"name": f"TEST_Ficha {uuid.uuid4().hex[:6]}"}
    for f in EXTENDED_FIELDS:
        body[f] = f"val-{f}"
    r = requests.post(f"{API}/patients", json=body, headers=auth, timeout=30)
    assert r.status_code == 200, r.text
    data = r.json()
    yield data
    # cleanup
    requests.delete(f"{API}/patients/{data['id']}", headers=auth)


def _png_bytes():
    # 1x1 red PNG
    return (b"\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x02\x00\x00\x00"
            b"\x90wS\xde\x00\x00\x00\x0cIDATx\x9cc\xf8\xcf\xc0\x00\x00\x00\x03\x00\x01\x5c\xcd\xff\x69"
            b"\x00\x00\x00\x00IEND\xaeB`\x82")


def test_create_persists_all_extended_fields(patient):
    for f in EXTENDED_FIELDS:
        assert patient[f] == f"val-{f}", f"field {f} mismatch at create"
    assert patient["ekg_files"] == []
    assert patient["eco_files"] == []
    assert patient["followups"] == []
    assert "_id" not in patient


def test_get_by_id_returns_extended(patient, auth):
    r = requests.get(f"{API}/patients/{patient['id']}", headers=auth, timeout=15)
    assert r.status_code == 200
    data = r.json()
    for f in EXTENDED_FIELDS:
        assert data[f] == f"val-{f}"
    assert "_id" not in data


def test_get_by_id_requires_auth(patient):
    r = requests.get(f"{API}/patients/{patient['id']}", timeout=15)
    assert r.status_code == 401


def test_get_by_id_not_found(auth):
    r = requests.get(f"{API}/patients/does-not-exist-xyz", headers=auth, timeout=15)
    assert r.status_code == 404


def test_upload_ekg_file(patient, auth):
    files = {"file": ("ekg.png", _png_bytes(), "image/png")}
    r = requests.post(f"{API}/patients/{patient['id']}/files",
                      data={"field": "ekg"}, files=files, headers=auth, timeout=60)
    assert r.status_code == 200, r.text
    data = r.json()
    assert len(data["ekg_files"]) == 1
    f = data["ekg_files"][0]
    assert f["original_filename"] == "ekg.png"
    assert f["content_type"] == "image/png"
    assert f["url"].startswith("/api/files/")
    assert "file_id" in f
    patient["_ekg_file_id"] = f["file_id"]


def test_upload_eco_file(patient, auth):
    files = {"file": ("eco.png", _png_bytes(), "image/png")}
    r = requests.post(f"{API}/patients/{patient['id']}/files",
                      data={"field": "eco"}, files=files, headers=auth, timeout=60)
    assert r.status_code == 200
    data = r.json()
    assert len(data["eco_files"]) == 1
    patient["_eco_file_id"] = data["eco_files"][0]["file_id"]


def test_upload_invalid_field(patient, auth):
    files = {"file": ("x.png", _png_bytes(), "image/png")}
    r = requests.post(f"{API}/patients/{patient['id']}/files",
                      data={"field": "bogus"}, files=files, headers=auth, timeout=30)
    assert r.status_code == 400


def test_add_followup(patient, auth):
    r = requests.post(f"{API}/patients/{patient['id']}/followups",
                      json={"text": "Primer seguimiento TEST"}, headers=auth, timeout=15)
    assert r.status_code == 200
    data = r.json()
    assert len(data["followups"]) == 1
    fu = data["followups"][0]
    assert fu["text"] == "Primer seguimiento TEST"
    assert "id" in fu and "date" in fu


def test_put_does_not_wipe_files_or_followups(patient, auth):
    """CRITICAL: PUT /patients/{id} must preserve ekg_files, eco_files, followups."""
    upd = {"name": patient["name"], "diagnostico": "updated-dx"}
    for f in EXTENDED_FIELDS:
        upd.setdefault(f, "")
    upd["diagnostico"] = "updated-dx"
    r = requests.put(f"{API}/patients/{patient['id']}", json=upd, headers=auth, timeout=30)
    assert r.status_code == 200, r.text
    data = r.json()
    assert data["diagnostico"] == "updated-dx"
    assert len(data.get("ekg_files", [])) == 1, "PUT wiped ekg_files!"
    assert len(data.get("eco_files", [])) == 1, "PUT wiped eco_files!"
    assert len(data.get("followups", [])) == 1, "PUT wiped followups!"


def test_delete_ekg_file(patient, auth):
    fid = patient["_ekg_file_id"]
    r = requests.delete(f"{API}/patients/{patient['id']}/files/{fid}?field=ekg",
                        headers=auth, timeout=15)
    assert r.status_code == 200
    data = r.json()
    assert all(f["file_id"] != fid for f in data["ekg_files"])
    assert len(data["ekg_files"]) == 0


def test_delete_file_invalid_field(patient, auth):
    r = requests.delete(f"{API}/patients/{patient['id']}/files/any?field=bogus",
                        headers=auth, timeout=15)
    assert r.status_code == 400


def test_uploads_require_auth(patient):
    files = {"file": ("x.png", _png_bytes(), "image/png")}
    r = requests.post(f"{API}/patients/{patient['id']}/files",
                      data={"field": "ekg"}, files=files, timeout=15)
    assert r.status_code == 401
