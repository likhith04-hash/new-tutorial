'use client'

import { useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Icon from '@/app/components/Icon'
import { useNutrition } from '@/app/components/NutritionContext'

export default function SmartNudge() {
  const router = useRouter()
  const { goals, meals, waterLogs, getLoggingStreak, getCaloriesForDate, getMacrosForDate, getWaterForDate } = useNutrition()
  
  const today = new Date().toISOString().slice(0, 10)
  const currentHour = new Date().getHours()
  const streak = getLoggingStreak()

  const nudge = useMemo(() => {
    const todayCals = getCaloriesForDate(today)
    const todayMacros = getMacrosForDate(today)
    const todayWater = getWaterForDate(today)
    const calsLeft = goals.calories - todayCals

    // 1. Time-sensitive evening calorie nudge
    if (calsLeft > 500 && currentHour >= 16) {
      return {
        type: 'nudge',
        title: 'Proactive AI Suggestion',
        text: `You have ${calsLeft} kcal left for today with dinner ahead. Want a ${goals.goalType === 'lose' ? 'light' : 'protein-packed'} meal suggestion?`,
        actionLabel: 'Ask AI Coach',
        actionQuery: `Suggest a ${goals.goalType === 'lose' ? 'light' : 'high-protein'} dinner under ${calsLeft} kcal.`,
        badge: 'Evening Nudge',
      }
    }

    // 2. Midday hydration nudge
    if (todayWater < Math.floor(goals.waterGlasses / 2) && currentHour >= 14) {
      return {
        type: 'water',
        title: 'Hydration Alert',
        text: `You've logged ${todayWater} of ${goals.waterGlasses} glasses of water today. Time for a glass! 💧`,
        actionLabel: null,
        badge: 'Water Goal',
      }
    }

    // 3. Computed 7-day protein pattern
    let proteinLowDays = 0
    for (let i = 0; i < 7; i++) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const dStr = d.toISOString().slice(0, 10)
      const m = getMacrosForDate(dStr)
      if (m.protein < goals.proteinG * 0.8) {
        proteinLowDays++
      }
    }

    if (proteinLowDays >= 3) {
      return {
        type: 'insight',
        title: 'Real Data Pattern',
        text: `Protein fell below target on ${proteinLowDays} of the last 7 days. Adding Greek yogurt, eggs, or chicken can help hit your ${goals.proteinG}g goal.`,
        actionLabel: 'Protein Tips',
        actionQuery: 'How can I easily add 20g more protein to my daily routine?',
        badge: 'Pattern Found',
      }
    }

    // 4. Streak motivation
    if (streak >= 3) {
      return {
        type: 'streak',
        title: 'Logging Momentum',
        text: `🔥 You're on a ${streak}-day logging streak! Consistent tracking doubles your chances of reaching your ${goals.goalType} goal.`,
        actionLabel: null,
        badge: `${streak} Day Streak`,
      }
    }

    // 5. Default weekly average insight
    let sumCals = 0
    for (let i = 0; i < 7; i++) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      sumCals += getCaloriesForDate(d.toISOString().slice(0, 10))
    }
    const avgCals = Math.round(sumCals / 7)
    const pct = Math.round((avgCals / goals.calories) * 100)

    return {
      type: 'overview',
      title: 'Weekly Intake Trend',
      text: `You're averaging ${avgCals} kcal/day over the last 7 days (${pct}% of your ${goals.calories} kcal ${goals.goalType} target).`,
      actionLabel: 'View Progress',
      route: '/progress',
      badge: 'Computed Insight',
    }
  }, [goals, meals, waterLogs, today, currentHour, streak, getCaloriesForDate, getMacrosForDate, getWaterForDate])

  const handleAction = () => {
    if (nudge.route) {
      router.push(nudge.route)
    } else if (nudge.actionQuery) {
      router.push(`/coach?prompt=${encodeURIComponent(nudge.actionQuery)}`)
    }
  }

  return (
    <div className="insight-card" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
      <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
        <div className="insight-icon" style={{ background: nudge.type === 'nudge' ? 'var(--clr-hero-accent)' : nudge.type === 'streak' ? '#ffefe6' : undefined }}>
          <Icon name={nudge.type === 'nudge' ? 'sparkle' : nudge.type === 'streak' ? 'fire' : nudge.type === 'water' ? 'water' : 'chart'} size={20} />
        </div>
        <div className="insight-content">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
            <b>{nudge.title}</b>
            <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 10, background: 'var(--clr-bg)', border: '1px solid var(--clr-border)', color: 'var(--clr-text-soft)' }}>
              {nudge.badge}
            </span>
          </div>
          <p style={{ margin: 0 }}>{nudge.text}</p>
        </div>
      </div>
      {nudge.actionLabel && (
        <button
          onClick={handleAction}
          className="link"
          style={{ whiteSpace: 'nowrap', fontSize: 12, fontWeight: 600, padding: '6px 12px', background: 'var(--clr-brand-light)', borderRadius: 6, color: 'var(--clr-brand-hover)' }}
        >
          {nudge.actionLabel} →
        </button>
      )}
    </div>
  )
}
