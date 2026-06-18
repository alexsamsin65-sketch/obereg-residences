"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import Reveal, { RevealLine } from "@/components/ui/Reveal";
import { AMENITIES } from "@/lib/constants";

/**
 * S7 — Инфраструктура / Сервис.
 *
 * Сетка amenities (SPA, консьерж, винный погреб, кинозал, двор, паркинг).
 * Reveal карточек со stagger. Тонкие кастомные SVG-иконки-линии.
 * Hover — раскрытие описания.
 */
export default function Amenities() {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const cards = gridRef.current?.querySelectorAll("[data-amenity]");
    if (!cards?.length) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        cards,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: "expo.out",
          stagger: 0.1,
          scrollTrigger: {
            trigger: gridRef.current,
            start: "top 80%",
          },
        },
      );
    }, gridRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="section-pad relative bg-bone text-ink" aria-label="Инфраструктура">
      <div className="container-luxe">
        <Reveal>
          <span data-reveal-line className="eyebrow mb-4 block text-ink/50">
            Инфраструктура
          </span>
        </Reveal>
        <Reveal stagger={0.1}>
          <h2 className="font-display mb-16 max-w-2xl text-4xl leading-[1.02] tracking-tight text-ink md:text-5xl lg:text-6xl">
            <RevealLine>Сервис,</RevealLine>
            <RevealLine>о котором не нужно просить.</RevealLine>
          </h2>
        </Reveal>

        {/* Сетка amenities */}
        <div ref={gridRef} className="grid grid-cols-1 gap-px bg-line md:grid-cols-2 lg:grid-cols-3">
          {AMENITIES.map((a) => (
            <AmenityCard key={a.id} amenity={a} />
          ))}
        </div>
      </div>

      <div className="hairline absolute bottom-0 inset-x-0" />
    </section>
  );
}

/* ─── Карточка amenity ─── */

function AmenityCard({ amenity: a }: { amenity: (typeof AMENITIES)[number] }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      data-amenity
      className="group relative bg-bone p-8 transition-colors duration-500 hover:bg-bone-2"
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      {/* Иконка — кастомная SVG-линия */}
      <div className="mb-6 h-8 w-8 text-brass">
        <AmenityIcon id={a.icon} />
      </div>

      <h3 className="font-display mb-3 text-xl text-ink">{a.title}</h3>

      <div
        className={`overflow-hidden transition-all duration-500 ease-out ${
          expanded ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <p className="text-sm leading-relaxed text-stone">{a.text}</p>
      </div>
    </div>
  );
}

/**
 * AmenityIcon — кастомные SVG-иконки-линии (НЕ emoji).
 * Минималистичные штриховые иконки в стиле архитектурного чертежа.
 */
function AmenityIcon({ id }: { id: string }) {
  const paths: Record<string, React.ReactNode> = {
    spa: (
      <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round">
        {/* Волна воды */}
        <path d="M4 16c2-2 4 2 6 0s4 2 6 0 4 2 6 0 4 2 6 0" />
        <path d="M4 22c2-2 4 2 6 0s4 2 6 0 4 2 6 0 4 2 6 0" />
        {/* Капля */}
        <path d="M16 4c0 0-6 8-6 12a6 6 0 0012 0c0-4-6-12-6-12z" />
      </svg>
    ),
    concierge: (
      <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        {/* Человек с галстуком */}
        <circle cx="16" cy="10" r="5" />
        <path d="M6 28c0-5.5 4.5-10 10-10s10 4.5 10 10" />
        <path d="M15 15l1 6 1-6" />
      </svg>
    ),
    wine: (
      <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        {/* Бутылка */}
        <path d="M12 4h8v8l4 6v8a2 2 0 01-2 2h-12a2 2 0 01-2-2v-8l4-6V4z" />
        <line x1="14" y1="4" x2="18" y2="4" />
        <path d="M14 18h4" />
      </svg>
    ),
    cinema: (
      <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        {/* Экран */}
        <rect x="4" y="6" width="24" height="16" rx="1" />
        <line x1="10" y1="22" x2="10" y2="28" />
        <line x1="22" y1="22" x2="22" y2="28" />
        <line x1="8" y1="28" x2="24" y2="28" />
      </svg>
    ),
    garden: (
      <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        {/* Дерево */}
        <line x1="16" y1="28" x2="16" y2="14" />
        <path d="M16 14c-6 0-8-6-6-10 4 0 6 4 6 10z" />
        <path d="M16 18c6 0 8-6 6-10-4 0-6 4-6 10z" />
        <path d="M16 22c-5 0-7-5-5-8 3 0 5 3 5 8z" />
      </svg>
    ),
    parking: (
      <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        {/* Автомобиль (вид сверху) */}
        <rect x="6" y="10" width="20" height="12" rx="4" />
        <line x1="6" y1="16" x2="26" y2="16" />
        <circle cx="10" cy="22" r="1.5" />
        <circle cx="22" cy="22" r="1.5" />
      </svg>
    ),
  };

  return <>{paths[id] ?? <div className="h-full w-full rounded bg-brass/10" />}</>;
}
