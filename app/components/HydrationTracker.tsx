'use client'

import Icon from '@/app/components/Icon'
import { useNutrition } from '@/app/components/NutritionContext'

export default function HydrationTracker({ date }: { date: string }) {
  const { getWaterForDate, addWater, goals } = useNutrition()
  const glasses = getWaterForDate(date)
  const target = goals.waterGlasses
  const remaining = Math.max(0, target - glasses)

  return (
    <div className="water-card">
      <div className="water-top">
        <span className="water-icon"><Icon name="water" size={18} /></span>
        <span className="soft-label">HYDRATION</span>
        <button onClick={() => addWater(date)}>+ Add</button>
      </div>
      <div className="water-value">
        <b>{(glasses * 0.25).toFixed(2)}L</b>
        <span>of {(target * 0.25).toFixed(1)}L goal</span>
      </div>
      <div className="droplets">
        {[...Array(target)].map((_, i) => (
          <span key={i} className={i < glasses ? 'filled' : ''}>●</span>
        ))}
      </div>
      <p>{glasses >= target ? 'Goal complete — beautifully hydrated!' : `${remaining} glasses to reach your goal`}</p>
    </div>
  )
}
