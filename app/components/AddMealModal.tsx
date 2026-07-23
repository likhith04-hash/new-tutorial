'use client'

import { useState } from 'react'
import Icon from '@/app/components/Icon'
import { useNutrition, type MealTone } from '@/app/components/NutritionContext'

interface AddMealModalProps {
  open: boolean
  onClose: () => void
  date?: string
}

const TONES: MealTone[] = ['peach', 'violet', 'green', 'coral', 'blue', 'amber']

export default function AddMealModal({ open, onClose, date }: AddMealModalProps) {
  const { addMeal } = useNutrition()
  const [type, setType] = useState<'Breakfast' | 'Lunch' | 'Dinner' | 'Snack'>('Lunch')
  const [name, setName] = useState('')
  const [calories, setCalories] = useState(400)
  const [protein, setProtein] = useState(15)
  const [carbs, setCarbs] = useState(45)
  const [fat, setFat] = useState(14)

  if (!open) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const today = new Date().toISOString().slice(0, 10)
    addMeal({
      type,
      name: name.trim() || 'Custom meal',
      detail: 'Quick added · 1 serving',
      calories,
      protein,
      carbs,
      fat,
      tone: TONES[Math.floor(Math.random() * TONES.length)],
      date: date || today,
    })
    setName(''); setCalories(400); setProtein(15); setCarbs(45); setFat(14)
    onClose()
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <form className="modal" onSubmit={handleSubmit} onClick={e => e.stopPropagation()}>
        <button className="modal-close" type="button" onClick={onClose}>×</button>
        <span className="soft-label">QUICK LOG</span>
        <h2>Add a meal</h2>
        <p>Describe what you ate and we&apos;ll add it to your diary.</p>

        <div className="meal-type-selector">
          {(['Breakfast', 'Lunch', 'Dinner', 'Snack'] as const).map(t => (
            <button key={t} type="button" className={`type-btn${type === t ? ' active' : ''}`} onClick={() => setType(t)}>
              {t}
            </button>
          ))}
        </div>

        <input autoFocus value={name} onChange={e => setName(e.target.value)} placeholder="e.g. avocado toast with egg" />

        <div className="input-row">
          <div>
            <label className="input-label">Calories</label>
            <input type="number" value={calories} onChange={e => setCalories(+e.target.value)} min={0} />
          </div>
          <div>
            <label className="input-label">Protein (g)</label>
            <input type="number" value={protein} onChange={e => setProtein(+e.target.value)} min={0} />
          </div>
        </div>

        <div className="input-row">
          <div>
            <label className="input-label">Carbs (g)</label>
            <input type="number" value={carbs} onChange={e => setCarbs(+e.target.value)} min={0} />
          </div>
          <div>
            <label className="input-label">Fat (g)</label>
            <input type="number" value={fat} onChange={e => setFat(+e.target.value)} min={0} />
          </div>
        </div>

        <button className="add full" type="submit">
          <Icon name="sparkle" size={16} /> Add to diary
        </button>
      </form>
    </div>
  )
}
