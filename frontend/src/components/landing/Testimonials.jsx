import { Quote } from "lucide-react";
import { Reveal } from "@/components/landing/Reveal";
import { TESTIMONIALS } from "@/data/site";

export const Testimonials = () => (
  <section id="testimonios" className="py-24 lg:py-32 bg-white">
    <div className="max-w-[1360px] mx-auto px-5 lg:px-8">
      <div className="max-w-2xl mb-14">
        <Reveal><p className="text-xs font-semibold uppercase tracking-[0.24em] text-pulse mb-4">Testimonios</p></Reveal>
        <Reveal delay={0.05}>
          <h2 className="font-display font-extrabold tracking-tight text-3xl lg:text-4xl text-navy-950">
            El mejor testimonio es un corazón sano
          </h2>
        </Reveal>
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        {TESTIMONIALS.map((t, i) => (
          <Reveal key={t.name} delay={i * 0.08}>
            <div className="h-full rounded-2xl border border-navy-950/10 bg-slate-50 p-7 hover:shadow-lg transition-shadow">
              <Quote className="text-pulse mb-4" size={26} />
              <p className="text-navy-950/75 leading-relaxed mb-6">"{t.text}"</p>
              <div className="flex items-center gap-3 pt-4 border-t border-navy-950/10">
                <div className="w-10 h-10 rounded-full bg-navy-900 text-white flex items-center justify-center font-display font-bold text-sm">
                  {t.name.split(" ").map((w) => w[0]).slice(0,2).join("")}
                </div>
                <div>
                  <p className="font-display font-bold text-navy-950 text-sm">{t.name}</p>
                  <p className="text-xs text-navy-950/50">{t.age}</p>
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);
