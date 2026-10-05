import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { UserPlus, Trash2, Search, Pencil } from "lucide-react";
import { api, apiErr } from "@/lib/api";

const calcAge = (bd) => {
  if (!bd) return "";
  const d = new Date(bd); if (isNaN(d)) return "";
  const a = Math.floor((Date.now() - d.getTime()) / (365.25 * 24 * 3600 * 1000));
  return a >= 0 && a < 130 ? a : "";
};

export const PatientsTab = ({ patients, reload }) => {
  const nav = useNavigate();
  const [query, setQuery] = useState("");

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return patients;
    return patients.filter((p) => `${p.name} ${p.cedula || ""} ${p.phone || ""}`.toLowerCase().includes(q));
  }, [patients, query]);

  const del = async (id, e) => {
    e.stopPropagation();
    try { await api.delete(`/patients/${id}`); toast.success("Paciente eliminado"); reload(); }
    catch (err) { toast.error(apiErr(err)); }
  };

  return (
    <div>
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div className="relative flex-1 min-w-[220px] max-w-md">
          <Search size={17} className="absolute left-3.5 top-3.5 ui-muted" />
          <input data-testid="patient-search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar por nombre, cédula o teléfono"
                 className="w-full ui-field rounded-xl pl-10 pr-4 py-3" />
        </div>
        <button onClick={() => nav("/ficha/new")} data-testid="new-patient-btn"
                className="inline-flex items-center gap-2 rounded-xl bg-pulse px-5 py-3 font-semibold text-white hover:bg-pulse-dark transition">
          <UserPlus size={18} /> Nuevo paciente
        </button>
      </div>

      <div className="rounded-2xl border ui-line overflow-x-auto">
        <div className="grid grid-cols-[40px_1.6fr_1fr_0.6fr_1fr_1.1fr_0.8fr_60px] min-w-[860px] ui-card2 px-5 py-4 ui-sub font-display font-semibold text-sm">
          <span>#</span><span>Nombre</span><span>Cédula</span><span>Edad</span><span>Sexo</span><span>Teléfono</span><span>T. Sangre</span><span></span>
        </div>
        {shown.length === 0 ? (
          <p className="p-10 text-center ui-muted ui-card">No hay pacientes. Agrega el primero con "Nuevo paciente".</p>
        ) : shown.map((p, i) => (
          <div key={p.id} data-testid={`patient-row-${i}`} onClick={() => nav(`/ficha/${p.id}`)}
               className="grid grid-cols-[40px_1.6fr_1fr_0.6fr_1fr_1.1fr_0.8fr_60px] min-w-[860px] items-center px-5 py-4 ui-card border-t ui-line hover:opacity-80 cursor-pointer">
            <span className="ui-muted">{i + 1}</span>
            <span className="ui-ink font-medium truncate pr-2">{p.name}</span>
            <span className="ui-sub">{p.cedula || "—"}</span>
            <span className="ui-sub">{p.age || calcAge(p.birthdate) || "—"}</span>
            <span className="ui-sub">{p.sex || "—"}</span>
            <span className="ui-sub">{p.phone || "—"}</span>
            <span className="ui-sub">{p.blood_type || "—"}</span>
            <div className="flex items-center gap-3 justify-self-end">
              <Pencil size={16} className="ui-muted" data-testid={`patient-edit-${i}`} />
              <button onClick={(e) => del(p.id, e)} data-testid={`patient-del-${i}`} className="ui-muted hover:text-pulse"><Trash2 size={16} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
