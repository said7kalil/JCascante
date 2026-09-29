import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ArrowRight } from "lucide-react";
import { LineReveal } from "@/components/landing/Reveal";
import { IMAGES, WHATSAPP_URL } from "@/data/site";

export const Hero = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 110]);

  return (
    <section id="inicio" ref={ref} className="relative bg-navy-950 pt-28 pb-20 lg:pt-36 lg:pb-28 overflow-hidden">
      <div className="absolute inset-0 glow-radial opacity-70" />
      <div className="absolute -left-40 top-1/4 w-[520px] h-[520px] rounded-full bg-pulse/10 blur-[120px]" />
      <div className="max-w-[1360px] mx-auto px-5 lg:px-8 grid lg:grid-cols-2 gap-12 items-center relative">
        <div>
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
                      className="inline-flex items-center gap-2 rounded-full bg-pulse/15 border border-pulse/30 px-4 py-1.5 mb-7">
            <span className="w-2 h-2 rounded-full bg-pulse animate-pulse" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-pulse">Cuidado cardíaco preventivo</span>
          </motion.div>

          <h1 className="font-display font-extrabold text-white tracking-tight leading-[0.98] text-4xl sm:text-5xl lg:text-6xl">
            <LineReveal lines={["Tu corazón", "merece cuidado"]} />
            <span className="reveal-mask">
              <motion.span className="block" initial={{ y: "110%" }} animate={{ y: 0 }} transition={{ duration: 0.85, delay: 0.54, ease: [0.22,1,0.36,1] }}>
                <span className="text-pulse">antes</span> del síntoma
              </motion.span>
            </span>
          </h1>

          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}
                    className="mt-7 max-w-lg text-white/70 text-base lg:text-lg leading-relaxed">
            Cardiología centrada en la prevención. Diagnóstico preciso, tecnología de alta resolución
            y un trato humano para proteger lo que más importa.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.05 }} className="mt-9 flex flex-wrap gap-3">
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" data-testid="hero-agendar"
               className="group inline-flex items-center gap-3 bg-greenok text-white rounded-full pl-6 pr-4 py-3.5 font-semibold hover:brightness-110 transition">
              Agendar cita
              <span className="bg-white/20 rounded-full p-1.5 group-hover:translate-x-0.5 transition-transform"><ArrowRight size={16} /></span>
            </a>
            <a href="#servicios" className="inline-flex items-center rounded-full border border-white/20 text-white px-6 py-3.5 font-semibold hover:bg-white/10 transition">
              Ver servicios
            </a>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3 }} className="mt-12 flex gap-10">
            {[["+15","años de experiencia"],["6","estudios cardíacos"],["100%","enfoque preventivo"]].map(([n,l]) => (
              <div key={l}>
                <div className="font-display font-extrabold text-3xl text-white">{n}</div>
                <div className="text-xs text-white/55 mt-1 max-w-[92px] leading-tight">{l}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Portrait (image already includes rings + icons) */}
        <motion.div style={{ y }} className="relative flex justify-center items-center min-h-[420px] lg:min-h-[600px]">
          <div className="absolute w-[78%] h-[78%] rounded-full bg-cyan/10 blur-[120px]" />
          <motion.img src={IMAGES.portrait} alt="Dr. Julio Cascante"
                      data-testid="hero-portrait"
                      initial={{ opacity: 0, scale: 1.04 }} animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 1.1, delay: 0.3, ease: [0.22,1,0.36,1] }}
                      className="relative z-10 w-full max-w-[560px] object-contain drop-shadow-2xl animate-floaty" />
        </motion.div>
      </div>
    </section>
  );
};
