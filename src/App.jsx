/*
Название: Холодильники - Прототип магазина (React + Tailwind)
Файл: default export React компонента

Инструкции:
1) Этот файл — самодостаточный React-компонент, готовый для вставки в приложение Create React App или Vite.
2) Для лучшего результата подключите Tailwind CSS (следуйте официальной документации Tailwind).
3) В корне репозитория на GitHub можно положить этот файл как src/App.jsx и запустить проект.

Команды (пример для Vite + React):
  npm create vite@latest my-fridge-store -- --template react
  cd my-fridge-store
  npm install
  (настройте Tailwind согласно https://tailwindcss.com/docs/guides/vite)
  npm run dev

Описание компонента:
- Темная (черная) палитра с акцентами
- Сайдбар с фильтрами: категории, технологии, цвет — свертываемые группы
- Поддерживается мобильное раскрывающееся меню (появляющееся меню для категорий)
- Простейшая логика фильтрации (checkbox + counts)
- Сетка товаров и простая карточка с кнопкой "Купить"

Ниже — реализация компонента.
*/

import React, { useState, useMemo } from "react";

// Пример данных: небольшая выборка холодильников
const PRODUCTS = [
  { id: 1, title: "LG DoorCooling+", brand: "LG", type: "С нижней морозильной камерой", technologies: ["DoorCooling+", "InstaView"], color: "Черный", price: 59990 },
  { id: 2, title: "Samsung NoFrost 360", brand: "Samsung", type: "Однокамерный", technologies: ["NoFrost", "Door-in-Door"], color: "Серебристый", price: 45990 },
  { id: 3, title: "Bosch MetalFresh", brand: "Bosch", type: "Многокамерный", technologies: ["MetalFresh"], color: "Темный графит", price: 69990 },
  { id: 4, title: "Haier SmartCool", brand: "Haier", type: "Side-by-Side", technologies: ["Inverter"], color: "Белый", price: 124990 },
  { id: 5, title: "LG InstaView Slim", brand: "LG", type: "С верхней морозильной камерой", technologies: ["InstaView", "Inverter"], color: "Черный", price: 82990 },
];

const FILTER_GROUPS = {
  type: {
    title: "Тип",
    options: [
      "Side-by-Side",
      "Многокамерный",
      "С нижней морозильной камерой",
      "С верхней морозильной камерой",
      "Однокамерный",
    ],
  },
  tech: {
    title: "Технологии",
    options: [
      "DoorCooling+",
      "Умный Инверторный компрессор",
      "MetalFresh",
      "FreshConverter",
      "FreshBalancer",
      "InstaView",
      "Door-in-Door",
      "NoFrost",
      "Inverter",
    ],
  },
  color: {
    title: "Цвет",
    options: ["Черный", "Серебристый", "Стальной", "Темный графит", "Белый"],
  },
};

export default function FridgeShopPrototype() {
  const [openMobileFilters, setOpenMobileFilters] = useState(false);
  const [openGroups, setOpenGroups] = useState({ type: true, tech: false, color: false });
  const [selected, setSelected] = useState({ type: new Set(), tech: new Set(), color: new Set() });

  // Подсчёт количества элементов для каждой опции (динамически)
  const counts = useMemo(() => {
    const c = { type: {}, tech: {}, color: {} };
    PRODUCTS.forEach((p) => {
      c.type[p.type] = (c.type[p.type] || 0) + 1;
      p.technologies.forEach((t) => { c.tech[t] = (c.tech[t] || 0) + 1; });
      c.color[p.color] = (c.color[p.color] || 0) + 1;
    });
    return c;
  }, []);

  // Фильтрация продуктов на основе выбранных фильтров
  const filtered = useMemo(() => {
    return PRODUCTS.filter((p) => {
      // type
      if (selected.type.size > 0 && !selected.type.has(p.type)) return false;
      // tech: require at least one chosen tech to be present
      if (selected.tech.size > 0) {
        const hasTech = [...selected.tech].some((t) => p.technologies.includes(t));
        if (!hasTech) return false;
      }
      // color
      if (selected.color.size > 0 && !selected.color.has(p.color)) return false;
      return true;
    });
  }, [selected]);

  function toggleOption(group, option) {
    setSelected((prev) => {
      const copy = { type: new Set(prev.type), tech: new Set(prev.tech), color: new Set(prev.color) };
      if (copy[group].has(option)) copy[group].delete(option);
      else copy[group].add(option);
      return copy;
    });
  }

  function clearFilters() {
    setSelected({ type: new Set(), tech: new Set(), color: new Set() });
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="max-w-7xl mx-auto p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gray-800 rounded flex items-center justify-center text-xl font-bold">Х</div>
          <h1 className="text-xl font-semibold">Холодильники</h1>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setOpenMobileFilters((s) => !s)}
            className="px-3 py-2 border border-gray-700 rounded-lg text-sm md:hidden"
            aria-expanded={openMobileFilters}
          >
            Фильтры
          </button>
          <nav className="hidden md:flex gap-4 text-sm text-gray-300">
            <a href="#" className="hover:text-white">Каталог</a>
            <a href="#" className="hover:text-white">О нас</a>
            <a href="#" className="hover:text-white">Доставка</a>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar filters (desktop) */}
        <aside className="hidden md:block md:col-span-1">
          <div className="bg-gray-900 p-4 rounded-lg border border-gray-800">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">Фильтры</h2>
              <button onClick={clearFilters} className="text-sm text-gray-400 hover:text-white">Сброс</button>
            </div>

            {Object.keys(FILTER_GROUPS).map((groupKey) => {
              const group = FILTER_GROUPS[groupKey];
              return (
                <div key={groupKey} className="mt-4">
                  <button
                    className="w-full flex items-center justify-between text-left"
                    onClick={() => setOpenGroups((g) => ({ ...g, [groupKey]: !g[groupKey] }))}
                    aria-expanded={!!openGroups[groupKey]}
                  >
                    <span className="font-medium">{group.title}</span>
                    <span className="text-gray-400">{openGroups[groupKey] ? '−' : '+'}</span>
                  </button>

                  {openGroups[groupKey] && (
                    <div className="mt-3">
                      {group.options.map((opt) => (
                        <label key={opt} className="flex items-center gap-3 py-2 cursor-pointer text-sm text-gray-200">
                          <input
                            type="checkbox"
                            checked={selected[groupKey].has(opt)}
                            onChange={() => toggleOption(groupKey, opt)}
                            className="w-4 h-4 text-black rounded"
                          />
                          <span className="flex-1">{opt}</span>
                          <span className="text-gray-400">({counts[groupKey][opt] || 0})</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </aside>

        {/* Products area */}
        <section className="md:col-span-3">
          {/* Mobile filters drawer */}
          {openMobileFilters && (
            <div className="md:hidden mb-4">
              <div className="bg-gray-900 p-4 rounded-lg border border-gray-800">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">Фильтры</h3>
                  <button onClick={() => setOpenMobileFilters(false)} className="text-gray-400">Закрыть</button>
                </div>
                {Object.keys(FILTER_GROUPS).map((gk) => (
                  <details key={gk} open className="mb-2">
                    <summary className="font-medium cursor-pointer">{FILTER_GROUPS[gk].title}</summary>
                    <div className="mt-2">
                      {FILTER_GROUPS[gk].options.map((opt) => (
                        <label key={opt} className="flex items-center gap-3 py-2 cursor-pointer text-sm text-gray-200">
                          <input
                            type="checkbox"
                            checked={selected[gk].has(opt)}
                            onChange={() => toggleOption(gk, opt)}
                            className="w-4 h-4"
                          />
                          <span className="flex-1">{opt}</span>
                          <span className="text-gray-400">({counts[gk][opt] || 0})</span>
                        </label>
                      ))}
                    </div>
                  </details>
                ))}
                <div className="mt-3 flex gap-2">
                  <button onClick={clearFilters} className="flex-1 py-2 rounded border border-gray-700 text-sm">Сброс</button>
                  <button onClick={() => setOpenMobileFilters(false)} className="flex-1 py-2 bg-white text-black rounded text-sm">Применить</button>
                </div>
              </div>
            </div>
          )}

          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Результаты ({filtered.length})</h2>
            <div className="text-sm text-gray-400">Показываем актуальные модели</div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((p) => (
              <article key={p.id} className="bg-gray-900 rounded-lg overflow-hidden border border-gray-800">
                <div className="h-48 bg-gray-800 flex items-center justify-center text-gray-400">Фото товара</div>
                <div className="p-4">
                  <h3 className="font-semibold text-white">{p.title}</h3>
                  <p className="text-sm text-gray-300 mt-1">{p.brand} • {p.type}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <div>
                      <div className="text-xl font-bold">{p.price.toLocaleString('ru-RU')} ₽</div>
                      <div className="text-xs text-gray-400">В наличии</div>
                    </div>
                    <div>
                      <button className="px-3 py-2 rounded bg-white text-black font-medium">Купить</button>
                    </div>
                  </div>
                </div>
              </article>
            ))}

            {filtered.length === 0 && (
              <div className="col-span-full text-center text-gray-400 py-12">Нет товаров по выбранным фильтрам. Попробуйте сбросить фильтры.</div>
            )}
          </div>
        </section>
      </main>

      <footer className="bg-gray-900 border-t border-gray-800 mt-8">
        <div className="max-w-7xl mx-auto p-6 text-gray-400 text-sm">© 2025 Магазин холодильников — пример прототипа. Контакты: info@example.com</div>
      </footer>
    </div>
  );
}
