import * as Icons from "lucide-react";
import { motion } from "framer-motion";
import { Reveal } from "@/components/landing/Reveal";
import { SERVICES, IMAGES } from "@/data/site";

export const Services = () => (
  <section id="servicios" className="py-24 lg:py-32 bg-white">
    <div className="max-w-[1360px] mx-auto px-5 lg:px-8">
      <div className="max-w-2xl mb-16">
        <Reveal><p className="text-xs font-semibold uppercase tracking-[0.24em] text-pulse mb-4">Servicios</p></Reveal>
        <Reveal delay={0.05}>
          <h2 className="font-display font-extrabold tracking-tight text-3xl lg:text-4xl text-navy-950">
            Estudios que cuidan tu corazón
          </h2>
        </Reveal>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 items-start">
        <div className="grid gap-6 lg:col-span-1">
          {SERVICES.slice(0, 3).map((s, i) => <Card key={s.id} s={s} i={i} />)}
        </div>
        <Reveal delay={0.1} className="lg:col-span-1">
          <div className="relative rounded-3xl overflow-hidden h-full min-h-[420px] bg-navy-900">
            <img src={IMAGES.clinic} alt="Consulta cardiológica" className="w-full h-full object-cover opacity-90" />
            <div className="absolute inset-0 bg-gradient-to-t from-navy-950/85 via-navy-950/20 to-transparent" />
            <div className="absolute bottom-0 p-7">
              <div className="inline-flex items-center gap-2 rounded-full bg-pulse px-3 py-1 text-[11px] font-semibold text-white mb-3">
                <Icons.HeartPulse size={13} /> Diagnóstico integral
              </div>
              <p className="font-display font-bold text-white text-xl leading-snug">Tecnología de precisión, interpretada personalmente.</p>
            </div>
          </div>
        </Reveal>
        <div className="grid gap-6 lg:col-span-1">
          {SERVICES.slice(3).map((s, i) => <Card key={s.id} s={s} i={i + 3} />)}
        </div>
      </div>
    </div>
  </section>
);

const Card = ({ s, i }) => {
  const Icon = Icons[s.icon] || Icons.HeartPulse;
  return (
    <Reveal delay={i * 0.05}>
      <motion.div whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  data-testid={`service-${s.id}`}
                  className="group rounded-2xl border border-navy-950/10 bg-white p-6 hover:border-pulse/40 hover:shadow-[0_16px_40px_rgba(226,59,46,0.12)] transition-all">
        <div className="w-11 h-11 rounded-xl bg-pulse/10 text-pulse flex items-center justify-center mb-4 group-hover:bg-pulse group-hover:text-white transition-colors">
          <Icon size={20} strokeWidth={1.8} />
        </div>
        <h3 className="font-display font-bold text-lg text-navy-950 mb-2">{s.name}</h3>
        <p className="text-sm text-navy-950/60 leading-relaxed">{s.desc}</p>
      </motion.div>
    </Reveal>
  );
};
