import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { User, Lock, Loader2, ArrowLeft } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { apiErr } from "@/lib/api";
import { Logo } from "@/components/Logo";

export default function Login() {
  const { user, login } = useAuth();
  const nav = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => { if (user) nav("/dashboard", { replace: true }); }, [user, nav]);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(username, password);
      toast.success("Bienvenido");
      nav("/dashboard", { replace: true });
    } catch (err) { toast.error(apiErr(err)); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-navy-950 flex flex-col">
      <div className="bg-white px-6 lg:px-10 h-[76px] flex items-center justify-between">
        <Link to="/"><Logo /></Link>
        <Link to="/" className="text-sm text-navy-950/60 hover:text-pulse inline-flex items-center gap-1.5"><ArrowLeft size={15} /> Volver al sitio</Link>
      </div>

      <div className="flex-1 flex items-center justify-center px-5 py-12 relative">
        <div className="absolute inset-0 glow-radial opacity-60" />
        <motion.form onSubmit={submit} data-testid="login-form"
                     initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
                     className="relative w-full max-w-md rounded-3xl bg-gradient-to-b from-navy-600/80 to-navy-800/90 border border-white/10 backdrop-blur-xl p-8 sm:p-10 shadow-2xl">
          <div className="flex justify-center mb-7">
            <div className="w-24 h-24 rounded-full bg-navy-700/70 border border-white/15 flex items-center justify-center">
              <User size={44} className="text-white/40" />
            </div>
          </div>

          <div className="relative mb-6">
            <User size={18} className="absolute left-0 top-3.5 text-white/50" />
            <input data-testid="login-username" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Usuario"
                   className="w-full bg-transparent border-b border-white/25 pl-7 py-3 text-white placeholder:text-white/50 outline-none focus:border-cyan transition-colors" />
          </div>
          <div className="relative mb-6">
            <Lock size={18} className="absolute left-0 top-3.5 text-white/50" />
            <input data-testid="login-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Contraseña"
                   className="w-full bg-transparent border-b border-white/25 pl-7 py-3 text-white placeholder:text-white/50 outline-none focus:border-cyan transition-colors" />
          </div>

          <div className="flex items-center justify-between mb-8 text-sm">
            <label className="flex items-center gap-2 text-white/70 cursor-pointer select-none">
              <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="accent-cyan w-4 h-4" />
              Recordarme
            </label>
            <span className="text-white/45 italic">¿Olvidaste tu contraseña?</span>
          </div>

          <button type="submit" disabled={loading} data-testid="login-submit"
                  className="w-full rounded-xl bg-gradient-to-r from-magenta to-pulse py-3.5 font-display font-bold uppercase tracking-wide text-white hover:brightness-110 transition disabled:opacity-60 inline-flex items-center justify-center gap-2">
            {loading ? <Loader2 className="animate-spin" size={20} /> : "Ingresar"}
          </button>
        </motion.form>
      </div>

      <div className="py-6 flex justify-center"><Logo light /></div>
    </div>
  );
}
