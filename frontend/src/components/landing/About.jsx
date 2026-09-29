import { CheckCircle2 } from "lucide-react";
import { Reveal } from "@/components/landing/Reveal";
import { IMAGES } from "@/data/site";

const POINTS = [
  "Enfoque preventivo y personalizado para cada paciente",
  "Interpretación directa de cada estudio, sin intermediarios",
  "Trato humano, claro y cercano en cada consulta",
];

export const About = () => (
  <section id="sobre-mi" className="py-24 lg:py-32 bg-slate-50">
    <div className="max-w-[1360px] mx-auto px-5 lg:px-8 grid lg:grid-cols-12 gap-12 items-center">
      <Reveal className="lg:col-span-5">
        <div className="relative rounded-[2rem] overflow-hidden">
          <img src={IMAGES.suit} alt="Dr. Julio Cascante" className="w-full h-[460px] lg:h-[560px] object-cover object-top" />
          <div className="absolute bottom-5 left-5 right-5 rounded-2xl bg-navy-950/85 backdrop-blur px-6 py-4">
            <p className="font-display font-bold text-white text-lg leading-none">Dr. Julio Cascante</p>
            <p className="text-xs text-cyan mt-1">Médico Cardiólogo · Ecuador / Argentina</p>
          </div>
        </div>
      </Reveal>
      <div className="lg:col-span-6 lg:col-start-7">
        <Reveal><p className="text-xs font-semibold uppercase tracking-[0.24em] text-pulse mb-5">Sobre mí</p></Reveal>
        <Reveal delay={0.05}>
          <h2 className="font-display font-extrabold tracking-tight text-3xl lg:text-4xl text-navy-950 leading-tight">
            Cuidado del corazón, con nombre y rostro
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-6 text-navy-950/65 leading-relaxed text-lg max-w-xl">
            Soy el Dr. Julio Cascante, cardiólogo dedicado a la prevención y al diagnóstico temprano.
            Creo en una medicina cercana: explicar cada resultado, entender tu historia y construir contigo
            un plan para mantener tu corazón fuerte durante años.
          </p>
        </Reveal>
        <div className="mt-8 space-y-4">
          {POINTS.map((p, i) => (
            <Reveal key={p} delay={0.12 + i * 0.07}>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="text-pulse shrink-0 mt-0.5" size={21} />
                <span className="text-navy-950/85">{p}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  </section>
);
