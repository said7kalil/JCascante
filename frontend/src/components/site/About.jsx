import { Reveal } from "@/components/site/Reveal";
import { CheckCircle2 } from "lucide-react";
import { IMAGES } from "@/data/site";

const POINTS = [
  "Enfoque preventivo y personalizado para cada paciente",
  "Interpretación directa de cada estudio, sin intermediarios",
  "Trato humano, claro y cercano en cada consulta",
];

export const About = () => (
  <section id="sobre-mi" className="py-24 lg:py-36">
    <div className="max-w-[1400px] mx-auto px-6 lg:px-10 grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
      <div className="lg:col-span-5 order-2 lg:order-1">
        <Reveal>
          <div className="relative rounded-3xl overflow-hidden">
            <img
              src={IMAGES.consult}
              alt="Dr. Julio Cascante en consulta con una paciente"
              className="w-full h-[440px] lg:h-[560px] object-cover"
            />
            <div className="absolute inset-0 ring-1 ring-inset ring-brand-ink/10 rounded-3xl" />
            <div className="absolute bottom-5 left-5 right-5 backdrop-blur-md bg-brand-bg/80 rounded-2xl px-6 py-4 flex items-center justify-between">
              <div>
                <p className="font-heading text-xl text-brand-ink leading-none">Dr. Julio Cascante</p>
                <p className="text-xs text-brand-muted mt-1">Médico Cardiólogo</p>
              </div>
              <span className="text-xs uppercase tracking-[0.2em] text-brand-crimson font-semibold">CARDIO</span>
            </div>
          </div>
        </Reveal>
      </div>

      <div className="lg:col-span-6 lg:col-start-7 order-1 lg:order-2">
        <Reveal>
          <p className="text-xs font-body font-semibold uppercase tracking-[0.28em] text-brand-crimson mb-6">
            Sobre mí
          </p>
          <h2 className="font-heading font-light tracking-tight leading-[1.05] text-4xl sm:text-5xl md:text-6xl text-brand-ink">
            Medicina del corazón, con nombre y rostro.
          </h2>
          <p className="mt-8 font-light text-brand-muted leading-relaxed text-lg max-w-xl">
            Soy el Dr. Julio Cascante, cardiólogo dedicado a la prevención y al diagnóstico
            temprano. Creo en una medicina cercana: explicar cada resultado, entender tu
            historia y construir contigo un plan para mantener tu corazón fuerte durante años.
          </p>
        </Reveal>
        <div className="mt-10 space-y-4">
          {POINTS.map((p, i) => (
            <Reveal key={p} delay={i * 0.08}>
              <div className="flex items-start gap-4">
                <CheckCircle2 className="text-brand-crimson shrink-0 mt-0.5" size={22} strokeWidth={1.6} />
                <span className="font-light text-brand-ink">{p}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  </section>
);
