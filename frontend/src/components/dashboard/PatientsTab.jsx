import { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import { UserPlus, Trash2, Loader2, Search, Pencil, X } from "lucide-react";
import { api, apiErr } from "@/lib/api";

const SEX = ["Masculino", "Femenino", "Otro"];
const BLOOD = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", "Desconocido"];
const MARITAL = ["Soltero/a", "Casado/a", "Divorciado/a", "Viudo/a", "Unión libre"];
const INP = "bg-navy-800 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-white/35 outline-none focus:border-cyan w-full transition-colors";

const EMPTY = {
  name: "", cedula: "", birthdate: "", age: "", sex: "", blood_type: "",
  phone: "", email: "", city: "", address: "", marital_status: "", occupation: "",
  insurance: "", emergency_contact: "", emergency_phone: "", allergies: "",
  history: "", medications: "", notes: "",
};

const calcAge = (bd) => {
  if (!bd) return "";
  const d = new Date(bd); if (isNaN(d)) return "";
  const a = Math.floor((Date.now() - d.getTime()) / (365.25 * 24 * 3600 * 1000));
  return a >= 0 && a < 130 ? a : "";
};

// Stable module-level field components (prevents input focus loss on re-render)
const Field = ({ label, k, type = "text", req, value, onChange }) => (
  <div>
    <label className="text-xs text-white/50 uppercase tracking-wide">{label}{req && <span className="text-pulse"> *</span>}</label>
    <input data-testid={`pf-${k}`} type={type} className={INP} value={value} onChange={onChange} />
  </div>
);
const SelectField = ({ label, k, opts, value, onChange }) => (
  <div>
    <label className="text-xs text-white/50 uppercase tracking-wide">{label}</label>
    <select data-testid={`pf-${k}`} className={INP} value={value} onChange={onChange}>
      <option value="">—</option>
      {opts.map((o) => <option key={o} value={o}>{o}</option>)}
    </select>
  </div>
);
const AreaField = ({ label, k, value, onChange }) => (
  <div className="sm:col-span-2">
    <label className="text-xs text-white/50 uppercase tracking-wide">{label}</label>
    <textarea data-testid={`pf-${k}`} rows={2} className={`${INP} resize-none`} value={value} onChange={onChange} />
  </div>
);

export const PatientsTab = ({ patients, reload }) => {
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState(null);

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return patients;
    return patients.filter((p) => `${p.name} ${p.cedula || ""} ${p.phone || ""}`.toLowerCase().includes(q));
  }, [patients, query]);

  const del = async (id) => {
    try { await api.delete(`/patients/${id}`); toast.success("Paciente eliminado"); reload(); }
    catch (e) { toast.error(apiErr(e)); }
  };

  return (
    <div>
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div className="relative flex-1 min-w-[220px] max-w-md">
          <Search size={17} className="absolute left-3.5 top-3.5 text-white/40" />
          <input data-testid="patient-search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar por nombre, cédula o teléfono"
                 className="w-full bg-navy-800 border border-white/15 rounded-xl pl-10 pr-4 py-3 text-white placeholder:text-white/35 outline-none focus:border-cyan" />
        </div>
        <button onClick={() => setEditing({ new: true })} data-testid="new-patient-btn"
                className="inline-flex items-center gap-2 rounded-xl bg-pulse px-5 py-3 font-semibold text-white hover:bg-pulse-dark transition">
          <UserPlus size={18} /> Nuevo paciente
        </button>
      </div>

      <div className="rounded-2xl border border-white/10 overflow-x-auto">
        <div className="grid grid-cols-[40px_1.6fr_1fr_0.6fr_1fr_1.1fr_0.8fr_90px] min-w-[860px] bg-navy-850 px-5 py-4 text-white/80 font-display font-semibold text-sm">
          <span>#</span><span>Nombre</span><span>Cédula</span><span>Edad</span><span>Sexo</span><span>Teléfono</span><span>T. Sangre</span><span></span>
        </div>
        {shown.length === 0 ? (
          <p className="p-10 text-center text-white/45 bg-navy-900">No hay pacientes. Agrega el primero con "Nuevo paciente".</p>
        ) : shown.map((p, i) => (
          <div key={p.id} data-testid={`patient-row-${i}`}
               className="grid grid-cols-[40px_1.6fr_1fr_0.6fr_1fr_1.1fr_0.8fr_90px] min-w-[860px] items-center px-5 py-4 bg-navy-900 border-t border-white/5 hover:bg-white/5">
            <span className="text-white/55">{i + 1}</span>
            <span className="text-white font-medium truncate pr-2">{p.name}</span>
            <span className="text-white/70">{p.cedula || "—"}</span>
            <span className="text-white/70">{p.age || calcAge(p.birthdate) || "—"}</span>
            <span className="text-white/70">{p.sex || "—"}</span>
            <span className="text-white/70">{p.phone || "—"}</span>
            <span className="text-white/70">{p.blood_type || "—"}</span>
            <div className="flex items-center gap-3 justify-self-end">
              <button onClick={() => setEditing(p)} data-testid={`patient-edit-${i}`} className="text-white/45 hover:text-cyan"><Pencil size={17} /></button>
              <button onClick={() => del(p.id)} data-testid={`patient-del-${i}`} className="text-white/45 hover:text-pulse"><Trash2 size={17} /></button>
            </div>
          </div>
        ))}
      </div>

      {editing && <PatientModal initial={editing.new ? null : editing} onClose={() => setEditing(null)} onSaved={reload} />}
    </div>
  );
};

const PatientModal = ({ initial, onClose, onSaved }) => {
  const [form, setForm] = useState({ ...EMPTY, ...(initial || {}) });
  const [saving, setSaving] = useState(false);
  const up = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const save = async () => {
    if (!form.name.trim()) { toast.error("El nombre es obligatorio"); return; }
    if (!form.phone.trim()) { toast.error("El teléfono es obligatorio"); return; }
    const payload = { ...form };
    if (!payload.age && payload.birthdate) payload.age = String(calcAge(payload.birthdate) || "");
    setSaving(true);
    try {
      if (initial?.id) { await api.put(`/patients/${initial.id}`, payload); toast.success("Paciente actualizado"); }
      else { await api.post("/patients", payload); toast.success("Paciente agregado"); }
      onSaved(); onClose();
    } catch (e) { toast.error(apiErr(e)); }
    finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm flex items-start justify-center p-4 overflow-y-auto" onClick={onClose}>
      <div className="bg-navy-900 border border-white/10 rounded-2xl w-full max-w-3xl my-8 p-7" onClick={(e) => e.stopPropagation()} data-testid="patient-modal">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-display font-bold text-xl text-white">{initial?.id ? "Editar paciente" : "Nuevo paciente"}</h3>
          <button onClick={onClose} className="text-white/50 hover:text-white"><X size={22} /></button>
        </div>

        <p className="text-cyan font-display font-semibold text-sm mb-3">Datos personales</p>
        <div className="grid sm:grid-cols-2 gap-4 mb-6">
          <Field label="Nombre completo" k="name" req value={form.name} onChange={up("name")} />
          <Field label="Cédula / DNI" k="cedula" value={form.cedula} onChange={up("cedula")} />
          <Field label="Fecha de nacimiento" k="birthdate" type="date" value={form.birthdate} onChange={up("birthdate")} />
          <Field label="Edad" k="age" value={form.age} onChange={up("age")} />
          <SelectField label="Sexo" k="sex" opts={SEX} value={form.sex} onChange={up("sex")} />
          <SelectField label="Tipo de sangre" k="blood_type" opts={BLOOD} value={form.blood_type} onChange={up("blood_type")} />
          <SelectField label="Estado civil" k="marital_status" opts={MARITAL} value={form.marital_status} onChange={up("marital_status")} />
          <Field label="Ocupación" k="occupation" value={form.occupation} onChange={up("occupation")} />
        </div>

        <p className="text-cyan font-display font-semibold text-sm mb-3">Contacto</p>
        <div className="grid sm:grid-cols-2 gap-4 mb-6">
          <Field label="Teléfono" k="phone" req value={form.phone} onChange={up("phone")} />
          <Field label="Correo" k="email" type="email" value={form.email} onChange={up("email")} />
          <Field label="Ciudad" k="city" value={form.city} onChange={up("city")} />
          <Field label="Dirección" k="address" value={form.address} onChange={up("address")} />
          <Field label="Contacto de emergencia" k="emergency_contact" value={form.emergency_contact} onChange={up("emergency_contact")} />
          <Field label="Teléfono de emergencia" k="emergency_phone" value={form.emergency_phone} onChange={up("emergency_phone")} />
        </div>

        <p className="text-cyan font-display font-semibold text-sm mb-3">Información médica</p>
        <div className="grid sm:grid-cols-2 gap-4 mb-7">
          <Field label="Seguro médico" k="insurance" value={form.insurance} onChange={up("insurance")} />
          <div />
          <AreaField label="Alergias" k="allergies" value={form.allergies} onChange={up("allergies")} />
          <AreaField label="Antecedentes médicos" k="history" value={form.history} onChange={up("history")} />
          <AreaField label="Medicación actual" k="medications" value={form.medications} onChange={up("medications")} />
          <AreaField label="Notas" k="notes" value={form.notes} onChange={up("notes")} />
        </div>

        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="rounded-lg border border-white/15 px-5 py-2.5 font-semibold text-white/80 hover:bg-white/5 transition">Cancelar</button>
          <button onClick={save} disabled={saving} data-testid="patient-save"
                  className="rounded-lg bg-pulse px-6 py-2.5 font-semibold text-white hover:bg-pulse-dark transition inline-flex items-center gap-2">
            {saving ? <Loader2 className="animate-spin" size={18} /> : (initial?.id ? "Guardar cambios" : "Agregar paciente")}
          </button>
        </div>
      </div>
    </div>
  );
};
