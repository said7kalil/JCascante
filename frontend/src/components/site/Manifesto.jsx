import { motion } from "framer-motion";
import { Reveal } from "@/components/site/Reveal";
import { IMAGES } from "@/data/site";

const CHAPTERS = [
  {
    n: "01",
    title: "Escuchar antes que reaccionar",
    body: "La mayoría de los eventos cardíacos se anuncian mucho antes de ocurrir. La prevención comienza con una valoración a tiempo, no en la sala de urgencias.",
  },
  {
    n: "02",
    title: "Medir con precisión",
    body: "Electrocardiograma, ecocardiograma, ergometría y Holter nos dan una imagen completa y objetiva de la salud de tu corazón, sin suposiciones.",
  },
  {
    n: "03",
    title: "Acompañar en el tiempo",
    body: "Cuidar el corazón es un hábito, no un evento. El seguimiento continuo del ritmo y la presión arterial mantiene el riesgo bajo control año tras año.",
  },
];

export const Manifesto = () => (
  <section id="prevencion" className="py-24 lg:py-36">
    <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
      <div className="grid lg:grid-cols-12 gap-12 lg:gap-16">
        <div className="lg:col-span-5">
          <Reveal>
            <p className="text-xs font-body font-semibold uppercase tracking-[0.28em] text-brand-crimson mb-6">
              Filosofía de prevención
            </p>
            <h2 className="font-heading font-light tracking-tight leading-[1.02] text-4xl sm:text-5xl md:text-6xl text-brand-ink">
              El mejor tratamiento es el que <span className="italic text-brand-crimson">nunca</span> necesitarás.
            </h2>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="mt-10 relative rounded-3xl overflow-hidden">
              <img
                src={IMAGES.bpSeated}
                alt="Dr. Cascante midiendo la presión arterial de una paciente"
                className="w-full h-[360px] object-cover"
                style={{ filter: "sepia(0.12) saturate(0.95)" }}
              />
              <div className="absolute inset-0 ring-1 ring-inset ring-brand-ink/10 rounded-3xl" />
            </div>
          </Reveal>
        </div>

        <div className="lg:col-span-6 lg:col-start-7 flex flex-col justify-center">
          {CHAPTERS.map((c, i) => (
            <Reveal key={c.n} delay={i * 0.1}>
              <div className="py-8 border-b border-brand-border last:border-0 group">
                <div className="flex items-start gap-6">
                  <span className="font-heading text-3xl md:text-4xl text-brand-crimson/40 group-hover:text-brand-crimson transition-colors duration-500 leading-none pt-1">
                    {c.n}
                  </span>
                  <div>
                    <h3 className="font-heading text-2xl md:text-3xl text-brand-ink mb-3">{c.title}</h3>
                    <p className="font-light text-brand-muted leading-relaxed max-w-md">{c.body}</p>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  </section>
);
