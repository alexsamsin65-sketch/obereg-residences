"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Регистрация GSAP-плагинов.
 * Вызывается один раз на клиенте (в SmoothScroll provider либо при первом использовании).
 * Повторная регистрация безопасна — gsap internally дедуплит.
 */
let registered = false;

export function registerGsap() {
  if (registered || typeof window === "undefined") return;
  gsap.registerPlugin(ScrollTrigger);
  registered = true;
}

export { gsap, ScrollTrigger };
