'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { useNutrition, type Meal } from '@/app/components/NutritionContext'
import AddMealModal from '@/app/components/AddMealModal'
import MealCard from '@/app/components/MealCard'
import HydrationTracker from '@/app/components/HydrationTracker'
import WeeklyChart from '@/app/components/WeeklyChart'

export default function DashboardPage() {
  const { goals, getMealsForDate, getMacrosForDate, getCaloriesForDate } = useNutrition()
  const [showAdd, setShowAdd] = useState(false)
  const [editingMeal, setEditingMeal] = useState<Meal | null>(null)
  const today = new Date().toISOString().slice(0, 10)

  const meals = getMealsForDate(today)
  const macros = getMacrosForDate(today)
  const calories = meals.reduce((s, m) => s + m.calories, 0)
  const target = goals.calories
  const remaining = Math.max(0, target - calories)
  const pct = Math.min(100, Math.round((calories / target) * 100))

  const weeklyData = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date()
      d.setDate(d.getDate() - (6 - i))
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
    <div className="dark min-h-screen bg-[#09090B] text-[#FFFFFF] font-sans px-6 md:px-8 py-8 max-w-[1280px] mx-auto space-y-8">
      {/* Top Action & Date Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-white/[0.08]">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-[#111113] px-3.5 py-1 text-[13px] font-medium text-[#22D3EE] mb-2">
            <span className="h-2 w-2 rounded-full bg-[#22D3EE] animate-pulse" />
            TODAY&apos;S METABOLIC DASHBOARD
          </div>
          <h1 className="text-3xl md:text-[44px] font-semibold text-[#FFFFFF] tracking-tight leading-tight">
            Nutrition Overview
          </h1>
          <p className="text-[18px] text-[#A1A1AA] mt-1">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => window.dispatchEvent(new CustomEvent('open-search'))}
            className="inline-flex h-10 items-center gap-2 rounded-full bg-[#111113] border border-white/[0.08] px-4 text-[13px] font-medium text-[#A1A1AA] hover:text-[#FFFFFF] hover:border-white/20 transition-all"
          >
            <span>🔍 Search Food</span>
            <kbd className="bg-white/10 px-1.5 py-0.5 rounded text-[10px] text-white">⌘K</kbd>
          </button>
          <button
            onClick={() => { setEditingMeal(null); setShowAdd(true) }}
            className="inline-flex h-10 items-center justify-center rounded-full bg-[#22D3EE] text-[#09090B] font-bold px-5 text-[14px] hover:bg-[#34D399] transition-all duration-300 shadow-[0_0_20px_rgba(34,211,238,0.2)] active:scale-95"
          >
            + Log Food
          </button>
        </div>
      </div>

      {/* Hero Bento Calorie Widget */}
      <div className="bg-[#111113] border border-white/[0.08] rounded-[20px] p-8 shadow-2xl hover:border-[#22D3EE]/30 transition-all duration-300">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Big Calorie Metric */}
          <div className="lg:col-span-7 space-y-6">
            <span className="text-[13px] font-medium uppercase tracking-wider text-[#22D3EE]">Daily Calorie Budget</span>
            <div className="flex items-baseline gap-3">
              <span className="text-[40px] font-bold text-[#FFFFFF] tracking-tight leading-none">{calories.toLocaleString()}</span>
              <span className="text-[18px] text-[#A1A1AA] font-normal">/ {target.toLocaleString()} kcal</span>
            </div>

            {/* Animated Progress Bar */}
            <div className="w-full bg-[#09090B] h-3 rounded-full overflow-hidden border border-white/[0.08]">
              <div
                className="bg-gradient-to-r from-[#22D3EE] to-[#34D399] h-full transition-all duration-1000"
                style={{ width: `${pct}%` }}
              />
            </div>

            <div className="flex justify-between items-center text-[13px] text-[#A1A1AA]">
              <p><strong className="text-[#34D399]">{remaining.toLocaleString()} kcal</strong> remaining today</p>
              <span className="font-bold text-[#FFFFFF]">{pct}% Goal</span>
            </div>
          </div>

          {/* Right Column: Quick Stats */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-4">
            <div className="bg-[#09090B] border border-white/[0.08] p-5 rounded-[16px]">
              <span className="text-[13px] font-medium text-[#A1A1AA] uppercase tracking-wider">Active Burn</span>
              <p className="text-[40px] font-bold text-[#FFFFFF] leading-none mt-2">420 <span className="text-sm font-normal text-[#A1A1AA]">kcal</span></p>
              <span className="text-[13px] text-[#34D399] font-medium block mt-2">↑ 14% vs avg</span>
            </div>

            <div className="bg-[#09090B] border border-white/[0.08] p-5 rounded-[16px]">
              <span className="text-[13px] font-medium text-[#A1A1AA] uppercase tracking-wider">Step Count</span>
              <p className="text-[40px] font-bold text-[#FFFFFF] leading-none mt-2">8,420</p>
              <span className="text-[13px] text-[#22D3EE] font-medium block mt-2">Goal: 10,000</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bento Grid: Macros + Hydration */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Macros Card (8 Columns) */}
        <div className="col-span-12 md:col-span-7 bg-[#111113] border border-white/[0.08] rounded-[20px] p-8 shadow-2xl space-y-6">
          <div className="flex justify-between items-center border-b border-white/[0.08] pb-4">
            <span className="text-[18px] font-medium text-[#FFFFFF]">Macronutrient Breakdown</span>
            <span className="text-[13px] font-medium text-[#A1A1AA] uppercase tracking-wider">Today</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-[#09090B] border border-white/[0.08] p-5 rounded-[16px]">
              <span className="text-[13px] font-medium uppercase tracking-wider text-[#34D399]">Protein</span>
              <p className="text-[40px] font-bold text-[#FFFFFF] leading-none mt-2">{macros.protein}g</p>
              <p className="text-[13px] text-[#A1A1AA] mt-1">Target: {goals.proteinG}g</p>
              <div className="w-full bg-[#111113] h-1.5 rounded-full mt-3 overflow-hidden">
                <div className="bg-[#34D399] h-full" style={{ width: `${Math.min(100, (macros.protein / goals.proteinG) * 100)}%` }} />
              </div>
            </div>

            <div className="bg-[#09090B] border border-white/[0.08] p-5 rounded-[16px]">
              <span className="text-[13px] font-medium uppercase tracking-wider text-[#FACC15]">Carbs</span>
              <p className="text-[40px] font-bold text-[#FFFFFF] leading-none mt-2">{macros.carbs}g</p>
              <p className="text-[13px] text-[#A1A1AA] mt-1">Target: {goals.carbsG}g</p>
              <div className="w-full bg-[#111113] h-1.5 rounded-full mt-3 overflow-hidden">
                <div className="bg-[#FACC15] h-full" style={{ width: `${Math.min(100, (macros.carbs / goals.carbsG) * 100)}%` }} />
              </div>
            </div>

            <div className="bg-[#09090B] border border-white/[0.08] p-5 rounded-[16px]">
              <span className="text-[13px] font-medium uppercase tracking-wider text-[#22D3EE]">Fat</span>
              <p className="text-[40px] font-bold text-[#FFFFFF] leading-none mt-2">{macros.fat}g</p>
              <p className="text-[13px] text-[#A1A1AA] mt-1">Target: {goals.fatG}g</p>
              <div className="w-full bg-[#111113] h-1.5 rounded-full mt-3 overflow-hidden">
                <div className="bg-[#22D3EE] h-full" style={{ width: `${Math.min(100, (macros.fat / goals.fatG) * 100)}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Hydration Tracker (5 Columns) */}
        <div className="col-span-12 md:col-span-5">
          <HydrationTracker date={today} />
        </div>
      </div>

      {/* Meals Log Section */}
      <div className="space-y-6">
        <div className="flex justify-between items-center pb-2">
          <div>
            <h2 className="text-[18px] font-medium text-[#FFFFFF]">Logged Meals &amp; Snacks</h2>
            <p className="text-[13px] text-[#A1A1AA]">{meals.length} items logged today · {calories.toLocaleString()} kcal</p>
          </div>
          <button
            onClick={() => { setEditingMeal(null); setShowAdd(true) }}
            className="inline-flex h-9 items-center justify-center rounded-full border border-white/[0.08] bg-[#111113] px-4 text-xs font-semibold text-[#22D3EE] hover:bg-white/[0.08] transition-colors"
          >
            + Add Meal
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {meals.length > 0 ? (
            meals.map(meal => <MealCard key={meal.id} meal={meal} onEdit={handleEditMeal} />)
          ) : (
            <div className="col-span-12 bg-[#111113] border border-dashed border-white/[0.08] rounded-[20px] p-12 text-center space-y-4">
              <div className="text-4xl">🍽️</div>
              <h3 className="text-[18px] font-medium text-[#FFFFFF]">No meals logged yet today</h3>
              <p className="text-[14px] text-[#A1A1AA] max-w-sm mx-auto">
                Start tracking your meals to calculate your exact calorie &amp; macro breakdown.
              </p>
              <button
                onClick={() => { setEditingMeal(null); setShowAdd(true) }}
                className="inline-flex h-10 items-center justify-center rounded-full bg-[#22D3EE] text-[#09090B] font-bold px-6 text-xs hover:bg-[#34D399] transition-all"
              >
                + Add First Meal
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Weekly Intake Chart */}
      <div className="bg-[#111113] border border-white/[0.08] rounded-[20px] p-8 shadow-2xl space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-[18px] font-medium text-[#FFFFFF]">Weekly Intake Trend</h2>
            <p className="text-[13px] text-[#A1A1AA]">7-day historical calorie intake against daily targets</p>
          </div>
          <Link href="/progress" className="text-[13px] font-medium text-[#22D3EE] hover:underline">
            View Analytics →
          </Link>
        </div>
        <WeeklyChart data={weeklyData} title="Daily Calories" color="#22D3EE" />
      </div>

      {/* Modal */}
      <AddMealModal open={showAdd} onClose={handleCloseModal} editMeal={editingMeal} />
    </div>
  )
}
