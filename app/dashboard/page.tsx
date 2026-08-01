'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import Header from '@/app/components/Header'
import CalorieHero from '@/app/components/CalorieHero'
import MacroRing from '@/app/components/MacroRing'
import HydrationTracker from '@/app/components/HydrationTracker'
import MealCard from '@/app/components/MealCard'
import AddMealModal from '@/app/components/AddMealModal'
import WeeklyChart from '@/app/components/WeeklyChart'
import SmartNudge from '@/app/components/SmartNudge'
import Icon from '@/app/components/Icon'
import { useMealModal } from '@/app/lib/hooks'
import { useNutrition, type Meal } from '@/app/components/NutritionContext'
import { lastNDays, todayISO } from '@/app/lib/date'
import { buildCalorieSeries, sumCalories } from '@/app/lib/nutrition'

export default function DashboardPage() {
  const { goals, getMealsForDate, getMacrosForDate, getCaloriesForDate } = useNutrition()
  const mealModal = useMealModal<Meal>()
  const today = todayISO()

  const meals = getMealsForDate(today)
  const macros = getMacrosForDate(today)
  const calories = sumCalories(meals)

  const weeklyData = useMemo(
    () => buildCalorieSeries(lastNDays(7), getCaloriesForDate, goals.calories),
    [getCaloriesForDate, goals.calories],
  )

  return (
    <>
      <Header onLogFood={mealModal.openAdd} />

      <CalorieHero date={today} />

      <section className="section-heading">
        <div>
          <h2>Today&apos;s nutrition</h2>
          <p>Balanced and right on track.</p>
        </div>
        <Link href="/progress" className="link">View details <Icon name="arrow" size={14} /></Link>
      </section>

      <section className="nutrition-grid">
        <div className="macros-card">
          <div className="macro-heading"><b>Macronutrients</b><span>Today</span></div>
          <div className="rings">
            <MacroRing value={macros.protein} total={goals.proteinG} label="Protein" color="var(--clr-protein)" />
            <MacroRing value={macros.carbs} total={goals.carbsG} label="Carbs" color="var(--clr-carbs)" />
            <MacroRing value={macros.fat} total={goals.fatG} label="Fat" color="var(--clr-fat)" />
          </div>
        </div>
        <HydrationTracker date={today} />
      </section>

      <section className="section-heading meals-title">
        <div>
          <h2>Today&apos;s meals</h2>
          <p>{meals.length} items logged · {calories.toLocaleString()} kcal</p>
        </div>
        <button className="link" onClick={mealModal.openAdd}>Add meal <Icon name="plus" size={14} /></button>
      </section>

      <section className="meal-list">
        {meals.length > 0 ? (
          meals.map(meal => <MealCard key={meal.id} meal={meal} onEdit={mealModal.openEdit} />)
        ) : (
          <div className="empty-state" style={{ padding: '36px 20px', background: 'var(--clr-card)', borderRadius: 'var(--r-lg)', border: '1px dashed var(--clr-border)', textAlign: 'center' }}>
            <div className="empty-icon">🍽️</div>
            <h3 style={{ margin: '8px 0 4px', fontSize: 16 }}>No meals logged yet today</h3>
            <p className="empty-text" style={{ fontSize: 13, color: 'var(--clr-text-soft)', marginBottom: 16 }}>Start tracking to see your calorie &amp; macro breakdown.</p>
            <button className="add" onClick={mealModal.openAdd}>
              <Icon name="plus" size={15} /> Add first meal
            </button>
          </div>
        )}
      </section>

      <section className="weekly-section">
        <div className="section-heading">
          <div><h2>Weekly overview</h2><p>Last 7 days of calorie intake</p></div>
        </div>
        <WeeklyChart data={weeklyData} title="Daily Calories" color="var(--clr-hero-accent)" />
      </section>

      <SmartNudge />

      <AddMealModal open={mealModal.open} onClose={mealModal.close} date={today} editMeal={mealModal.editing} />
    </>
  )
}
