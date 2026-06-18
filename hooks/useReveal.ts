"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

/**
 * useReveal — построчный reveal контента по ScrollTrigger.
 * Находит дочерние элементы [data-reveal-line] и анимирует их появление
 * через clip-path маску с экспоненциальным ease и stagger.
 *
 * Использование:
 *   <div ref={ref}>
 *     <span data-reveal-line>Строка 1</span>
 *     <span data-reveal-line>Строка 2</span>
 *   </div>
 *
 * На prefers-reduced-motion элементы просто появляются (без анимации).
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>(
  options: { stagger?: number; delay?: number; start?: string } = {},
) {
  const { stagger = 0.08, delay = 0, start = "top 80%" } = options;
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const lines = el.querySelectorAll<HTMLElement>("[data-reveal-line]");

    if (reduced || lines.length === 0) {
      // Нет анимации — просто показываем
      lines.forEach((l) => {
        l.style.opacity = "1";
        l.style.transform = "none";
      });
      return;
    }

    // Начальное состояние — скрыто под маской
    gsap.set(lines, {
      yPercent: 110,
      opacity: 0,
    });

    const ctx = gsap.context(() => {
      gsap.to(lines, {
        yPercent: 0,
        opacity: 1,
        duration: 1.1,
        ease: "expo.out",
        stagger,
        delay,
        scrollTrigger: {
          trigger: el,
          start,
        },
      });
    }, el);

    return () => ctx.revert();
  }, [stagger, delay, start]);

  return ref;
}

/**
 * useImageReveal — раскрытие изображения через clip-path + scale.
 * Применяется к <img> или контейнеру. Запускается по ScrollTrigger.
 */
export function useImageReveal<T extends HTMLElement = HTMLDivElement>(
  options: { delay?: number; start?: string } = {},
) {
  const { delay = 0, start = "top 85%" } = options;
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const inner = el.querySelector("[data-reveal-img]") as HTMLElement | null;

    gsap.set(el, { clipPath: "inset(100% 0 0 0)" });
    if (inner) gsap.set(inner, { scale: 1.15 });

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: el, start },
      });
      tl.to(el, {
        clipPath: "inset(0% 0 0 0)",
        duration: 1.3,
        ease: "expo.out",
        delay,
      });
      if (inner) {
        tl.to(
          inner,
          { scale: 1, duration: 1.6, ease: "expo.out" },
          "<",
        );
      }
    }, el);

    return () => ctx.revert();
  }, [delay, start]);

  return ref;
}

export { ScrollTrigger };
