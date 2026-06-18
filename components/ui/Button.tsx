"use client";

import MagneticWrap from "./MagneticWrap";

/**
 * Button — премиальная кнопка с magnetic-эффектом.
 * Варианты:
 *  - solid: латунь на ink (основная CTA)
 *  - outline: hairline-рамка, brass при hover
 *  - ghost: только текст с подчёркиванием
 */
type Variant = "solid" | "outline" | "ghost";

export default function Button({
  children,
  variant = "solid",
  onClick,
  type = "button",
  className = "",
  magnetic = true,
}: {
  children: React.ReactNode;
  variant?: Variant;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  type?: "button" | "submit";
  className?: string;
  magnetic?: boolean;
}) {
  const base =
    "relative inline-flex items-center justify-center gap-3 px-8 py-4 text-xs font-medium uppercase tracking-[0.2em] transition-colors duration-500 ease-out";

  const variants: Record<Variant, string> = {
    solid:
      "bg-brass text-ink hover:bg-brass-soft",
    outline:
      "border border-line text-bone hover:border-brass hover:text-brass",
    ghost: "text-bone hover:text-brass px-0",
  };

  const btn = (
    <button
      type={type}
      onClick={onClick}
      data-cursor
      className={`${base} ${variants[variant]} ${className}`}
    >
      <span>{children}</span>
    </button>
  );

  if (!magnetic) return btn;
  return <MagneticWrap strength={0.3}>{btn}</MagneticWrap>;
}
