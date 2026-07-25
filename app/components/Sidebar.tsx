'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Icon from '@/app/components/Icon'
import { useNutrition } from '@/app/components/NutritionContext'

interface SidebarProps {
  mobileOpen: boolean
  onClose: () => void
}

const links = [
  { href: '/dashboard', label: 'Dashboard', icon: 'grid' },
  { href: '/progress', label: 'Progress', icon: 'chart' },
  { href: '/diary', label: 'Food diary', icon: 'fork' },
  { href: '/coach', label: 'AI coach', icon: 'sparkle', badge: 'New' },
  { href: '/goals', label: 'Goals', icon: 'target' },
  { href: '/', label: 'Home', icon: 'zap' },
]

export default function Sidebar({ mobileOpen, onClose }: SidebarProps) {
  const pathname = usePathname()
  const { profile } = useNutrition()

  return (
    <>
      <div className={`mobile-overlay${mobileOpen ? ' open' : ''}`} onClick={onClose} />
      <aside className={`sidebar${mobileOpen ? ' open' : ''}`}>
        <div className="brand">
          <span className="brand-mark">n</span>
          <span>Nourish</span>
        </div>

        <nav>
          {links.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={`nav${pathname === link.href ? ' active' : ''}`}
              onClick={onClose}
            >
              <Icon name={link.icon} size={19} />
              {link.label}
              {link.badge && <i>{link.badge}</i>}
            </Link>
          ))}
        </nav>

        <div className="side-bottom">
          <Link href="/settings" className={`nav${pathname === '/settings' ? ' active' : ''}`} onClick={onClose}>
            <Icon name="settings" size={19} />
            Settings
          </Link>
          <div className="profile">
            <div className="avatar">{profile.initials}</div>
            <div>
              <b>{profile.name}</b>
              <small>{profile.plan}</small>
            </div>
            <span>⌄</span>
          </div>
        </div>
      </aside>
    </>
  )
}
