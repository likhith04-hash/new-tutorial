'use client'

import { useEffect, useState } from 'react'

interface MacroRingProps {
  value: number
  total: number
  label: string
  color: string
  size?: number
}

export default function MacroRing({ value, total, label, color, size = 91 }: MacroRingProps) {
  const [animPct, setAnimPct] = useState(0)

  useEffect(() => {
    const t = setTimeout(() => {
      setAnimPct(total > 0 ? Math.min(100, Math.round((value / total) * 100)) : 0)
    }, 80)
    return () => clearTimeout(t)
  }, [value, total])

  return (
    <div className="macro">
      <div
        className="ring"
        style={{
          width: size,
          height: size,
          background: `conic-gradient(${color} ${animPct * 3.6}deg, #eee9e1 0deg)`,
        }}
      >
        <div className="ring-hole" style={{ width: size - 16, height: size - 16 }}>
          <b>{value}g</b>
          <small>{label}</small>
        </div>
      </div>
      <div className="macro-total">of {total}g</div>
    </div>
  )
}
