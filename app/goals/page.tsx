'use client'

import { useState, useEffect } from 'react'
import Header from '@/app/components/Header'
import Icon from '@/app/components/Icon'
import { useNutrition, type UserGoals } from '@/app/components/NutritionContext'
import { Button, Card, Badge, PageHeader, Input } from '@/app/components/ui/DesignSystem'

type ActivityLevel = UserGoals['activityLevel']

const ACTIVITIES: { id: ActivityLevel; label: string; desc: string }[] = [
  { id: 'sedentary', label: 'Sedentary', desc: 'Little or no exercise' },
  { id: 'light', label: 'Lightly Active', desc: 'Light exercise 1–3 days/week' },
  { id: 'moderate', label: 'Moderate', desc: 'Moderate exercise 3–5 days/week' },
  { id: 'active', label: 'Active', desc: 'Hard exercise 6–7 days/week' },
  { id: 'very_active', label: 'Very Active', desc: 'Very hard exercise / physical job' },
]

export default function GoalsPage() {
  const { goals, updateGoals, getMacrosForDate, getCaloriesForDate } = useNutrition()
  const [local, setLocal] = useState(goals)
  const today = new Date().toISOString().slice(0, 10)
  const todayMacros = getMacrosForDate(today)
  const todayCals = getCaloriesForDate(today)

  useEffect(() => { setLocal(goals) }, [goals])

  const setField = (field: keyof UserGoals, value: number) => {
    setLocal(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = () => updateGoals(local)

  return (
    <div className="dark min-h-screen bg-[#09090B] text-[#FFFFFF] font-sans px-6 md:px-8 py-8 max-w-[1280px] mx-auto space-y-8">
      <Header />

      <PageHeader
        badge="TARGET ENGINE OS"
        title="Adaptive Nutrition Goals"
        subtitle="Configure your daily energy budget, macronutrient splits, and metabolic objective."
        action={
          <Button variant="secondary" onClick={handleSave}>
            Save Goals →
          </Button>
        }
      />

      {/* Goal Type Selector */}
      <Card variant="default" radius="md" className="space-y-6">
        <div className="flex justify-between items-center pb-4 border-b border-white/[0.08]">
          <h2 className="text-[20px] font-medium text-white">Metabolic Objective</h2>
          <Badge variant="cyan">{local.goalType.toUpperCase()}</Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(['lose', 'maintain', 'gain'] as const).map(type => {
            const isActive = local.goalType === type
            return (
              <button
                key={type}
                onClick={() => setLocal(p => ({ ...p, goalType: type }))}
                className={`p-6 rounded-[16px] text-left transition-all duration-200 cursor-pointer border ${
                  isActive
                    ? 'bg-[#18181B] border-[#22D3EE] shadow-[0_0_20px_rgba(34,211,238,0.15)]'
                    : 'bg-[#09090B] border-white/[0.08] hover:bg-white/[0.04]'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-[#22D3EE]/10 text-[#22D3EE] flex items-center justify-center font-bold text-lg mb-4">
                  <Icon name={type === 'lose' ? 'chart' : type === 'maintain' ? 'target' : 'zap'} size={20} />
                </div>
                <h3 className="text-[18px] font-semibold text-white capitalize">{type} Weight</h3>
                <p className="text-[14px] text-[#A1A1AA] mt-1">
                  {type === 'lose' ? 'Reduce body fat gradually (-500 kcal deficit)' : type === 'maintain' ? 'Maintain current metabolic weight' : 'Build muscle mass (+300 kcal surplus)'}
                </p>
              </button>
            )
          })}
        </div>
      </Card>

      {/* Activity Level Cards */}
      <Card variant="default" radius="md" className="space-y-6">
        <div className="pb-4 border-b border-white/[0.08]">
          <h2 className="text-[20px] font-medium text-white">Daily Activity Level</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {ACTIVITIES.map(a => {
            const isActive = local.activityLevel === a.id
            return (
              <button
                key={a.id}
                onClick={() => setLocal(p => ({ ...p, activityLevel: a.id }))}
                className={`p-4 rounded-[14px] text-left transition-all duration-200 cursor-pointer border ${
                  isActive
                    ? 'bg-[#18181B] border-[#34D399] text-white'
                    : 'bg-[#09090B] border-white/[0.08] text-[#A1A1AA] hover:bg-white/[0.04]'
                }`}
              >
                <p className="font-semibold text-sm text-white">{a.label}</p>
                <p className="text-[12px] text-[#A1A1AA] mt-1">{a.desc}</p>
              </button>
            )
          })}
        </div>
      </Card>

      {/* Daily Targets Bento Grid */}
      <Card variant="default" radius="md" className="space-y-6">
        <div className="pb-4 border-b border-white/[0.08]">
          <h2 className="text-[20px] font-medium text-white">Target Numbers</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#09090B] border border-white/[0.08] p-5 rounded-[16px] space-y-4">
            <span className="text-[13px] font-medium uppercase tracking-wider text-[#22D3EE]">Daily Calories</span>
            <p className="text-[36px] font-bold text-white leading-none">{local.calories} <span className="text-xs font-normal text-[#A1A1AA]">kcal</span></p>
            <Input
              type="number"
              value={local.calories}
              onChange={e => setField('calories', +e.target.value)}
              onBlur={handleSave}
            />
          </div>

          <div className="bg-[#09090B] border border-white/[0.08] p-5 rounded-[16px] space-y-4">
            <span className="text-[13px] font-medium uppercase tracking-wider text-[#34D399]">Protein Target</span>
            <p className="text-[36px] font-bold text-white leading-none">{local.proteinG} <span className="text-xs font-normal text-[#A1A1AA]">grams</span></p>
            <Input
              type="number"
              value={local.proteinG}
              onChange={e => setField('proteinG', +e.target.value)}
              onBlur={handleSave}
            />
          </div>

          <div className="bg-[#09090B] border border-white/[0.08] p-5 rounded-[16px] space-y-4">
            <span className="text-[13px] font-medium uppercase tracking-wider text-[#FACC15]">Carbs Target</span>
            <p className="text-[36px] font-bold text-white leading-none">{local.carbsG} <span className="text-xs font-normal text-[#A1A1AA]">grams</span></p>
            <Input
              type="number"
              value={local.carbsG}
              onChange={e => setField('carbsG', +e.target.value)}
              onBlur={handleSave}
            />
          </div>

          <div className="bg-[#09090B] border border-white/[0.08] p-5 rounded-[16px] space-y-4">
            <span className="text-[13px] font-medium uppercase tracking-wider text-[#22D3EE]">Fat Target</span>
            <p className="text-[36px] font-bold text-white leading-none">{local.fatG} <span className="text-xs font-normal text-[#A1A1AA]">grams</span></p>
            <Input
              type="number"
              value={local.fatG}
              onChange={e => setField('fatG', +e.target.value)}
              onBlur={handleSave}
            />
          </div>
        </div>
      </Card>

      <div className="flex justify-end">
        <Button variant="secondary" size="lg" onClick={handleSave}>
          Save All Target Changes →
        </Button>
      </div>
    </div>
  )
}
