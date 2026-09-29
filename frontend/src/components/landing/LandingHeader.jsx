import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, LogIn } from "lucide-react";
import { Logo } from "@/components/Logo";
import { NAV, WHATSAPP_URL } from "@/data/site";

export const LandingHeader = () => {
  const [open, setOpen] = useState(false);

  return (
    <motion.header
      data-testid="landing-header"
      initial={{ y: -70, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, delay: 0.15 }}
      className="fixed top-0 inset-x-0 z-50 bg-white/95 backdrop-blur-xl border-b border-navy-950/10 shadow-sm"
    >
      <div className="max-w-[1360px] mx-auto px-5 lg:px-8 h-[70px] flex items-center justify-between">
        <a href="#inicio"><Logo /></a>

        <nav className="hidden lg:flex items-center gap-8">
          {NAV.map((l) => (
            <a key={l.href} href={l.href} data-testid={`nav-${l.href.replace("#","")}`}
               className="text-sm font-body font-medium text-navy-950/70 hover:text-pulse transition-colors">{l.label}</a>
          ))}
        </nav>

        <div className="flex items-center gap-2.5">
          <Link to="/login" data-testid="login-button"
                className="inline-flex items-center gap-2 text-sm font-semibold text-navy-950/80 hover:text-pulse border border-navy-950/15 hover:border-pulse rounded-full px-4 py-2 transition-colors">
            <LogIn size={16} /> <span className="hidden sm:inline">Ingresar</span>
          </Link>
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" data-testid="header-agendar"
             className="hidden sm:inline-flex items-center gap-2 bg-greenok text-white rounded-full px-5 py-2 text-sm font-semibold hover:brightness-110 transition">
            Agendar cita
          </a>
          <button className="lg:hidden text-pulse p-1" onClick={() => setOpen(!open)} data-testid="mobile-toggle" aria-label="Menú">
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                      className="lg:hidden overflow-hidden bg-white border-t border-navy-950/10">
            <div className="px-6 py-5 flex flex-col gap-4">
              {NAV.map((l) => <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="text-navy-950 font-display font-semibold text-lg">{l.label}</a>)}
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)}
                 className="bg-greenok text-white rounded-full px-5 py-3 text-center font-semibold mt-1">Agendar cita</a>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
};
