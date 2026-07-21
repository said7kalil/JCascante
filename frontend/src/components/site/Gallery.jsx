import { Reveal } from "@/components/site/Reveal";
import { IMAGES } from "@/data/site";

const SHOTS = [
  { src: IMAGES.bpArm, label: "Toma de presión arterial" },
  { src: IMAGES.stethoscope, label: "Auscultación cardíaca" },
  { src: IMAGES.bpSeated, label: "Control de hipertensión" },
];

export const Gallery = () => (
  <section className="py-20 lg:py-28 bg-brand-stone/40">
    <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
      <Reveal>
        <p className="text-xs font-body font-semibold uppercase tracking-[0.28em] text-brand-crimson mb-8">
          En consulta
        </p>
      </Reveal>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {SHOTS.map((s, i) => (
          <Reveal key={i} delay={i * 0.08}>
            <div className="relative rounded-2xl overflow-hidden group">
              <img
                src={s.src}
                alt={s.label}
                className="w-full h-[300px] md:h-[380px] object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-ink/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <p className="absolute bottom-5 left-5 text-brand-bg font-heading text-xl opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500">
                {s.label}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);
