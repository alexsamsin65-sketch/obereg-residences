"use client";

import { useEffect, useRef } from "react";
import { ScrollTrigger } from "@/lib/gsap";

/**
 * useScrollProgress — привязывает прогресс пин-секции (0..1) к ref.
 *
 * ВАЖНО: прогресс хранится в .current ref-объекта (мутабельно),
 * а НЕ в React-state. Так 3D-сцена читает его в useFrame каждый кадр
 * без ре-рендеров компонента → 60fps.
 *
 * Использование (в R3F useFrame):
 *   const progress = useScrollProgress({ pin: containerRef, end: "+=200%" });
 *   useFrame(() => { const p = progress.current; ... })
 *
 * Параметры:
 *  - target: элемент-триггер (по умолчанию — родитель пина)
 *  - start/end: стандартные ScrollTrigger-параметры скролла
 *  - pin: запинить ли секцию (для Hero)
 *  - pinSpacing: фикс-высота пина
 */
export interface ScrollProgressOptions {
  start?: string;
  end?: string;
  pin?: boolean;
  pinSpacing?: boolean;
  onUpdate?: (p: number) => void;
}

export function useScrollProgress(
  triggerRef: React.RefObject<HTMLElement | null>,
  options: ScrollProgressOptions = {},
) {
  const {
    start = "top top",
    end = "+=200%",
    pin = false,
    pinSpacing = false,
    onUpdate,
  } = options;

  // Прогресс — мутабельный ref, читается в useFrame
  const progress = useRef(0);

  useEffect(() => {
    const el = triggerRef.current;
    if (!el) return;

    const st = ScrollTrigger.create({
      trigger: el,
      start,
      end,
      pin: pin || pinSpacing,
      scrub: 1,
      onUpdate: (self) => {
        progress.current = self.progress;
        onUpdate?.(self.progress);
      },
    });

    return () => st.kill();
  }, [triggerRef, start, end, pin, pinSpacing, onUpdate]);

  return progress;
}
