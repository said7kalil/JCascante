import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Plus, FileText, Video, CheckCircle2, Upload, X, Loader2, Eye, Trash2 } from "lucide-react";
import { api, apiErr } from "@/lib/api";

export const CasesTab = ({ patients, cases, reloadCases }) => {
  const nav = useNavigate();
  const [filter, setFilter] = useState("");
  const [editing, setEditing] = useState(null); // case object or {new:true}

  const shown = filter ? cases.filter((c) => c.patient_id === filter) : cases;

  return (
    <div>
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <select data-testid="patient-filter" value={filter} onChange={(e) => setFilter(e.target.value)}
                className="bg-navy-800 border border-white/15 rounded-xl px-5 py-3 text-white outline-none focus:border-cyan min-w-[200px]">
          <option value="">Todos los pacientes</option>
          {patients.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        <button onClick={() => setEditing({ new: true })} data-testid="new-case-btn"
                className="inline-flex items-center gap-2 rounded-xl bg-navy-600 border border-white/15 px-5 py-3 font-semibold text-white hover:bg-navy-500 transition">
          <Plus size={18} className="text-cyan" /> Nuevo Caso
        </button>
      </div>

      <div className="rounded-2xl border border-white/10 overflow-hidden">
        <div className="grid grid-cols-[40px_1.4fr_1fr_0.7fr_1.1fr_1fr_90px] bg-navy-850 px-5 py-4 text-white/80 font-display font-semibold text-sm">
          <span>#</span><span>Paciente</span><span>Laboratorios</span><span>EKG</span><span>Ecocardiograma</span><span>Diagnóstico</span><span></span>
        </div>
        {shown.length === 0 ? (
          <p className="p-10 text-center text-white/45 bg-navy-900">No hay casos. Crea uno con "Nuevo Caso".</p>
        ) : shown.map((c, i) => (
          <div key={c.id} data-testid={`case-row-${i}`}
               className="grid grid-cols-[40px_1.4fr_1fr_0.7fr_1.1fr_1fr_90px] items-center px-5 py-4 bg-navy-900 border-t border-white/5 hover:bg-white/5">
            <span className="text-white/60">{i + 1}</span>
            <button onClick={() => setEditing(c)} className="text-left text-white font-medium hover:text-cyan truncate pr-2">{c.patient_name}</button>
            <Cell onClick={() => setEditing(c)}>{c.lab_files?.length ? <FileText className="text-white" size={20} /> : <UploadTag />}</Cell>
            <Cell onClick={() => setEditing(c)}>{c.ekg_files?.length ? <CheckCircle2 className="text-greenok" size={22} /> : <UploadTag />}</Cell>
            <Cell onClick={() => setEditing(c)}>{c.eco_file ? <Video className="text-magenta" size={20} /> : <UploadTag />}</Cell>
            <Cell onClick={() => setEditing(c)}>{c.diagnostico ? <FileText className="text-white" size={20} /> : <span className="text-white/30 text-sm">—</span>}</Cell>
            <button onClick={() => nav(`/caso/${c.id}`)} data-testid={`case-view-${i}`}
                    className="inline-flex items-center gap-1.5 text-gold hover:text-white text-sm font-semibold justify-self-end">
              <Eye size={16} /> Ver
            </button>
          </div>
        ))}
      </div>

      {editing && (
        <CaseModal patients={patients} initial={editing.new ? null : editing}
                   onClose={() => setEditing(null)} onSaved={reloadCases} />
      )}
    </div>
  );
};

const Cell = ({ children, onClick }) => (
  <button onClick={onClick} className="flex items-center">{children}</button>
);
const UploadTag = () => (
  <span className="inline-flex items-center gap-1 text-gold text-sm font-semibold hover:underline"><Upload size={14} /> Upload</span>
);

// ---------------- Case Modal ----------------
const FIELDS = [
  ["title", "Título del caso", "insuficiencia cardíaca por diabetes"],
  ["consulta", "Consulta / lugar", "Cenincardio"],
  ["fecha", "Fecha", "28 de Octubre 2025"],
];

const CaseModal = ({ patients, initial, onClose, onSaved }) => {
  const [c, setC] = useState(initial);
  const [form, setForm] = useState({
    patient_id: initial?.patient_id || "",
    title: initial?.title || "", consulta: initial?.consulta || "", fecha: initial?.fecha || "",
    cuadro_clinico: initial?.cuadro_clinico || "", laboratorios: initial?.laboratorios || "",
    eco_text: initial?.eco_text || "", diagnostico: initial?.diagnostico || "",
  });
  const [saving, setSaving] = useState(false);
  const up = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const save = async () => {
    if (!form.patient_id) { toast.error("Selecciona un paciente"); return; }
    setSaving(true);
    try {
      if (c) {
        const { data } = await api.put(`/cases/${c.id}`, form);
        setC(data); toast.success("Caso actualizado");
      } else {
        const { data } = await api.post("/cases", form);
        setC(data); toast.success("Caso creado. Ahora puedes subir archivos.");
      }
      onSaved();
    } catch (e) { toast.error(apiErr(e)); }
    finally { setSaving(false); }
  };

  const doUpload = async (field, file) => {
    if (!file) return;
    const fd = new FormData(); fd.append("field", field); fd.append("file", file);
    try {
      const { data } = await api.post(`/cases/${c.id}/files`, fd);
      setC(data); onSaved(); toast.success("Archivo subido");
    } catch (e) { toast.error(apiErr(e)); }
  };
  const removeFile = async (field, fileId) => {
    try { const { data } = await api.delete(`/cases/${c.id}/files/${fileId}?field=${field}`); setC(data); onSaved(); }
    catch (e) { toast.error(apiErr(e)); }
  };

  const inp = "bg-navy-800 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-white/35 outline-none focus:border-cyan w-full transition-colors";

  return (
    <div className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm flex items-start justify-center p-4 overflow-y-auto" onClick={onClose}>
      <div className="bg-navy-900 border border-white/10 rounded-2xl w-full max-w-3xl my-8 p-7" onClick={(e) => e.stopPropagation()} data-testid="case-modal">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-display font-bold text-xl text-white">{c ? "Editar caso" : "Nuevo caso"}</h3>
          <button onClick={onClose} className="text-white/50 hover:text-white"><X size={22} /></button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs text-white/50 uppercase tracking-wide">Paciente</label>
            <select data-testid="case-patient" value={form.patient_id} onChange={up("patient_id")} className={inp}>
              <option value="">Selecciona un paciente</option>
              {patients.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            {FIELDS.map(([k, label, ph]) => (
              <div key={k}><label className="text-xs text-white/50 uppercase tracking-wide">{label}</label>
                <input data-testid={`case-${k}`} className={inp} placeholder={ph} value={form[k]} onChange={up(k)} /></div>
            ))}
          </div>
          <div><label className="text-xs text-white/50 uppercase tracking-wide">Cuadro clínico</label>
            <textarea data-testid="case-cuadro" className={`${inp} resize-none`} rows={3} value={form.cuadro_clinico} onChange={up("cuadro_clinico")} /></div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div><label className="text-xs text-white/50 uppercase tracking-wide">Laboratorios (texto)</label>
              <textarea className={`${inp} resize-none`} rows={3} value={form.laboratorios} onChange={up("laboratorios")} /></div>
            <div><label className="text-xs text-white/50 uppercase tracking-wide">Ecocardiograma (mediciones)</label>
              <textarea className={`${inp} resize-none`} rows={3} value={form.eco_text} onChange={up("eco_text")} /></div>
          </div>
          <div><label className="text-xs text-white/50 uppercase tracking-wide">Diagnóstico</label>
            <textarea data-testid="case-diagnostico" className={`${inp} resize-none`} rows={2} value={form.diagnostico} onChange={up("diagnostico")} /></div>

          <button onClick={save} disabled={saving} data-testid="case-save"
                  className="rounded-lg bg-pulse px-6 py-2.5 font-semibold text-white hover:bg-pulse-dark transition inline-flex items-center gap-2">
            {saving ? <Loader2 className="animate-spin" size={18} /> : (c ? "Guardar cambios" : "Crear caso")}
          </button>
        </div>

        {c && (
          <div className="mt-8 pt-6 border-t border-white/10 grid sm:grid-cols-3 gap-5">
            <UploadPanel label="Laboratorios (JPG/PDF)" accept="image/*,application/pdf" files={c.lab_files || []}
                         onUpload={(f) => doUpload("lab", f)} onRemove={(id) => removeFile("lab", id)} testid="up-lab" />
            <UploadPanel label="EKG (imágenes)" accept="image/*" files={c.ekg_files || []}
                         onUpload={(f) => doUpload("ekg", f)} onRemove={(id) => removeFile("ekg", id)} testid="up-ekg" />
            <UploadPanel label="Ecocardiograma (video)" accept="video/*" files={c.eco_file ? [c.eco_file] : []} single
                         onUpload={(f) => doUpload("eco", f)} onRemove={(id) => removeFile("eco", id)} testid="up-eco" />
          </div>
        )}
      </div>
    </div>
  );
};

const UploadPanel = ({ label, accept, files, onUpload, onRemove, single, testid }) => (
  <div>
    <p className="text-xs text-white/60 uppercase tracking-wide mb-2">{label}</p>
    <label data-testid={testid} className="flex flex-col items-center justify-center gap-1 border-2 border-dashed border-white/15 rounded-xl py-5 cursor-pointer hover:border-cyan hover:bg-white/5 transition">
      <Upload size={20} className="text-cyan" />
      <span className="text-xs text-white/50">{single && files.length ? "Reemplazar" : "Subir archivo"}</span>
      <input type="file" accept={accept} className="hidden" onChange={(e) => { onUpload(e.target.files[0]); e.target.value = ""; }} />
    </label>
    <div className="mt-2 space-y-1.5">
      {files.map((f) => (
        <div key={f.file_id} className="flex items-center justify-between bg-navy-800 rounded-lg px-3 py-1.5">
          <span className="text-xs text-white/70 truncate pr-2">{f.original_filename}</span>
          <button onClick={() => onRemove(f.file_id)} className="text-white/40 hover:text-pulse shrink-0"><Trash2 size={14} /></button>
        </div>
      ))}
    </div>
  </div>
);
