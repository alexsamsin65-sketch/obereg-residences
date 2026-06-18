"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";

/**
 * Cursor — кастомный курсор: точка + расширяющееся кольцо.
 * - Точка мгновенно следует за мышью.
 * - Кольцо догоняет с инерцией (lerp через gsap.quickTo).
 * - На элементах [data-cursor] / интерактивных — кольцо расширяется и меняет вид.
 * - Скрывается на сенсорных устройствах.
 */
export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    // Только точные указатели (десктоп с мышью)
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!fine) return;
    setEnabled(true);

    const dot = dotRef.current!;
    const ring = ringRef.current!;

    // Мгновенный dot
    const dotX = gsap.quickTo(dot, "x", { duration: 0.15, ease: "power3.out" });
    const dotY = gsap.quickTo(dot, "y", { duration: 0.15, ease: "power3.out" });
    // Инерционное ring
    const ringX = gsap.quickTo(ring, "x", { duration: 0.5, ease: "power3.out" });
    const ringY = gsap.quickTo(ring, "y", { duration: 0.5, ease: "power3.out" });

    const onMove = (e: MouseEvent) => {
      dotX(e.clientX);
      dotY(e.clientY);
      ringX(e.clientX);
      ringY(e.clientY);
    };

    const setHover = (active: boolean) => {
      gsap.to(ring, {
        scale: active ? 2.4 : 1,
        borderColor: active ? "rgba(184,151,92,0.9)" : "rgba(184,151,92,0.4)",
        duration: 0.4,
        ease: "expo.out",
      });
      gsap.to(dot, {
        scale: active ? 0 : 1,
        duration: 0.3,
        ease: "expo.out",
      });
    };

    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.closest("a, button, [data-cursor], input, textarea, select, label")
      ) {
        setHover(true);
      }
    };
    const onOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.closest("a, button, [data-cursor], input, textarea, select, label")
      ) {
        setHover(false);
      }
    };

    const onDown = () => gsap.to(ring, { scale: 0.8, duration: 0.2 });
    const onUp = () => gsap.to(ring, { scale: 1, duration: 0.3 });

    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseout", onOut);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
    };
  }, []);

  if (!enabled) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[9999]"
      style={{ mixBlendMode: "difference" }}
    >
      {/* Точка */}
      <div
        ref={dotRef}
        className="absolute left-0 top-0 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-bone"
      />
      {/* Кольцо */}
      <div
        ref={ringRef}
        className="absolute left-0 top-0 h-9 w-9 -translate-x-1/2 -translate-y-1/2 rounded-full border"
        style={{ borderColor: "rgba(184,151,92,0.4)" }}
      />
    </div>
  );
}
