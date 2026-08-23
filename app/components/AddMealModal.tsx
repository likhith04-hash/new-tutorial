'use client'

import { useState, useEffect, useRef } from 'react'
import Icon from '@/app/components/Icon'
import { useNutrition, type Meal, type MealTone } from '@/app/components/NutritionContext'

interface AddMealModalProps {
  open: boolean
  onClose: () => void
  date?: string
  editMeal?: Meal | null
}

const TONES: MealTone[] = ['peach', 'violet', 'green', 'coral', 'blue', 'amber']

const PRESETS = [
  { name: 'Oatmeal & Berries', type: 'Breakfast' as const, calories: 320, protein: 12, carbs: 54, fat: 6, detail: 'Rolled oats, blueberries, honey' },
  { name: 'Avocado Toast & Egg', type: 'Breakfast' as const, calories: 410, protein: 18, carbs: 36, fat: 24, detail: 'Sourdough, poached egg, avocado' },
  { name: 'Grilled Chicken Salad', type: 'Lunch' as const, calories: 450, protein: 44, carbs: 18, fat: 20, detail: 'Chicken breast, mixed greens, olive oil' },
  { name: 'Tandoori Chicken Bowl', type: 'Lunch' as const, calories: 540, protein: 43, carbs: 52, fat: 14, detail: 'Brown rice, grilled chicken, mint yogurt' },
  { name: 'Salmon & Roasted Veggies', type: 'Dinner' as const, calories: 490, protein: 38, carbs: 22, fat: 26, detail: 'Atlantic salmon, broccoli, olive oil' },
  { name: 'Dal Tadka & Roti', type: 'Dinner' as const, calories: 440, protein: 22, carbs: 56, fat: 14, detail: 'Yellow lentils, 2 wheat roti' },
  { name: 'Greek Yogurt & Honey', type: 'Snack' as const, calories: 220, protein: 18, carbs: 24, fat: 4, detail: 'Low-fat Greek yogurt, raw honey' },
  { name: 'Protein Shake', type: 'Snack' as const, calories: 250, protein: 30, carbs: 10, fat: 4, detail: 'Whey protein, almond milk' },
]

export default function AddMealModal({ open, onClose, date, editMeal }: AddMealModalProps) {
  const { addMeal, updateMeal } = useNutrition()
  const [mode, setMode] = useState<'manual' | 'photo' | 'barcode'>('manual')
  const [type, setType] = useState<'Breakfast' | 'Lunch' | 'Dinner' | 'Snack'>('Lunch')
  const [name, setName] = useState('')
  const [detail, setDetail] = useState('Quick added · 1 serving')
  const [calories, setCalories] = useState(400)
  const [protein, setProtein] = useState(15)
  const [carbs, setCarbs] = useState(45)
  const [fat, setFat] = useState(14)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisError, setAnalysisError] = useState('')
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (editMeal) {
      setType(editMeal.type)
      setName(editMeal.name)
      setDetail(editMeal.detail)
      setCalories(editMeal.calories)
      setProtein(editMeal.protein)
      setCarbs(editMeal.carbs)
      setFat(editMeal.fat)
      setMode('manual')
    } else {
      setName('')
      setDetail('Quick added · 1 serving')
      setCalories(400)
      setProtein(15)
      setCarbs(45)
      setFat(14)
      setMode('manual')
      setImagePreview(null)
    }
  }, [editMeal, open])

  if (!open) return null

  const analyzeDescription = async (description: string) => {
    if (description.trim().length < 3) { setAnalysisError('Describe the meal first, then choose Analyze.'); return }
    setAnalysisError(''); setIsAnalyzing(true)
    try {
      const res = await fetch('/api/meal-analysis', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ description }) })
      const data = await res.json() as { meal?: { name: string; type: typeof type; detail: string; calories: number; protein: number; carbs: number; fat: number; confidence: string }; error?: string }
      if (!res.ok || !data.meal) { setAnalysisError(data.error || 'Could not analyze that meal.'); return }
      const meal = data.meal; setName(meal.name); setType(meal.type); setDetail(`${meal.detail} · AI estimate (${meal.confidence} confidence)`); setCalories(Math.round(meal.calories)); setProtein(Math.round(meal.protein)); setCarbs(Math.round(meal.carbs)); setFat(Math.round(meal.fat))
    } catch { setAnalysisError('Meal analysis is temporarily unavailable. You can still enter values manually.') } finally { setIsAnalyzing(false) }
  }

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => {
      setImagePreview(event.target?.result as string)
      setAnalysisError('Image analysis needs a vision-enabled AI provider. Your image is not uploaded or stored; please describe the food to analyze it.')
    }
    reader.readAsDataURL(file)
  }

  const useBarcodeEstimate = () => {
    setMode('barcode')
    setAnalysisError('Barcode lookup requires an Open Food Facts provider key. Use manual logging while it is not connected.')
  }

  const selectPreset = (p: typeof PRESETS[0]) => {
    setName(p.name)
    setType(p.type)
    setCalories(p.calories)
    setProtein(p.protein)
    setCarbs(p.carbs)
    setFat(p.fat)
    setDetail(p.detail)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const todayStr = new Date().toISOString().slice(0, 10)

    if (editMeal) {
      updateMeal(editMeal.id, {
        type,
        name: name.trim() || 'Custom meal',
        detail: detail || 'Quick added · 1 serving',
        calories,
        protein,
        carbs,
        fat,
      })
    } else {
      addMeal({
        type,
        name: name.trim() || 'Custom meal',
        detail: detail || 'Quick added · 1 serving',
        calories,
        protein,
        carbs,
        fat,
        tone: TONES[Math.floor(Math.random() * TONES.length)],
        date: date || todayStr,
      })
    }
    onClose()
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <form className="modal" onSubmit={handleSubmit} onClick={e => e.stopPropagation()}>
        <button className="modal-close" type="button" onClick={onClose}>×</button>
        <span className="soft-label">{editMeal ? 'EDIT MEAL' : 'QUICK LOG'}</span>
        <h2>{editMeal ? 'Edit meal details' : 'Add a meal'}</h2>
        <p>{editMeal ? 'Update the nutritional values below.' : 'Describe what you ate, pick a preset, or snap a photo.'}</p>

        {!editMeal && (
          <div className="log-mode-selector">
            <button type="button" className={mode === 'manual' ? 'active' : ''} onClick={() => setMode('manual')}>
              <Icon name="edit" size={14} /> Manual
            </button>
            <button type="button" className={mode === 'photo' ? 'active' : ''} onClick={() => { setMode('photo'); fileInputRef.current?.click() }}>
              <Icon name="camera" size={15} /> Photo AI
            </button>
            <button type="button" className={mode === 'barcode' ? 'active' : ''} onClick={useBarcodeEstimate}>
              <Icon name="barcode" size={15} /> Barcode
            </button>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          style={{ display: 'none' }}
          onChange={handlePhotoUpload}
        />

        {isAnalyzing && (
          <div className="scan-assist" style={{ background: 'var(--clr-brand-light)', color: 'var(--clr-brand-hover)' }}>
            <Icon name="sparkle" size={18} />
            <span>AI is analyzing your meal description…</span>
          </div>
        )}

        {analysisError && <p className="form-error" role="alert">{analysisError}</p>}

        {imagePreview && mode === 'photo' && !isAnalyzing && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'var(--clr-bg)', padding: 8, borderRadius: 8, marginBottom: 12 }}>
            <img src={imagePreview} alt="Food scan preview" style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 6 }} />
            <div style={{ fontSize: 12 }}>
              <b>Image selected locally</b>
              <p style={{ margin: 0, color: 'var(--clr-text-soft)' }}>Vision analysis is not configured; no image was uploaded.</p>
            </div>
          </div>
        )}

        {!editMeal && mode === 'manual' && (
          <div style={{ marginBottom: 12 }}>
            <div className="ai-analysis-row"><input aria-label="Describe a meal for AI analysis" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. 2 rotis, dal and paneer" /><button type="button" onClick={() => analyzeDescription(name)} disabled={isAnalyzing}>{isAnalyzing ? 'Analyzing…' : 'Analyze'}</button></div>
            <div style={{ fontSize: 11, color: 'var(--clr-text-faint)', fontWeight: 600, letterSpacing: 0.5, marginBottom: 6 }}>POPULAR PRESETS</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, maxHeight: 84, overflowY: 'auto' }}>
              {PRESETS.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => selectPreset(p)}
                  style={{
                    fontSize: 11,
                    padding: '4px 9px',
                    borderRadius: 14,
                    border: '1px solid var(--clr-border)',
                    background: name === p.name ? 'var(--clr-brand-light)' : 'var(--clr-bg)',
                    color: name === p.name ? 'var(--clr-brand)' : 'var(--clr-text)',
                    fontWeight: name === p.name ? 600 : 400,
                  }}
                >
                  {p.name} ({p.calories} kcal)
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="meal-type-selector">
          {(['Breakfast', 'Lunch', 'Dinner', 'Snack'] as const).map(t => (
            <button key={t} type="button" className={`type-btn${type === t ? ' active' : ''}`} onClick={() => setType(t)}>
              {t}
            </button>
          ))}
        </div>

        <input
          id="meal-name-input"
          aria-label="Meal name"
          autoFocus
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="e.g. avocado toast with egg"
        />

        <div className="input-row">
          <div>
            <label htmlFor="meal-cals-input" className="input-label">Calories</label>
            <input id="meal-cals-input" type="number" value={calories} onChange={e => setCalories(+e.target.value)} min={0} />
          </div>
          <div>
            <label htmlFor="meal-protein-input" className="input-label">Protein (g)</label>
            <input id="meal-protein-input" type="number" value={protein} onChange={e => setProtein(+e.target.value)} min={0} />
          </div>
        </div>

        <div className="input-row">
          <div>
            <label htmlFor="meal-carbs-input" className="input-label">Carbs (g)</label>
            <input id="meal-carbs-input" type="number" value={carbs} onChange={e => setCarbs(+e.target.value)} min={0} />
          </div>
          <div>
            <label htmlFor="meal-fat-input" className="input-label">Fat (g)</label>
            <input id="meal-fat-input" type="number" value={fat} onChange={e => setFat(+e.target.value)} min={0} />
          </div>
        </div>

        <button className="add full" type="submit">
          <Icon name="sparkle" size={16} /> {editMeal ? 'Save changes' : 'Add to diary'}
        </button>
      </form>
    </div>
  )
}
