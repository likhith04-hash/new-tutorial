'use client'

import React, { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'

/* ───────── Types ───────── */

export type MealTone = 'peach' | 'violet' | 'green' | 'coral' | 'blue' | 'amber'

export interface Meal {
  id: string
  type: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack'
  name: string
  detail: string
  calories: number
  protein: number
  carbs: number
  fat: number
  tone: MealTone
  date: string          // YYYY-MM-DD
}

export interface WeightEntry {
  date: string
  kg: number
}

export interface UserGoals {
  calories: number
  proteinG: number
  carbsG: number
  fatG: number
  waterGlasses: number
  goalType: 'lose' | 'maintain' | 'gain'
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active'
}

export interface UserProfile {
  name: string
  email: string
  initials: string
  heightCm: number
  weightKg: number
  targetWeightKg: number
  allergies: string[]
  plan: string
  units: 'metric' | 'imperial'
  theme: 'light' | 'dark'
  notifications: { mealReminders: boolean; waterReminders: boolean; weeklyReport: boolean }
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: number
}

export interface NutritionContextType {
  /* data */
  meals: Meal[]
  waterLogs: Record<string, number>
  weightEntries: WeightEntry[]
  goals: UserGoals
  profile: UserProfile
  chatMessages: ChatMessage[]

  /* actions */
  addMeal: (meal: Omit<Meal, 'id'>) => void
  repeatMeal: (meal: Meal, date: string) => void
  updateMeal: (id: string, patch: Partial<Meal>) => void
  removeMeal: (id: string) => void
  setWater: (date: string, glasses: number) => void
  addWater: (date: string) => void
  addWeightEntry: (entry: WeightEntry) => void
  updateGoals: (patch: Partial<UserGoals>) => void
  updateProfile: (patch: Partial<UserProfile>) => void
  addChatMessage: (msg: Omit<ChatMessage, 'id' | 'timestamp'>) => void
  updateLastChatMessage: (content: string) => void
  clearAllData: () => void

  /* computed */
  getMealsForDate: (date: string) => Meal[]
  getWaterForDate: (date: string) => number
  getCaloriesForDate: (date: string) => number
  getMacrosForDate: (date: string) => { protein: number; carbs: number; fat: number }
  getLoggingStreak: () => number
}

/* ───────── Helpers ───────── */

const today = () => new Date().toISOString().slice(0, 10)
const uid = () => Math.random().toString(36).slice(2, 10)
const daysAgo = (n: number) => {
  const d = new Date(); d.setDate(d.getDate() - n); return d.toISOString().slice(0, 10)
}

/* ───────── Seed Data ───────── */

const SEED_MEALS: Meal[] = [
  { id: uid(), type: 'Breakfast', name: 'Greek yogurt bowl', detail: 'Greek yogurt, berries, granola', calories: 386, protein: 26, carbs: 42, fat: 12, tone: 'peach', date: today() },
  { id: uid(), type: 'Lunch', name: 'Tandoori chicken bowl', detail: 'Brown rice, cucumber, mint', calories: 542, protein: 43, carbs: 52, fat: 14, tone: 'violet', date: today() },
  { id: uid(), type: 'Snack', name: 'Almonds & apple', detail: '28 g almonds · 1 medium apple', calories: 259, protein: 6, carbs: 34, fat: 16, tone: 'green', date: today() },
  // previous days for chart data
  { id: uid(), type: 'Breakfast', name: 'Oatmeal & banana', detail: 'Rolled oats, honey, banana', calories: 340, protein: 12, carbs: 58, fat: 8, tone: 'amber', date: daysAgo(1) },
  { id: uid(), type: 'Lunch', name: 'Caesar salad', detail: 'Romaine, chicken, croutons', calories: 480, protein: 38, carbs: 26, fat: 22, tone: 'green', date: daysAgo(1) },
  { id: uid(), type: 'Dinner', name: 'Pasta primavera', detail: 'Penne, seasonal veggies, olive oil', calories: 520, protein: 16, carbs: 72, fat: 18, tone: 'coral', date: daysAgo(1) },
  { id: uid(), type: 'Breakfast', name: 'Avocado toast', detail: 'Sourdough, egg, avocado', calories: 410, protein: 18, carbs: 36, fat: 24, tone: 'green', date: daysAgo(2) },
  { id: uid(), type: 'Lunch', name: 'Sushi platter', detail: 'Salmon nigiri, miso soup', calories: 560, protein: 32, carbs: 64, fat: 14, tone: 'coral', date: daysAgo(2) },
  { id: uid(), type: 'Breakfast', name: 'Smoothie bowl', detail: 'Açaí, banana, granola', calories: 390, protein: 10, carbs: 62, fat: 12, tone: 'violet', date: daysAgo(3) },
  { id: uid(), type: 'Lunch', name: 'Grilled paneer wrap', detail: 'Whole wheat, veggies, chutney', calories: 470, protein: 28, carbs: 44, fat: 20, tone: 'peach', date: daysAgo(3) },
  { id: uid(), type: 'Dinner', name: 'Dal tadka & roti', detail: 'Yellow lentils, ghee, wheat roti', calories: 440, protein: 22, carbs: 56, fat: 14, tone: 'amber', date: daysAgo(3) },
  { id: uid(), type: 'Breakfast', name: 'Poha', detail: 'Flattened rice, peanuts, lime', calories: 310, protein: 8, carbs: 48, fat: 10, tone: 'amber', date: daysAgo(4) },
  { id: uid(), type: 'Lunch', name: 'Chicken biryani', detail: 'Basmati rice, spiced chicken', calories: 620, protein: 36, carbs: 68, fat: 22, tone: 'peach', date: daysAgo(4) },
  { id: uid(), type: 'Breakfast', name: 'Eggs & toast', detail: '2 boiled eggs, multigrain toast', calories: 320, protein: 22, carbs: 28, fat: 14, tone: 'peach', date: daysAgo(5) },
  { id: uid(), type: 'Lunch', name: 'Quinoa salad', detail: 'Quinoa, chickpeas, feta, veggies', calories: 440, protein: 20, carbs: 54, fat: 16, tone: 'green', date: daysAgo(5) },
  { id: uid(), type: 'Dinner', name: 'Grilled salmon', detail: 'Salmon fillet, asparagus, lemon', calories: 480, protein: 42, carbs: 12, fat: 28, tone: 'coral', date: daysAgo(5) },
  { id: uid(), type: 'Breakfast', name: 'Idli & sambar', detail: '3 idli, sambar, chutney', calories: 290, protein: 10, carbs: 52, fat: 4, tone: 'peach', date: daysAgo(6) },
  { id: uid(), type: 'Lunch', name: 'Rajma chawal', detail: 'Kidney beans, basmati rice', calories: 510, protein: 18, carbs: 74, fat: 12, tone: 'coral', date: daysAgo(6) },
]

const SEED_WATER: Record<string, number> = {
  [today()]: 5,
  [daysAgo(1)]: 7,
  [daysAgo(2)]: 6,
  [daysAgo(3)]: 8,
  [daysAgo(4)]: 4,
  [daysAgo(5)]: 6,
  [daysAgo(6)]: 5,
}

const SEED_WEIGHT: WeightEntry[] = [
  { date: daysAgo(30), kg: 68.2 },
  { date: daysAgo(25), kg: 67.8 },
  { date: daysAgo(20), kg: 67.5 },
  { date: daysAgo(15), kg: 67.1 },
  { date: daysAgo(10), kg: 66.8 },
  { date: daysAgo(5), kg: 66.4 },
  { date: daysAgo(2), kg: 66.1 },
  { date: today(), kg: 65.8 },
]

const DEFAULT_GOALS: UserGoals = { calories: 2100, proteinG: 130, carbsG: 240, fatG: 70, waterGlasses: 8, goalType: 'lose', activityLevel: 'moderate' }

const DEFAULT_PROFILE: UserProfile = {
  name: 'Ananya Sharma', email: 'ananya@example.com', initials: 'AS',
  heightCm: 165, weightKg: 65.8, targetWeightKg: 60,
  allergies: ['Shellfish'], plan: 'Free plan', units: 'metric', theme: 'light',
  notifications: { mealReminders: true, waterReminders: true, weeklyReport: false },
}

/* ───────── Storage ───────── */

const STORAGE_KEY = 'nourish-ai-data'

interface StoredData {
  meals: Meal[]
  waterLogs: Record<string, number>
  weightEntries: WeightEntry[]
  goals: UserGoals
  profile: UserProfile
  chatMessages: ChatMessage[]
}

function loadData(): StoredData | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as StoredData) : null
  } catch { return null }
}

function saveData(data: StoredData) {
  if (typeof window === 'undefined') return
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)) } catch { /* quota */ }
}

/* ───────── Context ───────── */

const NutritionContext = createContext<NutritionContextType | null>(null)

export function useNutrition(): NutritionContextType {
  const ctx = useContext(NutritionContext)
  if (!ctx) throw new Error('useNutrition must be used inside <NutritionProvider>')
  return ctx
}

export function NutritionProvider({ children }: { children: ReactNode }) {
  const [meals, setMeals] = useState<Meal[]>(SEED_MEALS)
  const [waterLogs, setWaterLogs] = useState<Record<string, number>>(SEED_WATER)
  const [weightEntries, setWeightEntries] = useState<WeightEntry[]>(SEED_WEIGHT)
  const [goals, setGoals] = useState<UserGoals>(DEFAULT_GOALS)
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [hydrated, setHydrated] = useState(false)

  /* load from localStorage on mount */
  useEffect(() => {
    const stored = loadData()
    if (stored) {
      setMeals(stored.meals)
      setWaterLogs(stored.waterLogs)
      setWeightEntries(stored.weightEntries)
      setGoals(stored.goals)
      setProfile(stored.profile)
      setChatMessages(stored.chatMessages ?? [])
    }
    setHydrated(true)
  }, [])

  /* sync data-theme to document element */
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', profile.theme)
    }
  }, [profile.theme])

  /* persist whenever state changes (after hydration) */
  useEffect(() => {
    if (!hydrated) return
    saveData({ meals, waterLogs, weightEntries, goals, profile, chatMessages })
  }, [meals, waterLogs, weightEntries, goals, profile, chatMessages, hydrated])

  /* ── actions ── */

  const addMeal = useCallback((meal: Omit<Meal, 'id'>) => {
    setMeals(prev => [...prev, { ...meal, id: uid() }])
  }, [])

  const updateMeal = useCallback((id: string, patch: Partial<Meal>) => {
    setMeals(prev => prev.map(m => m.id === id ? { ...m, ...patch } : m))
  }, [])

  const removeMeal = useCallback((id: string) => {
    setMeals(prev => prev.filter(m => m.id !== id))
  }, [])

  const repeatMeal = useCallback((meal: Meal, date: string) => {
    setMeals(prev => [...prev, { ...meal, id: uid(), date, detail: `${meal.detail} · repeated` }])
  }, [])

  const setWaterFn = useCallback((date: string, glasses: number) => {
    setWaterLogs(prev => ({ ...prev, [date]: Math.max(0, Math.min(12, glasses)) }))
  }, [])

  const addWater = useCallback((date: string) => {
    setWaterLogs(prev => ({ ...prev, [date]: Math.min(12, (prev[date] ?? 0) + 1) }))
  }, [])

  const addWeightEntry = useCallback((entry: WeightEntry) => {
    setWeightEntries(prev => {
      const filtered = prev.filter(e => e.date !== entry.date)
      return [...filtered, entry].sort((a, b) => a.date.localeCompare(b.date))
    })
  }, [])

  const updateGoals = useCallback((patch: Partial<UserGoals>) => {
    setGoals(prev => ({ ...prev, ...patch }))
  }, [])

  const updateProfile = useCallback((patch: Partial<UserProfile>) => {
    setProfile(prev => ({ ...prev, ...patch }))
  }, [])

  const addChatMessage = useCallback((msg: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    setChatMessages(prev => [...prev, { ...msg, id: uid(), timestamp: Date.now() }])
  }, [])

  const updateLastChatMessage = useCallback((content: string) => {
    setChatMessages(prev => {
      const updated = [...prev]
      const lastIdx = updated.length - 1
      if (lastIdx >= 0 && updated[lastIdx].role === 'assistant') {
        updated[lastIdx] = { ...updated[lastIdx], content }
      }
      return updated
    })
  }, [])

  const clearAllData = useCallback(() => {
    setMeals([])
    setWaterLogs({})
    setWeightEntries([])
    setGoals(DEFAULT_GOALS)
    setProfile(DEFAULT_PROFILE)
    setChatMessages([])
    if (typeof window !== 'undefined') localStorage.removeItem(STORAGE_KEY)
  }, [])

  /* ── computed ── */

  const getMealsForDate = useCallback((date: string) => meals.filter(m => m.date === date), [meals])

  const getWaterForDate = useCallback((date: string) => waterLogs[date] ?? 0, [waterLogs])

  const getCaloriesForDate = useCallback((date: string) =>
    meals.filter(m => m.date === date).reduce((s, m) => s + m.calories, 0)
  , [meals])

  const getMacrosForDate = useCallback((date: string) => {
    const dm = meals.filter(m => m.date === date)
    return {
      protein: dm.reduce((s, m) => s + m.protein, 0),
      carbs: dm.reduce((s, m) => s + m.carbs, 0),
      fat: dm.reduce((s, m) => s + m.fat, 0),
    }
  }, [meals])

  const getLoggingStreak = useCallback(() => {
    let streak = 0
    const todayStr = today()
    let checkDate = new Date()
    
    // Check today first. If no meals today, check starting from yesterday
    const todayMeals = meals.filter(m => m.date === todayStr)
    if (todayMeals.length > 0) {
      streak++
      checkDate.setDate(checkDate.getDate() - 1)
    } else {
      checkDate.setDate(checkDate.getDate() - 1)
    }

    while (true) {
      const dStr = checkDate.toISOString().slice(0, 10)
      const dayMeals = meals.filter(m => m.date === dStr)
      if (dayMeals.length > 0) {
        streak++
        checkDate.setDate(checkDate.getDate() - 1)
      } else {
        break
      }
    }

    return streak
  }, [meals])

  const value: NutritionContextType = {
    meals, waterLogs, weightEntries, goals, profile, chatMessages,
    addMeal, repeatMeal, updateMeal, removeMeal, setWater: setWaterFn, addWater, addWeightEntry,
    updateGoals, updateProfile, addChatMessage, updateLastChatMessage, clearAllData,
    getMealsForDate, getWaterForDate, getCaloriesForDate, getMacrosForDate, getLoggingStreak,
  }

  return <NutritionContext.Provider value={value}>{children}</NutritionContext.Provider>
}
