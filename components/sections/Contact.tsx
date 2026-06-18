"use client";

import { useState } from "react";
import Reveal, { RevealLine } from "@/components/ui/Reveal";
import Button from "@/components/ui/Button";
import { SITE, BUDGET_RANGES } from "@/lib/constants";

/**
 * S10 — Заявка / Контакты.
 *
 * Премиальная форма «Запросить презентацию / подбор резиденции»:
 * имя, телефон, бюджет (select-диапазоны).
 * Поля — минималистичные, underline-стиль, плавная анимация фокуса.
 * Magnetic-кнопка отправки. Без HTML <form>-перезагрузок — onClick.
 * Внизу — контакты, адрес офиса продаж, тонкий footer.
 */
export default function Contact() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [budget, setBudget] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    // TODO: подключить реальный бэкенд / CRM
    console.log("Форма отправлена:", { name, phone, budget });
    setSubmitted(true);
  };

  return (
    <>
      <section
        className="section-pad relative bg-ink text-bone"
        aria-label="Запросить презентацию"
      >
        <div className="container-luxe">
          <div className="grid grid-cols-1 gap-16 md:grid-cols-12 md:gap-16">
            {/* Левая часть — заголовок + информация */}
            <div className="flex flex-col justify-center md:col-span-5">
              <Reveal>
                <span data-reveal-line className="eyebrow mb-4 block">
                  Контакты
                </span>
              </Reveal>
              <Reveal stagger={0.1}>
                <h2 className="font-display mb-8 text-4xl leading-[1.02] tracking-tight text-bone md:text-5xl lg:text-6xl">
                  <RevealLine>Запросите</RevealLine>
                  <RevealLine>закрытую</RevealLine>
                  <RevealLine>презентацию.</RevealLine>
                </h2>
              </Reveal>
              <Reveal delay={0.25}>
                <p className="mb-12 max-w-md text-base leading-relaxed text-stone md:text-lg">
                  Мы не публикуем цены и планировки в открытый доступ.
                  Каждая презентация — персональна и по записи.
                </p>
              </Reveal>

              {/* Контактная информация */}
              <Reveal delay={0.35}>
                <div className="space-y-4 border-t border-line pt-8">
                  <div>
                    <span className="eyebrow block mb-1">Адрес</span>
                    <p className="text-sm text-stone">{SITE.address}</p>
                  </div>
                  <div>
                    <span className="eyebrow block mb-1">Офис продаж</span>
                    <p className="text-sm text-stone">{SITE.office}</p>
                  </div>
                  <div>
                    <span className="eyebrow block mb-1">Телефон</span>
                    <a
                      href={`tel:${SITE.phone.replace(/\s/g, "")}`}
                      className="text-sm text-bone/80 transition-colors hover:text-brass"
                    >
                      {SITE.phone}
                    </a>
                  </div>
                  <div>
                    <span className="eyebrow block mb-1">Email</span>
                    <a
                      href={`mailto:${SITE.email}`}
                      className="text-sm text-bone/80 transition-colors hover:text-brass"
                    >
                      {SITE.email}
                    </a>
                  </div>
                </div>
              </Reveal>
            </div>

            {/* Правая часть — форма */}
            <div className="md:col-span-7">
              {submitted ? (
                <Reveal>
                  <div className="flex h-full flex-col items-center justify-center rounded-sm border border-line bg-ink-2 p-16 text-center">
                    <span className="font-display mb-4 text-5xl text-brass">
                      ✓
                    </span>
                    <h3 className="font-display mb-3 text-2xl text-bone">
                      Запрос отправлен
                    </h3>
                    <p className="text-sm text-stone">
                      Наш консьерж свяжется с вами в течение 24 часов
                      для назначения персональной встречи.
                    </p>
                    <button
                      className="mt-8 text-xs uppercase tracking-[0.2em] text-stone transition-colors hover:text-brass"
                      onClick={() => setSubmitted(false)}
                    >
                      Отправить ещё
                    </button>
                  </div>
                </Reveal>
              ) : (
                <Reveal delay={0.15}>
                  <div className="rounded-sm border border-line bg-ink-2 p-8 md:p-12">
                    <p className="mb-10 text-sm text-stone">
                      Заполните форму — и мы подготовим для вас
                      индивидуальный подбор резиденций.
                    </p>

                    <div className="space-y-8">
                      {/* Имя */}
                      <FormField
                        label="Имя"
                        value={name}
                        onChange={setName}
                        placeholder="Как к вам обращаться"
                      />

                      {/* Телефон */}
                      <FormField
                        label="Телефон"
                        type="tel"
                        value={phone}
                        onChange={setPhone}
                        placeholder="+7 (___) ___-__-__"
                      />

                      {/* Бюджет — select */}
                      <div className="relative">
                        <label className="eyebrow block mb-3">Бюджет</label>
                        <select
                          value={budget}
                          onChange={(e) => setBudget(e.target.value)}
                          className="w-full border-b border-line bg-transparent pb-3 pt-1 text-sm text-bone outline-none transition-colors focus:border-brass"
                          style={{ appearance: "none" }}
                        >
                          <option value="" disabled className="bg-ink text-stone">
                            Укажите диапазон
                          </option>
                          {BUDGET_RANGES.map((r) => (
                            <option key={r} value={r} className="bg-ink text-bone">
                              {r}
                            </option>
                          ))}
                        </select>
                        {/* Стрелочка кастомная */}
                        <div className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-stone">
                          <svg viewBox="0 0 12 12" className="h-3 w-3">
                            <path
                              d="M1 4l5 4 5-4"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>

                    {/* Кнопка отправки */}
                    <div className="mt-12">
                      <Button
                        variant="solid"
                        onClick={handleSubmit}
                        magnetic
                      >
                        Запросить презентацию
                      </Button>
                    </div>

                    <p className="mt-6 text-[11px] leading-relaxed text-stone/60">
                      Нажимая кнопку, вы соглашаетесь с политикой
                      конфиденциальности. Мы не передаём ваши данные
                      третьим лицам.
                    </p>
                  </div>
                </Reveal>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-ink px-0 py-8">
        <div className="container-luxe">
          <div className="hairline mb-8" />
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <span className="font-display text-sm tracking-tight text-bone/40">
              {SITE.name}
            </span>
            <span className="text-xs text-stone/40">
              {/* TODO: реальный год основания */}
              © 2024 {SITE.fullName}. Все права защищены.
            </span>
            <div className="flex gap-6">
              <a
                href="#"
                className="text-xs text-stone/40 transition-colors hover:text-brass"
              >
                Политика конфиденциальности
              </a>
              <a
                href="#"
                className="text-xs text-stone/40 transition-colors hover:text-brass"
              >
                Правовая информация
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

/* ─── Поле формы — underline-стиль ─── */

function FormField({
  label,
  type = "text",
  value,
  onChange,
  placeholder = "",
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="eyebrow block mb-3">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full border-b border-line bg-transparent pb-3 pt-1 text-sm text-bone outline-none transition-colors placeholder:text-stone/30 focus:border-brass"
      />
    </div>
  );
}
