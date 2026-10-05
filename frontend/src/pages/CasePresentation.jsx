import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { LogOut, ChevronRight, ChevronLeft, LayoutDashboard, FileText, Play } from "lucide-react";
import { toast } from "sonner";
import { api, apiErr, fileUrl } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Logo } from "@/components/Logo";

export default function CasePresentation() {
  const { id } = useParams();
  const nav = useNavigate();
  const { user, logout } = useAuth();
  const [c, setC] = useState(null);
  const [ekgIdx, setEkgIdx] = useState(0);

  useEffect(() => {
    api.get(`/cases/${id}`).then((r) => setC(r.data)).catch((e) => { toast.error(apiErr(e)); nav("/dashboard"); });
  }, [id, nav]);

  if (!c) return <div className="min-h-screen bg-navy-950 flex items-center justify-center text-white/60">Cargando caso…</div>;

  const ekg = c.ekg_files || [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-navy-950 to-navy-900">
      <div className="bg-white px-6 lg:px-10 h-[76px] flex items-center justify-between">
        <Logo />
        <div className="flex items-center gap-5 text-navy-900/80">
          <Link to="/dashboard" data-testid="back-dashboard" className="inline-flex items-center gap-1.5 font-semibold hover:text-pulse"><LayoutDashboard size={18} /> Ver Dashboard</Link>
          <span className="font-semibold text-pulse">{user?.name}</span>
          <button onClick={() => { logout(); nav("/"); }} className="hover:text-pulse"><LogOut size={20} /></button>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-5 lg:px-8 py-10">
        <div className="rounded-[2rem] bg-navy-850 border border-white/10 p-7 lg:p-10" data-testid="case-card">
          <p className="font-display font-bold text-magenta text-sm lg:text-base mb-2">
            Caso [{c.patient_name}] · Fecha [{c.fecha || "—"}] · Consulta: {c.consulta || "—"}
          </p>
          <h1 className="font-display font-extrabold text-white text-3xl lg:text-5xl mb-8">
            {c.title ? <>Título: {c.title}</> : c.patient_name}
          </h1>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Cuadro clínico */}
            <Panel title="Cuadro clínico" color="cyan">
              <p className="text-white/85 leading-relaxed whitespace-pre-line">{c.cuadro_clinico || "Sin información."}</p>
            </Panel>

            {/* EKG */}
            <Panel title={`EKG ${c.fecha ? `[${c.fecha}]` : ""}`} color="cyan">
              {ekg.length ? (
                <div className="relative">
                  <img src={fileUrl(ekg[ekgIdx].url)} alt="EKG" className="w-full h-56 object-contain rounded-lg bg-white" />
                  {ekg.length > 1 && (
                    <>
                      <button onClick={() => setEkgIdx((ekgIdx - 1 + ekg.length) % ekg.length)} className="absolute left-2 top-1/2 -translate-y-1/2 bg-pulse text-white rounded-full p-2 shadow-lg"><ChevronLeft size={18} /></button>
                      <button onClick={() => setEkgIdx((ekgIdx + 1) % ekg.length)} className="absolute right-2 top-1/2 -translate-y-1/2 bg-pulse text-white rounded-full p-2 shadow-lg"><ChevronRight size={18} /></button>
                      <span className="absolute bottom-2 right-2 text-xs bg-navy-950/80 text-white px-2 py-0.5 rounded">{ekgIdx + 1}/{ekg.length}</span>
                    </>
                  )}
                </div>
              ) : <Empty text="Sin electrocardiogramas cargados." />}
            </Panel>

            {/* Laboratorios */}
            <Panel title="Laboratorios" color="magenta">
              {c.laboratorios ? <p className="text-white/85 leading-relaxed whitespace-pre-line mb-3">{c.laboratorios}</p> : null}
              {(c.lab_files || []).map((f) => (
                <a key={f.file_id} href={fileUrl(f.url)} target="_blank" rel="noopener noreferrer"
                   className="inline-flex items-center gap-2 text-cyan hover:underline text-sm mb-1.5"><FileText size={15} /> {f.original_filename}</a>
              ))}
              {!c.laboratorios && !(c.lab_files || []).length && <Empty text="Sin laboratorios." />}
            </Panel>

            {/* Ecocardiograma */}
            <Panel title="Ecocardiograma" color="magenta">
              {c.eco_file ? (
                <video src={fileUrl(c.eco_file.url)} controls className="w-full h-52 rounded-lg bg-black mb-3" />
              ) : <div className="flex items-center justify-center h-40 rounded-lg bg-navy-800 mb-3 text-white/30"><Play size={40} /></div>}
              {c.eco_text && <p className="text-white/85 leading-relaxed whitespace-pre-line">{c.eco_text}</p>}
            </Panel>
          </div>

          {c.diagnostico && (
            <div className="mt-6 rounded-xl border border-pulse/40 bg-pulse/10 p-5">
              <p className="font-display font-bold text-pulse text-sm uppercase tracking-wide mb-1">Diagnóstico</p>
              <p className="text-white/90 leading-relaxed whitespace-pre-line">{c.diagnostico}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const Panel = ({ title, color, children }) => (
  <div className={`rounded-2xl bg-navy-900/70 border p-6 ${color === "magenta" ? "border-magenta/30" : "border-white/10"}`}>
    <h3 className={`font-display font-bold text-lg mb-4 ${color === "magenta" ? "text-magenta" : "text-cyan"}`}>{title}</h3>
    {children}
  </div>
);
const Empty = ({ text }) => <p className="text-white/35 text-sm">{text}</p>;
