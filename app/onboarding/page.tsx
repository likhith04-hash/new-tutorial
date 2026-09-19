'use client'

import { useRouter } from 'next/navigation'
import { FormEvent, useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'

const STEPS = [
  { label: 'About You' },
  { label: 'Body Stats' },
  { label: 'Your Diet' },
  { label: 'Your Goal' },
  { label: 'Your Plan' },
]

const DIET_TYPES = [
  { value: 'vegetarian' as const, label: 'Vegetarian', desc: 'Dairy, eggs, grains, veggies', emoji: '🥬' },
  { value: 'non_vegetarian' as const, label: 'Non-Vegetarian', desc: 'Includes chicken, fish, eggs', emoji: '🍗' },
  { value: 'vegan' as const, label: 'Vegan', desc: '100% plant-based', emoji: '🌱' },
]

const ACTIVITY_LEVELS = [
  { value: 'sedentary' as const, label: 'Sedentary', desc: 'Little or no exercise' },
  { value: 'light' as const, label: 'Lightly Active', desc: 'Light exercise 1-3 days/week' },
  { value: 'moderate' as const, label: 'Moderately Active', desc: 'Moderate exercise 3-5 days/week' },
  { value: 'active' as const, label: 'Very Active', desc: 'Hard exercise 6-7 days/week' },
]

const GOAL_TYPES = [
  { value: 'lose' as const, label: 'Lose Weight', desc: 'Calorie deficit for fat loss', emoji: '📉' },
  { value: 'maintain' as const, label: 'Maintain', desc: 'Stay at current weight', emoji: '⚖️' },
  { value: 'gain' as const, label: 'Gain Muscle', desc: 'Calorie surplus for muscle', emoji: '💪' },
]

function calcTargets(weight: number, height: number, age: number, activity: string, goal: string) {
  const bmr = 10 * weight + 6.25 * height - 5 * age + 5
  const mult: Record<string, number> = { sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725 }
  const tdee = bmr * (mult[activity] || 1.55)
  const cal = goal === 'lose' ? tdee - 350 : goal === 'gain' ? tdee + 300 : tdee
  const protein = Math.round(weight * (goal === 'gain' ? 1.8 : 1.5))
  return {
    calories: Math.max(1400, Math.round(cal)),
    proteinG: protein,
    carbsG: Math.round(cal * 0.48 / 4),
    fatG: Math.round(cal * 0.27 / 9),
  }
}

export default function OnboardingPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)

  const [name, setName] = useState('')
  const [age, setAge] = useState(25)
  const [weight, setWeight] = useState(65)
  const [height, setHeight] = useState(165)
  const [activity, setActivity] = useState('moderate')
  const [goal, setGoal] = useState('lose')
  const [dietType, setDietType] = useState<'vegetarian' | 'non_vegetarian' | 'vegan'>('non_vegetarian')
  const [targets, setTargets] = useState({ calories: 2000, proteinG: 130, carbsG: 240, fatG: 70 })
  const [showOverride, setShowOverride] = useState(false)

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.name) {
      setName(session.user.name)
    }
  }, [session, status])

  useEffect(() => {
    if (status === 'unauthenticated') router.replace('/sign-in')
  }, [status, router])

  if (status === 'loading') return null

  const canProceed = () => {
    if (step === 1) return name.trim().length > 0
    if (step === 2) return age > 0 && weight > 0 && height > 0
    return true
  }

  const handleNext = () => {
    if (step === 4) {
      setTargets(calcTargets(weight, height, age, activity, goal))
    }
    if (step < 5) setStep(step + 1)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profile: { name, age, weightKg: weight, heightCm: height, activityLevel: activity, goalType: goal, dietType },
          goal: { calorieTarget: targets.calories, proteinG: targets.proteinG, carbsG: targets.carbsG, fatG: targets.fatG, waterGlasses: 8 },
        }),
      })
      router.push('/dashboard')
    } catch {
      setLoading(false)
    }
  }

  return (
    <main className="access-page">
      <form className="access-card onboarding" onSubmit={handleSubmit}>
        <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginBottom: 20 }}>
          {STEPS.map((s, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{
                width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 13, fontWeight: 600, transition: 'all 0.2s',
                background: step > i + 1 ? 'var(--clr-hero)' : step === i + 1 ? 'var(--clr-brand)' : 'var(--clr-border)',
                color: step >= i + 1 ? '#fff' : 'var(--clr-text-soft)',
                boxShadow: step === i + 1 ? '0 0 0 4px var(--clr-brand-light)' : 'none',
              }}>
                {step > i + 1 ? '✓' : i + 1}
              </div>
              {i < STEPS.length - 1 && (
                <div style={{
                  width: 28, height: 2, borderRadius: 1,
                  background: step > i + 1 ? 'var(--clr-hero)' : 'var(--clr-border)',
                }} />
              )}
            </div>
          ))}
        </div>

        <p className="landing-kicker">STEP {step} OF 5 · {STEPS[step - 1].label}</p>
        <h1>
          {step === 1 && `What should we call you, ${name || 'there'}?`}
          {step === 2 && 'Tell us about your body'}
          {step === 3 && 'Pick your diet type'}
          {step === 4 && "What's your focus?"}
          {step === 5 && 'Your personalized plan'}
        </h1>
        <p style={{ color: 'var(--clr-text-soft)', fontSize: 14, marginBottom: 20 }}>
          {step === 1 && 'Just a name so we can personalize your experience.'}
          {step === 2 && 'Help us calculate the right calorie target for you.'}
          {step === 3 && 'We will recommend meals that fit your dietary preference.'}
          {step === 4 && 'Pick an activity level and your primary goal.'}
          {step === 5 && "Here's what we recommend based on your stats."}
        </p>

        {step === 1 && (
          <div style={{ flexDirection: 'column' }}>
            <label>Your Name
              <input autoFocus placeholder="e.g., Alex" value={name} onChange={e => setName(e.target.value)} />
            </label>
          </div>
        )}

        {step === 2 && (
          <>
            <div className="form-row">
              <label>Age
                <input type="number" min={14} max={100} value={age} onChange={e => setAge(+e.target.value)} />
              </label>
            </div>
            <div className="form-row">
              <label>Weight (kg)
                <input type="number" step="0.1" min={35} max={250} value={weight} onChange={e => setWeight(+e.target.value)} />
              </label>
              <label>Height (cm)
                <input type="number" step="0.1" min={120} max={230} value={height} onChange={e => setHeight(+e.target.value)} />
              </label>
            </div>
          </>
        )}

        {step === 3 && (
          <fieldset style={{ border: 'none', padding: 0 }}>
            <div className="choice-grid">
              {DIET_TYPES.map(d => (
                <button type="button" key={d.value} onClick={() => setDietType(d.value)}
                  className={dietType === d.value ? 'selected' : ''}
                  style={{ textAlign: 'center', padding: '16px 8px' }}>
                  <div style={{ fontSize: 28, marginBottom: 6 }}>{d.emoji}</div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{d.label}</div>
                  <div style={{ fontSize: 11, opacity: 0.6, marginTop: 2 }}>{d.desc}</div>
                </button>
              ))}
            </div>
          </fieldset>
        )}

        {step === 4 && (
          <>
            <fieldset style={{ border: 'none', padding: 0, marginBottom: 16 }}>
              <legend style={{ fontWeight: 600, fontSize: 14, marginBottom: 8 }}>Activity Level</legend>
              <div className="choice-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
                {ACTIVITY_LEVELS.map(l => (
                  <button type="button" key={l.value} onClick={() => setActivity(l.value)}
                    className={activity === l.value ? 'selected' : ''}
                    style={{ textAlign: 'left', padding: '10px 12px' }}>
                    <div style={{ fontWeight: 600, fontSize: 13 }}>{l.label}</div>
                    <div style={{ fontSize: 11, opacity: 0.6 }}>{l.desc}</div>
                  </button>
                ))}
              </div>
            </fieldset>
            <fieldset style={{ border: 'none', padding: 0, marginBottom: 16 }}>
              <legend style={{ fontWeight: 600, fontSize: 14, marginBottom: 8 }}>Your Goal</legend>
              <div className="choice-grid">
                {GOAL_TYPES.map(g => (
                  <button type="button" key={g.value} onClick={() => setGoal(g.value)}
                    className={goal === g.value ? 'selected' : ''}
                    style={{ textAlign: 'center', padding: '12px 8px' }}>
                    <div style={{ fontSize: 20, marginBottom: 4 }}>{g.emoji}</div>
                    <div style={{ fontWeight: 600, fontSize: 13 }}>{g.label}</div>
                    <div style={{ fontSize: 11, opacity: 0.6 }}>{g.desc}</div>
                  </button>
                ))}
              </div>
            </fieldset>
          </>
        )}

        {step === 5 && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
              {[
                { label: 'Calories', value: targets.calories, unit: 'kcal', color: 'var(--clr-hero)' },
                { label: 'Protein', value: targets.proteinG, unit: 'g', color: 'var(--clr-protein)' },
                { label: 'Carbs', value: targets.carbsG, unit: 'g', color: 'var(--clr-carbs)' },
                { label: 'Fat', value: targets.fatG, unit: 'g', color: 'var(--clr-fat)' },
              ].map(item => (
                <div key={item.label} style={{
                  background: 'var(--clr-card)', border: '1px solid var(--clr-border)',
                  borderRadius: 'var(--r-md)', padding: 14, textAlign: 'center',
                }}>
                  <div style={{ fontSize: 24, fontWeight: 700, color: item.color }}>{item.value}</div>
                  <div style={{ fontSize: 12, color: 'var(--clr-text-soft)' }}>{item.unit} {item.label.toLowerCase()}</div>
                </div>
              ))}
            </div>

            <button type="button" onClick={() => setShowOverride(!showOverride)}
              style={{ background: 'none', border: 'none', color: 'var(--clr-brand)', fontWeight: 600, fontSize: 13, cursor: 'pointer', marginBottom: 16, padding: 0 }}>
              {showOverride ? 'Hide' : 'Customize'} targets
            </button>

            {showOverride && (
              <div className="form-row" style={{ flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
                {(['calories', 'proteinG', 'carbsG', 'fatG'] as const).map(key => (
                  <label key={key} style={{ flex: '1 1 40%', fontSize: 12 }}>
                    {key === 'calories' ? 'Calories' : key.replace('G', ' (g)')}
                    <input type="number" value={targets[key]}
                      onChange={e => setTargets(prev => ({ ...prev, [key]: +e.target.value || 0 }))} />
                  </label>
                ))}
              </div>
            )}

            <div style={{ display: 'flex', gap: 8 }}>
              <button type="button" className="landing-button" style={{ flex: 1, background: 'var(--clr-card)', color: 'var(--clr-text)', border: '1px solid var(--clr-border)' }}
                onClick={() => setStep(4)}>← Back</button>
              <button type="submit" className="landing-button" style={{ flex: 2 }} disabled={loading}>
                {loading ? 'Saving...' : 'Create my nutrition targets →'}
              </button>
            </div>
          </div>
        )}

        {step < 5 && (
          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            {step > 1 && (
              <button type="button" className="landing-button" style={{ flex: 1, background: 'var(--clr-card)', color: 'var(--clr-text)', border: '1px solid var(--clr-border)' }}
                onClick={() => setStep(step - 1)}>← Back</button>
            )}
            <button type="button" className="landing-button" style={{ flex: step > 1 ? 1 : 2 }}
              onClick={handleNext} disabled={!canProceed()}>
              Continue →
            </button>
          </div>
        )}
      </form>
    </main>
  )
}
