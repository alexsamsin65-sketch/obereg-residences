"use client";

import { useEffect, useState } from "react";

/**
 * useMediaQuery — реактивный матчер медиа-выражений.
 * Возвращает false на сервере и при первом рендере (избегаем гидратационных ошибок),
 * затем синхронизируется.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(query);
    setMatches(mql.matches);

    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, [query]);

  return matches;
}

/**
 * useDeviceCapabilities — определяет «силу» устройства для решения:
 * грузить ли тяжёлую 3D + постобработку, или отдать статичный fallback.
 *
 * Критерии:
 *  - isMobile: сенсорный/узкий экран
 *  - prefersReducedMotion: пользователь запросил меньше анимаций
 *  - isLowPower: мало ядер CPU (<4) — 3D будет тормозить
 *  - supportsWebGL: доступен ли WebGL-контекст
 *  - canRenderHeavy3D: итоговый вердикт — грузить 3D
 */
export interface DeviceCapabilities {
  isMobile: boolean;
  prefersReducedMotion: boolean;
  isLowPower: boolean;
  supportsWebGL: boolean;
  canRenderHeavy3D: boolean;
  ready: boolean; // false до первого эффекта (SSR-безопасно)
}

export function useDeviceCapabilities(): DeviceCapabilities {
  const isMobile = useMediaQuery("(max-width: 768px), (pointer: coarse)");
  const prefersReducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const [isLowPower, setIsLowPower] = useState(false);
  const [supportsWebGL, setSupportsWebGL] = useState(true);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // CPU-эвристика
    const cores = navigator.hardwareConcurrency ?? 8;
    setIsLowPower(cores < 4);

    // WebGL-проба: пытаемся получить контекст, сразу освобождаем
    try {
      const canvas = document.createElement("canvas");
      const gl =
        canvas.getContext("webgl2") ||
        canvas.getContext("webgl") ||
        canvas.getContext("experimental-webgl");
      setSupportsWebGL(!!gl);
    } catch {
      setSupportsWebGL(false);
    }

    setReady(true);
  }, []);

  const canRenderHeavy3D =
    ready &&
    supportsWebGL &&
    !isMobile &&
    !prefersReducedMotion &&
    !isLowPower;

  return {
    isMobile,
    prefersReducedMotion,
    isLowPower,
    supportsWebGL,
    canRenderHeavy3D,
    ready,
  };
}
