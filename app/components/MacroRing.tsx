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

export default function MacroRing({ value, total, label, color, size = 91, unit = 'g' }: MacroRingProps) {
  const [animPct, setAnimPct] = useState(0)

  useEffect(() => {
    const t = setTimeout(() => {
      setAnimPct(total > 0 ? Math.min(100, Math.round((value / total) * 100)) : 0)
    }, 80)
    return () => clearTimeout(t)
  }, [value, total])

  const unitSuffix = unit ? (unit === 'g' ? 'g' : ` ${unit}`) : ''

  return (
    <div
      className="macro"
      role="progressbar"
      aria-valuenow={value}
      aria-valuemax={total}
      aria-label={`${label}: ${value} of ${total}${unitSuffix}`}
    >
      <div
        className="ring"
        style={{
          width: size,
          height: size,
          background: `conic-gradient(${color} ${animPct * 3.6}deg, #eee9e1 0deg)`,
        }}
      >
        <div className="ring-hole" style={{ width: size - 16, height: size - 16 }}>
          <b>{value}{unit === 'g' ? 'g' : ''}</b>
          <small>{label}</small>
        </div>
      </div>
      <div className="macro-total">of {total}{unitSuffix}</div>
    </div>
  )
}
