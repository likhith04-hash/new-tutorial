'use client'

import React from 'react'

/* ==========================================================================
   NOURISH OS DESIGN SYSTEM TOKENS & REUSABLE UI COMPONENTS
   Inspired by 21st.dev, Linear, Vercel, Raycast, Apple
   ========================================================================== */

// 1. UNIVERSAL BUTTON COMPONENT
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
}

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:pointer-events-none whitespace-nowrap cursor-pointer'
  
  const sizeStyles = {
    sm: 'h-8 px-3.5 rounded-full text-xs gap-1.5',
    md: 'h-10 px-5 rounded-full text-sm gap-2',
    lg: 'h-12 px-7 rounded-full text-sm font-semibold gap-2.5',
  }

  const variantStyles = {
    primary: 'bg-[#FFFFFF] text-[#09090B] hover:bg-[#22D3EE] font-semibold shadow-[0_0_20px_rgba(34,211,238,0.2)]',
    secondary: 'bg-[#22D3EE] text-[#09090B] hover:bg-[#34D399] font-bold shadow-[0_0_25px_rgba(34,211,238,0.3)]',
    outline: 'border border-white/[0.08] bg-[#111113] text-[#FFFFFF] hover:bg-white/[0.08] hover:border-white/20',
    ghost: 'text-[#A1A1AA] hover:text-[#FFFFFF] hover:bg-white/[0.06]',
    danger: 'bg-[#EF4444] text-[#FFFFFF] hover:bg-red-600 font-semibold shadow-[0_0_20px_rgba(239,68,68,0.3)]',
  }

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

// 2. UNIVERSAL CARD COMPONENT (21st.dev Style Bento Card)
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'subtle' | 'highlight'
  radius?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
}

export function Card({
  variant = 'default',
  radius = 'md',
  className = '',
  children,
  ...props
}: CardProps) {
  const radiusStyles = {
    sm: 'rounded-[12px]',
    md: 'rounded-[18px]',
    lg: 'rounded-[24px]',
  }

  const variantStyles = {
    default: 'bg-[#111113] border border-white/[0.08] text-[#FFFFFF] shadow-2xl hover:border-[#22D3EE]/30 transition-all duration-300',
    subtle: 'bg-[#09090B] border border-white/[0.08] text-[#FFFFFF]',
    highlight: 'bg-gradient-to-br from-[#111113] via-[#14261f] to-[#111113] border border-[#22D3EE]/30 text-[#FFFFFF] shadow-[0_0_30px_rgba(34,211,238,0.1)]',
  }

  return (
    <div
      className={`${radiusStyles[radius]} ${variantStyles[variant]} p-6 md:p-8 ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

// 3. UNIVERSAL BADGE COMPONENT
export interface BadgeProps {
  variant?: 'cyan' | 'emerald' | 'amber' | 'danger' | 'muted'
  children: React.ReactNode
  className?: string
}

export function Badge({ variant = 'cyan', children, className = '' }: BadgeProps) {
  const variantStyles = {
    cyan: 'bg-[#22D3EE]/10 text-[#22D3EE] border-border border-[#22D3EE]/30',
    emerald: 'bg-[#34D399]/10 text-[#34D399] border-border border-[#34D399]/30',
    amber: 'bg-[#FACC15]/10 text-[#FACC15] border-border border-[#FACC15]/30',
    danger: 'bg-[#EF4444]/10 text-[#EF4444] border-border border-[#EF4444]/30',
    muted: 'bg-white/[0.06] text-[#A1A1AA] border-border border-white/[0.08]',
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[13px] font-medium border uppercase tracking-wider ${variantStyles[variant]} ${className}`}>
      {children}
    </span>
  )
}

// 4. UNIVERSAL INPUT COMPONENT
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode
}

export function Input({ icon, className = '', ...props }: InputProps) {
  return (
    <div className="relative w-full flex items-center">
      {icon && <div className="absolute left-4 text-[#A1A1AA] pointer-events-none">{icon}</div>}
      <input
        className={`h-12 w-full bg-[#111113] border border-white/[0.08] text-[#FFFFFF] placeholder:text-[#A1A1AA] rounded-full text-sm transition-all focus:border-[#22D3EE] focus:ring-1 focus:ring-[#22D3EE]/30 focus:outline-none ${
          icon ? 'pl-11 pr-5' : 'px-5'
        } ${className}`}
        {...props}
      />
    </div>
  )
}

// 5. UNIVERSAL PAGE HEADER COMPONENT
export interface PageHeaderProps {
  badge?: string
  title: string
  subtitle?: string
  action?: React.ReactNode
}

export function PageHeader({ badge, title, subtitle, action }: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-8 border-b border-white/[0.08] mb-8">
      <div className="space-y-1.5">
        {badge && <Badge variant="cyan">{badge}</Badge>}
        <h1 className="text-3xl md:text-[36px] font-semibold text-[#FFFFFF] tracking-tight leading-tight">
          {title}
        </h1>
        {subtitle && <p className="text-[16px] md:text-[18px] text-[#A1A1AA]">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  )
}

// 6. UNIVERSAL METRIC CARD
export interface MetricCardProps {
  title: string
  value: string | number
  unit?: string
  subtitle?: string
  trend?: string
  badgeVariant?: 'cyan' | 'emerald' | 'amber' | 'danger'
}

export function MetricCard({ title, value, unit, subtitle, trend, badgeVariant = 'cyan' }: MetricCardProps) {
  return (
    <Card radius="md" variant="subtle" className="p-5 flex flex-col justify-between">
      <div className="flex justify-between items-start mb-2">
        <span className="text-[13px] font-medium text-[#A1A1AA] uppercase tracking-wider">{title}</span>
        {trend && <Badge variant={badgeVariant}>{trend}</Badge>}
      </div>
      <div>
        <p className="text-[36px] md:text-[40px] font-bold text-[#FFFFFF] leading-none tracking-tight">
          {value} {unit && <span className="text-sm font-normal text-[#A1A1AA]">{unit}</span>}
        </p>
        {subtitle && <p className="text-[13px] text-[#A1A1AA] mt-2">{subtitle}</p>}
      </div>
    </Card>
  )
}
