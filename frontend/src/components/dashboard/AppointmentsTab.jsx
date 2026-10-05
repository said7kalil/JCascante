import { useState, useEffect, useCallback, useMemo } from "react";
import { toast } from "sonner";
import { CalendarPlus, Loader2, X, Trash2, Pencil, ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { api, apiErr } from "@/lib/api";
import { SERVICES, WHATSAPP_NUMBER } from "@/data/site";

const STATUS = {
  pendiente: { label: "Pendiente", cls: "bg-gold/15 text-gold border-gold/30" },
  confirmada: { label: "Confirmada", cls: "bg-greenok/15 text-greenok border-greenok/30" },
  cancelada: { label: "Cancelada", cls: "bg-pulse/15 text-pulse border-pulse/30" },
};
const MONTHS = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
const DOW = ["Lun","Mar","Mié","Jue","Vie","Sáb","Dom"];
const pad = (n) => String(n).padStart(2, "0");
const toISO = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const SLOTS = (() => { const s = []; for (let h = 8; h < 18; h++) { s.push(`${pad(h)}:00`); s.push(`${pad(h)}:30`); } return s; })();
const prettyDate = (iso) => { if (!iso) return ""; const [y,m,d] = iso.split("-").map(Number); return `${d} ${MONTHS[m-1]} ${y}`; };

export const AppointmentsTab = ({ patients }) => {
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);

  const load = useCallback(async () => {
    try { const { data } = await api.get("/appointments"); setItems(data); }
    catch (e) { toast.error(apiErr(e)); }
  }, []);
  useEffect(() => { load(); }, [load]);

  const setStatus = async (a, status) => {
    try { await api.put(`/appointments/${a.id}/status`, { status }); load(); }
    catch (e) { toast.error(apiErr(e)); }
  };
  const del = async (id) => {
    try { await api.delete(`/appointments/${id}`); toast.success("Cita eliminada"); load(); }
    catch (e) { toast.error(apiErr(e)); }
  };
  const whatsapp = (a) => {
    const msg = `Cita — ${a.name}%0AFecha: ${prettyDate(a.date)} a las ${a.time}%0AServicio: ${a.service || "Consulta"}%0ATel: ${a.phone || "-"}%0AMotivo: ${a.reason || "-"}`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, "_blank");
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <p className="text-white/60 text-sm">{items.length} cita(s) agendada(s)</p>
        <button onClick={() => setEditing({ new: true })} data-testid="new-appt-btn"
                className="inline-flex items-center gap-2 rounded-xl bg-pulse px-5 py-3 font-semibold text-white hover:bg-pulse-dark transition">
          <CalendarPlus size={18} /> Nueva cita
        </button>
      </div>

      <div className="rounded-2xl border border-white/10 overflow-x-auto">
        <div className="grid grid-cols-[1.1fr_0.7fr_1.4fr_1.2fr_1fr_130px] min-w-[820px] bg-navy-850 px-5 py-4 text-white/80 font-display font-semibold text-sm">
          <span>Fecha</span><span>Hora</span><span>Paciente</span><span>Servicio</span><span>Estado</span><span></span>
        </div>
        {items.length === 0 ? (
          <p className="p-10 text-center text-white/45 bg-navy-900">No hay citas. Agenda la primera con "Nueva cita".</p>
        ) : items.map((a, i) => (
          <div key={a.id} data-testid={`appt-row-${i}`} className="grid grid-cols-[1.1fr_0.7fr_1.4fr_1.2fr_1fr_130px] min-w-[820px] items-center px-5 py-4 bg-navy-900 border-t border-white/5 hover:bg-white/5">
            <span className="text-white font-medium">{prettyDate(a.date)}</span>
            <span className="text-white/70 inline-flex items-center gap-1.5"><Clock size={14} className="text-cyan" />{a.time}</span>
            <span className="text-white/80 truncate pr-2">{a.name}</span>
            <span className="text-white/60 truncate pr-2">{a.service || "—"}</span>
            <select value={a.status} onChange={(e) => setStatus(a, e.target.value)} data-testid={`appt-status-${i}`}
                    className={`text-xs font-semibold rounded-full border px-2.5 py-1 outline-none cursor-pointer bg-navy-800 ${STATUS[a.status]?.cls || ""}`}>
              {Object.keys(STATUS).map((s) => <option key={s} value={s} className="bg-navy-800 text-white">{STATUS[s].label}</option>)}
            </select>
            <div className="flex items-center gap-3 justify-self-end">
              <button onClick={() => whatsapp(a)} data-testid={`appt-wa-${i}`} className="text-greenok hover:brightness-125" title="WhatsApp">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.4-1.48-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.14.3-.35.44-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.88 1.21 3.07.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.09 1.76-.72 2-1.41.25-.7.25-1.29.18-1.41-.08-.13-.27-.2-.57-.35M12.05 21.8h-.01a9.87 9.87 0 01-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 01-1.51-5.26c0-5.45 4.44-9.88 9.9-9.88a9.86 9.86 0 019.88 9.89c0 5.45-4.44 9.88-9.89 9.88M20.46 3.49A11.82 11.82 0 0012.05 0C5.5 0 .16 5.34.16 11.89c0 2.1.55 4.14 1.59 5.95L.06 24l6.3-1.65a11.88 11.88 0 005.69 1.45h.01c6.55 0 11.89-5.34 11.89-11.89 0-3.18-1.24-6.17-3.49-8.42"/></svg>
              </button>
              <button onClick={() => setEditing(a)} data-testid={`appt-edit-${i}`} className="text-white/45 hover:text-cyan"><Pencil size={17} /></button>
              <button onClick={() => del(a.id)} data-testid={`appt-del-${i}`} className="text-white/45 hover:text-pulse"><Trash2 size={17} /></button>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <ApptModal initial={editing.new ? null : editing} patients={patients} taken={items}
                   onClose={() => setEditing(null)} onSaved={load} />
      )}
    </div>
  );
};

const ApptModal = ({ initial, patients, taken, onClose, onSaved }) => {
  const [form, setForm] = useState({
    patient_id: initial?.patient_id || "", name: initial?.name || "", phone: initial?.phone || "",
    email: initial?.email || "", cedula: initial?.cedula || "", service: initial?.service || "",
    reason: initial?.reason || "", date: initial?.date || "", time: initial?.time || "",
    status: initial?.status || "pendiente",
  });
  const [saving, setSaving] = useState(false);
  const today = new Date(); today.setHours(0,0,0,0);
  const [view, setView] = useState(() => { const d = initial?.date ? new Date(initial.date) : new Date(); return { y: d.getFullYear(), m: d.getMonth() }; });

  const up = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const pickPatient = (e) => {
    const id = e.target.value;
    const p = patients.find((x) => x.id === id);
    setForm((f) => ({ ...f, patient_id: id, ...(p ? { name: p.name, phone: p.phone || "", email: p.email || "", cedula: p.cedula || "" } : {}) }));
  };

  const takenTimes = useMemo(() =>
    taken.filter((a) => a.date === form.date && a.status !== "cancelada" && a.id !== initial?.id).map((a) => a.time),
  [taken, form.date, initial]);

  // build month grid
  const first = new Date(view.y, view.m, 1);
  const startOffset = (first.getDay() + 6) % 7; // Monday-based
  const daysInMonth = new Date(view.y, view.m + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(view.y, view.m, d));

  const save = async () => {
    if (!form.name.trim()) { toast.error("El nombre es obligatorio"); return; }
    if (!form.date) { toast.error("Selecciona una fecha"); return; }
    if (!form.time) { toast.error("Selecciona un horario"); return; }
    setSaving(true);
    try {
      if (initial?.id) { await api.put(`/appointments/${initial.id}`, form); toast.success("Cita actualizada"); }
      else { const { data } = await api.post("/appointments", form); toast.success(data.email_sent ? "Cita agendada y notificada por correo" : "Cita agendada"); }
      onSaved(); onClose();
    } catch (e) { toast.error(apiErr(e)); }
    finally { setSaving(false); }
  };

  const inp = "bg-navy-800 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-white/35 outline-none focus:border-cyan w-full transition-colors";

  return (
    <div className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm flex items-start justify-center p-4 overflow-y-auto" onClick={onClose}>
      <div className="bg-navy-900 border border-white/10 rounded-2xl w-full max-w-4xl my-8 p-7" onClick={(e) => e.stopPropagation()} data-testid="appt-modal">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-display font-bold text-xl text-white">{initial?.id ? "Editar cita" : "Nueva cita"}</h3>
          <button onClick={onClose} className="text-white/50 hover:text-white"><X size={22} /></button>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left: data */}
          <div className="space-y-4">
            <div>
              <label className="text-xs text-white/50 uppercase tracking-wide">Paciente existente (opcional)</label>
              <select data-testid="appt-patient" value={form.patient_id} onChange={pickPatient} className={inp}>
                <option value="">— Escribir manualmente —</option>
                {patients.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div><label className="text-xs text-white/50 uppercase tracking-wide">Nombre <span className="text-pulse">*</span></label>
              <input data-testid="appt-name" className={inp} value={form.name} onChange={up("name")} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="text-xs text-white/50 uppercase tracking-wide">Teléfono</label>
                <input data-testid="appt-phone" className={inp} value={form.phone} onChange={up("phone")} /></div>
              <div><label className="text-xs text-white/50 uppercase tracking-wide">Cédula</label>
                <input className={inp} value={form.cedula} onChange={up("cedula")} /></div>
            </div>
            <div><label className="text-xs text-white/50 uppercase tracking-wide">Correo</label>
              <input data-testid="appt-email" type="email" className={inp} value={form.email} onChange={up("email")} /></div>
            <div><label className="text-xs text-white/50 uppercase tracking-wide">Servicio</label>
              <select data-testid="appt-service" className={inp} value={form.service} onChange={up("service")}>
                <option value="">Selecciona un estudio</option>
                {SERVICES.map((s) => <option key={s.id} value={s.name}>{s.name}</option>)}
                <option value="Consulta general">Consulta general</option>
              </select></div>
            <div><label className="text-xs text-white/50 uppercase tracking-wide">Motivo</label>
              <textarea data-testid="appt-reason" rows={2} className={`${inp} resize-none`} value={form.reason} onChange={up("reason")} /></div>
          </div>

          {/* Right: calendar + slots */}
          <div>
            <label className="text-xs text-white/50 uppercase tracking-wide">Fecha <span className="text-pulse">*</span></label>
            <div className="bg-navy-800 border border-white/10 rounded-xl p-4 mt-1">
              <div className="flex items-center justify-between mb-3">
                <button onClick={() => setView((v) => { const m = v.m - 1; return m < 0 ? { y: v.y - 1, m: 11 } : { y: v.y, m }; })} className="text-white/60 hover:text-white p-1"><ChevronLeft size={18} /></button>
                <span className="font-display font-semibold text-white">{MONTHS[view.m]} {view.y}</span>
                <button onClick={() => setView((v) => { const m = v.m + 1; return m > 11 ? { y: v.y + 1, m: 0 } : { y: v.y, m }; })} className="text-white/60 hover:text-white p-1"><ChevronRight size={18} /></button>
              </div>
              <div className="grid grid-cols-7 gap-1 text-center text-[11px] text-white/40 mb-1">
                {DOW.map((d) => <span key={d}>{d}</span>)}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {cells.map((d, i) => {
                  if (!d) return <span key={i} />;
                  const iso = toISO(d);
                  const weekend = d.getDay() === 0 || d.getDay() === 6;
                  const past = d < today;
                  const disabled = weekend || past;
                  const sel = form.date === iso;
                  return (
                    <button key={i} disabled={disabled} data-testid={`day-${iso}`}
                            onClick={() => setForm((f) => ({ ...f, date: iso, time: "" }))}
                            className={`h-9 rounded-lg text-sm transition ${sel ? "bg-pulse text-white font-bold" : disabled ? "text-white/20 cursor-not-allowed" : "text-white/80 hover:bg-white/10"}`}>
                      {d.getDate()}
                    </button>
                  );
                })}
              </div>
            </div>

            <label className="text-xs text-white/50 uppercase tracking-wide block mt-5 mb-2">Horario disponible <span className="text-pulse">*</span></label>
            {!form.date ? (
              <p className="text-white/35 text-sm">Primero elige una fecha.</p>
            ) : (
              <div className="grid grid-cols-4 gap-2">
                {SLOTS.map((t) => {
                  const busy = takenTimes.includes(t);
                  const sel = form.time === t;
                  return (
                    <button key={t} disabled={busy} data-testid={`slot-${t}`}
                            onClick={() => setForm((f) => ({ ...f, time: t }))}
                            className={`py-2 rounded-lg text-sm transition ${sel ? "bg-cyan text-navy-950 font-bold" : busy ? "bg-navy-800 text-white/20 line-through cursor-not-allowed" : "bg-navy-800 text-white/80 hover:bg-white/10"}`}>
                      {t}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-7">
          <button onClick={onClose} className="rounded-lg border border-white/15 px-5 py-2.5 font-semibold text-white/80 hover:bg-white/5 transition">Cancelar</button>
          <button onClick={save} disabled={saving} data-testid="appt-save"
                  className="rounded-lg bg-pulse px-6 py-2.5 font-semibold text-white hover:bg-pulse-dark transition inline-flex items-center gap-2">
            {saving ? <Loader2 className="animate-spin" size={18} /> : (initial?.id ? "Guardar cambios" : "Agendar cita")}
          </button>
        </div>
      </div>
    </div>
  );
};
