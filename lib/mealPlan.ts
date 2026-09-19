import { db } from './db'
import { foods, type Food } from './schema'
import { eq } from 'drizzle-orm'

export interface MealSlot {
  mealType: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack'
  food: Food
  calories: number
  proteinG: number
  carbsG: number
  fatG: number
}

export interface DailyPlan {
  meals: MealSlot[]
  totalCalories: number
  totalProteinG: number
  totalCarbsG: number
  totalFatG: number
}

const CALORIE_DISTRIBUTION = {
  Breakfast: 0.25,
  Lunch: 0.35,
  Dinner: 0.30,
  Snack: 0.10,
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function pickFoodsForMeal(
  availableFoods: Food[],
  targetCalories: number,
): Food | null {
  if (availableFoods.length === 0) return null

  const sorted = [...availableFoods].sort((a, b) => {
    return Math.abs(a.calories - targetCalories) - Math.abs(b.calories - targetCalories)
  })

  return sorted[0]
}

export async function generateDailyPlan(
  dietType: 'vegetarian' | 'non_vegetarian' | 'vegan',
  calorieTarget: number,
  proteinTarget: number,
): Promise<DailyPlan> {
  const allFoods = await db.query.foods.findMany({
    where: eq(foods.dietType, dietType),
  })

  if (allFoods.length === 0) {
    return { meals: [], totalCalories: 0, totalProteinG: 0, totalCarbsG: 0, totalFatG: 0 }
  }

  const meals: MealSlot[] = []
  const usedFoodIds = new Set<string>()

  const mealTypes: Array<'Breakfast' | 'Lunch' | 'Dinner' | 'Snack'> = ['Breakfast', 'Lunch', 'Dinner', 'Snack']

  for (const mealType of mealTypes) {
    const targetCals = Math.round(calorieTarget * CALORIE_DISTRIBUTION[mealType])
    const available = allFoods.filter(f => !usedFoodIds.has(f.id))

    const food = pickFoodsForMeal(available, targetCals)
    if (food) {
      usedFoodIds.add(food.id)
      meals.push({
        mealType,
        food,
        calories: food.calories,
        proteinG: Number(food.proteinG),
        carbsG: Number(food.carbsG),
        fatG: Number(food.fatG),
      })
    }
  }

  const totals = meals.reduce(
    (acc, m) => ({
      totalCalories: acc.totalCalories + m.calories,
      totalProteinG: acc.totalProteinG + m.proteinG,
      totalCarbsG: acc.totalCarbsG + m.carbsG,
      totalFatG: acc.totalFatG + m.fatG,
    }),
    { totalCalories: 0, totalProteinG: 0, totalCarbsG: 0, totalFatG: 0 }
  )

  return { meals, ...totals }
}

export function calculateTargets(weight: number, height: number, age: number, activity: string, goal: string) {
  const bmr = 10 * weight + 6.25 * height - 5 * age + 5
  const mult: Record<string, number> = { sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725, very_active: 1.9 }
  const tdee = bmr * (mult[activity] || 1.55)
  const cal = goal === 'lose' ? tdee - 350 : goal === 'gain' ? tdee + 300 : tdee
  const protein = Math.round(weight * (goal === 'gain' ? 1.8 : 1.5))
  const calories = Math.max(1400, Math.round(cal))

  return {
    calories,
    proteinG: protein,
    carbsG: Math.round(calories * 0.48 / 4),
    fatG: Math.round(calories * 0.27 / 9),
  }
}
