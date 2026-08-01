import { shortWeekday } from '@/app/lib/date'

export interface MacroTotals {
  protein: number
  carbs: number
  fat: number
}

interface MacroSource extends MacroTotals {
  calories: number
}

export function sumCalories(items: { calories: number }[]): number {
  return items.reduce((s, m) => s + m.calories, 0)
}

export function sumMacros(items: MacroSource[]): MacroTotals {
  return items.reduce<MacroTotals>((acc, m) => ({
    protein: acc.protein + m.protein,
    carbs: acc.carbs + m.carbs,
    fat: acc.fat + m.fat,
  }), { protein: 0, carbs: 0, fat: 0 })
}

export interface ChartPoint {
  label: string
  value: number
  max: number
}

/** Bar-chart series of daily calories for the given ISO dates. */
export function buildCalorieSeries(
  dates: string[],
  getCaloriesForDate: (date: string) => number,
  max: number,
): ChartPoint[] {
  return dates.map(date => ({ label: shortWeekday(date), value: getCaloriesForDate(date), max }))
}

export function average(values: number[]): number {
  if (values.length === 0) return 0
  return Math.round(values.reduce((s, v) => s + v, 0) / values.length)
}

export function percentOf(value: number, total: number): number {
  return total > 0 ? Math.round((value / total) * 100) : 0
}

export function initialsFrom(name: string, fallback: string): string {
  const parts = (name || '').trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return fallback
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

export interface LinePoint {
  x: number
  y: number
}

/** Maps values onto SVG coordinates for the weight trend line. */
export function scaleLinePoints(
  values: number[],
  { x0 = 30, width = 340, y0 = 10, height = 100, pad = 1 } = {},
): LinePoint[] {
  if (values.length === 0) return []
  const min = Math.min(...values) - pad
  const max = Math.max(...values) + pad
  const range = max - min || 1
  return values.map((v, i) => ({
    x: x0 + (values.length > 1 ? (i / (values.length - 1)) * width : width / 2),
    y: y0 + (1 - (v - min) / range) * height,
  }))
}
