"use client";

import { useRef, useState } from "react";
import Reveal, { RevealLine } from "@/components/ui/Reveal";
import { ARCHITECTURE } from "@/lib/constants";
import { useDeviceCapabilities } from "@/hooks/useMediaQuery";
import dynamic from "next/dynamic";

// 3D-модель для интерактивного вращения — lazy, только клиент
const ArchModelViewer = dynamic(
  () => import("@/components/three/ArchModelViewer"),
  { ssr: false },
);

/**
 * S3 — Архитектура.
 *
 * Тёмная секция (--ink). Интерактивная 3D-модель здания, которую
 * можно вращать drag'ом + хотспоты. Hairline-аннотации в стиле
 * архитектурного чертежа.
 */
export default function Architecture() {
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);
  const capabilities = useDeviceCapabilities();
  const show3D = capabilities.ready && capabilities.canRenderHeavy3D;

  return (
    <section
      className="section-pad relative overflow-hidden bg-ink"
      aria-label="Архитектура"
    >
      <div className="container-luxe">
        {/* Заголовок */}
        <Reveal>
          <span data-reveal-line className="eyebrow mb-4 block">
            {ARCHITECTURE.eyebrow}
          </span>
        </Reveal>
        <Reveal stagger={0.1}>
          <h2 className="font-display mb-6 max-w-2xl text-4xl leading-[1.02] tracking-tight text-bone md:text-5xl lg:text-6xl">
            <RevealLine>{ARCHITECTURE.title}</RevealLine>
          </h2>
        </Reveal>
        <Reveal delay={0.25}>
          <p className="mb-16 max-w-xl text-base leading-relaxed text-stone md:text-lg">
            {ARCHITECTURE.body}
          </p>
        </Reveal>

        {/* 3D-модель с хотспотами */}
        <div className="relative aspect-[16/10] w-full overflow-hidden rounded-sm border border-line">
          {show3D ? (
            <ArchModelViewer />
          ) : (
            /* Статичный fallback для слабых устройств */
            <div
              className="flex h-full w-full items-center justify-center"
              style={{
                background:
                  "radial-gradient(ellipse at center, #1c2722 0%, #0e0d0b 70%)",
              }}
            >
              {/* Силуэт здания */}
              <div
                className="relative"
                style={{
                  width: "20%",
                  height: "70%",
                  background:
                    "linear-gradient(180deg, transparent 0%, #15130f 10%, #0e0d0b 100%)",
                  border: "1px solid rgba(184,151,92,0.15)",
                }}
              />
            </div>
          )}

          {/* Хотспоты поверх 3D */}
          {ARCHITECTURE.hotspots.map((hs) => (
            <Hotspot
              key={hs.id}
              title={hs.title}
              text={hs.text}
              pos={hs.pos}
              active={activeHotspot === hs.id}
              onEnter={() => setActiveHotspot(hs.id)}
              onLeave={() => setActiveHotspot(null)}
            />
          ))}
        </div>
      </div>

      <div className="hairline absolute bottom-0 inset-x-0" />
    </section>
  );
}

/* ─── Хотспот-маркер ─── */

function Hotspot({
  title,
  text,
  pos,
  active,
  onEnter,
  onLeave,
}: {
  title: string;
  text: string;
  pos: { x: number; y: number };
  active: boolean;
  onEnter: () => void;
  onLeave: () => void;
}) {
  return (
    <div
      className="absolute z-10"
      style={{ left: `${pos.x * 100}%`, top: `${pos.y * 100}%` }}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onFocus={onEnter}
      onBlur={onLeave}
      tabIndex={0}
      role="button"
      aria-label={title}
    >
      {/* Маркер — точка + пульсирующее кольцо */}
      <div className="relative -translate-x-1/2 -translate-y-1/2">
        <div className="h-3 w-3 rounded-full bg-brass" />
        <div
          className={`absolute inset-0 h-3 w-3 rounded-full border border-brass transition-transform duration-500 ${
            active ? "scale-[2.5] opacity-30" : "scale-150 opacity-10"
          }`}
        />

        {/* Всплывающая подсказка */}
        <div
          className={`pointer-events-none absolute left-6 top-1/2 -translate-y-1/2 transition-all duration-500 ease-out ${
            active
              ? "translate-x-0 opacity-100"
              : "translate-x-2 opacity-0"
          }`}
        >
          <div className="w-52 rounded-sm border border-line bg-ink p-4">
            <span className="eyebrow mb-2 block">{title}</span>
            <p className="text-sm leading-relaxed text-stone">{text}</p>
          </div>
          {/* Hairline-соединитель */}
          <div className="absolute left-0 top-1/2 h-px w-4 -translate-x-full bg-brass/40" />
        </div>
      </div>
    </div>
  );
}
