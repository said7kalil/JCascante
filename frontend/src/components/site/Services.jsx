import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import { SERVICES, WHATSAPP_URL } from "@/data/site";

const Card = ({ s, i }) => {
  const Icon = Icons[s.icon] || Icons.HeartPulse;
  return (
    <Reveal
      delay={i * 0.06}
      className={s.span ? "md:col-span-2" : ""}
    >
      <motion.div
        whileHover={{ y: -6 }}
        transition={{ type: "spring", stiffness: 300, damping: 22 }}
        data-testid={`service-card-${s.id}`}
        className={`group relative h-full bg-white border border-brand-border/60 rounded-2xl p-8 lg:p-9 overflow-hidden transition-shadow duration-300 hover:shadow-[0_18px_50px_rgba(131,34,50,0.13)] ${
          s.span ? "flex flex-col md:flex-row md:items-center gap-6 justify-between" : ""
        }`}
      >
        <div className={s.span ? "md:max-w-md" : ""}>
          <div className="w-12 h-12 rounded-full bg-brand-crimson/8 text-brand-crimson flex items-center justify-center mb-6 group-hover:bg-brand-crimson group-hover:text-white transition-colors duration-300">
            <Icon size={22} strokeWidth={1.6} />
          </div>
          <h3 className="font-heading text-2xl md:text-3xl text-brand-ink mb-3">{s.name}</h3>
          <p className="font-light text-brand-muted leading-relaxed">{s.desc}</p>
        </div>
        {s.span && (
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 inline-flex items-center gap-2 rounded-full bg-brand-ink text-brand-bg px-6 py-3 text-sm font-medium hover:bg-brand-crimson transition-colors"
          >
            Reservar <Icons.ArrowRight size={16} />
          </a>
        )}
        <span className="absolute -bottom-8 -right-6 font-heading text-[7rem] text-brand-crimson/[0.04] leading-none pointer-events-none select-none">
          {String(i + 1).padStart(2, "0")}
        </span>
      </motion.div>
    </Reveal>
  );
};

export const Services = () => (
  <section id="servicios" className="py-24 lg:py-32 bg-brand-stone/40">
    <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
        <Reveal>
          <p className="text-xs font-body font-semibold uppercase tracking-[0.28em] text-brand-crimson mb-4">
            Servicios
          </p>
          <h2 className="font-heading font-light tracking-tight leading-none text-4xl sm:text-5xl md:text-6xl text-brand-ink max-w-2xl">
            Estudios que cuidan tu corazón
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="font-light text-brand-muted max-w-sm md:text-right">
            Tecnología cardiológica de precisión, interpretada personalmente por el Dr. Cascante.
          </p>
        </Reveal>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {SERVICES.map((s, i) => (
          <Card key={s.id} s={s} i={i} />
        ))}
      </div>
    </div>
  </section>
);
