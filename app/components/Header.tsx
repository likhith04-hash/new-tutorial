'use client'

import Icon from '@/app/components/Icon'
import { useNutrition } from '@/app/components/NutritionContext'

interface HeaderProps {
  onMenuToggle?: () => void
  onLogFood?: () => void
  onSearch?: () => void
}

export default function Header({ onMenuToggle, onLogFood, onSearch }: HeaderProps) {
  const { profile } = useNutrition()

  const hour = new Date().getHours()
  const greeting = hour >= 5 && hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
  const dateStr = new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'long', day: 'numeric' }).format(new Date()).toUpperCase()
  const firstName = profile.name.split(' ')[0]

  return (
    <header>
      <button className="mobile-menu" onClick={onMenuToggle}>
        <Icon name="menu" size={24} />
      </button>
      <div>
        <p className="eyebrow">{dateStr}</p>
        <h1>{greeting}, {firstName} <span>✦</span></h1>
      </div>
      <div className="header-actions">
        <button className="round" onClick={onSearch || (() => window.dispatchEvent(new Event('open-search')))}>
          <Icon name="search" size={18} />
        </button>
        <button className="round notification"><Icon name="bell" size={18} /><em /></button>
        {onLogFood && (
          <button className="add" onClick={onLogFood}>
            <Icon name="plus" size={20} /> Log food
          </button>
        )}
      </div>
    </header>
  )
}
