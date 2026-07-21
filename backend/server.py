from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import httpx
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Emergent managed email proxy (constant, never from env)
EMAIL_BASE_URL = "https://integrations.emergentagent.com"
EMAIL_KEY = os.environ["EMERGENT_EMAIL_KEY"]
EMAIL_FROM_NAME = os.environ["EMAIL_FROM_NAME"]
CONTACT_RECIPIENT_EMAIL = os.environ["CONTACT_RECIPIENT_EMAIL"]

app = FastAPI()
api_router = APIRouter(prefix="/api")


# ---------------- Models ----------------
class ContactCreate(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = ""
    service: Optional[str] = ""
    message: str


class ContactSubmission(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: str
    phone: str = ""
    service: str = ""
    message: str
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


def build_email_html(sub: ContactSubmission) -> str:
    return f"""
    <table width="100%" cellpadding="0" cellspacing="0" style="font-family: Arial, sans-serif; background:#F4F3EF; padding:32px;">
      <tr><td>
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px; margin:0 auto; background:#ffffff; border-radius:16px; overflow:hidden;">
          <tr><td style="background:#832232; padding:28px 32px;">
            <p style="margin:0; color:#ffffff; font-size:13px; letter-spacing:3px; text-transform:uppercase;">Nueva solicitud de cita</p>
            <h1 style="margin:6px 0 0; color:#ffffff; font-size:24px;">Dr. Julio Cascante</h1>
          </td></tr>
          <tr><td style="padding:32px;">
            <table width="100%" cellpadding="0" cellspacing="0" style="font-size:15px; color:#1C1917;">
              <tr><td style="padding:8px 0; color:#5C5955; width:130px;">Nombre</td><td style="padding:8px 0; font-weight:bold;">{sub.name}</td></tr>
              <tr><td style="padding:8px 0; color:#5C5955;">Correo</td><td style="padding:8px 0;">{sub.email}</td></tr>
              <tr><td style="padding:8px 0; color:#5C5955;">Teléfono</td><td style="padding:8px 0;">{sub.phone or '-'}</td></tr>
              <tr><td style="padding:8px 0; color:#5C5955;">Servicio</td><td style="padding:8px 0;">{sub.service or '-'}</td></tr>
            </table>
            <div style="margin-top:20px; padding:20px; background:#F4F3EF; border-radius:12px;">
              <p style="margin:0 0 6px; color:#5C5955; font-size:13px; text-transform:uppercase; letter-spacing:1px;">Mensaje</p>
              <p style="margin:0; color:#1C1917; font-size:15px; line-height:1.6;">{sub.message}</p>
            </div>
            <p style="margin:24px 0 0; color:#9c9890; font-size:12px;">Recibido el {sub.created_at}</p>
          </td></tr>
        </table>
      </td></tr>
    </table>
    """


# ---------------- Routes ----------------
@api_router.get("/")
async def root():
    return {"message": "Dr. Julio Cascante API"}


@api_router.post("/contact")
async def create_contact(payload: ContactCreate):
    sub = ContactSubmission(**payload.model_dump())
    await db.contact_submissions.insert_one(sub.model_dump())

    html = build_email_html(sub)
    email_payload = {
        "to": [CONTACT_RECIPIENT_EMAIL],
        "subject": f"Nueva cita: {sub.name}",
        "html": html,
        "from_name": EMAIL_FROM_NAME,
        "contact_email": sub.email,
    }
    try:
        async with httpx.AsyncClient(timeout=30) as http_client:
            resp = await http_client.post(
                f"{EMAIL_BASE_URL}/api/v1/email/send",
                headers={"X-Email-Key": EMAIL_KEY},
                json=email_payload,
            )
        resp.raise_for_status()
    except Exception as e:
        logger.error(f"Contact email failed: {str(e)}")
        # Submission is stored; report partial success
        return {"status": "stored", "message": "Solicitud guardada. No se pudo enviar la notificación por correo."}

    return {"status": "success", "message": "¡Gracias! Tu solicitud fue enviada correctamente."}


@api_router.get("/contact", response_model=List[ContactSubmission])
async def list_contacts():
    docs = await db.contact_submissions.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    return docs


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
