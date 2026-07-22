'use client'

import { useMemo, useState } from 'react'

type Meal = { type: string; name: string; detail: string; calories: number; protein: number; tone: string }
const seedMeals: Meal[] = [
  { type: 'Breakfast', name: 'Greek yogurt bowl', detail: 'Greek yogurt, berries, granola', calories: 386, protein: 26, tone: 'peach' },
  { type: 'Lunch', name: 'Tandoori chicken bowl', detail: 'Brown rice, cucumber, mint', calories: 542, protein: 43, tone: 'violet' },
  { type: 'Snack', name: 'Almonds & apple', detail: '28g almonds · 1 medium apple', calories: 259, protein: 6, tone: 'green' }
]

const Icon = ({ name, size = 19 }: { name: string; size?: number }) => {
  const icons: Record<string, string> = { grid: '▦', chart: '⌁', fork: '♧', spark: '✦', target: '◎', water: '◒', settings: '⚙', plus: '+', bell: '♧', arrow: '→', search: '⌕', fire: '♨', check: '✓', menu: '☰' }
  return <span aria-hidden style={{ fontSize: size, lineHeight: 1 }}>{icons[name] || '•'}</span>
}

function Ring({ value, total, label, color }: { value: number; total: number; label: string; color: string }) {
  const pct = Math.min(100, Math.round(value / total * 100))
  return <div className="macro"><div className="ring" style={{ background: `conic-gradient(${color} ${pct * 3.6}deg, #eee9e1 0deg)` }}><div className="ring-hole"><b>{value}g</b><small>{label}</small></div></div><div className="macro-total">of {total}g</div></div>
}

export default function Dashboard() {
  const [meals, setMeals] = useState(seedMeals); const [water, setWater] = useState(5); const [showAdd, setShowAdd] = useState(false); const [query, setQuery] = useState('')
  const calories = useMemo(() => meals.reduce((sum, meal) => sum + meal.calories, 0), [meals])
  const protein = useMemo(() => meals.reduce((sum, meal) => sum + meal.protein, 0), [meals])
  const remaining = 2100 - calories
  function addQuickMeal() { const name = query.trim() || 'Avocado toast'; setMeals([...meals, { type: 'Dinner', name, detail: 'Quick added · 1 serving', calories: 410, protein: 14, tone: 'coral' }]); setQuery(''); setShowAdd(false) }
  return <main className="shell">
    <aside className="sidebar"><div className="brand"><span className="brand-mark">n</span><span>Nourish</span></div><nav><a className="nav active"><Icon name="grid"/>Dashboard</a><a className="nav"><Icon name="chart"/>Progress</a><a className="nav"><Icon name="fork"/>Food diary</a><a className="nav"><Icon name="spark"/>AI coach <i>New</i></a><a className="nav"><Icon name="target"/>Goals</a></nav><div className="side-bottom"><a className="nav"><Icon name="settings"/>Settings</a><div className="profile"><div className="avatar">AS</div><div><b>Ananya Sharma</b><small>Free plan</small></div><span>⌄</span></div></div></aside>
    <section className="content"><header><button className="mobile-menu"><Icon name="menu" /></button><div><p className="eyebrow">TUESDAY, JUNE 10</p><h1>Good morning, Ananya <span>✦</span></h1></div><div className="header-actions"><button className="round"><Icon name="search" /></button><button className="round notification"><Icon name="bell" /><em /></button><button className="add" onClick={() => setShowAdd(true)}><Icon name="plus" size={22}/> Log food</button></div></header>
      <section className="hero-card"><div className="hero-copy"><span className="soft-label">DAILY CALORIE TARGET</span><div className="calorie-line"><b>{calories.toLocaleString()}</b><span>/ 2,100 kcal</span></div><div className="progress"><i style={{ width: `${calories / 21}%` }} /></div><p><strong>{remaining > 0 ? remaining : 0} kcal</strong> remaining for today</p></div><div className="hero-stats"><div><span>Burned</span><b>320 <small>kcal</small></b></div><div className="divider"/><div><span>Steps</span><b>7,842</b><small className="up">↑ 12% vs avg</small></div></div><div className="daily-ring"><div><b>68<small>%</small></b><span>daily goal</span></div></div></section>
      <section className="section-heading"><div><h2>Today&apos;s nutrition</h2><p>Balanced and right on track.</p></div><button className="link">View details <Icon name="arrow"/></button></section>
      <section className="nutrition-grid"><div className="macros-card"><div className="macro-heading"><b>Macronutrients</b><span>Today</span></div><div className="rings"><Ring value={protein} total={130} label="Protein" color="#f48b62"/><Ring value={168} total={240} label="Carbs" color="#8067ee"/><Ring value={54} total={70} label="Fat" color="#6fae87"/></div></div><div className="water-card"><div className="water-top"><span className="water-icon"><Icon name="water" size={28}/></span><span className="soft-label">HYDRATION</span><button onClick={() => setWater(Math.min(8, water + 1))}>+ Add</button></div><div className="water-value"><b>{(water * .25).toFixed(2)}L</b><span>of 2.0L goal</span></div><div className="droplets">{[...Array(8)].map((_, i) => <span key={i} className={i < water ? 'filled' : ''}>●</span>)}</div><p>{water >= 8 ? 'Goal complete — beautifully hydrated!' : `${8 - water} glasses to reach your goal`}</p></div></section>
      <section className="section-heading meals-title"><div><h2>Today&apos;s meals</h2><p>{meals.length} items logged · {calories.toLocaleString()} kcal</p></div><button className="link" onClick={() => setShowAdd(true)}>Add meal <Icon name="plus"/></button></section>
      <section className="meal-list">{meals.map((meal, i) => <article className="meal" key={`${meal.name}-${i}`}><div className={`meal-icon ${meal.tone}`}>{meal.type === 'Breakfast' ? '☼' : meal.type === 'Lunch' ? '◒' : '●'}</div><div className="meal-main"><span>{meal.type}</span><h3>{meal.name}</h3><p>{meal.detail}</p></div><div className="meal-nutrition"><b>{meal.calories} <small>kcal</small></b><span>{meal.protein}g protein</span></div><button className="more">•••</button></article>)}</section>
    </section>
    {showAdd && <div className="modal-backdrop" onClick={() => setShowAdd(false)}><form className="modal" onSubmit={(e) => { e.preventDefault(); addQuickMeal() }} onClick={(e) => e.stopPropagation()}><button className="modal-close" type="button" onClick={() => setShowAdd(false)}>×</button><span className="soft-label">QUICK LOG</span><h2>Add a meal</h2><p>Describe what you ate and we&apos;ll add an estimate to your diary.</p><input autoFocus value={query} onChange={e => setQuery(e.target.value)} placeholder="e.g. avocado toast with egg"/><button className="add full" type="submit"><Icon name="spark"/> Add to diary</button></form></div>}
  </main>
}
