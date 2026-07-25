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
  { href: '/diary', label: 'Food Journal', icon: 'fork' },
  { href: '/coach', label: 'AI Coach', icon: 'sparkle', badge: 'v2.0' },
  { href: '/progress', label: 'Analytics', icon: 'chart' },
  { href: '/goals', label: 'Goals', icon: 'target' },
  { href: '/', label: 'Home OS', icon: 'zap' },
]

export default function Sidebar({ mobileOpen, onClose }: SidebarProps) {
  const pathname = usePathname()
  const { profile } = useNutrition()

  return (
    <>
      <div className={`mobile-overlay${mobileOpen ? ' open' : ''}`} onClick={onClose} />
      <aside className={`sidebar${mobileOpen ? ' open' : ''}`}>
        <div className="brand flex items-center gap-3 px-4 py-6 border-b border-white/[0.08]">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#22D3EE] to-[#34D399] flex items-center justify-center text-[#09090B] font-bold text-sm shadow-[0_0_15px_rgba(34,211,238,0.3)]">
            ✦
          </div>
          <span className="font-bold text-lg text-white">Nourish<span className="text-[#22D3EE]">.os</span></span>
        </div>

        <nav className="p-4 space-y-1.5">
          {links.map(link => {
            const isActive = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center justify-between px-4 py-3 rounded-[12px] text-[14px] font-medium transition-all ${
                  isActive
                    ? 'bg-white/[0.08] text-[#FFFFFF] font-semibold border border-white/[0.08] shadow-sm'
                    : 'text-[#A1A1AA] hover:text-[#FFFFFF] hover:bg-white/[0.04]'
                }`}
                onClick={onClose}
              >
                <div className="flex items-center gap-3">
                  <Icon name={link.icon} size={18} />
                  <span>{link.label}</span>
                </div>
                {link.badge && (
                  <span className="bg-[#22D3EE]/10 border border-[#22D3EE]/30 text-[#22D3EE] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                    {link.badge}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>

        <div className="side-bottom p-4 border-t border-white/[0.08] mt-auto space-y-3">
          <Link
            href="/settings"
            className={`flex items-center gap-3 px-4 py-3 rounded-[12px] text-[14px] font-medium transition-all ${
              pathname === '/settings'
                ? 'bg-white/[0.08] text-[#FFFFFF] font-semibold border border-white/[0.08]'
                : 'text-[#A1A1AA] hover:text-[#FFFFFF] hover:bg-white/[0.04]'
            }`}
            onClick={onClose}
          >
            <Icon name="settings" size={18} />
            Settings
          </Link>

          <div className="profile bg-[#111113] border border-white/[0.08] p-3 rounded-[14px] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#22D3EE] text-[#09090B] font-bold flex items-center justify-center text-xs">
                {profile.initials}
              </div>
              <div>
                <p className="text-xs font-bold text-white leading-none">{profile.name}</p>
                <p className="text-[10px] text-[#34D399] mt-0.5">{profile.plan}</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
