import Hero from "@/components/sections/Hero";
import Concept from "@/components/sections/Concept";
import Architecture from "@/components/sections/Architecture";
import Residences from "@/components/sections/Residences";
import Interiors from "@/components/sections/Interiors";
import Location from "@/components/sections/Location";
import Amenities from "@/components/sections/Amenities";
import Investment from "@/components/sections/Investment";
import Developer from "@/components/sections/Developer";
import Contact from "@/components/sections/Contact";

/**
 * Главная (единственная) страница лендинга ОБЕРЁГ.
 * One-page scroll, 10 секций. Каждая — отдельный компонент со своим
 * визуальным характером, но в единой дизайн-системе.
 */
export default function Home() {
  return (
    <main className="relative">
      <Hero />
      <Concept />
      <Architecture />
      <Residences />
      <Interiors />
      <Location />
      <Amenities />
      <Investment />
      <Developer />
      <Contact />
    </main>
  );
}
