"use client";

import dynamic from "next/dynamic";
import { useRef } from "react";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import { useDeviceCapabilities } from "@/hooks/useMediaQuery";
import { useReveal } from "@/hooks/useReveal";
import { HERO } from "@/lib/constants";

// 3D-сцена — только клиентская (R3F), lazy-loaded
const BuildingScene = dynamic(
  () => import("@/components/three/BuildingScene"),
  { ssr: false },
);

/**
 * Hero (S1) — «Дом рождается из фундамента».
 *
 * Пин-секция (~200vh). По мере скролла башня собирается снизу вверх:
 * фундамент → каркас этажей → фасад → готовый дом с подсветкой окон.
 *
 * Поверх 3D — заголовок ЖК с line-by-line reveal и надзаголовок-лейбл.
 *
 * Fallback: на мобильных/слабых устройствах и при отсутствии WebGL —
 * статичный кинематографичный постер (CSS-градиент + силуэт).
 */
export default function Hero() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const capabilities = useDeviceCapabilities();

  // Прогресс стройки — мутабельный ref (без ре-рендеров, для 60fps в useFrame)
  const progress = useScrollProgress(sectionRef, {
    start: "top top",
    end: "+=200%",
    pin: true,
    pinSpacing: true,
  });

  const textRef = useReveal<HTMLDivElement>({ stagger: 0.12, start: "top 70%" });

  const show3D = capabilities.ready && capabilities.canRenderHeavy3D;

  return (
    <section
      ref={sectionRef}
      className="relative h-screen w-full overflow-hidden bg-ink"
      aria-label="ОБЕРЁГ — резиденции суперпремиум"
    >
      {/* 3D-сцена ИЛИ статичный fallback-постер */}
      {show3D ? (
        <div className="absolute inset-0">
          <BuildingScene progressRef={progress} heavy={!capabilities.isLowPower} />
        </div>
      ) : (
        <HeroPoster />
      )}

      {/* Градиент-затемнение для читаемости текста */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-ink/30" />

      {/* Текстовый оверлей */}
      <div
        ref={textRef}
        className="pointer-events-none absolute inset-0 flex flex-col justify-end"
      >
        <div className="container-luxe pb-20 md:pb-28">
          <span
            data-reveal-line
            className="eyebrow mb-6 block opacity-0"
          >
            {HERO.eyebrow}
          </span>

          <h1 className="font-display text-bone">
            {HERO.titleLines.map((line, i) => (
              <span key={i} className="block overflow-hidden">
                <span
                  data-reveal-line
                  className="block text-[18vw] leading-[0.92] opacity-0 md:text-[14vw] lg:text-[12rem]"
                >
                  {line}
                </span>
              </span>
            ))}
          </h1>

          <div className="mt-8 max-w-xl overflow-hidden">
            <p
              data-reveal-line
              className="text-base leading-relaxed text-bone/70 opacity-0 md:text-lg"
            >
              {HERO.subtitle}
            </p>
          </div>
        </div>
      </div>

      {/* Индикатор скролла (только десктоп) */}
      <div className="pointer-events-none absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 md:flex">
        <span className="text-[10px] uppercase tracking-[0.3em] text-stone">
          Скролл
        </span>
        <div className="h-12 w-px overflow-hidden bg-line">
          <div
            className="h-1/2 w-full origin-top animate-scroll-hint"
            style={{ backgroundColor: "var(--color-brass)" }}
          />
        </div>
      </div>

      <style jsx>{`
        @keyframes scroll-hint {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(200%); }
        }
        .animate-scroll-hint {
          animation: scroll-hint 2.2s var(--ease-power) infinite;
        }
      `}</style>
    </section>
  );
}

/**
 * HeroPoster — статичный кинематографичный fallback для слабых устройств.
 * CSS-градиент + силуэт здания — без WebGL, без нагрузки.
 */
function HeroPoster() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Закатное небо */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 75%, #3a2a1a 0%, #1a1410 40%, #0e0d0b 80%)",
        }}
      />
      {/* Силуэт башни */}
      <div
        className="absolute left-1/2 top-1/2 h-[60%] w-[22%] max-w-[280px] -translate-x-1/2 -translate-y-1/2"
        style={{
          background:
            "linear-gradient(180deg, transparent 0%, #15130f 15%, #0e0d0b 100%)",
          boxShadow: "0 0 80px 20px rgba(184,151,92,0.08)",
          borderTop: "1px solid rgba(184,151,92,0.3)",
        }}
      >
        {/* Имитация окон */}
        <div className="grid h-full w-full grid-cols-4 gap-1 p-3 opacity-40">
          {Array.from({ length: 32 }).map((_, i) => (
            <div
              key={i}
              style={{
                backgroundColor:
                  Math.random() > 0.5
                    ? "rgba(184,151,92,0.4)"
                    : "transparent",
              }}
            />
          ))}
        </div>
      </div>
      {/* Тёплый блик снизу */}
      <div
        className="absolute inset-x-0 bottom-0 h-1/3"
        style={{
          background:
            "linear-gradient(to top, rgba(255,217,160,0.12), transparent)",
        }}
      />
    </div>
  );
}
