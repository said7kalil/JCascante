# PRD — JC · Dr. Julio Cascante · Cardiólogo (v2: landing + portal clínico)

## Original Problem Statement (v2)
Rebuild: animated Spanish landing (fireguard.org style) + LOGIN button opening a private multi-user clinical dashboard to manage patients, upload labs (JPG/PDF), EKG (images), echocardiogram (video), write diagnosis; auto-generated dark case presentation; dashboard tabs Gestionar Casos / Pacientes / Diapositivas; slideshow viewer (upload PDF/PPTX; PDF viewable, PPTX downloadable) with Atrás/Fullscreen/Compartir/Descargar/Siguiente. Brand JC · Julio Cascante Cardiólogo, navy+red.

## User Choices
- Spanish. Brand JC kept. Navy+red palette. Fireguard-style cinematic animations (Lenis + framer-motion).
- Multi-user JWT auth. Two seeded accounts: jcascante/Cardio2026, skalil/Skalil87 (login by username).
- Echocardiogram = video. Slideshow: PDF viewable + PPTX downloadable. Case presentation auto-generated, NO public share link.

## Architecture
- Frontend React 19 + Tailwind + framer-motion + Lenis. Routes: `/` (landing), `/login`, `/dashboard` (protected), `/caso/:id` (protected). AuthContext with Bearer JWT in localStorage (`jc_token`).
- Backend FastAPI + MongoDB. JWT auth (bcrypt), users seeded idempotently on startup. Emergent Object Storage (EMERGENT_LLM_KEY) for file uploads; files served via `/api/files/{path}?auth=<token>`. Emergent Resend for the public contact form.
- Collections: users, patients, cases (lab_files/ekg_files/eco_file + text fields + diagnostico), presentations, files, contact_submissions.

## Implemented (2026-09-29)
- Animated landing: navy hero with pulse rings + floating icons + line-by-line headline, services, about, testimonials, dark contact form (emails), WhatsApp FAB.
- Login page (glass card matching mockup). Multi-user JWT.
- Dashboard: tabs Gestionar Casos (table + Nuevo Caso modal with file upload panels), Pacientes (add/list/delete), Diapositivas (upload PDF/PPTX + slideshow viewer with toolbar).
- Case presentation dark card (Cuadro clínico, EKG gallery, Laboratorios, Ecocardiograma video, Diagnóstico).
- Tested: backend 20/20, frontend 100% of flows. Escape closes modals.

## Backlog
- P1: Real clinic contact info + recipient email (placeholders in data/site.js & backend .env).
- P2: Case presentation Fullscreen/Descargar (print) actions; PPTX→image auto-conversion for in-viewer preview.
- P2: Password reset / self-registration UI; per-doctor profile slide (credentials, flags) as in mockup 07.
- P2: Favicon/OG image, brand logo asset.
