export const WHATSAPP_NUMBER = "593985107013";
export const WHATSAPP_MSG = encodeURIComponent(
  "Hola Dr. Cascante, me gustaría agendar una cita de valoración cardíaca."
);
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MSG}`;

const A = "https://customer-assets-jai6qajn.emergentagent.net/job_15966aec-b689-4cce-b086-73bd494c937a/artifacts";

export const IMAGES = {
  portrait: `${A}/ntnszniz_JULIO.png`,
  bpSeated: `${A}/h676s0u9_IMG_8458.webp`,
  bpArm: `${A}/etkgjoq2_IMG_7697.webp`,
  consult: `${A}/cm8zkfip_IMG_4522.webp`,
  stethoscope: `${A}/ven73h3n_IMG_4519.webp`,
};

export const NAV_LINKS = [
  { label: "Inicio", href: "#inicio" },
  { label: "Prevención", href: "#prevencion" },
  { label: "Servicios", href: "#servicios" },
  { label: "Sobre mí", href: "#sobre-mi" },
  { label: "Contacto", href: "#contacto" },
];

export const SERVICES = [
  {
    id: "electrocardiograma",
    name: "Electrocardiograma",
    desc: "Registro de la actividad eléctrica del corazón para detectar arritmias e isquemias en minutos.",
    icon: "Activity",
    span: false,
  },
  {
    id: "ecocardiograma",
    name: "Ecocardiograma",
    desc: "Ultrasonido cardíaco de alta resolución que evalúa estructura, válvulas y función del corazón.",
    icon: "HeartPulse",
    span: false,
  },
  {
    id: "prequirurgica",
    name: "Consulta prequirúrgica",
    desc: "Valoración integral del riesgo cardiovascular antes de una cirugía, para operar con total seguridad.",
    icon: "ClipboardCheck",
    span: true,
  },
  {
    id: "ergometria",
    name: "Ergometría",
    desc: "Prueba de esfuerzo que mide la respuesta del corazón durante el ejercicio controlado.",
    icon: "Gauge",
    span: false,
  },
  {
    id: "holter",
    name: "Holter",
    desc: "Monitoreo continuo del ritmo cardíaco durante 24 a 48 horas en tu vida cotidiana.",
    icon: "Waves",
    span: false,
  },
  {
    id: "mapa",
    name: "MAPA · Presión arterial",
    desc: "Monitoreo ambulatorio de la presión arterial (BPMA) para un diagnóstico preciso de hipertensión.",
    icon: "Stethoscope",
    span: false,
  },
];

export const CONTACT = {
  phone: "+593 98 510 7013",
  email: "contacto@drjuliocascante.com",
  address: "Consultorio de Cardiología · Torre Médica, Piso 4",
  hours: "Lun – Vie · 08:00 – 18:00",
};
