"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Регистрация GSAP-плагинов.
 * Идемпотентна: повторные вызовы безопасны (GSAP дедуплит внутренне).
 * Регистрируем при первом импорте модуля на клиенте — гарантирует,
 * что плагин готов ДО любого ScrollTrigger.create() / gsap.context().
 *
 * Ранее была ошибка "_context is not a function": ScrollTrigger
 * использовался до регистрации. Теперь регистрация происходит
 * синхронно при загрузке модуля.
 */
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function registerGsap() {
  if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
  }
}

export { gsap, ScrollTrigger };
