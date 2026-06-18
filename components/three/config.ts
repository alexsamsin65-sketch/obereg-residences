import * as THREE from "three";

/**
 * Конфигурация процедурной башни ОБЕРЁГ.
 * Все размеры — в условных единицах сцены.
 * Башня собирается из примитивов: фундамент + N этажей + пентхаус.
 */

export const BUILDING = {
  /** Число этажей */
  floors: 14,
  /** Высота одного этажа */
  floorHeight: 0.55,
  /** Ширина/глубина этажа (квадратное сечение) */
  floorSize: 2.4,
  /** Высота плиты перекрытия */
  slabHeight: 0.04,
  /** Возвышение фундамента над землёй */
  baseHeight: 0.5,
  /** Возвышение пентхауса */
  crownHeight: 0.4,
} as const;

/**
 * Маппинг глобального прогресса стройки (0..1) на параметры.
 * - первые 85% — поэтажная сборка
 * - последние 15% — финал: окна загораются, корона, камера отъезжает
 */
export const PROGRESS = {
  buildEnd: 0.85,
  finishStart: 0.85,
} as const;

/** Палитра материалов в формате THREE.Color (в HEX без #). */
export const MATERIALS = {
  base: "#1a1714", // фундамент — тёплый бетон
  slab: "#15110d", // перекрытие
  glass: "#1c2722", // остекление — глубокий тёмно-зелёный (forest)
  glassEmissive: "#b8975c", // горящие окна — латунь
  crown: "#b8975c", // корона/пентхаус — латунь
  ground: "#0e0d0b", // земля — ink
} as const;

/**
 * Временной слот этажа i из общего N.
 * Каждый этаж занимает равную долю от PROGRESS.buildEnd.
 */
export function floorSlot(
  i: number,
  total: number,
): { start: number; end: number } {
  const step = PROGRESS.buildEnd / total;
  return { start: i * step, end: (i + 1) * step };
}

/** Локальный прогресс этажа 0..1 с плавным expo.out. */
export function floorProgress(
  globalProgress: number,
  i: number,
  total: number,
): number {
  const { start, end } = floorSlot(i, total);
  if (globalProgress <= start) return 0;
  if (globalProgress >= end) return 1;
  const raw = (globalProgress - start) / (end - start);
  // expo.out
  return 1 - Math.pow(2, -10 * raw);
}

/** Финальная высота центра этажа i (от земли). */
export function floorY(i: number): number {
  return (
    BUILDING.baseHeight +
    BUILDING.slabHeight +
    i * BUILDING.floorHeight +
    BUILDING.floorHeight / 2
  );
}

/** Создаёт случайный паттерн «горящих» окон для этажа. */
export function windowPattern(
  i: number,
  cols: number = 8,
  rows: number = 1,
  seed: number = 0.5,
): boolean[] {
  // Детерминированный псевдослучайный паттерн (стабильный между рендерами)
  const arr: boolean[] = [];
  for (let k = 0; k < cols * rows; k++) {
    const r = Math.sin(i * 12.9898 + k * 78.233 + seed) * 43758.5453;
    arr.push(r - Math.floor(r) > 0.45);
  }
  return arr;
}

export const THREE_EXPORT = THREE; // реэкспорт для удобства
