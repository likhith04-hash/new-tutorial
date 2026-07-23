'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import Header from '@/app/components/Header'
import CalorieHero from '@/app/components/CalorieHero'
import MacroRing from '@/app/components/MacroRing'
import HydrationTracker from '@/app/components/HydrationTracker'
import MealCard from '@/app/components/MealCard'
import AddMealModal from '@/app/components/AddMealModal'
import WeeklyChart from '@/app/components/WeeklyChart'
import Icon from '@/app/components/Icon'
import { useNutrition } from '@/app/components/NutritionContext'

export default function DashboardPage() {
  const { goals, getMealsForDate, getMacrosForDate, getCaloriesForDate } = useNutrition()
  const [showAdd, setShowAdd] = useState(false)
  const today = new Date().toISOString().slice(0, 10)

  const meals = getMealsForDate(today)
  const macros = getMacrosForDate(today)
  const calories = meals.reduce((s, m) => s + m.calories, 0)

  const weeklyData = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(); d.setDate(d.getDate() - (6 - i))
      return {
        label: d.toLocaleDateString('en-US', { weekday: 'short' }),
        value: getCaloriesForDate(d.toISOString().slice(0, 10)),
        max: goals.calories,
      }
    })
  }, [getCaloriesForDate, goals.calories])

  return (
    <>
      <Header onLogFood={() => setShowAdd(true)} />

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
        <button className="link" onClick={() => setShowAdd(true)}>Add meal <Icon name="plus" size={14} /></button>
      </section>

      <section className="meal-list">
        {meals.map(meal => <MealCard key={meal.id} meal={meal} />)}
      </section>

      <section className="weekly-section">
        <div className="section-heading">
          <div><h2>Weekly overview</h2><p>Last 7 days of calorie intake</p></div>
        </div>
        <WeeklyChart data={weeklyData} title="Daily Calories" color="var(--clr-hero-accent)" />
      </section>

      <div className="insight-card">
        <div className="insight-icon"><Icon name="sparkle" size={20} /></div>
        <div className="insight-content">
          <b>AI Insight</b>
          <p>Your protein intake has improved 15% this week. Keep up the balanced meals — you&apos;re building great habits!</p>
        </div>
      </div>

      <AddMealModal open={showAdd} onClose={() => setShowAdd(false)} date={today} />
    </>
  )
}
