"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import Reveal, { RevealLine } from "@/components/ui/Reveal";
import { INVESTMENT } from "@/lib/constants";

/**
 * S8 — Инвестиционная привлекательность.
 *
 * Анимированные счётчики (GSAP) — числа «накручиваются» при появлении.
 * Минималистичный SVG-график. Сдержанно, по-банковски солидно.
 */
export default function Investment() {
  const countersRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const counters = countersRef.current?.querySelectorAll("[data-counter]");
    if (!counters?.length) return;

    const ctx = gsap.context(() => {
      counters.forEach((el) => {
        const target = parseFloat(el.getAttribute("data-counter") ?? "0");
        const obj = { val: 0 };

        gsap.to(obj, {
          val: target,
          duration: 2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
          },
          onUpdate: () => {
            const span = el.querySelector("span");
            if (span) span.textContent = String(Math.floor(obj.val));
          },
        });
      });
    }, countersRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="section-pad relative bg-ink text-bone" aria-label="Инвестиции">
      <div className="container-luxe">
        <Reveal>
          <span data-reveal-line className="eyebrow mb-4 block">
            {INVESTMENT.eyebrow}
          </span>
        </Reveal>
        <Reveal stagger={0.1}>
          <h2 className="font-display mb-6 max-w-2xl text-4xl leading-[1.02] tracking-tight text-bone md:text-5xl lg:text-6xl">
            <RevealLine>{INVESTMENT.title}</RevealLine>
          </h2>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="mb-16 max-w-xl text-base leading-relaxed text-stone md:text-lg">
            {INVESTMENT.body}
          </p>
        </Reveal>

        {/* Счётчики */}
        <div ref={countersRef} className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {INVESTMENT.stats.map((s, i) => (
            <div
              key={s.id}
              data-counter={s.value}
              className="border-t border-line pt-8"
            >
              <div className="flex items-baseline gap-2">
                <span className="tnum font-display text-5xl text-brass md:text-6xl">
                  {s.value}
                </span>
                {s.suffix && (
                  <span className="font-display text-2xl text-brass/70">
                    {s.suffix}
                  </span>
                )}
              </div>
              <p className="mt-3 text-sm leading-relaxed text-stone">{s.label}</p>
            </div>
          ))}
        </div>

        {/* SVG-график — рост стоимости м² (5 лет) */}
        <div className="mt-20">
          <Reveal>
            <span data-reveal-line className="eyebrow mb-8 block">
              Динамика стоимости, 2019 — 2024
            </span>
          </Reveal>
          <InvestmentChart />
        </div>
      </div>

      <div className="hairline absolute bottom-0 inset-x-0" />
    </section>
  );
}

/* ─── Минималистичный SVG-график ─── */

function InvestmentChart() {
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const path = pathRef.current;
    if (!path) return;

    const len = path.getTotalLength();
    path.style.strokeDasharray = String(len);
    path.style.strokeDashoffset = String(len);

    const ctx = gsap.context(() => {
      gsap.to(path, {
        strokeDashoffset: 0,
        duration: 2,
        ease: "expo.out",
        scrollTrigger: {
          trigger: svgRef.current,
          start: "top 85%",
        },
      });
    }, svgRef);

    return () => ctx.revert();
  }, []);

  // Данные (произвольные, плейсхолдеры) — рост 100 → 147 за 5 лет
  const data = [100, 108, 115, 125, 138, 147];
  const w = 100;
  const h = 30;
  const step = w / (data.length - 1);
  const minVal = 80;
  const maxVal = 160;

  const points = data.map((v, i) => ({
    x: i * step,
    y: h - ((v - minVal) / (maxVal - minVal)) * h,
  }));

  const linePath = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
    .join(" ");

  // Заливка под линией
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${h} L 0 ${h} Z`;

  const years = ["2019", "2020", "2021", "2022", "2023", "2024"];

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${w} ${h + 8}`}
      className="w-full"
      preserveAspectRatio="xMidYMid meet"
    >
      {/* Градиент заливки */}
      <defs>
        <linearGradient id="chart-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(184,151,92,0.15)" />
          <stop offset="100%" stopColor="rgba(184,151,92,0)" />
        </linearGradient>
      </defs>

      {/* Заливка */}
      <path d={areaPath} fill="url(#chart-fill)" />

      {/* Линия */}
      <path
        ref={pathRef}
        d={linePath}
        fill="none"
        stroke="#b8975c"
        strokeWidth="0.25"
      />

      {/* Точки */}
      {points.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r="0.5" fill="#b8975c" />
          <text
            x={p.x}
            y={h + 6}
            textAnchor="middle"
            fill="rgba(138,132,122,0.6)"
            fontSize="2"
          >
            {years[i]}
          </text>
        </g>
      ))}

      {/* Значения над точками (первая и последняя) */}
      <text x={points[0].x} y={points[0].y - 1.5} textAnchor="middle" fill="#b8975c" fontSize="2">
        {data[0]}
      </text>
      <text x={points[points.length - 1].x} y={points[points.length - 1].y - 1.5} textAnchor="middle" fill="#b8975c" fontSize="2">
        {data[data.length - 1]}
      </text>
    </svg>
  );
}
