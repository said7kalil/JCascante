from dotenv import load_dotenv
from pathlib import Path
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

import os
import uuid
import logging
import bcrypt
import jwt
import httpx
import requests
from datetime import datetime, timezone, timedelta
from typing import List, Optional

from fastapi import FastAPI, APIRouter, HTTPException, Depends, UploadFile, File, Form, Header, Query, Request
from fastapi.responses import Response
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, EmailStr

# ---------------- Config ----------------
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

JWT_SECRET = os.environ["JWT_SECRET"]
JWT_ALGORITHM = "HS256"
TOKEN_DAYS = 7

EMAIL_BASE_URL = "https://integrations.emergentagent.com"
EMAIL_KEY = os.environ["EMERGENT_EMAIL_KEY"]
EMAIL_FROM_NAME = os.environ["EMAIL_FROM_NAME"]
CONTACT_RECIPIENT_EMAIL = os.environ["CONTACT_RECIPIENT_EMAIL"]

STORAGE_BASE = (os.environ.get("INTEGRATION_PROXY_URL") or "").strip() or "https://integrations.emergentagent.com"
STORAGE_URL = STORAGE_BASE.rstrip("/") + "/objstore/api/v1/storage"
EMERGENT_KEY = os.environ.get("EMERGENT_LLM_KEY")
APP_NAME = "jccardio"

app = FastAPI()
api_router = APIRouter(prefix="/api")

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# ---------------- Storage ----------------
storage_key = None

def init_storage(force: bool = False):
    global storage_key
    if storage_key and not force:
        return storage_key
    resp = requests.post(f"{STORAGE_URL}/init", json={"emergent_key": EMERGENT_KEY}, timeout=30)
    resp.raise_for_status()
    storage_key = resp.json()["storage_key"]
    return storage_key

def put_object(path: str, data: bytes, content_type: str) -> dict:
    key = init_storage()
    resp = requests.put(f"{STORAGE_URL}/objects/{path}",
                        headers={"X-Storage-Key": key, "Content-Type": content_type},
                        data=data, timeout=120)
    if resp.status_code == 404:
        key = init_storage(force=True)
        resp = requests.put(f"{STORAGE_URL}/objects/{path}",
                            headers={"X-Storage-Key": key, "Content-Type": content_type},
                            data=data, timeout=120)
    resp.raise_for_status()
    return resp.json()

def get_object(path: str):
    key = init_storage()
    resp = requests.get(f"{STORAGE_URL}/objects/{path}", headers={"X-Storage-Key": key}, timeout=60)
    if resp.status_code == 404:
        key = init_storage(force=True)
        resp = requests.get(f"{STORAGE_URL}/objects/{path}", headers={"X-Storage-Key": key}, timeout=60)
    resp.raise_for_status()
    return resp.content, resp.headers.get("Content-Type", "application/octet-stream")

# ---------------- Auth helpers ----------------
def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

def verify_password(plain: str, hashed: str) -> bool:
    return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))

def create_token(user_id: str, username: str) -> str:
    payload = {"sub": user_id, "username": username,
               "exp": datetime.now(timezone.utc) + timedelta(days=TOKEN_DAYS), "type": "access"}
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

def public_user(u: dict) -> dict:
    return {"id": u["id"], "username": u["username"], "name": u.get("name", ""), "role": u.get("role", "doctor")}

async def get_current_user(authorization: str = Header(None)) -> dict:
    token = None
    if authorization and authorization.startswith("Bearer "):
        token = authorization[7:]
    if not token:
        raise HTTPException(status_code=401, detail="No autenticado")
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Sesión expirada")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Token inválido")
    user = await db.users.find_one({"id": payload["sub"]}, {"_id": 0})
    if not user:
        raise HTTPException(status_code=401, detail="Usuario no encontrado")
    return user

# ---------------- Models ----------------
class LoginIn(BaseModel):
    username: str
    password: str

class RegisterIn(BaseModel):
    username: str
    name: str
    email: Optional[EmailStr] = None
    password: str

class PatientIn(BaseModel):
    name: str
    age: Optional[str] = ""
    sex: Optional[str] = ""
    phone: Optional[str] = ""
    notes: Optional[str] = ""

class CaseIn(BaseModel):
    patient_id: str
    title: Optional[str] = ""
    consulta: Optional[str] = ""
    fecha: Optional[str] = ""
    cuadro_clinico: Optional[str] = ""
    laboratorios: Optional[str] = ""
    eco_text: Optional[str] = ""
    diagnostico: Optional[str] = ""

class ContactIn(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = ""
    service: Optional[str] = ""
    message: str

# ---------------- Auth routes ----------------
@api_router.post("/auth/register")
async def register(body: RegisterIn):
    uname = body.username.strip().lower()
    if await db.users.find_one({"username": uname}):
        raise HTTPException(status_code=400, detail="El usuario ya existe")
    doc = {"id": str(uuid.uuid4()), "username": uname, "name": body.name,
           "email": (body.email or "").lower(), "password_hash": hash_password(body.password),
           "role": "doctor", "created_at": datetime.now(timezone.utc).isoformat()}
    await db.users.insert_one(doc)
    return {"token": create_token(doc["id"], uname), "user": public_user(doc)}

@api_router.post("/auth/login")
async def login(body: LoginIn):
    uname = body.username.strip().lower()
    user = await db.users.find_one({"username": uname})
    if not user or not verify_password(body.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Usuario o contraseña incorrectos")
    return {"token": create_token(user["id"], uname), "user": public_user(user)}

@api_router.get("/auth/me")
async def me(user: dict = Depends(get_current_user)):
    return public_user(user)

# ---------------- Patients ----------------
@api_router.get("/patients")
async def list_patients(user: dict = Depends(get_current_user)):
    docs = await db.patients.find({"owner_id": user["id"], "is_deleted": {"$ne": True}}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    return docs

@api_router.post("/patients")
async def create_patient(body: PatientIn, user: dict = Depends(get_current_user)):
    doc = {"id": str(uuid.uuid4()), "owner_id": user["id"], **body.model_dump(),
           "is_deleted": False, "created_at": datetime.now(timezone.utc).isoformat()}
    await db.patients.insert_one(doc)
    doc.pop("_id", None)
    return doc

@api_router.delete("/patients/{pid}")
async def delete_patient(pid: str, user: dict = Depends(get_current_user)):
    await db.patients.update_one({"id": pid, "owner_id": user["id"]}, {"$set": {"is_deleted": True}})
    return {"status": "ok"}

# ---------------- Cases ----------------
def case_public(c: dict) -> dict:
    c.pop("_id", None)
    return c

@api_router.get("/cases")
async def list_cases(user: dict = Depends(get_current_user)):
    docs = await db.cases.find({"owner_id": user["id"], "is_deleted": {"$ne": True}}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    return docs

@api_router.get("/cases/{cid}")
async def get_case(cid: str, user: dict = Depends(get_current_user)):
    c = await db.cases.find_one({"id": cid, "owner_id": user["id"]}, {"_id": 0})
    if not c:
        raise HTTPException(status_code=404, detail="Caso no encontrado")
    return c

@api_router.post("/cases")
async def create_case(body: CaseIn, user: dict = Depends(get_current_user)):
    patient = await db.patients.find_one({"id": body.patient_id, "owner_id": user["id"]})
    if not patient:
        raise HTTPException(status_code=404, detail="Paciente no encontrado")
    doc = {"id": str(uuid.uuid4()), "owner_id": user["id"], "patient_name": patient["name"],
           **body.model_dump(), "lab_files": [], "ekg_files": [], "eco_file": None,
           "is_deleted": False, "created_at": datetime.now(timezone.utc).isoformat()}
    await db.cases.insert_one(doc)
    doc.pop("_id", None)
    return doc

@api_router.put("/cases/{cid}")
async def update_case(cid: str, body: CaseIn, user: dict = Depends(get_current_user)):
    patient = await db.patients.find_one({"id": body.patient_id, "owner_id": user["id"]})
    if not patient:
        raise HTTPException(status_code=404, detail="Paciente no encontrado")
    upd = {**body.model_dump(), "patient_name": patient["name"]}
    res = await db.cases.update_one({"id": cid, "owner_id": user["id"]}, {"$set": upd})
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail="Caso no encontrado")
    c = await db.cases.find_one({"id": cid}, {"_id": 0})
    return c

@api_router.delete("/cases/{cid}")
async def delete_case(cid: str, user: dict = Depends(get_current_user)):
    await db.cases.update_one({"id": cid, "owner_id": user["id"]}, {"$set": {"is_deleted": True}})
    return {"status": "ok"}

async def _store_file(upload: UploadFile, user_id: str) -> dict:
    ext = upload.filename.split(".")[-1].lower() if "." in upload.filename else "bin"
    path = f"{APP_NAME}/uploads/{user_id}/{uuid.uuid4()}.{ext}"
    data = await upload.read()
    ct = upload.content_type or "application/octet-stream"
    result = put_object(path, data, ct)
    ref = {"file_id": str(uuid.uuid4()), "storage_path": result["path"],
           "original_filename": upload.filename, "content_type": ct,
           "size": result.get("size", len(data)),
           "url": f"/api/files/{result['path']}"}
    await db.files.insert_one({**ref, "owner_id": user_id, "is_deleted": False,
                               "created_at": datetime.now(timezone.utc).isoformat()})
    return ref

@api_router.post("/cases/{cid}/files")
async def upload_case_file(cid: str, field: str = Form(...), file: UploadFile = File(...),
                           user: dict = Depends(get_current_user)):
    if field not in ("lab", "ekg", "eco"):
        raise HTTPException(status_code=400, detail="Campo inválido")
    c = await db.cases.find_one({"id": cid, "owner_id": user["id"]})
    if not c:
        raise HTTPException(status_code=404, detail="Caso no encontrado")
    ref = await _store_file(file, user["id"])
    if field == "eco":
        await db.cases.update_one({"id": cid}, {"$set": {"eco_file": ref}})
    else:
        key = "lab_files" if field == "lab" else "ekg_files"
        await db.cases.update_one({"id": cid}, {"$push": {key: ref}})
    updated = await db.cases.find_one({"id": cid}, {"_id": 0})
    return updated

@api_router.delete("/cases/{cid}/files/{file_id}")
async def remove_case_file(cid: str, file_id: str, field: str = Query(...),
                           user: dict = Depends(get_current_user)):
    if field == "eco":
        await db.cases.update_one({"id": cid, "owner_id": user["id"]}, {"$set": {"eco_file": None}})
    else:
        key = "lab_files" if field == "lab" else "ekg_files"
        await db.cases.update_one({"id": cid, "owner_id": user["id"]},
                                  {"$pull": {key: {"file_id": file_id}}})
    updated = await db.cases.find_one({"id": cid}, {"_id": 0})
    return updated

# ---------------- Presentations (Diapositivas) ----------------
@api_router.get("/presentations")
async def list_presentations(user: dict = Depends(get_current_user)):
    docs = await db.presentations.find({"owner_id": user["id"], "is_deleted": {"$ne": True}}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    return docs

@api_router.post("/presentations")
async def create_presentation(title: str = Form(...), file: UploadFile = File(...),
                              user: dict = Depends(get_current_user)):
    ext = file.filename.split(".")[-1].lower() if "." in file.filename else "bin"
    if ext not in ("pdf", "pptx", "ppt"):
        raise HTTPException(status_code=400, detail="Solo se permiten archivos PDF o PPTX")
    ref = await _store_file(file, user["id"])
    doc = {"id": str(uuid.uuid4()), "owner_id": user["id"], "title": title,
           "kind": "pdf" if ext == "pdf" else "pptx", "file": ref,
           "is_deleted": False, "created_at": datetime.now(timezone.utc).isoformat()}
    await db.presentations.insert_one(doc)
    doc.pop("_id", None)
    return doc

@api_router.delete("/presentations/{pid}")
async def delete_presentation(pid: str, user: dict = Depends(get_current_user)):
    await db.presentations.update_one({"id": pid, "owner_id": user["id"]}, {"$set": {"is_deleted": True}})
    return {"status": "ok"}

# ---------------- File serving (supports ?auth= for img/video/pdf tags) ----------------
def _verify_token_str(token: str) -> Optional[str]:
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return payload.get("sub")
    except jwt.InvalidTokenError:
        return None

@api_router.get("/files/{path:path}")
async def serve_file(path: str, authorization: str = Header(None), auth: str = Query(None)):
    token = None
    if authorization and authorization.startswith("Bearer "):
        token = authorization[7:]
    elif auth:
        token = auth
    if not token or not _verify_token_str(token):
        raise HTTPException(status_code=401, detail="No autenticado")
    record = await db.files.find_one({"storage_path": path, "is_deleted": False})
    if not record:
        raise HTTPException(status_code=404, detail="Archivo no encontrado")
    data, content_type = get_object(path)
    return Response(content=data, media_type=record.get("content_type", content_type),
                    headers={"Cache-Control": "private, max-age=3600"})

# ---------------- Contact (landing form -> email) ----------------
@api_router.post("/contact")
async def create_contact(body: ContactIn):
    sub = {"id": str(uuid.uuid4()), **body.model_dump(),
           "created_at": datetime.now(timezone.utc).isoformat()}
    await db.contact_submissions.insert_one(dict(sub))
    html = f"""<div style="font-family:Arial;padding:24px;background:#0F1A35;color:#fff;border-radius:12px;max-width:560px">
    <h2 style="color:#E23B2E;margin:0 0 12px">Nueva solicitud de cita</h2>
    <p><b>Nombre:</b> {sub['name']}</p><p><b>Correo:</b> {sub['email']}</p>
    <p><b>Teléfono:</b> {sub.get('phone') or '-'}</p><p><b>Servicio:</b> {sub.get('service') or '-'}</p>
    <p><b>Mensaje:</b><br>{sub['message']}</p></div>"""
    try:
        async with httpx.AsyncClient(timeout=30) as hc:
            r = await hc.post(f"{EMAIL_BASE_URL}/api/v1/email/send",
                              headers={"X-Email-Key": EMAIL_KEY},
                              json={"to": [CONTACT_RECIPIENT_EMAIL], "subject": f"Nueva cita: {sub['name']}",
                                    "html": html, "from_name": EMAIL_FROM_NAME, "contact_email": sub["email"]})
        r.raise_for_status()
    except Exception as e:
        logger.error(f"Contact email failed: {e}")
        return {"status": "stored", "message": "Solicitud guardada. No se pudo enviar el correo."}
    return {"status": "success", "message": "¡Gracias! Tu solicitud fue enviada correctamente."}

@api_router.get("/")
async def root():
    return {"message": "JC Cardio API"}

# ---------------- App wiring ----------------
app.include_router(api_router)
app.add_middleware(CORSMiddleware, allow_credentials=True,
                   allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
                   allow_methods=["*"], allow_headers=["*"])

SEED_USERS = [
    {"username": "jcascante", "name": "Dr. Julio Cascante", "password": "Cardio2026"},
    {"username": "skalil", "name": "Dr. Said Kalil", "password": "Skalil87"},
]

@app.on_event("startup")
async def startup():
    await db.users.create_index("username", unique=True)
    for s in SEED_USERS:
        existing = await db.users.find_one({"username": s["username"]})
        if not existing:
            await db.users.insert_one({"id": str(uuid.uuid4()), "username": s["username"],
                                       "name": s["name"], "email": "",
                                       "password_hash": hash_password(s["password"]),
                                       "role": "doctor", "created_at": datetime.now(timezone.utc).isoformat()})
        elif not verify_password(s["password"], existing["password_hash"]):
            await db.users.update_one({"username": s["username"]},
                                      {"$set": {"password_hash": hash_password(s["password"])}})
    try:
        init_storage()
        logger.info("Storage initialized")
    except Exception as e:
        logger.error(f"Storage init failed: {e}")

@app.on_event("shutdown")
async def shutdown():
    client.close()
