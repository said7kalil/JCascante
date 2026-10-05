import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import {
  Save, CalendarClock, GitCompare, ArrowRight, ArrowLeft, Activity, Upload, Trash2,
  Loader2, X, Image as ImageIcon, Video, Send, Mail, MessageCircle, Sun, Moon, ChevronLeft, ChevronRight, Play, FileText,
} from "lucide-react";
import { api, apiErr, fileUrl } from "@/lib/api";
import { useTheme } from "@/context/ThemeContext";
import { Logo } from "@/components/Logo";
import { WHATSAPP_NUMBER } from "@/data/site";

const EMPTY = {
  name: "", age: "", cedula: "", consulta_date: "", phone: "", email: "", consulta_place: "",
  motivo_control: "", factores_riesgo: "", allergies: "", habitos: "", app: "", apqx: "",
  medications: "", actividad_fisica: "", vacuna_covid: "",
  cuadro_clinico: "", ex_respiratorio: "", ex_cardiovascular: "", igy: "", sv: "", imc: "", ecg_reposo: "",
  diagnostico: "", laboratorios: "", eco_desc: "",
};

const L = ({ children }) => <label className="text-[13px] ui-sub">{children}</label>;
const Txt = ({ label, k, value, onChange, type = "text", req }) => (
  <div>
    <L>{label}{req && <span className="text-pulse"> *</span>}</L>
    <input data-testid={`f-${k}`} type={type} value={value} onChange={onChange}
           className="ui-field rounded-xl px-4 py-3 w-full mt-1.5 text-[15px]" />
  </div>
);
const Area = ({ label, k, value, onChange, rows = 3 }) => (
  <div>
    <L>{label}</L>
    <textarea data-testid={`f-${k}`} rows={rows} value={value} onChange={onChange}
              className="ui-field rounded-xl px-4 py-3 w-full mt-1.5 text-[15px] resize-none" />
  </div>
);
const Section = ({ title, children }) => (
  <div className="ui-card border rounded-3xl p-6 lg:p-8 shadow-sm">
    <h2 className="font-display font-extrabold text-xl lg:text-2xl ui-ink mb-6">{title}</h2>
    {children}
  </div>
);

export default function FichaPaciente() {
  const { id } = useParams();
  const nav = useNavigate();
  const { isDark, toggle } = useTheme();
  const isNew = id === "new";
  const [form, setForm] = useState(EMPTY);
  const [p, setP] = useState(null);
  const [saving, setSaving] = useState(false);
  const [showNext, setShowNext] = useState(false);
  const [showCompare, setShowCompare] = useState(false);
  const [showVisor, setShowVisor] = useState(false);

  const load = useCallback(async () => {
    if (isNew) return;
    try { const { data } = await api.get(`/patients/${id}`); setP(data); setForm({ ...EMPTY, ...data }); }
    catch (e) { toast.error(apiErr(e)); nav("/dashboard"); }
  }, [id, isNew, nav]);
  useEffect(() => { load(); }, [load]);

  const up = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const save = async () => {
    if (!form.name.trim()) { toast.error("El nombre es obligatorio"); return; }
    setSaving(true);
    try {
      if (isNew) { const { data } = await api.post("/patients", form); toast.success("Paciente creado"); nav(`/ficha/${data.id}`, { replace: true }); }
      else { const { data } = await api.put(`/patients/${id}`, form); setP(data); toast.success("Ficha guardada"); }
    } catch (e) { toast.error(apiErr(e)); }
    finally { setSaving(false); }
  };

  const doUpload = async (field, file) => {
    if (!file) return;
    if (isNew) { toast.error("Guarda el paciente antes de subir archivos"); return; }
    const fd = new FormData(); fd.append("field", field); fd.append("file", file);
    try { const { data } = await api.post(`/patients/${id}/files`, fd); setP(data); toast.success("Archivo subido"); }
    catch (e) { toast.error(apiErr(e)); }
  };
  const removeFile = async (field, fileId) => {
    try { const { data } = await api.delete(`/patients/${id}/files/${fileId}?field=${field}`); setP(data); }
    catch (e) { toast.error(apiErr(e)); }
  };

  const addFollowup = async () => {
    if (isNew) { toast.error("Guarda el paciente primero"); return; }
    const text = window.prompt("Actualización / seguimiento:");
    if (!text) return;
    try { const { data } = await api.post(`/patients/${id}/followups`, { text }); setP(data); toast.success("Seguimiento agregado"); }
    catch (e) { toast.error(apiErr(e)); }
  };

  return (
    <div className="ui-page min-h-screen">
      <div className="ui-card border-b ui-line px-5 lg:px-10 h-[70px] flex items-center justify-between">
        <Link to="/dashboard"><Logo invert={isDark} /></Link>
        <div className="flex items-center gap-4">
          <Link to="/dashboard" className="inline-flex items-center gap-1.5 ui-sub hover:text-pulse text-sm font-semibold"><ArrowLeft size={16} /> Dashboard</Link>
          <button onClick={toggle} data-testid="theme-toggle" className="ui-sub hover:text-cyan" title="Cambiar tema">{isDark ? <Sun size={19} /> : <Moon size={19} />}</button>
        </div>
      </div>

      <div className="max-w-[1180px] mx-auto px-5 lg:px-8 py-10">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-pulse mb-2">{isNew ? "Nueva ficha" : "Editar ficha"}</p>
        <h1 className="font-display font-extrabold text-4xl lg:text-5xl ui-ink mb-8">Ficha del paciente</h1>

        <div className="space-y-7">
          <Section title="Datos generales">
            <div className="grid sm:grid-cols-2 gap-5">
              <Txt label="Nombre" k="name" value={form.name} onChange={up("name")} req />
              <Txt label="Edad" k="age" value={form.age} onChange={up("age")} />
              <Txt label="Cédula de identidad" k="cedula" value={form.cedula} onChange={up("cedula")} />
              <Txt label="Fecha de consulta" k="consulta_date" type="date" value={form.consulta_date} onChange={up("consulta_date")} />
              <Txt label="Teléfono (WhatsApp)" k="phone" value={form.phone} onChange={up("phone")} />
              <Txt label="Email" k="email" type="email" value={form.email} onChange={up("email")} />
              <Txt label="Lugar de consulta" k="consulta_place" value={form.consulta_place} onChange={up("consulta_place")} />
            </div>
          </Section>

          <Section title="Antecedentes y hábitos">
            <div className="grid sm:grid-cols-2 gap-5">
              <Area label="Motivo del control" k="motivo_control" value={form.motivo_control} onChange={up("motivo_control")} />
              <Area label="Factores de riesgo" k="factores_riesgo" value={form.factores_riesgo} onChange={up("factores_riesgo")} />
              <Area label="Alergias" k="allergies" value={form.allergies} onChange={up("allergies")} rows={2} />
              <Area label="Hábitos" k="habitos" value={form.habitos} onChange={up("habitos")} rows={2} />
              <Area label="APP (Antecedentes patológicos personales)" k="app" value={form.app} onChange={up("app")} />
              <Area label="APQX (Antecedentes quirúrgicos)" k="apqx" value={form.apqx} onChange={up("apqx")} />
              <Area label="Medicación" k="medications" value={form.medications} onChange={up("medications")} />
              <Txt label="Actividad física" k="actividad_fisica" value={form.actividad_fisica} onChange={up("actividad_fisica")} />
              <Txt label="Vacuna Covid" k="vacuna_covid" value={form.vacuna_covid} onChange={up("vacuna_covid")} />
            </div>
            <button onClick={addFollowup} data-testid="add-followup"
                    className="mt-6 inline-flex items-center gap-2 rounded-full bg-pulse/10 text-pulse border border-pulse/30 px-5 py-2.5 font-semibold hover:bg-pulse/20 transition">
              <Activity size={17} /> Agregar actualización / seguimiento
            </button>
            {(p?.followups || []).length > 0 && (
              <div className="mt-5 space-y-2" data-testid="followup-list">
                {p.followups.slice().reverse().map((f) => (
                  <div key={f.id} className="ui-field rounded-xl px-4 py-3">
                    <p className="text-xs ui-muted mb-1">{new Date(f.date).toLocaleString("es-EC")}</p>
                    <p className="ui-ink text-sm whitespace-pre-line">{f.text}</p>
                  </div>
                ))}
              </div>
            )}
          </Section>

          <Section title="Examen físico y signos">
            <div className="grid sm:grid-cols-2 gap-5">
              <div className="sm:col-span-2"><Area label="Cuadro clínico" k="cuadro_clinico" value={form.cuadro_clinico} onChange={up("cuadro_clinico")} /></div>
              <Area label="Ex. Físico — Respiratorio" k="ex_respiratorio" value={form.ex_respiratorio} onChange={up("ex_respiratorio")} rows={2} />
              <Area label="Ex. Físico — Cardiovascular" k="ex_cardiovascular" value={form.ex_cardiovascular} onChange={up("ex_cardiovascular")} rows={2} />
              <Txt label="IGY" k="igy" value={form.igy} onChange={up("igy")} />
              <Txt label="SV (Signos vitales)" k="sv" value={form.sv} onChange={up("sv")} />
              <Txt label="IMC" k="imc" value={form.imc} onChange={up("imc")} />
              <Txt label="ECG en reposo" k="ecg_reposo" value={form.ecg_reposo} onChange={up("ecg_reposo")} />
            </div>
          </Section>

          <Section title="Visor clínico (diagnóstico, EKG, labs y eco)">
            <div className="space-y-5">
              <Txt label="Título / Diagnóstico (visor)" k="diagnostico" value={form.diagnostico} onChange={up("diagnostico")} />
              <Area label="Laboratorios" k="laboratorios" value={form.laboratorios} onChange={up("laboratorios")} rows={3} />
              <Area label="Ecocardiograma — descripción" k="eco_desc" value={form.eco_desc} onChange={up("eco_desc")} rows={3} />
              <div className="grid sm:grid-cols-2 gap-6 pt-2">
                <UploadRow label="EKG — imágenes" icon={ImageIcon} accept="image/*" files={p?.ekg_files || []}
                           onUpload={(f) => doUpload("ekg", f)} onRemove={(fid) => removeFile("ekg", fid)} testid="up-ekg" />
                <UploadRow label="Ecocardiograma — imágenes / video" icon={Video} accept="image/*,video/*" files={p?.eco_files || []}
                           onUpload={(f) => doUpload("eco", f)} onRemove={(fid) => removeFile("eco", fid)} testid="up-eco" />
              </div>
            </div>
          </Section>
        </div>

        {/* Action bar */}
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <button onClick={save} disabled={saving} data-testid="save-patient"
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-magenta to-pulse px-6 py-3.5 font-display font-bold text-white hover:brightness-110 transition disabled:opacity-60">
            {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />} Guardar paciente
          </button>
          <button onClick={() => isNew ? toast.error("Guarda el paciente primero") : setShowNext(true)} data-testid="next-appt-btn"
                  className="inline-flex items-center gap-2 rounded-xl bg-cyan/15 text-cyan border border-cyan/30 px-5 py-3.5 font-semibold hover:bg-cyan/25 transition">
            <CalendarClock size={18} /> ¿Cuándo será la próxima consulta?
          </button>
          <button onClick={() => setShowCompare(true)} data-testid="compare-btn"
                  className="inline-flex items-center gap-2 rounded-xl ui-field px-5 py-3.5 font-semibold ui-ink hover:opacity-80 transition">
            <GitCompare size={18} /> Comparar evolución
          </button>
          <button onClick={() => setShowVisor(true)} data-testid="open-visor"
                  className="inline-flex items-center gap-1.5 ui-sub hover:text-pulse font-semibold underline underline-offset-4">
            Ver en el visor <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {showNext && p && <NextModal patient={p} onClose={() => setShowNext(false)} />}
      {showCompare && <CompareModal followups={p?.followups || []} onClose={() => setShowCompare(false)} />}
      {showVisor && <VisorModal p={{ ...p, ...form }} onClose={() => setShowVisor(false)} />}
    </div>
  );
}

const UploadRow = ({ label, icon: Icon, accept, files, onUpload, onRemove, testid }) => (
  <div>
    <L>{label}</L>
    <div className="flex items-center gap-3 mt-2 flex-wrap">
      <label data-testid={testid} className="w-20 h-20 rounded-xl border-2 border-dashed ui-line flex flex-col items-center justify-center gap-1 cursor-pointer hover:border-cyan transition">
        <Icon size={20} className="ui-muted" />
        <span className="text-[11px] ui-muted">Subir</span>
        <input type="file" accept={accept} className="hidden" onChange={(e) => { onUpload(e.target.files[0]); e.target.value = ""; }} />
      </label>
      {files.map((f) => (
        <div key={f.file_id} className="relative group w-20 h-20 rounded-xl overflow-hidden ui-field border flex items-center justify-center">
          {f.content_type?.startsWith("image/")
            ? <img src={fileUrl(f.url)} alt="" className="w-full h-full object-cover" />
            : <Video size={22} className="ui-muted" />}
          <button onClick={() => onRemove(f.file_id)} className="absolute top-1 right-1 bg-pulse text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition"><X size={12} /></button>
        </div>
      ))}
    </div>
  </div>
);

const NextModal = ({ patient, onClose }) => {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [note, setNote] = useState("");
  const [channel, setChannel] = useState("ambos");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey); return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const submit = async () => {
    if (!date || !time) { toast.error("Elige fecha y hora"); return; }
    setSaving(true);
    try {
      const { data } = await api.post("/appointments", {
        patient_id: patient.id, name: patient.name, phone: patient.phone || "", email: patient.email || "",
        cedula: patient.cedula || "", service: "Control / seguimiento", date, time, reason: note,
      });
      if (channel !== "email") {
        const msg = `Hola ${patient.name}, le recordamos su próxima consulta con el Dr. Julio Cascante el ${date} a las ${time}.${note ? " Nota: " + note : ""}`;
        const num = (patient.phone || "").replace(/[^0-9]/g, "") || WHATSAPP_NUMBER;
        window.open(`https://wa.me/${num}?text=${encodeURIComponent(msg)}`, "_blank");
      }
      toast.success(data.email_sent || channel === "whatsapp" ? "Cita agendada y recordatorio enviado" : "Cita agendada");
      onClose();
    } catch (e) { toast.error(apiErr(e)); }
    finally { setSaving(false); }
  };

  const Chan = ({ id, icon: Icon, label }) => (
    <button onClick={() => setChannel(id)} data-testid={`chan-${id}`}
            className={`flex-1 inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-3 font-semibold transition ${channel === id ? "bg-pulse/10 text-pulse border-pulse/40" : "ui-field ui-ink"}`}>
      <Icon size={17} /> {label}
    </button>
  );

  return (
    <div className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <div className="ui-card border rounded-3xl w-full max-w-lg p-7 shadow-2xl" onClick={(e) => e.stopPropagation()} data-testid="next-modal">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-cyan/15 text-cyan flex items-center justify-center"><CalendarClock size={22} /></div>
            <div><h3 className="font-display font-extrabold text-xl ui-ink">¿Cuándo será la próxima consulta?</h3><p className="ui-sub text-sm">{patient.name}</p></div>
          </div>
          <button onClick={onClose} className="ui-muted hover:text-pulse"><X size={22} /></button>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div><L>Fecha</L><input data-testid="next-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} className="ui-field rounded-xl px-4 py-3 w-full mt-1.5" /></div>
          <div><L>Hora</L><input data-testid="next-time" type="time" value={time} onChange={(e) => setTime(e.target.value)} className="ui-field rounded-xl px-4 py-3 w-full mt-1.5" /></div>
        </div>
        <div className="mb-5"><L>Nota (opcional)</L><input data-testid="next-note" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Ej. Traer exámenes de laboratorio" className="ui-field rounded-xl px-4 py-3 w-full mt-1.5" /></div>
        <L>Enviar recordatorio por</L>
        <div className="flex gap-3 mt-2 mb-6">
          <Chan id="email" icon={Mail} label="Email" />
          <Chan id="whatsapp" icon={MessageCircle} label="WhatsApp" />
          <Chan id="ambos" icon={Send} label="Ambos" />
        </div>
        <button onClick={submit} disabled={saving} data-testid="next-submit"
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-magenta to-pulse py-3.5 font-display font-bold text-white hover:brightness-110 transition disabled:opacity-60">
          {saving ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />} Agendar y enviar recordatorio
        </button>
        <p className="text-center ui-muted text-xs mt-4">El email se envía automáticamente. WhatsApp abre el chat con el mensaje listo para enviar.</p>
      </div>
    </div>
  );
};

const CompareModal = ({ followups, onClose }) => {
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey); return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);
  return (
    <div className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <div className="ui-card border rounded-3xl w-full max-w-2xl p-7 shadow-2xl max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()} data-testid="compare-modal">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-display font-extrabold text-xl ui-ink">Evolución del paciente</h3>
          <button onClick={onClose} className="ui-muted hover:text-pulse"><X size={22} /></button>
        </div>
        {followups.length === 0 ? <p className="ui-sub">Aún no hay actualizaciones de seguimiento.</p> : (
          <div className="relative pl-6">
            <span className="absolute left-1.5 top-2 bottom-2 w-px bg-pulse/30" />
            {followups.map((f) => (
              <div key={f.id} className="relative mb-6">
                <span className="absolute -left-[18px] top-1.5 w-3 h-3 rounded-full bg-pulse" />
                <p className="text-xs ui-muted mb-1">{new Date(f.date).toLocaleString("es-EC")}</p>
                <p className="ui-ink whitespace-pre-line">{f.text}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const VisorModal = ({ p, onClose }) => {
  const [i, setI] = useState(0);
  const ekg = p.ekg_files || [];
  const eco = (p.eco_files || []).filter((f) => f.content_type?.startsWith("video/"));
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey); return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);
  const Panel = ({ title, color, children }) => (
    <div className={`rounded-2xl bg-navy-900/70 border p-6 ${color === "magenta" ? "border-magenta/30" : "border-white/10"}`}>
      <h3 className={`font-display font-bold text-lg mb-4 ${color === "magenta" ? "text-magenta" : "text-cyan"}`}>{title}</h3>{children}
    </div>
  );
  return (
    <div className="fixed inset-0 z-[60] bg-navy-950/95 backdrop-blur flex items-start justify-center p-4 overflow-y-auto" onClick={onClose} data-testid="visor-modal">
      <div className="w-full max-w-4xl my-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-end mb-3"><button onClick={onClose} className="text-white/70 hover:text-white"><X size={26} /></button></div>
        <div className="rounded-[2rem] bg-navy-850 border border-white/10 p-7 lg:p-10">
          <p className="font-display font-bold text-magenta text-sm mb-2">Caso [{p.name}] · {p.consulta_date || "—"} · {p.consulta_place || "Consulta"}</p>
          <h1 className="font-display font-extrabold text-white text-3xl lg:text-4xl mb-8">{p.diagnostico || p.name}</h1>
          <div className="grid lg:grid-cols-2 gap-6">
            <Panel title="Cuadro clínico" color="cyan"><p className="text-white/85 whitespace-pre-line">{p.cuadro_clinico || "—"}</p></Panel>
            <Panel title="EKG" color="cyan">
              {ekg.length ? (
                <div className="relative">
                  <img src={fileUrl(ekg[i % ekg.length].url)} alt="EKG" className="w-full h-56 object-contain rounded-lg bg-white" />
                  {ekg.length > 1 && (<>
                    <button onClick={() => setI((i - 1 + ekg.length) % ekg.length)} className="absolute left-2 top-1/2 -translate-y-1/2 bg-pulse text-white rounded-full p-2"><ChevronLeft size={18} /></button>
                    <button onClick={() => setI((i + 1) % ekg.length)} className="absolute right-2 top-1/2 -translate-y-1/2 bg-pulse text-white rounded-full p-2"><ChevronRight size={18} /></button>
                  </>)}
                </div>
              ) : <p className="text-white/35 text-sm">Sin EKG.</p>}
            </Panel>
            <Panel title="Laboratorios" color="magenta"><p className="text-white/85 whitespace-pre-line">{p.laboratorios || "—"}</p></Panel>
            <Panel title="Ecocardiograma" color="magenta">
              {eco.length ? <video src={fileUrl(eco[0].url)} controls className="w-full h-52 rounded-lg bg-black mb-3" />
                : <div className="flex items-center justify-center h-40 rounded-lg bg-navy-800 mb-3 text-white/30"><Play size={38} /></div>}
              {p.eco_desc && <p className="text-white/85 whitespace-pre-line">{p.eco_desc}</p>}
            </Panel>
          </div>
          {p.diagnostico && <div className="mt-6 rounded-xl border border-pulse/40 bg-pulse/10 p-5"><p className="font-display font-bold text-pulse text-sm uppercase mb-1">Diagnóstico</p><p className="text-white/90 whitespace-pre-line">{p.diagnostico}</p></div>}
        </div>
      </div>
    </div>
  );
};
