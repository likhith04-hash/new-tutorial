import React, { type ReactNode } from 'react'
import { NutritionProvider, type Meal, type UserGoals, type UserProfile, type WeightEntry, type ChatMessage } from '@/app/components/NutritionContext'

export const STORAGE_KEY = 'nourish-ai-data'

export const DEFAULT_GOALS: UserGoals = {
  calories: 2100, proteinG: 130, carbsG: 240, fatG: 70,
  waterGlasses: 8, goalType: 'lose', activityLevel: 'moderate',
}

export const DEFAULT_PROFILE: UserProfile = {
  name: 'Ananya Sharma', email: 'ananya@example.com', initials: 'AS',
  heightCm: 165, weightKg: 65.8, targetWeightKg: 60,
  allergies: ['Shellfish'], plan: 'Free plan', units: 'metric', theme: 'light',
  notifications: { mealReminders: true, waterReminders: true, weeklyReport: false },
}

export function isoDaysAgo(n: number): string {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d.toISOString().slice(0, 10)
}

export function makeMeal(patch: Partial<Meal> = {}): Meal {
  return {
    id: patch.id ?? `meal-${Math.random().toString(36).slice(2, 8)}`,
    type: 'Lunch',
    name: 'Test meal',
    detail: 'Test detail',
    calories: 400,
    protein: 30,
    carbs: 40,
    fat: 10,
    tone: 'peach',
    date: isoDaysAgo(0),
    ...patch,
  }
}

export interface StoredState {
  meals?: Meal[]
  waterLogs?: Record<string, number>
  weightEntries?: WeightEntry[]
  goals?: Partial<UserGoals>
  profile?: Partial<UserProfile>
  chatMessages?: ChatMessage[]
}

/** Seeds localStorage so <NutritionProvider> hydrates with deterministic data. */
export function seedStorage(state: StoredState = {}) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    meals: state.meals ?? [],
    waterLogs: state.waterLogs ?? {},
    weightEntries: state.weightEntries ?? [],
    goals: { ...DEFAULT_GOALS, ...state.goals },
    profile: { ...DEFAULT_PROFILE, ...state.profile },
    chatMessages: state.chatMessages ?? [],
  }))
}

export function readStorage() {
  const raw = localStorage.getItem(STORAGE_KEY)
  return raw ? JSON.parse(raw) : null
}

export function wrapper({ children }: { children: ReactNode }) {
  return <NutritionProvider>{children}</NutritionProvider>
}
