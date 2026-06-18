"use client";

import { ReactNode } from "react";
import { useReveal } from "@/hooks/useReveal";

/**
 * Reveal — обёртка для построчного reveal-эффекта.
 * Дочерние элементы с [data-reveal-line] анимируются построчно
 * (clip-path маска + yPercent + expo.out + stagger).
 *
 * Использование:
 *   <Reveal>
 *     <h1>
 *       <span data-reveal-line>Первая строка</span>
 *       <span data-reveal-line>Вторая строка</span>
 *     </h1>
 *   </Reveal>
 *
 * Каждая строка должна быть блочным элементом с overflow:hidden-обёрткой.
 * Для удобства используйте <RevealLine> — она сама делает обёртку.
 */
export default function Reveal({
  children,
  stagger = 0.08,
  delay = 0,
  start = "top 80%",
  className = "",
}: {
  children: ReactNode;
  stagger?: number;
  delay?: number;
  start?: string;
  className?: string;
}) {
  const ref = useReveal<HTMLDivElement>({ stagger, delay, start });
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

/**
 * RevealLine — одна строка текста с overflow-hidden обёрткой,
 * готовая к построчному reveal. Внутрь кладётся span[data-reveal-line].
 */
export function RevealLine({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span className="block overflow-hidden">
      <span data-reveal-line className={`block ${className}`}>
        {children}
      </span>
    </span>
  );
}
