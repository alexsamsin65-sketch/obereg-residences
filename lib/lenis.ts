"use client";

import Lenis from "lenis";
import { gsap, ScrollTrigger, registerGsap } from "./gsap";

/**
 * Инициализация Lenis с синхронизацией с GSAP-тикером и ScrollTrigger.
 * Один общий тикер → скролл, пин и 3D-анимация синхронны, без рассинхрона.
 *
 * Возвращает инстанс Lenis (для dispose при unmount).
 */
export function initLenis(): Lenis {
  registerGsap();

  const lenis = new Lenis({
    duration: 1.2,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // expo.out
    smoothWheel: true,
    touchMultiplier: 1.5,
    wheelMultiplier: 1,
  });

  // Синхронизация: Lenis.raf гоняется gsap-тикером (один rAF на всё)
  const raf = (time: number) => {
    lenis.raf(time * 1000);
  };
  gsap.ticker.add(raf);
  gsap.ticker.lagSmoothing(0);

  // При скролле Lenis — обновляем ScrollTrigger
  lenis.on("scroll", ScrollTrigger.update);

  return lenis;
}
