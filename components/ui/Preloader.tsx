"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { SITE } from "@/lib/constants";

/**
 * Preloader — счётчик 0→100 + плавный занавес-reveal первого экрана.
 *
 * Фазы:
 *  1. Счётчик крутится 0→100 (симуляция прогресса, ~2s).
 *  2. По достижении 100 — занавес (две панели) расходится вверх/вниз,
 *     открывая сайт.
 *  3. Блокирует скролл во время показа.
 *
 * При prefers-reduced-motion — мгновенно скрывается.
 */
export default function Preloader() {
  const rootRef = useRef<HTMLDivElement>(null);
  const panelTopRef = useRef<HTMLDivElement>(null);
  const panelBottomRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reduced) {
      setDone(true);
      return;
    }

    // Блокируем скролл на время прелоада
    document.documentElement.style.overflow = "hidden";

    const counter = { val: 0 };
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          document.documentElement.style.overflow = "";
          setDone(true);
        },
      });

      // 1. Счётчик 0 → 100
      tl.to(counter, {
        val: 100,
        duration: 2,
        ease: "power2.inOut",
        onUpdate: () => {
          if (counterRef.current) {
            counterRef.current.textContent = String(
              Math.floor(counter.val),
            ).padStart(2, "0");
          }
        },
      });

      // 2. Логотип-подпись появляется
      tl.from(
        rootRef.current!.querySelectorAll("[data-preload-fade]"),
        {
          opacity: 0,
          y: 14,
          duration: 0.8,
          stagger: 0.1,
          ease: "expo.out",
        },
        "<0.3",
      );

      // 3. Занавес расходится
      tl.to(
        panelTopRef.current,
        { yPercent: -100, duration: 1.1, ease: "expo.inOut" },
        "+=0.3",
      );
      tl.to(
        panelBottomRef.current,
        { yPercent: 100, duration: 1.1, ease: "expo.inOut" },
        "<",
      );

      // 4. Контент прелоадера уходит
      tl.to(
        rootRef.current!.querySelectorAll("[data-preload-content]"),
        { opacity: 0, duration: 0.4 },
        "<0.2",
      );
    }, rootRef);

    return () => {
      ctx.revert();
      document.documentElement.style.overflow = "";
    };
  }, []);

  if (done) return null;

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[10000] overflow-hidden"
      aria-hidden
    >
      {/* Верхняя панель занавеса */}
      <div
        ref={panelTopRef}
        className="absolute inset-x-0 top-0 h-1/2 bg-ink"
      />
      {/* Нижняя панель занавеса */}
      <div
        ref={panelBottomRef}
        className="absolute inset-x-0 bottom-0 h-1/2 bg-ink"
      />

      {/* Контент по центру */}
      <div
        data-preload-content
        className="relative z-10 flex h-full flex-col items-center justify-center gap-6"
      >
        <span
          data-preload-fade
          className="eyebrow"
        >
          {SITE.name}
        </span>

        <div className="flex items-baseline gap-3" data-preload-fade>
          <span
            ref={counterRef}
            className="font-display text-7xl text-bone tnum md:text-8xl"
          >
            00
          </span>
        </div>

        {/* Тонкая полоса прогресса */}
        <div
          data-preload-fade
          className="h-px w-40 overflow-hidden bg-line"
        >
          <div
            id="preload-bar"
            className="h-full w-full origin-left scale-x-0 bg-brass"
            style={{ transformOrigin: "left" }}
          />
        </div>
      </div>
    </div>
  );
}
