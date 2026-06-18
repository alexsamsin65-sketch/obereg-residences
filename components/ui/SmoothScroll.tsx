"use client";

import { useEffect } from "react";
import { initLenis } from "@/lib/lenis";

/**
 * SmoothScroll — provider инерционного скролла через Lenis.
 * Инициализируется один раз на клиенте, синхронизирован с GSAP-тикером
 * и ScrollTrigger (см. lib/lenis.ts).
 *
 * Оборачивает всё приложение в layout.tsx.
 */
export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const lenis = initLenis();

    return () => {
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
