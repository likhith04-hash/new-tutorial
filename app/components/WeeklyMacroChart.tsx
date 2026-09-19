'use client'

import React, { useEffect, useState } from 'react'

interface MacroPoint {
  label: string
  protein: number
  carbs: number
  fat: number
}

interface WeeklyMacroChartProps {
  data: MacroPoint[]
  targets: { protein: number; carbs: number; fat: number }
  height?: number
}

const COLORS = {
  protein: 'var(--clr-protein, #e5966b)',
  carbs: 'var(--clr-carbs, #6bc2b0)',
  fat: 'var(--clr-fat, #8b7bec)',
}

export default function WeeklyMacroChart({ data, targets, height = 200 }: WeeklyMacroChartProps) {
  const [mounted, setMounted] = useState(false)
  const [hoverIndex, setHoverIndex] = useState<number | null>(null)

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 50)
    return () => clearTimeout(timer)
  }, [])

  const maxVal = Math.max(
    ...data.map(d => Math.max(d.protein, d.carbs, d.fat)),
    targets.protein,
    targets.carbs,
    targets.fat,
    1
  )

  const padL = 36, padR = 12, padT = 16, padB = 32
  const chartW = 400 - padL - padR
  const chartH = height - padT - padB

  const toX = (i: number) => padL + (data.length > 1 ? (i / (data.length - 1)) * chartW : chartW / 2)
  const toY = (v: number) => padT + chartH - (v / maxVal) * chartH

  const buildPath = (key: 'protein' | 'carbs' | 'fat') =>
    data.map((d, i) => `${i === 0 ? 'M' : 'L'}${toX(i)},${toY(d[key])}`).join(' ')

  const macros = [
    { key: 'protein' as const, label: 'Protein', color: COLORS.protein, target: targets.protein },
    { key: 'carbs' as const, label: 'Carbs', color: COLORS.carbs, target: targets.carbs },
    { key: 'fat' as const, label: 'Fat', color: COLORS.fat, target: targets.fat },
  ]

  return (
    <div className="chart-container" style={{ width: '100%' }}>
      <svg viewBox={`0 0 400 ${height}`} style={{ width: '100%', height, display: 'block' }}>
        {/* grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map(frac => {
          const y = padT + chartH * (1 - frac)
          const val = Math.round(maxVal * frac)
          return (
            <g key={frac}>
              <line x1={padL} y1={y} x2={400 - padR} y2={y} stroke="var(--clr-border)" strokeWidth={0.5} />
              <text x={padL - 6} y={y + 4} textAnchor="end" fontSize={10} fill="var(--clr-text-soft)">{val}</text>
            </g>
          )
        })}

        {/* target lines (dashed) */}
        {macros.map(m => (
          <line
            key={`target-${m.key}`}
            x1={padL} y1={toY(m.target)} x2={400 - padR} y2={toY(m.target)}
            stroke={m.color} strokeWidth={1} strokeDasharray="4 3" opacity={0.35}
          />
        ))}

        {/* data lines */}
        {macros.map(m => (
          <path
            key={m.key}
            d={buildPath(m.key)}
            fill="none"
            stroke={m.color}
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ opacity: mounted ? 1 : 0, transition: 'opacity 0.8s ease-in' }}
          />
        ))}

        {/* dots + hover */}
        {data.map((d, i) => {
          const x = toX(i)
          return (
            <g
              key={i}
              onMouseEnter={() => setHoverIndex(i)}
              onMouseLeave={() => setHoverIndex(null)}
              style={{ cursor: 'pointer' }}
            >
              <rect x={x - 14} y={padT} width={28} height={chartH} fill="transparent" />
              {macros.map(m => (
                <circle
                  key={m.key}
                  cx={x} cy={toY(d[m.key])}
                  r={hoverIndex === i ? 5 : 3}
                  fill={m.color}
                  style={{ transition: 'r 0.15s, opacity 0.8s', opacity: mounted ? 1 : 0 }}
                />
              ))}
              <text x={x} y={height - 10} textAnchor="middle" fontSize={11} fill="var(--clr-text-soft)">{d.label}</text>

              {hoverIndex === i && (
                <g>
                  <rect x={x - 50} y={padT + 2} width={100} height={54} fill="var(--clr-surface-elevated, #333)" rx={6} opacity={0.95} />
                  <text x={x - 38} y={padT + 18} fontSize={10} fill={COLORS.protein}>P {d.protein}g</text>
                  <text x={x - 38} y={padT + 32} fontSize={10} fill={COLORS.carbs}>C {d.carbs}g</text>
                  <text x={x - 38} y={padT + 46} fontSize={10} fill={COLORS.fat}>F {d.fat}g</text>
                </g>
              )}
            </g>
          )
        })}
      </svg>

      {/* legend */}
      <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginTop: 8, fontSize: 12 }}>
        {macros.map(m => (
          <div key={m.key} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: m.color, display: 'inline-block' }} />
            <span style={{ color: 'var(--clr-text-soft)' }}>{m.label} (avg)</span>
          </div>
        ))}
      </div>
    </div>
  )
}
