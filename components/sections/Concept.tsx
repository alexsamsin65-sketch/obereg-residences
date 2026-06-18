"use client";

import Reveal, { RevealLine } from "@/components/ui/Reveal";
import { useImageReveal } from "@/hooks/useReveal";
import { CONCEPT } from "@/lib/constants";

/**
 * S2 — Концепция / Философия проекта.
 *
 * Сдержанный текстовый блок на светлом (--bone) фоне.
 * Крупная типографика, manifest-текст. Параллакс: изображение/деталь
 * архитектуры уезжает медленнее текста. Построчный reveal по ScrollTrigger.
 */
export default function Concept() {
  const imageRef = useImageReveal({ delay: 0.15, start: "top 85%" });

  return (
    <section
      className="section-pad relative overflow-hidden bg-bone text-ink"
      aria-label="Философия проекта"
    >
      <div className="container-luxe">
        <div className="grid grid-cols-1 gap-16 md:grid-cols-12 md:gap-8 lg:gap-16">
          {/* Текстовый столбец */}
          <div className="flex flex-col justify-center md:col-span-7">
            <Reveal>
              <span data-reveal-line className="eyebrow mb-8 block text-ink/60">
                {CONCEPT.eyebrow}
              </span>
            </Reveal>

            <Reveal stagger={0.14} className="mb-12">
              <h2 className="font-display text-4xl leading-[1.02] tracking-tight text-ink md:text-5xl lg:text-6xl">
                {CONCEPT.manifest.map((line, i) => (
                  <RevealLine key={i} className="text-ink">
                    {line}
                  </RevealLine>
                ))}
              </h2>
            </Reveal>

            <Reveal delay={0.3}>
              <p className="max-w-lg text-base leading-relaxed text-ink/60 md:text-lg">
                {CONCEPT.body}
              </p>
            </Reveal>
          </div>

          {/* Изображение — параллакс + image reveal */}
          <div className="relative md:col-span-5">
            <div
              ref={imageRef}
              className="aspect-[4/5] overflow-hidden"
            >
              {/* TODO: заменить на реальное фото архитектурной детали */}
              <div
                data-reveal-img
                className="h-full w-full scale-110 bg-stone/20"
                style={{
                  backgroundImage:
                    "linear-gradient(135deg, #e8e1d3 0%, #c9ae80 40%, #8a847a 100%)",
                }}
                role="img"
                aria-label="Архитектурная деталь ОБЕРЁГ"
              />
            </div>
            {/* Тонкая латунная рамка */}
            <div className="pointer-events-none absolute inset-4 border border-brass/20" />
          </div>
        </div>
      </div>

      {/* Разделитель снизу */}
      <div className="hairline absolute bottom-0 inset-x-0" />
    </section>
  );
}
