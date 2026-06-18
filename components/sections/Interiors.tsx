"use client";

import { useRef, useEffect, useState } from "react";
import { gsap, registerGsap } from "@/lib/gsap";
import { useImageReveal, ScrollTrigger } from "@/hooks/useReveal";
import Reveal, { RevealLine } from "@/components/ui/Reveal";
import { INTERIORS } from "@/lib/constants";

/**
 * S5 — Интерьеры / Лайфстайл.
 *
 * Полноэкранная галерея с image reveal (clip-path),
 * плавная смена кадров. Текст-оверлеи с описанием материалов.
 * Ken Burns эффект (медленный zoom фото).
 */
export default function Interiors() {
  return (
    <section
      className="relative bg-ink text-bone"
      aria-label="Интерьеры и материалы"
    >
      <div className="section-pad">
        <div className="container-luxe mb-16">
          <Reveal>
            <span data-reveal-line className="eyebrow mb-4 block">
              Интерьеры
            </span>
          </Reveal>
          <Reveal stagger={0.1}>
            <h2 className="font-display text-4xl leading-[1.02] tracking-tight text-bone md:text-5xl lg:text-6xl">
              <RevealLine>Материалы,</RevealLine>
              <RevealLine>которых не нужно касаться,</RevealLine>
              <RevealLine>чтобы понять.</RevealLine>
            </h2>
          </Reveal>
        </div>

        {/* Слайд-шоу */}
        <div className="container-luxe">
          <InteriorSlideshow />
        </div>
      </div>

      <div className="hairline absolute bottom-0 inset-x-0" />
    </section>
  );
}

/* ─── Слайд-шоу с clip-path reveal ─── */

function InteriorSlideshow() {
  const [activeIndex, setActiveIndex] = useState(0);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Автоматическая смена слайдов каждые 5s
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % INTERIORS.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Анимация входа нового слайда (clip-path reveal)
  useEffect(() => {
    const el = slideRefs.current[activeIndex];
    if (!el) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    registerGsap();
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      tl.fromTo(
        el,
        { clipPath: "inset(100% 0 0 0)" },
        { clipPath: "inset(0% 0 0 0)", duration: 1.3, ease: "expo.out" },
      );
    }, el);

    return () => ctx.revert();
  }, [activeIndex]);

  return (
    <div className="relative aspect-[16/9] w-full overflow-hidden">
      {/* Слайды */}
      {INTERIORS.map((item, i) => (
        <div
          key={item.id}
          ref={(el) => { slideRefs.current[i] = el; }}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            i === activeIndex ? "z-10" : "z-0 opacity-0"
          }`}
          style={{
            clipPath: i === activeIndex ? "inset(0% 0 0 0)" : "inset(100% 0 0 0)",
          }}
        >
          {/* TODO: заменить на реальные фото интерьеров */}
          <div
            className="ken-burns absolute inset-0"
            style={{
              background: i === 0
                ? "linear-gradient(135deg, #e8e1d3 0%, #c9ae80 50%, #8a847a 100%)"
                : i === 1
                  ? "linear-gradient(135deg, #4a3f2f 0%, #8a7a5a 50%, #c9ae80 100%)"
                  : "linear-gradient(135deg, #b8975c 0%, #8a7a5a 50%, #4a3f2f 100%)",
            }}
          />
        </div>
      ))}

      {/* Текст-оверлей */}
      <div className="absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-ink/90 via-ink/50 to-transparent p-8 pt-24 md:p-12 md:pt-32">
        <div className="max-w-md">
          {INTERIORS.map((item, i) => (
            <div
              key={item.id}
              className={`transition-all duration-700 ${
                i === activeIndex
                  ? "translate-y-0 opacity-100"
                  : "translate-y-4 opacity-0"
              }`}
              style={{ position: i === activeIndex ? "relative" : "absolute" }}
            >
              <span className="eyebrow mb-2 block">{item.material}</span>
              <p className="text-sm leading-relaxed text-bone/70 md:text-base">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Навигация — точки */}
      <div className="absolute bottom-4 right-8 z-20 flex gap-2 md:bottom-6 md:right-12">
        {INTERIORS.map((item, i) => (
          <button
            key={item.id}
            onClick={() => setActiveIndex(i)}
            className={`h-1 rounded-full transition-all duration-500 ${
              i === activeIndex
                ? "w-8 bg-brass"
                : "w-4 bg-bone/20 hover:bg-bone/40"
            }`}
            aria-label={`Слайд ${i + 1}: ${item.material}`}
          />
        ))}
      </div>

      {/* Ken Burns CSS */}
      <style jsx>{`
        .ken-burns {
          animation: ken-burns 12s ease-in-out infinite alternate;
        }
        @keyframes ken-burns {
          from { transform: scale(1) translate(0, 0); }
          to { transform: scale(1.08) translate(-0.5%, -0.5%); }
        }
      `}</style>
    </div>
  );
}
