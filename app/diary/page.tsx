'use client'

import { useState } from 'react'
import Header from '@/app/components/Header'
import MealCard from '@/app/components/MealCard'
import AddMealModal from '@/app/components/AddMealModal'
import Icon from '@/app/components/Icon'
import { useNutrition, type Meal } from '@/app/components/NutritionContext'
import { Button, Card, Badge, PageHeader, MetricCard } from '@/app/components/ui/DesignSystem'

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
    <div className="dark min-h-screen bg-[#09090B] text-[#FFFFFF] font-sans px-6 md:px-8 py-8 max-w-[1280px] mx-auto space-y-8">
      <Header onLogFood={() => { setEditingMeal(null); setShowAdd(true) }} />

      <PageHeader
        badge="FOOD JOURNAL OS"
        title="Daily Food Journal"
        subtitle={dateLabel}
        action={
          <Button variant="secondary" onClick={() => { setEditingMeal(null); setShowAdd(true) }}>
            + Add Meal
          </Button>
        }
      />

      {/* Date Navigation & Summary Metrics */}
      <Card variant="default" radius="md" className="space-y-6">
        <div className="flex justify-between items-center pb-4 border-b border-white/[0.08]">
          <Button variant="outline" size="sm" onClick={() => shiftDate(-1)}>
            ← Previous Day
          </Button>
          <div className="text-center">
            <span className="text-[18px] font-semibold text-white">{dateLabel}</span>
            {selectedDate === todayStr && <Badge variant="cyan" className="ml-3">Today</Badge>}
          </div>
          <Button variant="outline" size="sm" onClick={() => shiftDate(1)} disabled={selectedDate === todayStr}>
            Next Day →
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricCard title="Calories Logged" value={totalCals} unit="kcal" badgeVariant="cyan" />
          <MetricCard title="Protein" value={macros.protein} unit="g" badgeVariant="emerald" />
          <MetricCard title="Carbs" value={macros.carbs} unit="g" badgeVariant="amber" />
          <MetricCard title="Fat" value={macros.fat} unit="g" badgeVariant="cyan" />
        </div>
      </Card>

      {/* Meal Groups List */}
      <div className="space-y-8">
        {mealGroups.length > 0 ? (
          mealGroups.map(group => (
            <Card key={group.type} variant="default" radius="md" className="space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-white/[0.08]">
                <h3 className="text-[20px] font-medium text-white">{group.type}</h3>
                <Badge variant="cyan">{group.items.reduce((s, m) => s + m.calories, 0)} kcal</Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {group.items.map(meal => (
                  <MealCard key={meal.id} meal={meal} onEdit={handleEditMeal} />
                ))}
              </div>
            </Card>
          ))
        ) : (
          <Card variant="subtle" radius="md" className="p-12 text-center space-y-4">
            <div className="text-4xl">🍽️</div>
            <h3 className="text-[20px] font-medium text-[#FFFFFF]">No meals logged for this date</h3>
            <p className="text-[16px] text-[#A1A1AA]">Start tracking to record your exact nutrition history.</p>
            <Button variant="secondary" onClick={() => { setEditingMeal(null); setShowAdd(true) }}>
              + Log First Meal
            </Button>
          </Card>
        )}
      </div>

      <AddMealModal open={showAdd} onClose={handleCloseModal} date={selectedDate} editMeal={editingMeal} />
    </div>
  )
}
