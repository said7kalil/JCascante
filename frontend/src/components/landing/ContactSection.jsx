import { useState } from "react";
import { toast } from "sonner";
import { Loader2, ArrowRight, Phone, Mail, MapPin, Clock } from "lucide-react";
import { Reveal } from "@/components/landing/Reveal";
import { api, apiErr } from "@/lib/api";
import { CONTACT, SERVICES } from "@/data/site";

const initial = { name: "", email: "", phone: "", service: "", message: "" };

export const ContactSection = () => {
  const [form, setForm] = useState(initial);
  const [loading, setLoading] = useState(false);
  const up = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) { toast.error("Completa nombre, correo y mensaje."); return; }
    setLoading(true);
    try {
      const { data } = await api.post("/contact", form);
      toast.success(data.message || "¡Solicitud enviada!");
      setForm(initial);
    } catch (err) { toast.error(apiErr(err)); }
    finally { setLoading(false); }
  };

  const inp = "w-full bg-transparent border-b border-white/20 py-3 text-white placeholder:text-white/35 outline-none focus:border-pulse transition-colors";

  return (
    <section id="contacto" className="py-24 lg:py-28 bg-navy-950">
      <div className="max-w-[1360px] mx-auto px-5 lg:px-8 grid lg:grid-cols-12 gap-12">
        <div className="lg:col-span-5">
          <Reveal><p className="text-xs font-semibold uppercase tracking-[0.24em] text-pulse mb-5">Contacto</p></Reveal>
          <Reveal delay={0.05}>
            <h2 className="font-display font-extrabold tracking-tight text-3xl lg:text-4xl text-white leading-tight">
              Cuidemos tu corazón, juntos
            </h2>
          </Reveal>
          <Reveal delay={0.1}><p className="mt-5 text-white/60 max-w-sm">Agenda tu valoración cardíaca. Déjanos tus datos y te contactaremos a la brevedad.</p></Reveal>
          <div className="mt-10 space-y-4">
            {[[Phone, CONTACT.phone],[Mail, CONTACT.email],[MapPin, CONTACT.address],[Clock, CONTACT.hours]].map(([Ic, v], i) => (
              <Reveal key={i} delay={0.12 + i * 0.05}>
                <div className="flex items-center gap-4 text-white/80">
                  <span className="w-10 h-10 rounded-full border border-white/15 flex items-center justify-center shrink-0"><Ic size={17} /></span>
                  <span className="text-sm">{v}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        <div className="lg:col-span-6 lg:col-start-7">
          <form onSubmit={submit} data-testid="contact-form" className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-6">
              <div><label className="text-[11px] uppercase tracking-[0.15em] text-white/45">Nombre</label>
                <input data-testid="contact-name" value={form.name} onChange={up("name")} placeholder="Tu nombre completo" className={inp} /></div>
              <div><label className="text-[11px] uppercase tracking-[0.15em] text-white/45">Teléfono</label>
                <input data-testid="contact-phone" value={form.phone} onChange={up("phone")} placeholder="+593 …" className={inp} /></div>
            </div>
            <div><label className="text-[11px] uppercase tracking-[0.15em] text-white/45">Correo</label>
              <input data-testid="contact-email" type="email" value={form.email} onChange={up("email")} placeholder="correo@ejemplo.com" className={inp} /></div>
            <div><label className="text-[11px] uppercase tracking-[0.15em] text-white/45">Servicio de interés</label>
              <select data-testid="contact-service" value={form.service} onChange={up("service")} className={`${inp} [&>option]:text-navy-950`}>
                <option value="">Selecciona un estudio</option>
                {SERVICES.map((s) => <option key={s.id} value={s.name}>{s.name}</option>)}
                <option value="Consulta general">Consulta general</option>
              </select></div>
            <div><label className="text-[11px] uppercase tracking-[0.15em] text-white/45">Mensaje</label>
              <textarea data-testid="contact-message" value={form.message} onChange={up("message")} rows={3} placeholder="Cuéntanos tu motivo de consulta" className={`${inp} resize-none`} /></div>
            <button type="submit" disabled={loading} data-testid="contact-submit"
                    className="inline-flex items-center gap-3 bg-pulse text-white rounded-full pl-7 pr-5 py-3.5 font-semibold hover:bg-pulse-dark transition disabled:opacity-60">
              {loading ? <Loader2 className="animate-spin" size={18} /> : <>Enviar solicitud <ArrowRight size={16} /></>}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};
