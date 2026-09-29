export const BRAND = "Julio Cascante";
export const BRAND_SUB = "CARDIÓLOGO";
export const WHATSAPP_NUMBER = "593985107013";
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hola Dr. Cascante, quiero agendar una valoración cardíaca.")}`;

const A1 = "https://customer-assets-jai6qajn.emergentagent.net/job_15966aec-b689-4cce-b086-73bd494c937a/artifacts";
const A2 = "https://customer-assets-lqy194kg.emergentagent.net/job_prevention-first-2/artifacts";

export const LOGO = "https://customer-assets-lqy194kg.emergentagent.net/job_prevention-first-2/artifacts/mycxlkk7_JC-Logo-02.webp";

export const IMAGES = {
  portrait: `${A2}/yp5msng4_Jcascante-Cardiologo.webp`,
  suit: `${A2}/y1gzzjge_Gemini_Generated_Image_i42r42i42r42i42r.jpeg`,
  ergo: `${A2}/0mv13s9h_Ergo_2.png`,
  clinic: `${A1}/cm8zkfip_IMG_4522.webp`,
};

export const NAV = [
  { label: "Inicio", href: "#inicio" },
  { label: "Servicios", href: "#servicios" },
  { label: "Sobre mí", href: "#sobre-mi" },
  { label: "Testimonios", href: "#testimonios" },
  { label: "Contacto", href: "#contacto" },
];

export const SERVICES = [
  { id: "ecg", name: "Electrocardiograma", icon: "Activity", desc: "Registro de la actividad eléctrica del corazón para detectar arritmias e isquemias en minutos." },
  { id: "eco", name: "Ecocardiograma", icon: "HeartPulse", desc: "Ultrasonido cardíaco de alta resolución que evalúa estructura, válvulas y función del corazón." },
  { id: "preq", name: "Consulta prequirúrgica", icon: "ClipboardCheck", desc: "Valoración integral del riesgo cardiovascular antes de una cirugía, para operar con seguridad." },
  { id: "ergo", name: "Ergometría", icon: "Gauge", desc: "Prueba de esfuerzo que mide la respuesta del corazón durante el ejercicio controlado." },
  { id: "holter", name: "Holter", icon: "Waves", desc: "Monitoreo continuo del ritmo cardíaco durante 24 a 48 horas en tu vida cotidiana." },
  { id: "mapa", name: "MAPA · Presión arterial", icon: "Stethoscope", desc: "Monitoreo ambulatorio de la presión arterial (BPMA) para el diagnóstico preciso de hipertensión." },
];

export const TESTIMONIALS = [
  { name: "Marcel Saldaña", age: "68 años", text: "Me diagnosticaron hipertensión sin exámenes. Acudí al Dr. Cascante, hizo una evaluación completa e indicó un tratamiento que mejoró mi calidad de vida." },
  { name: "Lino Ulloa", age: "59 años", text: "Fui atendido en el seguro social donde solo me recetaban medicamentos. Gracias al Dr. Cascante, con exámenes adecuados y tratamiento correcto, hoy me siento bien." },
  { name: "Verónica Cull", age: "72 años", text: "Sufría de taquicardia crónica y mis latidos eran muy acelerados. Gracias a los tratamientos del Dr. Julio, en tres semanas he mejorado notablemente." },
];

export const CONTACT = {
  phone: "+593 98 510 7013",
  email: "contacto@drjuliocascante.com",
  address: "Edif. Ágora XXI, Piso 5 · Consultorio 510",
  hours: "Lun – Vie · 08:00 – 18:00",
};
