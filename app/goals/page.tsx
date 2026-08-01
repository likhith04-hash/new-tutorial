'use client'

import Header from '@/app/components/Header'
import Icon from '@/app/components/Icon'
import MacroRing from '@/app/components/MacroRing'
import { useNutrition, type UserGoals } from '@/app/components/NutritionContext'
import { todayISO } from '@/app/lib/date'
import { useSyncedState } from '@/app/lib/hooks'

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
  const [local, setLocal] = useSyncedState(goals)
  const today = todayISO()
  const todayMacros = getMacrosForDate(today)
  const todayCals = getCaloriesForDate(today)

  const setField = (field: keyof UserGoals, value: number) => {
    setLocal(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = () => updateGoals(local)

  return (
    <>
      <Header />
      <div className="goals-page">
        <div className="section-heading"><div><h2>Goal Type</h2><p>What&apos;s your primary objective?</p></div></div>
        <div className="goal-type-selector">
          {(['lose', 'maintain', 'gain'] as const).map(type => (
            <button key={type} className={`type-option${local.goalType === type ? ' active' : ''}`} onClick={() => setLocal(p => ({ ...p, goalType: type }))}>
              <div className="option-icon">
                <Icon name={type === 'lose' ? 'chart' : type === 'maintain' ? 'target' : 'zap'} size={22} />
              </div>
              <b>{type.charAt(0).toUpperCase() + type.slice(1)}</b>
              <p>{type === 'lose' ? 'Reduce body fat gradually' : type === 'maintain' ? 'Keep your current weight' : 'Build muscle and strength'}</p>
            </button>
          ))}
        </div>

        <div className="section-heading"><div><h2>Activity Level</h2><p>How active are you on a typical day?</p></div></div>
        <div className="activity-cards">
          {ACTIVITIES.map(a => (
            <button key={a.id} className={`activity-card${local.activityLevel === a.id ? ' active' : ''}`} onClick={() => setLocal(p => ({ ...p, activityLevel: a.id }))}>
              <b>{a.label}</b>
              <p>{a.desc}</p>
            </button>
          ))}
        </div>

        <div className="section-heading"><div><h2>Daily Targets</h2><p>Set your nutrition goals and track today&apos;s progress</p></div></div>
        <div className="goal-cards">
          <div className="goal-card">
            <div className="goal-header"><label htmlFor="goal-cals">Calories</label><span>{todayCals} / {local.calories} kcal</span></div>
            <div className="goal-ring-wrap"><MacroRing value={todayCals} total={local.calories} label="kcal" color="var(--clr-hero-accent)" size={80} unit="kcal" /></div>
            <input id="goal-cals" type="number" className="goal-input" value={local.calories} onChange={e => setField('calories', +e.target.value)} onBlur={handleSave} aria-label="Daily calorie target" />
          </div>
          <div className="goal-card">
            <div className="goal-header"><label htmlFor="goal-protein">Protein</label><span>{todayMacros.protein}g / {local.proteinG}g</span></div>
            <div className="goal-ring-wrap"><MacroRing value={todayMacros.protein} total={local.proteinG} label="Protein" color="var(--clr-protein)" size={80} /></div>
            <input id="goal-protein" type="number" className="goal-input" value={local.proteinG} onChange={e => setField('proteinG', +e.target.value)} onBlur={handleSave} aria-label="Daily protein target (g)" />
          </div>
          <div className="goal-card">
            <div className="goal-header"><label htmlFor="goal-carbs">Carbs</label><span>{todayMacros.carbs}g / {local.carbsG}g</span></div>
            <div className="goal-ring-wrap"><MacroRing value={todayMacros.carbs} total={local.carbsG} label="Carbs" color="var(--clr-carbs)" size={80} /></div>
            <input id="goal-carbs" type="number" className="goal-input" value={local.carbsG} onChange={e => setField('carbsG', +e.target.value)} onBlur={handleSave} aria-label="Daily carbs target (g)" />
          </div>
          <div className="goal-card">
            <div className="goal-header"><label htmlFor="goal-fat">Fat</label><span>{todayMacros.fat}g / {local.fatG}g</span></div>
            <div className="goal-ring-wrap"><MacroRing value={todayMacros.fat} total={local.fatG} label="Fat" color="var(--clr-fat)" size={80} /></div>
            <input id="goal-fat" type="number" className="goal-input" value={local.fatG} onChange={e => setField('fatG', +e.target.value)} onBlur={handleSave} aria-label="Daily fat target (g)" />
          </div>
          <div className="goal-card">
            <div className="goal-header"><label htmlFor="goal-water">Water</label><span>{local.waterGlasses} glasses / day</span></div>
            <div className="goal-ring-wrap" style={{ padding: '10px 0' }}><Icon name="water" size={36} /></div>
            <input id="goal-water" type="number" className="goal-input" value={local.waterGlasses} onChange={e => setField('waterGlasses', +e.target.value)} onBlur={handleSave} aria-label="Daily water glasses target" />
          </div>
        </div>

        <button className="save-btn" onClick={handleSave}>Save changes</button>
      </div>
    </>
  )
}
