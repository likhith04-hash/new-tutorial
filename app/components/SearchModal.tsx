'use client'

import { useState, useRef, useEffect } from 'react'
import Icon from '@/app/components/Icon'
import { useNutrition, type Meal } from '@/app/components/NutritionContext'
import { useEscapeKey } from '@/app/lib/hooks'

interface SearchModalProps {
  open: boolean
  onClose: () => void
}

export default function SearchModal({ open, onClose }: SearchModalProps) {
  const { meals } = useNutrition()
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) {
      setQuery('')
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [open])

  useEscapeKey(open, onClose)

  if (!open) return null

  let results: Meal[] = []
  if (!query.trim()) {
    results = [...meals]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5)
  } else {
    const q = query.toLowerCase()
    results = meals.filter(m => 
      m.name.toLowerCase().includes(q) || 
      m.type.toLowerCase().includes(q) || 
      m.detail.toLowerCase().includes(q)
    ).slice(0, 10)
  }

  const getMealEmoji = (type: string) => {
    if (type === 'Breakfast') return '🍳'
    if (type === 'Lunch') return '🥗'
    if (type === 'Dinner') return '🍲'
    return '🍎'
  }

  return (
    <div className="search-backdrop" onClick={onClose}>
      <div className="search-modal" onClick={e => e.stopPropagation()}>
        <div className="search-input-wrap">
          <Icon name="search" size={20} />
          <input 
            ref={inputRef}
            type="text" 
            className="search-input" 
            placeholder="Search meals by name, type..." 
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          <span className="search-shortcut">ESC</span>
        </div>
        
        <div className="search-results">
          {!query.trim() && <div className="search-section-label">Recent Meals</div>}
          
          {query.trim() && results.length === 0 ? (
            <div className="search-empty">No meals found for "{query}"</div>
          ) : (
            results.map(meal => (
              <div key={meal.id} className="search-result" onClick={onClose}>
                <div className={`meal-icon ${meal.tone}`}>
                  {getMealEmoji(meal.type)}
                </div>
                <div className="search-result-info">
                  <b>{meal.name}</b>
                  <span>{meal.type} • {meal.detail}</span>
                </div>
                <div className="search-result-meta">
                  <b>{meal.calories} kcal</b>
                  <span>{meal.date}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
