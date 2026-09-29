import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, LogIn } from "lucide-react";
import { Logo } from "@/components/Logo";
import { NAV, WHATSAPP_URL } from "@/data/site";

export const LandingHeader = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      data-testid="landing-header"
      initial={{ y: -70, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, delay: 0.15 }}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${scrolled ? "bg-navy-950/85 backdrop-blur-xl border-b border-white/10" : "bg-transparent"}`}
    >
      <div className="max-w-[1360px] mx-auto px-5 lg:px-8 h-[70px] flex items-center justify-between">
        <a href="#inicio"><Logo light /></a>
        <nav className="hidden lg:flex items-center gap-8">
          {NAV.map((l) => (
            <a key={l.href} href={l.href} data-testid={`nav-${l.href.replace("#","")}`}
               className="text-sm font-body text-white/70 hover:text-white transition-colors">{l.label}</a>
          ))}
        </nav>
        <div className="flex items-center gap-2.5">
          <Link to="/login" data-testid="login-button"
                className="inline-flex items-center gap-2 text-sm font-semibold text-white/90 hover:text-white border border-white/20 hover:border-white/50 rounded-full px-4 py-2 transition-colors">
            <LogIn size={16} /> <span className="hidden sm:inline">Ingresar</span>
          </Link>
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" data-testid="header-agendar"
             className="hidden sm:inline-flex items-center gap-2 bg-greenok text-white rounded-full px-5 py-2 text-sm font-semibold hover:brightness-110 transition">
            Agendar cita
          </a>
          <button className="lg:hidden text-white p-1" onClick={() => setOpen(!open)} data-testid="mobile-toggle" aria-label="Menú">
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>
      <AnimatePresence>
        {open && (
          <motion.nav initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                      className="lg:hidden overflow-hidden bg-navy-900/95 backdrop-blur-xl border-t border-white/10">
            <div className="px-6 py-5 flex flex-col gap-4">
              {NAV.map((l) => <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="text-white/85 font-display text-lg">{l.label}</a>)}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
};
