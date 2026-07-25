'use client'

import { useMemo } from 'react'
import Header from '@/app/components/Header'
import WeeklyChart from '@/app/components/WeeklyChart'
import MacroRing from '@/app/components/MacroRing'
import Icon from '@/app/components/Icon'
import { useNutrition } from '@/app/components/NutritionContext'

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
      color: 'gold',
      unlocked: streak >= 3,
    },
    {
      id: 'hydration',
      title: 'Hydration Hero',
      desc: `Hit water goal ${waterGoalCount}/7 times this week`,
      icon: 'water',
      color: 'blue',
      unlocked: waterGoalCount >= 3,
    },
    {
      id: 'protein',
      title: 'Protein Power',
      desc: `Averaged ${avgProtein}g protein daily (target: ${goals.proteinG}g)`,
      icon: 'zap',
      color: 'orange',
      unlocked: avgProtein >= goals.proteinG * 0.75,
    },
    {
      id: 'earlybird',
      title: 'Early Bird',
      desc: `Logged breakfast ${breakfastCount}/7 days this week`,
      icon: 'trophy',
      color: 'green',
      unlocked: breakfastCount >= 4,
    },
    {
      id: 'goalmaster',
      title: 'Goal Champion',
      desc: `Averaging ${Math.round((avgCalories / goals.calories) * 100)}% of target calories`,
      icon: 'target',
      color: 'gold',
      unlocked: avgCalories >= goals.calories * 0.85 && avgCalories <= goals.calories * 1.15,
    },
  ]

  return (
    <>
      <Header />
      <div className="progress-page">
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-label">Avg Daily Calories</div>
            <div className="stat-value">{avgCalories.toLocaleString()}</div>
            <div className="stat-change">kcal / day</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Current Weight</div>
            <div className="stat-value">{latestWeight > 0 ? `${latestWeight} kg` : '—'}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Weight Change</div>
            <div className={`stat-value ${weightChange <= 0 ? 'stat-change down' : 'stat-change up'}`}>
              {weightChange !== 0 ? `${weightChange > 0 ? '+' : ''}${weightChange.toFixed(1)} kg` : '0 kg'}
              {weightChange < 0 && ' ↓'}
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Logging Streak</div>
            <div className="stat-value">{streak} {streak === 1 ? 'day' : 'days'}</div>
            <div className="stat-change up">{streak > 0 ? '🔥 Keep it up!' : 'Start your streak today'}</div>
          </div>
        </div>

        <div className="chart-section">
          <div className="section-heading"><div><h2>Weekly Calories</h2><p>Your intake over the past 7 days</p></div></div>
          <WeeklyChart data={weeklyData} title="Daily Calories" />
        </div>

        <div className="chart-section">
          <div className="section-heading"><div><h2>Weight Trend</h2><p>Tracking your progress over time</p></div></div>
          <div className="chart-card">
            <svg viewBox="0 0 400 130" className="weight-chart" preserveAspectRatio="xMidYMid meet" style={{ width: '100%', height: 160 }}>
              {/* grid lines */}
              <line x1="30" y1="30" x2="370" y2="30" />
              <line x1="30" y1="60" x2="370" y2="60" />
              <line x1="30" y1="90" x2="370" y2="90" />
              {weightEntries.length > 0 && (
                <>
                  <polyline points={weightPoints} />
                  {weightEntries.map((w, i) => {
                    const kgs = weightEntries.map(e => e.kg)
                    const minW = Math.min(...kgs) - 1
                    const maxW = Math.max(...kgs) + 1
                    const range = maxW - minW || 1
                    const x = 30 + (weightEntries.length > 1 ? (i / (weightEntries.length - 1)) * 340 : 170)
                    const y = 10 + (1 - (w.kg - minW) / range) * 100
                    return (
                      <g key={w.date}>
                        <circle cx={x} cy={y} r={4} />
                        <text x={x} y={y - 10} textAnchor="middle">{w.kg}</text>
                      </g>
                    )
                  })}
                </>
              )}
            </svg>
          </div>
        </div>

        <div className="chart-section">
          <div className="section-heading"><div><h2>Macro Averages</h2><p>Weekly average macronutrient intake</p></div></div>
          <div className="chart-card">
            <div className="rings" style={{ padding: '20px 0' }}>
              <MacroRing value={avgProtein} total={goals.proteinG} label="Protein" color="var(--clr-protein)" />
              <MacroRing value={avgCarbs} total={goals.carbsG} label="Carbs" color="var(--clr-carbs)" />
              <MacroRing value={avgFat} total={goals.fatG} label="Fat" color="var(--clr-fat)" />
            </div>
          </div>
        </div>

        <div className="section-heading"><div><h2>Achievements</h2><p>Badges dynamically evaluated from your logs</p></div></div>
        <div className="achievements">
          {achievements.map(ach => (
            <div key={ach.id} className="achievement-card" style={{ opacity: ach.unlocked ? 1 : 0.65 }}>
              <div className={`achievement-icon ${ach.color}`}><Icon name={ach.icon as any} size={22} /></div>
              <div className="achievement-info">
                <b>{ach.title}</b>
                <p>{ach.desc}</p>
              </div>
              <span className={`badge${ach.unlocked ? '' : ' locked'}`} style={{ background: ach.unlocked ? undefined : 'var(--clr-border)', color: ach.unlocked ? undefined : 'var(--clr-text-soft)' }}>
                {ach.unlocked ? 'Earned' : 'In Progress'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
