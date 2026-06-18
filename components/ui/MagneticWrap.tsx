"use client";

import { useMagnetic } from "@/hooks/useMagnetic";

/**
 * MagneticWrap — обёртка, добавляющая magnetic-эффект любому содержимому.
 * Сила настраивается через prop `strength` (по умолчанию 0.35).
 *
 * Использование:
 *   <MagneticWrap strength={0.4}>
 *     <button>...</button>
 *   </MagneticWrap>
 */
export default function MagneticWrap({
  children,
  strength = 0.35,
  className = "",
}: {
  children: React.ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useMagnetic<HTMLDivElement>(strength);
  return (
    <div ref={ref} className={className} style={{ display: "inline-block" }}>
      {children}
    </div>
  );
}
