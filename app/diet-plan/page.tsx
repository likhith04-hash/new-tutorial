'use client'

import { useState, useEffect } from 'react'
import Header from '@/app/components/Header'
import Icon from '@/app/components/Icon'

interface MealSlot {
  mealType: string
  food: { id: string; name: string; calories: number; proteinG: string; carbsG: string; fatG: string; servingSize: string | null }
  calories: number
  proteinG: number
  carbsG: number
  fatG: number
}

interface PlanData {
  dietType: string
  calorieTarget: number
  proteinTarget: number
  plan: { meals: MealSlot[]; totalCalories: number; totalProteinG: number; totalCarbsG: number; totalFatG: number }
}

const mealIcons: Record<string, { icon: string; color: string }> = {
  Breakfast: { icon: '☼', color: 'peach' },
  Lunch: { icon: '◒', color: 'violet' },
  Dinner: { icon: '◆', color: 'green' },
  Snack: { icon: '●', color: 'amber' },
}

export default function DietPlanPage() {
  const [plan, setPlan] = useState<PlanData | null>(null)
  const [loading, setLoading] = useState(true)
  const [addingId, setAddingId] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/diet-plan')
      .then(r => r.json())
      .then(data => { setPlan(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const handleAddToLog = async (meal: MealSlot) => {
    setAddingId(meal.food.id)
    const today = new Date().toISOString().slice(0, 10)
    try {
      await fetch('/api/meals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          foodId: meal.food.id,
          mealType: meal.mealType,
          calories: meal.calories,
          protein: meal.proteinG,
          carbs: meal.carbsG,
          fat: meal.fatG,
          detail: meal.food.servingSize || '',
          date: today,
        }),
      })
    } catch { /* silent */ }
    setAddingId(null)
  }

  const handleRegenerate = async () => {
    setLoading(true)
    const res = await fetch('/api/diet-plan')
    const data = await res.json()
    setPlan(data)
    setLoading(false)
  }

  if (loading) {
    return (
      <>
        <Header />
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>🍽️</div>
          <h2 style={{ fontSize: 18, marginBottom: 8 }}>Generating your meal plan...</h2>
          <p style={{ color: 'var(--clr-text-soft)', fontSize: 13 }}>Based on your diet type and nutrition targets</p>
        </div>
      </>
    )
  }

  if (!plan || !plan.plan?.meals?.length) {
    return (
      <>
        <Header />
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>📋</div>
          <h2 style={{ fontSize: 18, marginBottom: 8 }}>No meal plan available</h2>
          <p style={{ color: 'var(--clr-text-soft)', fontSize: 13, marginBottom: 16 }}>Complete your onboarding to get a personalized plan.</p>
        </div>
      </>
    )
  }

  const { meals, totalCalories, totalProteinG, totalCarbsG, totalFatG } = plan.plan
  const calPct = Math.round((totalCalories / plan.calorieTarget) * 100)
  const proteinPct = Math.round((totalProteinG / plan.proteinTarget) * 100)

  return (
    <>
      <Header />
      <div className="progress-page">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div>
            <h1 style={{ fontSize: 24, marginBottom: 4 }}>Today&apos;s Meal Plan</h1>
            <p style={{ color: 'var(--clr-text-soft)', fontSize: 13 }}>
              {plan.dietType.replace('_', '-')} · {plan.calorieTarget} kcal target
            </p>
          </div>
          <button className="link" onClick={handleRegenerate} style={{ fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
            <Icon name="repeat" size={15} /> Regenerate
          </button>
        </div>

        <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: 24 }}>
          {[
            { label: 'Calories', value: totalCalories, target: plan.calorieTarget, unit: 'kcal', pct: calPct },
            { label: 'Protein', value: totalProteinG, target: plan.proteinTarget, unit: 'g', pct: proteinPct },
            { label: 'Carbs', value: totalCarbsG, target: Math.round(plan.calorieTarget * 0.48 / 4), unit: 'g' },
            { label: 'Fat', value: totalFatG, target: Math.round(plan.calorieTarget * 0.27 / 9), unit: 'g' },
          ].map(s => (
            <div key={s.label} className="stat-card">
              <div className="stat-label">{s.label}</div>
              <div className="stat-value">{s.value}{s.unit}</div>
              <div className="stat-change" style={{ color: 'var(--clr-text-soft)' }}>
                of {s.target}{s.unit} {s.pct ? `(${s.pct}%)` : ''}
              </div>
            </div>
          ))}
        </div>

        <div className="meal-list">
          {meals.map((meal, i) => {
            const style = mealIcons[meal.mealType] || mealIcons.Snack
            return (
              <article key={i} className="meal">
                <div className={`meal-icon ${style.color}`} title={meal.mealType}>{style.icon}</div>
                <div className="meal-main">
                  <span>{meal.mealType}</span>
                  <h3>{meal.food.name}</h3>
                  <p>{meal.food.servingSize || ''}</p>
                </div>
                <div className="meal-nutrition">
                  <b>{meal.calories} <small>kcal</small></b>
                  <span>{meal.proteinG}g protein</span>
                </div>
                <button
                  className="link"
                  onClick={() => handleAddToLog(meal)}
                  disabled={addingId === meal.food.id}
                  style={{ fontSize: 12, fontWeight: 600, padding: '6px 12px', background: 'var(--clr-brand-light)', borderRadius: 6, color: 'var(--clr-brand-hover)', whiteSpace: 'nowrap' }}
                >
                  {addingId === meal.food.id ? '...' : 'Add to log →'}
                </button>
              </article>
            )
          })}
        </div>
      </div>
    </>
  )
}
