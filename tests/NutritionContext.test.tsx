import { describe, it, expect, beforeEach, vi } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import { useNutrition } from '@/app/components/NutritionContext'
import { STORAGE_KEY, isoDaysAgo, makeMeal, readStorage, seedStorage, wrapper } from './helpers'

function setup(state: Parameters<typeof seedStorage>[0] = {}) {
  seedStorage(state)
  return renderHook(() => useNutrition(), { wrapper })
}

describe('useNutrition', () => {
  it('throws when used outside of a provider', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    expect(() => renderHook(() => useNutrition())).toThrow(/inside <NutritionProvider>/)
    spy.mockRestore()
  })
})

describe('NutritionProvider hydration and persistence', () => {
  it('hydrates state from localStorage', () => {
    const meal = makeMeal({ id: 'stored-1', name: 'Stored meal' })
    const { result } = setup({ meals: [meal], waterLogs: { [isoDaysAgo(0)]: 3 }, goals: { calories: 1800 } })

    expect(result.current.meals).toEqual([meal])
    expect(result.current.getWaterForDate(isoDaysAgo(0))).toBe(3)
    expect(result.current.goals.calories).toBe(1800)
  })

  it('falls back to seed data when stored JSON is unreadable', () => {
    localStorage.setItem(STORAGE_KEY, '{not json')
    const { result } = renderHook(() => useNutrition(), { wrapper })

    expect(result.current.meals.length).toBeGreaterThan(0)
    expect(result.current.goals.calories).toBe(2100)
  })

  it('persists state changes back to localStorage', () => {
    const { result } = setup()

    act(() => result.current.addMeal(makeMeal({ name: 'Persisted' })))

    expect(readStorage().meals).toHaveLength(1)
    expect(readStorage().meals[0].name).toBe('Persisted')
  })

  it('survives a localStorage write failure', () => {
    const { result } = setup()
    const spy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('QuotaExceeded')
    })

    expect(() => act(() => result.current.addMeal(makeMeal()))).not.toThrow()
    spy.mockRestore()
  })

  it('applies the profile theme to the document element', () => {
    setup({ profile: { theme: 'dark' } })
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark')
  })
})

describe('meal actions', () => {
  it('adds meals with generated unique ids', () => {
    const { result } = setup()

    act(() => {
      result.current.addMeal(makeMeal({ id: undefined, name: 'A' }))
      result.current.addMeal(makeMeal({ id: undefined, name: 'B' }))
    })

    const [a, b] = result.current.meals
    expect(result.current.meals).toHaveLength(2)
    expect(a.id).toBeTruthy()
    expect(a.id).not.toBe(b.id)
  })

  it('patches only the targeted meal', () => {
    const { result } = setup({ meals: [makeMeal({ id: 'm1' }), makeMeal({ id: 'm2', calories: 100 })] })

    act(() => result.current.updateMeal('m2', { calories: 999, name: 'Updated' }))

    expect(result.current.meals[0].calories).toBe(400)
    expect(result.current.meals[1]).toMatchObject({ id: 'm2', calories: 999, name: 'Updated' })
  })

  it('ignores updates for unknown meal ids', () => {
    const { result } = setup({ meals: [makeMeal({ id: 'm1' })] })

    act(() => result.current.updateMeal('missing', { calories: 1 }))

    expect(result.current.meals).toHaveLength(1)
    expect(result.current.meals[0].calories).toBe(400)
  })

  it('removes a meal by id', () => {
    const { result } = setup({ meals: [makeMeal({ id: 'm1' }), makeMeal({ id: 'm2' })] })

    act(() => result.current.removeMeal('m1'))

    expect(result.current.meals.map(m => m.id)).toEqual(['m2'])
  })

  it('repeats a meal onto another date with a new id and annotated detail', () => {
    const original = makeMeal({ id: 'm1', detail: 'Brown rice', date: isoDaysAgo(3) })
    const { result } = setup({ meals: [original] })

    act(() => result.current.repeatMeal(original, isoDaysAgo(0)))

    const copy = result.current.meals[1]
    expect(copy.id).not.toBe('m1')
    expect(copy.date).toBe(isoDaysAgo(0))
    expect(copy.detail).toBe('Brown rice · repeated')
    expect(copy.calories).toBe(original.calories)
  })
})

describe('water tracking', () => {
  const day = isoDaysAgo(0)

  it('clamps an explicitly set value to the 0-12 range', () => {
    const { result } = setup()

    act(() => result.current.setWater(day, 20))
    expect(result.current.getWaterForDate(day)).toBe(12)

    act(() => result.current.setWater(day, -4))
    expect(result.current.getWaterForDate(day)).toBe(0)

    act(() => result.current.setWater(day, 5))
    expect(result.current.getWaterForDate(day)).toBe(5)
  })

  it('increments from zero for an untracked date and caps at 12', () => {
    const { result } = setup({ waterLogs: { [day]: 11 } })

    act(() => result.current.addWater(day))
    expect(result.current.getWaterForDate(day)).toBe(12)

    act(() => result.current.addWater(day))
    expect(result.current.getWaterForDate(day)).toBe(12)

    act(() => result.current.addWater(isoDaysAgo(1)))
    expect(result.current.getWaterForDate(isoDaysAgo(1))).toBe(1)
  })

  it('reports zero water for dates with no log', () => {
    const { result } = setup()
    expect(result.current.getWaterForDate('1999-01-01')).toBe(0)
  })
})

describe('weight entries', () => {
  it('replaces an existing entry for the same date and keeps entries sorted', () => {
    const { result } = setup({
      weightEntries: [{ date: isoDaysAgo(1), kg: 70 }, { date: isoDaysAgo(5), kg: 72 }],
    })

    act(() => result.current.addWeightEntry({ date: isoDaysAgo(1), kg: 69 }))

    expect(result.current.weightEntries).toEqual([
      { date: isoDaysAgo(5), kg: 72 },
      { date: isoDaysAgo(1), kg: 69 },
    ])
  })
})

describe('goals and profile', () => {
  it('merges goal patches', () => {
    const { result } = setup()

    act(() => result.current.updateGoals({ calories: 2400, goalType: 'gain' }))

    expect(result.current.goals).toMatchObject({ calories: 2400, goalType: 'gain', proteinG: 130 })
  })

  it('derives initials from a multi-word name', () => {
    const { result } = setup()

    act(() => result.current.updateProfile({ name: '  Likhith  Kumar Muniraju ' }))

    expect(result.current.profile.initials).toBe('LM')
  })

  it('derives initials from a single-word name', () => {
    const { result } = setup()

    act(() => result.current.updateProfile({ name: 'cher' }))

    expect(result.current.profile.initials).toBe('CH')
  })

  it('keeps existing initials when the name is only whitespace', () => {
    const { result } = setup({ profile: { initials: 'ZZ' } })

    act(() => result.current.updateProfile({ name: '   ' }))

    expect(result.current.profile.initials).toBe('ZZ')
  })

  it('prefers explicitly supplied initials over derived ones', () => {
    const { result } = setup()

    act(() => result.current.updateProfile({ name: 'Jane Doe', initials: 'QQ' }))

    expect(result.current.profile.initials).toBe('QQ')
  })

  it('writes the theme to the document element when updated', () => {
    const { result } = setup()

    act(() => result.current.updateProfile({ theme: 'dark' }))

    expect(document.documentElement.getAttribute('data-theme')).toBe('dark')
  })
})

describe('chat messages', () => {
  it('appends messages with an id and timestamp', () => {
    const { result } = setup()

    act(() => result.current.addChatMessage({ role: 'user', content: 'hi' }))

    expect(result.current.chatMessages).toHaveLength(1)
    expect(result.current.chatMessages[0]).toMatchObject({ role: 'user', content: 'hi' })
    expect(result.current.chatMessages[0].id).toBeTruthy()
    expect(result.current.chatMessages[0].timestamp).toBeGreaterThan(0)
  })

  it('streams content into the trailing assistant message', () => {
    const { result } = setup()

    act(() => {
      result.current.addChatMessage({ role: 'user', content: 'hi' })
      result.current.addChatMessage({ role: 'assistant', content: '' })
    })
    act(() => result.current.updateLastChatMessage('Hello there'))

    expect(result.current.chatMessages[1].content).toBe('Hello there')
    expect(result.current.chatMessages[0].content).toBe('hi')
  })

  it('does not overwrite a trailing user message', () => {
    const { result } = setup()

    act(() => result.current.addChatMessage({ role: 'user', content: 'hi' }))
    act(() => result.current.updateLastChatMessage('injected'))

    expect(result.current.chatMessages[0].content).toBe('hi')
  })

  it('is a no-op when there are no messages', () => {
    const { result } = setup()

    act(() => result.current.updateLastChatMessage('injected'))

    expect(result.current.chatMessages).toEqual([])
  })
})

describe('clearAllData', () => {
  it('resets every slice and drops the storage key', () => {
    const { result } = setup({
      meals: [makeMeal()],
      waterLogs: { [isoDaysAgo(0)]: 4 },
      weightEntries: [{ date: isoDaysAgo(0), kg: 70 }],
      goals: { calories: 3000 },
      chatMessages: [{ id: 'c1', role: 'user', content: 'hi', timestamp: 1 }],
    })

    act(() => result.current.clearAllData())

    expect(result.current.meals).toEqual([])
    expect(result.current.waterLogs).toEqual({})
    expect(result.current.weightEntries).toEqual([])
    expect(result.current.chatMessages).toEqual([])
    expect(result.current.goals.calories).toBe(2100)
    expect(result.current.profile.name).toBe('Ananya Sharma')
  })
})

describe('computed selectors', () => {
  const day = isoDaysAgo(0)
  const meals = [
    makeMeal({ id: 'a', date: day, calories: 300, protein: 20, carbs: 30, fat: 10 }),
    makeMeal({ id: 'b', date: day, calories: 500, protein: 40, carbs: 50, fat: 20 }),
    makeMeal({ id: 'c', date: isoDaysAgo(1), calories: 900, protein: 5, carbs: 5, fat: 5 }),
  ]

  it('filters meals by date', () => {
    const { result } = setup({ meals })
    expect(result.current.getMealsForDate(day).map(m => m.id)).toEqual(['a', 'b'])
  })

  it('sums calories for a date', () => {
    const { result } = setup({ meals })
    expect(result.current.getCaloriesForDate(day)).toBe(800)
    expect(result.current.getCaloriesForDate('1999-01-01')).toBe(0)
  })

  it('sums macros for a date', () => {
    const { result } = setup({ meals })
    expect(result.current.getMacrosForDate(day)).toEqual({ protein: 60, carbs: 80, fat: 30 })
    expect(result.current.getMacrosForDate('1999-01-01')).toEqual({ protein: 0, carbs: 0, fat: 0 })
  })
})

describe('getLoggingStreak', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('counts consecutive logged days including today', () => {
    const { result } = setup({
      meals: [0, 1, 2].map(n => makeMeal({ date: isoDaysAgo(n) })),
    })
    expect(result.current.getLoggingStreak()).toBe(3)
  })

  it('counts the run ending yesterday when today is unlogged', () => {
    const { result } = setup({
      meals: [1, 2].map(n => makeMeal({ date: isoDaysAgo(n) })),
    })
    expect(result.current.getLoggingStreak()).toBe(2)
  })

  it('stops at the first gap', () => {
    const { result } = setup({
      meals: [0, 1, 3, 4].map(n => makeMeal({ date: isoDaysAgo(n) })),
    })
    expect(result.current.getLoggingStreak()).toBe(2)
  })

  it('returns zero with no meals logged', () => {
    const { result } = setup({ meals: [] })
    expect(result.current.getLoggingStreak()).toBe(0)
  })

  it('counts a single day when only today is logged', () => {
    const { result } = setup({ meals: [makeMeal({ date: isoDaysAgo(0) })] })
    expect(result.current.getLoggingStreak()).toBe(1)
  })
})
