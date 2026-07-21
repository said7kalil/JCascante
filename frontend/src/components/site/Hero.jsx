import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ArrowDownRight } from "lucide-react";
import { IMAGES, WHATSAPP_URL } from "@/data/site";

const lineVariants = {
  hidden: { y: "110%" },
  visible: (i) => ({
    y: 0,
    transition: { duration: 0.9, delay: 0.35 + i * 0.12, ease: [0.22, 1, 0.36, 1] },
  }),
};

const Line = ({ children, i }) => (
  <span className="reveal-mask">
    <motion.span custom={i} variants={lineVariants} initial="hidden" animate="visible" className="block">
      {children}
    </motion.span>
  </span>
);

export const Hero = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);

  return (
    <section id="inicio" ref={ref} className="relative pt-32 pb-16 lg:pt-40 lg:pb-24 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 grid lg:grid-cols-12 gap-10 items-center">
        {/* Left — copy */}
        <div className="lg:col-span-6 relative z-10">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-xs md:text-sm font-body font-semibold uppercase tracking-[0.28em] text-brand-crimson mb-6 flex items-center gap-3"
          >
            <span className="h-px w-10 bg-brand-crimson inline-block" />
            Cuidado cardíaco preventivo
          </motion.p>

          <h1 className="font-heading font-light tracking-tight leading-[0.95] text-brand-ink text-5xl sm:text-6xl md:text-7xl xl:text-[5.4rem]">
            <Line i={0}>Tu corazón</Line>
            <Line i={1}>merece cuidado</Line>
            <Line i={2}>
              <span className="italic text-brand-crimson">antes</span> del síntoma.
            </Line>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="mt-8 max-w-md text-base md:text-lg font-light leading-relaxed text-brand-muted"
          >
            Cardiología centrada en la prevención. Diagnóstico preciso, tecnología de
            alta resolución y un trato humano para proteger lo que más importa.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.15, duration: 0.8 }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              data-testid="hero-cta-primary"
              className="group bg-brand-crimson text-white rounded-full pl-7 pr-5 py-4 font-body font-medium inline-flex items-center gap-3 transition-transform hover:scale-105 active:scale-95"
            >
              Agendar valoración
              <span className="bg-white/15 rounded-full p-1.5 group-hover:rotate-45 transition-transform duration-300">
                <ArrowDownRight size={16} />
              </span>
            </a>
            <a
              href="#servicios"
              data-testid="hero-cta-secondary"
              className="rounded-full border border-brand-ink/20 px-7 py-4 font-body font-medium text-brand-ink hover:bg-brand-ink hover:text-brand-bg transition-colors"
            >
              Ver servicios
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4, duration: 1 }}
            className="mt-14 flex items-center gap-8"
          >
            {[
              ["+15", "años de experiencia"],
              ["6", "estudios cardíacos"],
              ["100%", "enfoque preventivo"],
            ].map(([n, l]) => (
              <div key={l}>
                <p className="font-heading text-3xl md:text-4xl text-brand-ink leading-none">{n}</p>
                <p className="text-xs text-brand-muted mt-1 max-w-[90px] leading-tight">{l}</p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Right — portrait */}
        <div className="lg:col-span-6 relative">
          <motion.div style={{ scale }} className="relative flex justify-center">
            {/* spotlight glow */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-[85%] h-[85%] rounded-full bg-brand-crimson/25 blur-[90px]" />
            </div>
            <div className="absolute bottom-0 w-[92%] aspect-[3/4] rounded-t-[999px] bg-gradient-to-b from-brand-stone to-brand-bg border border-brand-border/70" />
            <motion.img
              style={{ y }}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
              src={IMAGES.portrait}
              alt="Dr. Julio Cascante, cardiólogo"
              data-testid="hero-portrait"
              className="relative z-10 w-[88%] max-w-[520px] object-contain drop-shadow-2xl"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};
