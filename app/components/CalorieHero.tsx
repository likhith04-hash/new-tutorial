'use client'

import { useEffect, useState } from 'react'
import { useNutrition } from '@/app/components/NutritionContext'

interface CalorieHeroProps { date: string }

export default function CalorieHero({ date }: CalorieHeroProps) {
  const { getCaloriesForDate, goals } = useNutrition()
  const calories = getCaloriesForDate(date)
  const target = goals.calories
  const remaining = Math.max(0, target - calories)
  const pct = Math.min(100, Math.round((calories / target) * 100))

  const [animWidth, setAnimWidth] = useState(0)
  useEffect(() => {
    const t = setTimeout(() => setAnimWidth(pct), 80)
    return () => clearTimeout(t)
  }, [pct])

  return (
    <section className="hero-card">
      <div className="hero-copy">
        <span className="soft-label">DAILY CALORIE TARGET</span>
        <div className="calorie-line">
          <b>{calories.toLocaleString()}</b>
          <span>/ {target.toLocaleString()} kcal</span>
        </div>
        <div className="progress">
          <i style={{ width: `${animWidth}%` }} />
        </div>
        <p><strong>{remaining > 0 ? remaining.toLocaleString() : 0} kcal</strong> remaining for today</p>
      </div>

      <div className="hero-stats">
        <div>
          <span>Burned</span>
          <b>320 <small>kcal</small></b>
        </div>
        <div className="divider" />
        <div>
          <span>Steps</span>
          <b>7,842</b>
          <small className="up">↑ 12% vs avg</small>
        </div>
      </div>

      <div className="daily-ring">
        <div>
          <b>{pct}<small>%</small></b>
          <span>daily goal</span>
        </div>
      </div>
    </section>
  )
}
