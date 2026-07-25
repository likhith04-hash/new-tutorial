'use client'

import { useState } from 'react'
import Header from '@/app/components/Header'
import MealCard from '@/app/components/MealCard'
import AddMealModal from '@/app/components/AddMealModal'
import Icon from '@/app/components/Icon'
import { useNutrition, type Meal } from '@/app/components/NutritionContext'

export default function DiaryPage() {
  const { getMealsForDate, getCaloriesForDate, getMacrosForDate } = useNutrition()
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10))
  const [showAdd, setShowAdd] = useState(false)
  const [editingMeal, setEditingMeal] = useState<Meal | null>(null)

  const todayStr = new Date().toISOString().slice(0, 10)

  const shiftDate = (dir: number) => {
    const d = new Date(selectedDate + 'T12:00:00')
    d.setDate(d.getDate() + dir)
    const next = d.toISOString().slice(0, 10)
    if (next <= todayStr) setSelectedDate(next)
  }

  const handleEditMeal = (meal: Meal) => {
    setEditingMeal(meal)
    setShowAdd(true)
  }

  const handleCloseModal = () => {
    setShowAdd(false)
    setEditingMeal(null)
  }

  const meals = getMealsForDate(selectedDate)
  const macros = getMacrosForDate(selectedDate)
  const totalCals = getCaloriesForDate(selectedDate)

  const mealGroups = (['Breakfast', 'Lunch', 'Dinner', 'Snack'] as const)
    .map(type => ({ type, items: meals.filter(m => m.type === type) }))
    .filter(g => g.items.length > 0)

  const dateLabel = new Date(selectedDate + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })

  return (
    <>
      <Header onLogFood={() => { setEditingMeal(null); setShowAdd(true) }} />
      <div className="diary-page">
        <div className="date-nav">
          <button className="date-nav-btn" onClick={() => shiftDate(-1)}>
            <Icon name="chevronLeft" size={18} />
          </button>
          <div className="date-display">
            {dateLabel}
            {selectedDate === todayStr && <small>Today</small>}
          </div>
          <button className="date-nav-btn" onClick={() => shiftDate(1)} disabled={selectedDate === todayStr}>
            <Icon name="chevronRight" size={18} />
          </button>
        </div>

        <div className="diary-summary">
          <div className="summary-item"><b>{totalCals}</b><span>kcal</span></div>
          <div className="summary-item"><b>{macros.protein}g</b><span>Protein</span></div>
          <div className="summary-item"><b>{macros.carbs}g</b><span>Carbs</span></div>
          <div className="summary-item"><b>{macros.fat}g</b><span>Fat</span></div>
        </div>

        {mealGroups.length > 0 ? (
          mealGroups.map(group => (
            <div key={group.type} className="meal-group">
              <div className="meal-group-header">
                <h3>{group.type}</h3>
                <span>{group.items.reduce((s, m) => s + m.calories, 0)} kcal</span>
              </div>
              <div className="meal-list">
                {group.items.map(meal => <MealCard key={meal.id} meal={meal} onEdit={handleEditMeal} />)}
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <div className="empty-icon"><Icon name="fork" size={28} /></div>
            <div className="empty-text">
              <h3>No meals logged</h3>
              <p>Start tracking by adding your first meal for this day.</p>
            </div>
            <button className="add" onClick={() => { setEditingMeal(null); setShowAdd(true) }}>
              <Icon name="plus" size={18} /> Add meal
            </button>
          </div>
        )}
      </div>
      <AddMealModal open={showAdd} onClose={handleCloseModal} date={selectedDate} editMeal={editingMeal} />
    </>
  )
}
