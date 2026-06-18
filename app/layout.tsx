import type { Metadata, Viewport } from "next";
import { Fraunces, Manrope } from "next/font/google";
import "./globals.css";

import SmoothScroll from "@/components/ui/SmoothScroll";
import Cursor from "@/components/ui/Cursor";
import GrainOverlay from "@/components/ui/GrainOverlay";
import Preloader from "@/components/ui/Preloader";
import { meta } from "@/lib/constants";

// Дисплейный шрифт — Fraunces (variable, opsz) — высокий контраст, роскошь
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  axes: ["opsz", "SOFT"],
});

// Текстовый шрифт — Manrope для body/UI
const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(meta.url),
  title: meta.title,
  description: meta.description,
  keywords: [
    "элитная недвижимость Москва",
    "премиум резиденции",
    "жилой комплекс суперпремиум",
    "ОБЕРЁГ",
    "квартиры на Тверской",
  ],
  authors: [{ name: "ОБЕРЁГ" }],
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: meta.url,
    title: meta.title,
    description: meta.description,
    siteName: "ОБЕРЁГ",
    images: [{ url: meta.ogImage, width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: meta.title,
    description: meta.description,
    images: [meta.ogImage],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0e0d0b",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="ru"
      className={`${fraunces.variable} ${manrope.variable} antialiased`}
    >
      <body className="min-h-screen bg-ink text-bone">
        {/* Премиум-инфраструктура (клиентская) */}
        <Preloader />
        <SmoothScroll>
          <Cursor />
          <GrainOverlay />
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
