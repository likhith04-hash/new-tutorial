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
import SmartNudge from '@/app/components/SmartNudge'
import Icon from '@/app/components/Icon'
import { useNutrition, type Meal } from '@/app/components/NutritionContext'

export default function DashboardPage() {
  const { goals, getMealsForDate, getMacrosForDate, getCaloriesForDate } = useNutrition()
  const [showAdd, setShowAdd] = useState(false)
  const [editingMeal, setEditingMeal] = useState<Meal | null>(null)
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

  const handleEditMeal = (meal: Meal) => {
    setEditingMeal(meal)
    setShowAdd(true)
  }

  const handleCloseModal = () => {
    setShowAdd(false)
    setEditingMeal(null)
  }

  return (
    <>
      <Header onLogFood={() => { setEditingMeal(null); setShowAdd(true) }} />

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
        <button className="link" onClick={() => { setEditingMeal(null); setShowAdd(true) }}>Add meal <Icon name="plus" size={14} /></button>
      </section>

      <section className="meal-list">
        {meals.length > 0 ? (
          meals.map(meal => <MealCard key={meal.id} meal={meal} onEdit={handleEditMeal} />)
        ) : (
          <div className="empty-state" style={{ padding: '36px 20px', background: 'var(--clr-card)', borderRadius: 'var(--r-lg)', border: '1px dashed var(--clr-border)', textAlign: 'center' }}>
            <div className="empty-icon">🍽️</div>
            <h3 style={{ margin: '8px 0 4px', fontSize: 16 }}>No meals logged yet today</h3>
            <p className="empty-text" style={{ fontSize: 13, color: 'var(--clr-text-soft)', marginBottom: 16 }}>Start tracking to see your calorie &amp; macro breakdown.</p>
            <button className="add" onClick={() => { setEditingMeal(null); setShowAdd(true) }}>
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

      <AddMealModal open={showAdd} onClose={handleCloseModal} date={today} editMeal={editingMeal} />
    </>
  )
}
