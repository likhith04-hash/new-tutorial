'use client'

import { useState, useRef, useEffect } from 'react'
import { type Meal, useNutrition } from '@/app/components/NutritionContext'
import Icon from '@/app/components/Icon'

export default function MealCard({ meal }: { meal: Meal }) {
  const { removeMeal } = useNutrition()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  const icon = meal.type === 'Breakfast' ? '☼' : meal.type === 'Lunch' ? '◒' : meal.type === 'Dinner' ? '●' : '◆'

  return (
    <article className="meal">
      <div className={`meal-icon ${meal.tone}`}>{icon}</div>
      <div className="meal-main">
        <span>{meal.type}</span>
        <h3>{meal.name}</h3>
        <p>{meal.detail}</p>
      </div>
      <div className="meal-nutrition">
        <b>{meal.calories} <small>kcal</small></b>
        <span>{meal.protein}g protein</span>
      </div>
      <div ref={ref} style={{ position: 'relative' }}>
        <button className="more" onClick={() => setOpen(!open)}>•••</button>
        {open && (
          <div className="meal-actions">
            <button onClick={() => { removeMeal(meal.id); setOpen(false) }}>
              <Icon name="trash" size={14} /> Delete
            </button>
          </div>
        )}
      </div>
    </article>
  )
}
