'use client'

import Icon from '@/app/components/Icon'
import { useNutrition } from '@/app/components/NutritionContext'
import { firstName } from '@/app/lib/date'

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
  const greetingName = firstName(profile.name)

  return (
    <header>
      <button className="mobile-menu" onClick={onMenuToggle}>
        <Icon name="menu" size={24} />
      </button>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div
          className="header-user-avatar"
          style={{
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--clr-brand), var(--clr-brand-hover))',
            color: '#ffffff',
            display: 'grid',
            placeItems: 'center',
            fontWeight: 700,
            fontSize: '13px',
            letterSpacing: '0.5px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
            flexShrink: 0,
          }}
        >
          {profile.initials}
        </div>
        <div>
          <p className="eyebrow">{dateStr}</p>
          <h1>{greeting}, {greetingName} <span style={{ fontSize: '16px' }}>✦</span></h1>
        </div>
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
