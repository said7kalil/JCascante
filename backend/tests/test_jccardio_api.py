"""Backend API tests for JC Cardio."""
import io
import os
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://prevention-first-2.preview.emergentagent.com").rstrip("/")
API = f"{BASE_URL}/api"


# --------- Fixtures ---------
@pytest.fixture(scope="session")
def s():
    return requests.Session()


@pytest.fixture(scope="session")
def token_jc(s):
    r = s.post(f"{API}/auth/login", json={"username": "jcascante", "password": "Cardio2026"})
    assert r.status_code == 200, r.text
    data = r.json()
    assert "token" in data and "user" in data
    return data["token"]


@pytest.fixture(scope="session")
def auth_headers(token_jc):
    return {"Authorization": f"Bearer {token_jc}"}


# --------- Auth ---------
class TestAuth:
    def test_login_jcascante(self, s):
        r = s.post(f"{API}/auth/login", json={"username": "jcascante", "password": "Cardio2026"})
        assert r.status_code == 200, r.text
        d = r.json()
        assert d["user"]["username"] == "jcascante"
        assert isinstance(d["token"], str) and len(d["token"]) > 10

    def test_login_skalil(self, s):
        r = s.post(f"{API}/auth/login", json={"username": "skalil", "password": "Skalil87"})
        assert r.status_code == 200, r.text
        assert r.json()["user"]["username"] == "skalil"

    def test_login_wrong_password(self, s):
        r = s.post(f"{API}/auth/login", json={"username": "jcascante", "password": "wrongpw"})
        assert r.status_code == 401

    def test_me(self, s, auth_headers):
        r = s.get(f"{API}/auth/me", headers=auth_headers)
        assert r.status_code == 200
        assert r.json()["username"] == "jcascante"

    def test_patients_no_auth(self, s):
        r = s.get(f"{API}/patients")
        assert r.status_code == 401

    def test_cases_no_auth(self, s):
        r = s.get(f"{API}/cases")
        assert r.status_code == 401


# --------- Patients ---------
class TestPatients:
    def test_create_list_delete(self, s, auth_headers):
        payload = {"name": "TEST_Paciente_API", "age": "45", "sex": "M", "phone": "0999", "notes": "n"}
        r = s.post(f"{API}/patients", json=payload, headers=auth_headers)
        assert r.status_code == 200, r.text
        p = r.json()
        assert p["name"] == payload["name"]
        pid = p["id"]

        r = s.get(f"{API}/patients", headers=auth_headers)
        assert r.status_code == 200
        assert any(x["id"] == pid for x in r.json())

        r = s.delete(f"{API}/patients/{pid}", headers=auth_headers)
        assert r.status_code == 200

        r = s.get(f"{API}/patients", headers=auth_headers)
        assert not any(x["id"] == pid for x in r.json())


# --------- Cases + files ---------
MINIMAL_PDF = (
    b"%PDF-1.1\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n"
    b"2 0 obj<</Type/Pages/Count 1/Kids[3 0 R]>>endobj\n"
    b"3 0 obj<</Type/Page/Parent 2 0 R/MediaBox[0 0 300 144]>>endobj\n"
    b"xref\n0 4\n0000000000 65535 f \n0000000010 00000 n \n0000000053 00000 n \n0000000100 00000 n \n"
    b"trailer<</Size 4/Root 1 0 R>>\nstartxref\n149\n%%EOF"
)
MINIMAL_PNG = (
    b"\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x02"
    b"\x00\x00\x00\x90wS\xde\x00\x00\x00\x0cIDATx\x9cc\xf8\xcf\xc0\x00\x00\x00\x03"
    b"\x00\x01\x5b\xdf\x0f\x0e\x00\x00\x00\x00IEND\xaeB`\x82"
)
MINIMAL_MP4 = b"\x00\x00\x00\x20ftypisom\x00\x00\x02\x00isomiso2mp41" + b"\x00" * 32


class TestCases:
    @pytest.fixture(scope="class")
    def patient_id(self, auth_headers):
        s = requests.Session()
        r = s.post(f"{API}/patients", json={"name": "TEST_CasePatient"}, headers=auth_headers)
        assert r.status_code == 200
        return r.json()["id"]

    def test_create_case(self, auth_headers, patient_id):
        body = {"patient_id": patient_id, "title": "TEST_case", "cuadro_clinico": "dolor",
                "diagnostico": "HTA"}
        r = requests.post(f"{API}/cases", json=body, headers=auth_headers)
        assert r.status_code == 200, r.text
        c = r.json()
        assert c["title"] == "TEST_case"
        assert c["patient_name"] == "TEST_CasePatient"
        pytest.case_id = c["id"]

    def test_list_get_case(self, auth_headers):
        r = requests.get(f"{API}/cases", headers=auth_headers)
        assert r.status_code == 200
        assert any(x["id"] == pytest.case_id for x in r.json())
        r = requests.get(f"{API}/cases/{pytest.case_id}", headers=auth_headers)
        assert r.status_code == 200

    def test_update_case(self, auth_headers, patient_id):
        body = {"patient_id": patient_id, "title": "TEST_updated", "diagnostico": "IC"}
        r = requests.put(f"{API}/cases/{pytest.case_id}", json=body, headers=auth_headers)
        assert r.status_code == 200
        assert r.json()["title"] == "TEST_updated"

    def test_upload_lab_pdf(self, auth_headers):
        files = {"file": ("lab.pdf", io.BytesIO(MINIMAL_PDF), "application/pdf")}
        data = {"field": "lab"}
        r = requests.post(f"{API}/cases/{pytest.case_id}/files", files=files, data=data, headers=auth_headers)
        assert r.status_code == 200, r.text
        c = r.json()
        assert len(c["lab_files"]) >= 1
        pytest.lab_url = c["lab_files"][0]["url"]

    def test_upload_ekg_png(self, auth_headers):
        files = {"file": ("ekg.png", io.BytesIO(MINIMAL_PNG), "image/png")}
        r = requests.post(f"{API}/cases/{pytest.case_id}/files",
                          files=files, data={"field": "ekg"}, headers=auth_headers)
        assert r.status_code == 200, r.text
        assert len(r.json()["ekg_files"]) >= 1

    def test_upload_eco_mp4(self, auth_headers):
        files = {"file": ("eco.mp4", io.BytesIO(MINIMAL_MP4), "video/mp4")}
        r = requests.post(f"{API}/cases/{pytest.case_id}/files",
                          files=files, data={"field": "eco"}, headers=auth_headers)
        assert r.status_code == 200, r.text
        assert r.json()["eco_file"] is not None

    def test_serve_file_with_auth_query(self, token_jc):
        # lab_url looks like /api/files/<path>
        url = f"{BASE_URL}{pytest.lab_url}?auth={token_jc}"
        r = requests.get(url)
        assert r.status_code == 200, r.text
        assert len(r.content) > 0

    def test_serve_file_without_auth(self):
        url = f"{BASE_URL}{pytest.lab_url}"
        r = requests.get(url)
        assert r.status_code == 401


# --------- Presentations ---------
class TestPresentations:
    def test_create_pdf(self, auth_headers):
        files = {"file": ("deck.pdf", io.BytesIO(MINIMAL_PDF), "application/pdf")}
        r = requests.post(f"{API}/presentations", files=files,
                          data={"title": "TEST_pdf_deck"}, headers=auth_headers)
        assert r.status_code == 200, r.text
        d = r.json()
        assert d["kind"] == "pdf"
        pytest.pres_pdf_id = d["id"]

    def test_create_pptx(self, auth_headers):
        # PPTX is a zip; content check is by ext only in backend
        files = {"file": ("deck.pptx", io.BytesIO(b"PK\x03\x04dummy"),
                          "application/vnd.openxmlformats-officedocument.presentationml.presentation")}
        r = requests.post(f"{API}/presentations", files=files,
                          data={"title": "TEST_pptx_deck"}, headers=auth_headers)
        assert r.status_code == 200, r.text
        assert r.json()["kind"] == "pptx"

    def test_reject_bad_ext(self, auth_headers):
        files = {"file": ("bad.txt", io.BytesIO(b"hello"), "text/plain")}
        r = requests.post(f"{API}/presentations", files=files,
                          data={"title": "TEST_bad"}, headers=auth_headers)
        assert r.status_code == 400

    def test_list(self, auth_headers):
        r = requests.get(f"{API}/presentations", headers=auth_headers)
        assert r.status_code == 200
        assert any(p["id"] == pytest.pres_pdf_id for p in r.json())

    def test_delete(self, auth_headers):
        r = requests.delete(f"{API}/presentations/{pytest.pres_pdf_id}", headers=auth_headers)
        assert r.status_code == 200
