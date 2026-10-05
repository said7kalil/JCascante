import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Globe } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { api, apiErr } from "@/lib/api";
import { toast } from "sonner";
import { Logo } from "@/components/Logo";
import { CasesTab } from "@/components/dashboard/CasesTab";
import { PatientsTab } from "@/components/dashboard/PatientsTab";
import { AppointmentsTab } from "@/components/dashboard/AppointmentsTab";
import { SlidesTab } from "@/components/dashboard/SlidesTab";

const TABS = [
  { id: "casos", label: "Gestionar Casos" },
  { id: "pacientes", label: "Pacientes" },
  { id: "citas", label: "Citas" },
  { id: "diapositivas", label: "Diapositivas" },
];

export default function Dashboard() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const [tab, setTab] = useState("casos");
  const [patients, setPatients] = useState([]);
  const [cases, setCases] = useState([]);

  const loadPatients = useCallback(async () => {
    try { const { data } = await api.get("/patients"); setPatients(data); }
    catch (e) { toast.error(apiErr(e)); }
  }, []);
  const loadCases = useCallback(async () => {
    try { const { data } = await api.get("/cases"); setCases(data); }
    catch (e) { toast.error(apiErr(e)); }
  }, []);

  useEffect(() => { loadPatients(); loadCases(); }, [loadPatients, loadCases]);

  const doLogout = () => { logout(); nav("/"); };

  return (
    <div className="min-h-screen bg-navy-950">
      {/* Top white bar */}
      <div className="bg-white px-6 lg:px-10 h-[76px] flex items-center justify-between">
        <Logo />
        <Globe className="text-navy-900/70" size={22} />
      </div>

      <div className="max-w-[1360px] mx-auto px-5 lg:px-8 py-8">
        {/* Dashboard header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-display font-bold text-2xl text-white">Dashboard</h1>
          <div className="flex items-center gap-3 text-gold">
            <span className="font-semibold" data-testid="dash-username">{user?.name}</span>
            <button onClick={doLogout} data-testid="logout-btn" className="hover:text-white transition-colors" aria-label="Salir"><LogOut size={20} /></button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-8 border-b border-white/10 mb-8">
          {TABS.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)} data-testid={`tab-${t.id}`}
                    className={`relative pb-3 font-display font-semibold text-lg transition-colors ${tab === t.id ? "text-gold" : "text-white/55 hover:text-white"}`}>
              {t.label}
              {tab === t.id && <span className="absolute bottom-0 inset-x-0 h-0.5 bg-gold rounded-full" />}
            </button>
          ))}
        </div>

        {tab === "casos" && <CasesTab patients={patients} cases={cases} reloadCases={loadCases} />}
        {tab === "pacientes" && <PatientsTab patients={patients} reload={loadPatients} />}
        {tab === "citas" && <AppointmentsTab patients={patients} />}
        {tab === "diapositivas" && <SlidesTab />}
      </div>
    </div>
  );
}
