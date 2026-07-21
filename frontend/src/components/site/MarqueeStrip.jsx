import Marquee from "react-fast-marquee";

const WORDS = ["Prevención", "Diagnóstico", "Tratamiento", "Cuidado continuo", "Corazón sano"];

export const MarqueeStrip = () => (
  <section className="py-8 md:py-10 bg-brand-ink overflow-hidden" data-testid="marquee-strip">
    <Marquee speed={38} gradient={false} autoFill>
      {WORDS.map((w, i) => (
        <div key={i} className="flex items-center">
          <span className="font-heading italic text-3xl md:text-5xl text-brand-bg px-8">{w}</span>
          <span className="text-brand-crimson text-3xl md:text-5xl">·</span>
        </div>
      ))}
    </Marquee>
  </section>
);
