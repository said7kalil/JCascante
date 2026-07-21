import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Loader2, ArrowRight, Phone, Mail, MapPin, Clock } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import { CONTACT, SERVICES } from "@/data/site";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const initial = { name: "", email: "", phone: "", service: "", message: "" };

export const Contact = () => {
  const [form, setForm] = useState(initial);
  const [loading, setLoading] = useState(false);

  const update = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error("Por favor completa nombre, correo y mensaje.");
      return;
    }
    setLoading(true);
    try {
      const { data } = await axios.post(`${API}/contact`, form);
      toast.success(data.message || "¡Solicitud enviada!");
      setForm(initial);
    } catch (err) {
      toast.error("No se pudo enviar. Intenta nuevamente o escríbenos por WhatsApp.");
    } finally {
      setLoading(false);
    }
  };

  const inputCls =
    "w-full bg-transparent border-b border-brand-bg/25 py-3 text-brand-bg placeholder:text-brand-bg/40 outline-none focus:border-brand-crimson transition-colors font-light";

  return (
    <section id="contacto" className="py-20 lg:py-28">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <div className="bg-brand-ink rounded-[2rem] lg:rounded-[2.5rem] p-8 sm:p-12 lg:p-16 grid lg:grid-cols-12 gap-12 lg:gap-16 relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-brand-crimson/20 blur-[100px] pointer-events-none" />

          {/* Left info */}
          <div className="lg:col-span-5 relative z-10">
            <Reveal>
              <p className="text-xs font-body font-semibold uppercase tracking-[0.28em] text-brand-crimson mb-6">
                Contacto
              </p>
              <h2 className="font-heading font-light tracking-tight leading-[1.02] text-4xl sm:text-5xl md:text-6xl text-brand-bg">
                Cuidemos tu corazón, juntos.
              </h2>
              <p className="mt-6 font-light text-brand-bg/60 leading-relaxed max-w-sm">
                Agenda tu valoración cardíaca. Déjanos tus datos y te contactaremos a la brevedad.
              </p>
            </Reveal>

            <div className="mt-12 space-y-5">
              {[
                [Phone, CONTACT.phone],
                [Mail, CONTACT.email],
                [MapPin, CONTACT.address],
                [Clock, CONTACT.hours],
              ].map(([Icon, val], i) => (
                <Reveal key={i} delay={i * 0.06}>
                  <div className="flex items-center gap-4 text-brand-bg/80">
                    <span className="w-10 h-10 rounded-full border border-brand-bg/20 flex items-center justify-center shrink-0">
                      <Icon size={17} strokeWidth={1.6} />
                    </span>
                    <span className="font-light text-sm md:text-base">{val}</span>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          {/* Right form */}
          <div className="lg:col-span-6 lg:col-start-7 relative z-10">
            <form onSubmit={submit} data-testid="contact-form" className="space-y-7">
              <div className="grid sm:grid-cols-2 gap-7">
                <div>
                  <label className="text-xs uppercase tracking-[0.15em] text-brand-bg/45">Nombre</label>
                  <input data-testid="contact-name" value={form.name} onChange={update("name")} placeholder="Tu nombre completo" className={inputCls} />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-[0.15em] text-brand-bg/45">Teléfono</label>
                  <input data-testid="contact-phone" value={form.phone} onChange={update("phone")} placeholder="+593 ..." className={inputCls} />
                </div>
              </div>
              <div>
                <label className="text-xs uppercase tracking-[0.15em] text-brand-bg/45">Correo</label>
                <input data-testid="contact-email" type="email" value={form.email} onChange={update("email")} placeholder="correo@ejemplo.com" className={inputCls} />
              </div>
              <div>
                <label className="text-xs uppercase tracking-[0.15em] text-brand-bg/45">Servicio de interés</label>
                <select data-testid="contact-service" value={form.service} onChange={update("service")} className={`${inputCls} appearance-none cursor-pointer [&>option]:text-brand-ink`}>
                  <option value="">Selecciona un estudio</option>
                  {SERVICES.map((s) => (
                    <option key={s.id} value={s.name}>{s.name}</option>
                  ))}
                  <option value="Consulta general">Consulta general</option>
                </select>
              </div>
              <div>
                <label className="text-xs uppercase tracking-[0.15em] text-brand-bg/45">Mensaje</label>
                <textarea data-testid="contact-message" value={form.message} onChange={update("message")} placeholder="Cuéntanos brevemente tu motivo de consulta" rows={3} className={`${inputCls} resize-none`} />
              </div>
              <button
                type="submit"
                disabled={loading}
                data-testid="contact-submit"
                className="group w-full sm:w-auto bg-brand-crimson text-white rounded-full pl-8 pr-6 py-4 font-body font-medium inline-flex items-center justify-center gap-3 transition-transform hover:scale-[1.03] active:scale-95 disabled:opacity-60 disabled:hover:scale-100"
              >
                {loading ? <Loader2 className="animate-spin" size={18} /> : "Enviar solicitud"}
                {!loading && (
                  <span className="bg-white/15 rounded-full p-1.5 group-hover:translate-x-1 transition-transform">
                    <ArrowRight size={16} />
                  </span>
                )}
              </button>
            </form>
          </div>
        </div>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 text-brand-muted text-sm">
          <p className="font-heading text-lg text-brand-ink">Dr. Julio Cascante</p>
          <p>© {new Date().getFullYear()} · www.drjuliocascante.com · Cardiología preventiva</p>
        </div>
      </div>
    </section>
  );
};
