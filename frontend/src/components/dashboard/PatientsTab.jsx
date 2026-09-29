import { useState } from "react";
import { toast } from "sonner";
import { UserPlus, Trash2, Loader2 } from "lucide-react";
import { api, apiErr } from "@/lib/api";

export const PatientsTab = ({ patients, reload }) => {
  const [form, setForm] = useState({ name: "", age: "", sex: "", phone: "", notes: "" });
  const [loading, setLoading] = useState(false);
  const up = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const add = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) { toast.error("Ingresa el nombre del paciente"); return; }
    setLoading(true);
    try {
      await api.post("/patients", form);
      toast.success("Paciente agregado");
      setForm({ name: "", age: "", sex: "", phone: "", notes: "" });
      reload();
    } catch (e2) { toast.error(apiErr(e2)); }
    finally { setLoading(false); }
  };

  const del = async (id) => {
    try { await api.delete(`/patients/${id}`); toast.success("Paciente eliminado"); reload(); }
    catch (e) { toast.error(apiErr(e)); }
  };

  const inp = "bg-navy-800 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-white/35 outline-none focus:border-cyan transition-colors";

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      <form onSubmit={add} data-testid="patient-form" className="lg:col-span-1 rounded-2xl bg-navy-900 border border-white/10 p-6 h-fit">
        <h3 className="font-display font-bold text-white text-lg mb-5 flex items-center gap-2"><UserPlus size={18} className="text-gold" /> Nuevo paciente</h3>
        <div className="space-y-3">
          <input data-testid="patient-name" className={`${inp} w-full`} placeholder="Nombre completo" value={form.name} onChange={up("name")} />
          <div className="grid grid-cols-2 gap-3">
            <input className={inp} placeholder="Edad" value={form.age} onChange={up("age")} />
            <select className={inp} value={form.sex} onChange={up("sex")}>
              <option value="">Sexo</option><option value="M">M</option><option value="F">F</option>
            </select>
          </div>
          <input className={`${inp} w-full`} placeholder="Teléfono" value={form.phone} onChange={up("phone")} />
          <textarea className={`${inp} w-full resize-none`} rows={2} placeholder="Notas" value={form.notes} onChange={up("notes")} />
          <button disabled={loading} data-testid="patient-save" className="w-full rounded-lg bg-pulse py-2.5 font-semibold text-white hover:bg-pulse-dark transition inline-flex items-center justify-center gap-2">
            {loading ? <Loader2 className="animate-spin" size={18} /> : "Agregar paciente"}
          </button>
        </div>
      </form>

      <div className="lg:col-span-2">
        <div className="rounded-2xl bg-navy-900 border border-white/10 overflow-hidden">
          {patients.length === 0 ? (
            <p className="p-8 text-center text-white/45">Aún no hay pacientes. Agrega el primero.</p>
          ) : patients.map((p, i) => (
            <div key={p.id} data-testid={`patient-row-${i}`} className="flex items-center justify-between px-6 py-4 border-b border-white/5 last:border-0 hover:bg-white/5">
              <div>
                <p className="font-semibold text-white">{p.name}</p>
                <p className="text-xs text-white/45">{[p.age && `${p.age} años`, p.sex, p.phone].filter(Boolean).join(" · ") || "—"}</p>
              </div>
              <button onClick={() => del(p.id)} data-testid={`patient-del-${i}`} className="text-white/40 hover:text-pulse transition-colors"><Trash2 size={18} /></button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
