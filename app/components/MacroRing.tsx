'use client'

import { useEffect, useState } from 'react'

interface MacroRingProps {
  value: number
  total: number
  label: string
  color: string
  size?: number
  unit?: string
}

export default function MacroRing({ value, total, label, color, size = 91, unit }: MacroRingProps) {
  const [animPct, setAnimPct] = useState(0)

  useEffect(() => {
    const t = setTimeout(() => {
      setAnimPct(total > 0 ? Math.min(100, Math.round((value / total) * 100)) : 0)
    }, 80)
    return () => clearTimeout(t)
  }, [value, total])

  const isKcal = unit === 'kcal' || label.toLowerCase() === 'kcal' || label.toLowerCase() === 'calories'
  const valueUnit = isKcal ? '' : (unit || 'g')
  const totalSuffix = isKcal ? ' kcal' : (valueUnit ? ` ${valueUnit}` : '')

  return (
    <div
      className="macro"
      role="progressbar"
      aria-valuenow={value}
      aria-valuemax={total}
      aria-label={`${label}: ${value} of ${total}${totalSuffix}`}
    >
      <div
        className="ring"
        style={{
          width: size,
          height: size,
          background: `conic-gradient(${color} ${animPct * 3.6}deg, var(--clr-ring-track) 0deg)`,
        }}
      >
        <div className="ring-hole" style={{ width: size - 16, height: size - 16 }}>
          <b>{value}{valueUnit}</b>
          <small>{label}</small>
        </div>
      </div>
      <div className="macro-total">of {total}{totalSuffix}</div>
    </div>
  )
}
