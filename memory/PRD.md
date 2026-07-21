# PRD — Dr. Julio Cascante · Cardiología Preventiva (Landing Page)

## Original Problem Statement
Medical landing page for cardiologist Dr. Julio Cascante (domain www.drjuliocascante.com). Focus on heart-care prevention, highlight services: Electrocardiograma, Ecocardiograma, Consulta prequirúrgica, Ergometría, Holter, MAPA (BPMA blood pressure monitoring). A cool contact form at the bottom + a floating WhatsApp button.

## User Choices
- Language: Spanish
- WhatsApp: +593985107013
- Contact form: sends email notifications (Emergent-managed Resend)
- Contact details: placeholders (user skipped)
- Visual style: agent-decided → "Humanistic Medical" (alabaster bg + deep crimson, Cormorant Garamond + Outfit)

## Architecture
- Frontend: React 19 + Tailwind + framer-motion + Lenis (smooth scroll) + react-fast-marquee. Single page (`src/pages/Landing.jsx`) composed of section components in `src/components/site/`.
- Backend: FastAPI + MongoDB. `POST /api/contact` stores submission in `contact_submissions` and sends notification email via Emergent Resend proxy. `GET /api/contact` lists.
- Data/config: `src/data/site.js` (WhatsApp URL, image assets, services, nav, contact info).

## Personas
- Prospective patient seeking preventive cardiac care / diagnostics.
- Patient needing pre-surgery cardiac clearance.

## Implemented (2026-07-21)
- Kinetic hero with line-by-line masked reveal + parallax portrait (doctor's real photo).
- Editorial marquee, prevention manifesto (numbered chapters), 6-service bento grid, About, in-consult gallery (real clinic photos).
- Dark contact section with email-sending form (name/email/phone/service/message) + validation + Spanish toasts.
- Floating animated WhatsApp FAB.
- Spanish SEO meta/title, `lang=es`.
- Tested: backend 6/6, frontend 22/22 (all pass).

## Backlog
- P1: Real clinic contact details (address/phone/email/hours) — currently placeholders in `src/data/site.js` and `backend/.env` CONTACT_RECIPIENT_EMAIL.
- P2: Testimonials section, FAQ accordion, appointment date/time picker.
- P2: Custom favicon / logo, Open Graph share image.

## Next Tasks
- Replace placeholder contact info & recipient email with the doctor's real data.
- Optional: add testimonials + FAQ.
