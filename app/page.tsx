import Hero from "@/components/sections/Hero";

/**
 * Главная (единственная) страница лендинга ОБЕРЁГ.
 * Секции подключаются по мере реализации. Каждая — отдельный компонент
 * со своим визуальным характером, но в единой дизайн-системе.
 */
export default function Home() {
  return (
    <main className="relative">
      <Hero />
      {/* TODO: Concept, Architecture, Residences, Interiors,
          Location, Amenities, Investment, Developer, Contact */}
    </main>
  );
}
