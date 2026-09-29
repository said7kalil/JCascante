import * as Icons from "lucide-react";
import { motion } from "framer-motion";
import { Reveal } from "@/components/landing/Reveal";
import { SERVICES, IMAGES, WHATSAPP_URL } from "@/data/site";

export const Services = () => (
  <section id="servicios" className="py-24 lg:py-32 bg-white overflow-hidden">
    <div className="max-w-[1360px] mx-auto px-5 lg:px-8">
      <div className="max-w-2xl mb-14">
        <Reveal><p className="text-xs font-semibold uppercase tracking-[0.24em] text-pulse mb-4">Servicios</p></Reveal>
        <Reveal delay={0.05}>
          <h2 className="font-display font-extrabold tracking-tight text-3xl lg:text-4xl text-navy-950">
            Estudios que cuidan tu corazón
          </h2>
        </Reveal>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 lg:gap-8 items-center">
        <div className="grid gap-6 order-1">
          {SERVICES.slice(0, 3).map((s, i) => <Card key={s.id} s={s} i={i} />)}
        </div>

        <Reveal delay={0.1} className="order-3 lg:order-2">
          <div className="relative flex items-center justify-center">
            <div className="absolute w-[85%] h-[70%] rounded-full glow-radial" />
            <img src={IMAGES.ergo} alt="Ergometría — prueba de esfuerzo cardíaco"
                 data-testid="ergo-image"
                 className="relative w-full max-w-[420px] object-contain drop-shadow-2xl" />
          </div>
        </Reveal>

        <div className="grid gap-6 order-2 lg:order-3">
          {SERVICES.slice(3).map((s, i) => <Card key={s.id} s={s} i={i + 3} />)}
        </div>
      </div>

      <Reveal delay={0.1}>
        <div className="mt-14 flex justify-center">
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" data-testid="services-agendar"
             className="inline-flex items-center gap-3 bg-greenok text-white rounded-full pl-7 pr-5 py-3.5 font-semibold hover:brightness-110 transition">
            Agendar cita
            <span className="bg-white/20 rounded-full p-1.5"><Icons.ArrowRight size={16} /></span>
          </a>
        </div>
      </Reveal>
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
