'use client'

import { useMemo } from 'react'
import Header from '@/app/components/Header'
import WeeklyChart from '@/app/components/WeeklyChart'
import MacroRing from '@/app/components/MacroRing'
import Icon from '@/app/components/Icon'
import { useNutrition } from '@/app/components/NutritionContext'
import { Card, Badge, PageHeader, MetricCard } from '@/app/components/ui/DesignSystem'

export default function ProgressPage() {
  const { weightEntries, getCaloriesForDate, getMacrosForDate, goals, getLoggingStreak, getWaterForDate, meals } = useNutrition()

  const streak = getLoggingStreak()

  const last7Days = useMemo(() =>
    Array.from({ length: 7 }, (_, i) => {
      const d = new Date(); d.setDate(d.getDate() - (6 - i))
      return d.toISOString().slice(0, 10)
    }), [])

  const { weeklyData, avgCalories, avgProtein, avgCarbs, avgFat, waterGoalCount, breakfastCount } = useMemo(() => {
    let totalCal = 0, totalP = 0, totalC = 0, totalF = 0
    let wCount = 0, bCount = 0

    const wd = last7Days.map(date => {
      const cals = getCaloriesForDate(date)
      const m = getMacrosForDate(date)
      totalCal += cals; totalP += m.protein; totalC += m.carbs; totalF += m.fat
      
      if (getWaterForDate(date) >= goals.waterGlasses) wCount++
      if (meals.some(item => item.date === date && item.type === 'Breakfast')) bCount++

      return { label: new Date(date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'short' }), value: cals, max: goals.calories }
    })

    return {
      weeklyData: wd,
      avgCalories: Math.round(totalCal / 7),
      avgProtein: Math.round(totalP / 7),
      avgCarbs: Math.round(totalC / 7),
      avgFat: Math.round(totalF / 7),
      waterGoalCount: wCount,
      breakfastCount: bCount,
    }
  }, [last7Days, getCaloriesForDate, getMacrosForDate, getWaterForDate, goals.calories, goals.waterGlasses, meals])

  const latestWeight = weightEntries.length > 0 ? weightEntries[weightEntries.length - 1].kg : 0
  const firstWeight = weightEntries.length > 0 ? weightEntries[0].kg : 0
  const weightChange = latestWeight - firstWeight

  // SVG weight chart
  const weightPoints = useMemo(() => {
    if (weightEntries.length === 0) return ''
    const kgs = weightEntries.map(w => w.kg)
    const minW = Math.min(...kgs) - 1
    const maxW = Math.max(...kgs) + 1
    const range = maxW - minW || 1
    return weightEntries.map((w, i) => {
      const x = 30 + (weightEntries.length > 1 ? (i / (weightEntries.length - 1)) * 340 : 170)
      const y = 10 + (1 - (w.kg - minW) / range) * 100
      return `${x},${y}`
    }).join(' ')
  }, [weightEntries])

  // Achievements evaluation
  const achievements = [
    {
      id: 'streak',
      title: `${streak > 0 ? streak : 3}-Day Streak`,
      desc: 'Logged meals continuously',
      icon: 'fire',
      unlocked: streak >= 3,
    },
    {
      id: 'hydration',
      title: 'Hydration Hero',
      desc: `Hit water goal ${waterGoalCount}/7 times this week`,
      icon: 'water',
      unlocked: waterGoalCount >= 3,
    },
    {
      id: 'protein',
      title: 'Protein Power',
      desc: `Averaged ${avgProtein}g protein daily (target: ${goals.proteinG}g)`,
      icon: 'zap',
      unlocked: avgProtein >= goals.proteinG * 0.75,
    },
    {
      id: 'earlybird',
      title: 'Early Bird',
      desc: `Logged breakfast ${breakfastCount}/7 days this week`,
      icon: 'trophy',
      unlocked: breakfastCount >= 4,
    },
  ]

  return (
    <div className="dark min-h-screen bg-[#09090B] text-[#FFFFFF] font-sans px-6 md:px-8 py-8 max-w-[1280px] mx-auto space-y-8">
      <Header />

      <PageHeader
        badge="METABOLIC ANALYTICS"
        title="Weekly Performance Analytics"
        subtitle="Detailed intake analytics, body weight trends, and habit achievements."
        action={<Badge variant="cyan">7-Day Analysis</Badge>}
      />

      {/* Top 4 Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard title="Avg Daily Intake" value={avgCalories} unit="kcal/day" badgeVariant="cyan" />
        <MetricCard title="Current Weight" value={latestWeight > 0 ? `${latestWeight}` : '—'} unit="kg" badgeVariant="emerald" />
        <MetricCard title="Weight Delta" value={weightChange.toFixed(1)} unit="kg" badgeVariant="amber" />
        <MetricCard title="Active Streak" value={streak} unit="days" trend="🔥 Active" badgeVariant="cyan" />
      </div>

      {/* Weekly Intake Chart */}
      <Card variant="default" radius="md" className="space-y-6">
        <div className="flex justify-between items-center pb-4 border-b border-white/[0.08]">
          <h2 className="text-[20px] font-medium text-white">7-Day Calorie Intake</h2>
          <Badge variant="cyan">Weekly Chart</Badge>
        </div>
        <WeeklyChart data={weeklyData} title="Daily Calories" color="#22D3EE" />
      </Card>

      {/* Weight Trend Chart */}
      <Card variant="default" radius="md" className="space-y-6">
        <div className="pb-4 border-b border-white/[0.08]">
          <h2 className="text-[20px] font-medium text-white">Body Weight Trend Line</h2>
        </div>

        <div className="bg-[#09090B] border border-white/[0.08] p-6 rounded-[16px]">
          <svg viewBox="0 0 400 130" className="w-full h-40 stroke-[#22D3EE] fill-none">
            <line x1="30" y1="30" x2="370" y2="30" stroke="rgba(255,255,255,0.08)" strokeDasharray="4 4" />
            <line x1="30" y1="60" x2="370" y2="60" stroke="rgba(255,255,255,0.08)" strokeDasharray="4 4" />
            <line x1="30" y1="90" x2="370" y2="90" stroke="rgba(255,255,255,0.08)" strokeDasharray="4 4" />
            {weightEntries.length > 0 && (
              <>
                <polyline points={weightPoints} strokeWidth="3" />
                {weightEntries.map((w, i) => {
                  const kgs = weightEntries.map(e => e.kg)
                  const minW = Math.min(...kgs) - 1
                  const maxW = Math.max(...kgs) + 1
                  const range = maxW - minW || 1
                  const x = 30 + (weightEntries.length > 1 ? (i / (weightEntries.length - 1)) * 340 : 170)
                  const y = 10 + (1 - (w.kg - minW) / range) * 100
                  return (
                    <g key={w.date}>
                      <circle cx={x} cy={y} r="4" fill="#22D3EE" />
                      <text x={x} y={y - 10} textAnchor="middle" fill="#FFFFFF" fontSize="10">{w.kg}kg</text>
                    </g>
                  )
                })}
              </>
            )}
          </svg>
        </div>
      </Card>

      {/* Macro Averages */}
      <Card variant="default" radius="md" className="space-y-6">
        <div className="pb-4 border-b border-white/[0.08]">
          <h2 className="text-[20px] font-medium text-white">7-Day Macro Averages</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          <div className="bg-[#09090B] border border-white/[0.08] p-6 rounded-[16px]">
            <MacroRing value={avgProtein} total={goals.proteinG} label="Protein" color="#34D399" />
          </div>
          <div className="bg-[#09090B] border border-white/[0.08] p-6 rounded-[16px]">
            <MacroRing value={avgCarbs} total={goals.carbsG} label="Carbs" color="#FACC15" />
          </div>
          <div className="bg-[#09090B] border border-white/[0.08] p-6 rounded-[16px]">
            <MacroRing value={avgFat} total={goals.fatG} label="Fat" color="#22D3EE" />
          </div>
        </div>
      </Card>

      {/* Achievements Bento Section */}
      <Card variant="default" radius="md" className="space-y-6">
        <div className="pb-4 border-b border-white/[0.08]">
          <h2 className="text-[20px] font-medium text-white">Dynamic Habit Achievements</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {achievements.map(ach => (
            <div
              key={ach.id}
              className={`p-5 rounded-[16px] bg-[#09090B] border flex items-center justify-between gap-4 ${
                ach.unlocked ? 'border-[#34D399]/40' : 'border-white/[0.08] opacity-60'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/[0.06] text-[#22D3EE] flex items-center justify-center font-bold">
                  <Icon name={ach.icon as any} size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-white text-sm">{ach.title}</h3>
                  <p className="text-[12px] text-[#A1A1AA]">{ach.desc}</p>
                </div>
              </div>
              <Badge variant={ach.unlocked ? 'emerald' : 'muted'}>
                {ach.unlocked ? 'Earned' : 'Locked'}
              </Badge>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
