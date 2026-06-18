"use client";

import { useEffect, useRef } from "react";
import { gsap, registerGsap } from "@/lib/gsap";
import Reveal, { RevealLine } from "@/components/ui/Reveal";
import { LOCATION } from "@/lib/constants";

/**
 * S6 — Локация.
 *
 * Стилизованная тёмная SVG-карта района (не дефолтный Google Maps).
 * Анимированные точки интереса появляются со stagger.
 * Линии-связи рисуются (stroke-dashoffset анимация).
 * Подчёркивает престиж адреса.
 */
export default function Location() {
  const mapRef = useRef<HTMLDivElement>(null);
  const pointsRef = useRef<(SVGGElement | null)[]>([]);
  const linesRef = useRef<(SVGLineElement | null)[]>([]);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      // Без анимации — просто показываем
      pointsRef.current.forEach((g) => {
        if (g) g.style.opacity = "1";
      });
      linesRef.current.forEach((l) => {
        if (l) l.style.strokeDashoffset = "0";
      });
      return;
    }

    registerGsap();
    const ctx = gsap.context(() => {
      // Точки появляются со stagger
      const points = pointsRef.current.filter((g): g is SVGGElement => g !== null);
      gsap.fromTo(
        points,
        { opacity: 0, scale: 0 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.6,
          ease: "expo.out",
          stagger: 0.12,
          scrollTrigger: {
            trigger: mapRef.current,
            start: "top 75%",
          },
        },
      );

      // Линии рисуются (stroke-dashoffset → 0)
      const lines = linesRef.current.filter((l): l is SVGLineElement => l !== null);
      lines.forEach((l) => {
        const len = l.getTotalLength();
        l.style.strokeDasharray = String(len);
        l.style.strokeDashoffset = String(len);
      });
      gsap.to(lines, {
        strokeDashoffset: 0,
        duration: 1.2,
        ease: "expo.out",
        stagger: 0.15,
        scrollTrigger: {
          trigger: mapRef.current,
          start: "top 70%",
        },
      });
    }, mapRef);

    return () => ctx.revert();
  }, []);

  // Центр карты — маркер здания
  const cx = 50;
  const cy = 50;

  return (
    <section
      className="section-pad relative overflow-hidden bg-forest text-bone"
      aria-label="Локация"
    >
      <div className="container-luxe">
        <Reveal>
          <span data-reveal-line className="eyebrow mb-4 block">
            {LOCATION.eyebrow}
          </span>
        </Reveal>
        <Reveal stagger={0.1}>
          <h2 className="font-display mb-4 max-w-2xl text-4xl leading-[1.02] tracking-tight text-bone md:text-5xl lg:text-6xl">
            <RevealLine>{LOCATION.title}</RevealLine>
          </h2>
        </Reveal>
        <Reveal delay={0.25}>
          <p className="mb-12 max-w-xl text-base leading-relaxed text-stone md:text-lg">
            {LOCATION.body}
          </p>
        </Reveal>

        {/* SVG-карта */}
        <div ref={mapRef} className="relative aspect-[16/10] w-full overflow-hidden rounded-sm border border-line bg-ink/50">
          <svg
            viewBox="0 0 100 100"
            className="absolute inset-0 h-full w-full"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="xMidYMid meet"
          >
            {/* Сетка улиц — стилизованная */}
            <defs>
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(184,151,92,0.06)" strokeWidth="0.15" />
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#grid)" />

            {/* Улицы — ключевые линии */}
            <line x1="10" y1="45" x2="90" y2="45" stroke="rgba(184,151,92,0.12)" strokeWidth="0.3" />
            <line x1="10" y1="55" x2="90" y2="55" stroke="rgba(184,151,92,0.12)" strokeWidth="0.3" />
            <line x1="45" y1="10" x2="45" y2="90" stroke="rgba(184,151,92,0.12)" strokeWidth="0.3" />
            <line x1="55" y1="10" x2="55" y2="90" stroke="rgba(184,151,92,0.12)" strokeWidth="0.3" />

            {/* Линии-связи от центра к точкам */}
            {LOCATION.points.map((pt, i) => (
              <line
                key={`line-${pt.id}`}
                ref={(el) => { linesRef.current[i] = el; }}
                x1={cx}
                y1={cy}
                x2={pt.pos.x}
                y2={pt.pos.y}
                stroke="rgba(184,151,92,0.25)"
                strokeWidth="0.12"
              />
            ))}

            {/* Центр — маркер ОБЕРЁГ */}
            <g opacity="1">
              <circle cx={cx} cy={cy} r="1.2" fill="#b8975c" />
              <circle cx={cx} cy={cy} r="2" fill="none" stroke="rgba(184,151,92,0.4)" strokeWidth="0.1" />
              <text
                x={cx}
                y={cy - 3}
                textAnchor="middle"
                fill="#b8975c"
                fontSize="1.5"
                fontFamily="var(--font-display)"
                letterSpacing="0.15em"
              >
                ОБЕРЁГ
              </text>
            </g>

            {/* Точки интереса */}
            {LOCATION.points.map((pt, i) => (
              <g
                key={pt.id}
                ref={(el) => { pointsRef.current[i] = el; }}
                opacity="0"
              >
                <circle cx={pt.pos.x} cy={pt.pos.y} r="0.8" fill="rgba(184,151,92,0.6)" />
                <circle cx={pt.pos.x} cy={pt.pos.y} r="1.4" fill="none" stroke="rgba(184,151,92,0.2)" strokeWidth="0.08" />
                <text
                  x={pt.pos.x}
                  y={pt.pos.y + 2.5}
                  textAnchor="middle"
                  fill="rgba(244,239,230,0.7)"
                  fontSize="1"
                  fontFamily="var(--font-sans)"
                >
                  {pt.label}
                </text>
                <text
                  x={pt.pos.x}
                  y={pt.pos.y + 3.8}
                  textAnchor="middle"
                  fill="rgba(184,151,92,0.8)"
                  fontSize="0.8"
                  fontFamily="var(--font-sans)"
                >
                  {pt.time}
                </text>
              </g>
            ))}
          </svg>
        </div>
      </div>

      <div className="hairline absolute bottom-0 inset-x-0" />
    </section>
  );
}
