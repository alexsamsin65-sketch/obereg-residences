"use client";

import Reveal, { RevealLine } from "@/components/ui/Reveal";
import { DEVELOPER } from "@/lib/constants";

/**
 * S9 — Застройщик / Доверие.
 *
 * Краткий блок о девелопере, реализованные проекты, награды.
 * Логотипы партнёров/наград — grayscale, при hover проявляются.
 */
export default function Developer() {
  return (
    <section className="section-pad relative bg-bone text-ink" aria-label="Застройщик">
      <div className="container-luxe">
        <div className="grid grid-cols-1 gap-16 md:grid-cols-2">
          {/* Текст */}
          <div>
            <Reveal>
              <span data-reveal-line className="eyebrow mb-4 block text-ink/50">
                {DEVELOPER.eyebrow}
              </span>
            </Reveal>
            <Reveal stagger={0.1}>
              <h2 className="font-display mb-8 text-4xl leading-[1.02] tracking-tight text-ink md:text-5xl lg:text-6xl">
                <RevealLine>{DEVELOPER.title}</RevealLine>
              </h2>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="max-w-lg text-base leading-relaxed text-ink/60 md:text-lg">
                {DEVELOPER.body}
              </p>
            </Reveal>
          </div>

          {/* Награды — grayscale, при hover проявляются */}
          <div>
            <Reveal delay={0.3}>
              <div className="space-y-0 divide-y divide-line">
                {DEVELOPER.awards.map((award, i) => (
                  <div
                    key={i}
                    className="group flex items-center justify-between py-6 transition-colors duration-500 hover:bg-bone-2"
                  >
                    {/* Иконка-награда — CSS-линья */}
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border border-line">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.2"
                        strokeLinecap="round"
                        className="h-5 w-5 text-stone transition-colors duration-500 group-hover:text-brass"
                      >
                        {/* Звезда */}
                        <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 16.8l-6.2 4.5 2.4-7.4L2 9.4h7.6z" />
                      </svg>
                    </div>
                    <span className="text-sm leading-relaxed text-ink/60 transition-colors duration-500 group-hover:text-ink">
                      {award}
                    </span>
                  </div>
                ))}
              </div>
            </Reveal>

            {/* Партнёры — плейсхолдеры-логотипы grayscale */}
            <Reveal delay={0.4}>
              <div className="mt-12">
                <span className="eyebrow mb-6 block text-ink/40">Партнёры</span>
                <div className="flex flex-wrap gap-8">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="group flex h-12 w-24 items-center justify-center rounded-sm border border-line bg-bone-2 transition-all duration-500 hover:border-brass/40"
                    >
                      {/* TODO: заменить на реальные логотипы партнёров */}
                      <span className="text-[10px] font-medium uppercase tracking-[0.15em] text-stone opacity-50 transition-opacity duration-500 group-hover:opacity-100 group-hover:text-brass">
                        Партнёр
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>

      <div className="hairline absolute bottom-0 inset-x-0" />
    </section>
  );
}
