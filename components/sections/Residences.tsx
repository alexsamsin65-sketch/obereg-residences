"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, registerGsap } from "@/lib/gsap";
import Reveal, { RevealLine } from "@/components/ui/Reveal";
import { RESIDENCES } from "@/lib/constants";

/**
 * S4 — Резиденции / Планировки.
 *
 * Горизонтальный скролл-галерея (GSAP horizontal scroll внутри pinned-секции).
 * Карточки планировок: площадь, спальни, вид. При hover — подсветка плана.
 */
export default function Residences() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      // На reduced-motion — горизонтальный скролл нативный
      track.style.overflowX = "auto";
      return;
    }

    registerGsap();
    const ctx = gsap.context(() => {
      // Пин секцию и двигаем трек по горизонтали
      const totalScroll = track.scrollWidth - window.innerWidth;
      gsap.to(track, {
        x: -totalScroll,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${totalScroll}`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-bone text-ink"
      aria-label="Резиденции"
    >
      <div className="absolute inset-x-0 top-0 z-10 flex items-start bg-gradient-to-b from-bone via-bone/90 to-transparent pb-20 pt-section-pad">
        <div className="container-luxe">
          <Reveal>
            <span data-reveal-line className="eyebrow mb-4 block text-ink/50">
              Резиденции
            </span>
          </Reveal>
          <Reveal stagger={0.1}>
            <h2 className="font-display text-4xl leading-[1.02] tracking-tight text-ink md:text-5xl lg:text-6xl">
              <RevealLine>Тринадцать резиденций.</RevealLine>
              <RevealLine>Ни одной лишней.</RevealLine>
            </h2>
          </Reveal>
        </div>
      </div>

      {/* Горизонтальный трек */}
      <div
        ref={trackRef}
        className="flex items-center gap-10 pl-[clamp(1.5rem,7vw,6rem)] pr-[20vw]"
        style={{ height: "100vh" }}
      >
        {RESIDENCES.map((r, i) => (
          <ResidenceCard key={r.id} residence={r} index={i} />
        ))}
      </div>

      <div className="hairline absolute bottom-0 inset-x-0" />
    </section>
  );
}

/* ─── Карточка резиденции ─── */

function ResidenceCard({
  residence: r,
  index,
}: {
  residence: (typeof RESIDENCES)[number];
  index: number;
}) {
  return (
    <div
      className="group relative flex h-[70vh] w-[55vw] flex-shrink-0 flex-col justify-end overflow-hidden rounded-sm border border-line bg-bone-2 md:w-[40vw]"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      {/* Фон-планировка — TODO: заменить на реальный план */}
      <div
        className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-105"
        style={{
          backgroundImage:
            "linear-gradient(180deg, rgba(244,239,230,0.3) 0%, rgba(138,132,122,0.15) 100%)",
          border: "1px solid rgba(184,151,92,0.08)",
        }}
      >
        {/* Имитация плана */}
        <div className="absolute inset-8 grid grid-cols-3 grid-rows-2 gap-1">
          <div className="rounded-sm bg-ink/5" /> {/* гостиная */}
          <div className="rounded-sm bg-ink/3" /> {/* спальня */}
          <div className="rounded-sm bg-ink/5" /> {/* кухня */}
          <div className="col-span-2 rounded-sm bg-ink/3" /> {/* коридор */}
          <div className="rounded-sm bg-ink/5" /> {/* ванная */}
        </div>
      </div>

      {/* Информация — внизу */}
      <div className="relative z-10 p-8">
        <div className="mb-3 flex items-baseline gap-3">
          <span className="eyebrow">{r.code}</span>
          <span className="text-xs text-stone">{r.bedrooms} спал.</span>
        </div>
        <h3 className="font-display mb-2 text-2xl text-ink">{r.name}</h3>
        <p className="mb-4 text-sm leading-relaxed text-stone">{r.detail}</p>

        {/* Метрики */}
        <div className="flex items-baseline gap-6 border-t border-line pt-4">
          <div>
            <span className="tnum font-display text-3xl text-brass">
              {r.area}
            </span>
            <span className="ml-1 text-xs text-stone">м²</span>
          </div>
          <span className="text-xs text-stone">{r.view}</span>
        </div>
      </div>

      {/* Ховер-подсветка */}
      <div className="pointer-events-none absolute inset-0 rounded-sm border-2 border-transparent transition-colors duration-500 group-hover:border-brass/30" />
    </div>
  );
}
