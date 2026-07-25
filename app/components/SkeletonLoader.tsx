'use client'

export default function SkeletonLoader() {
  return (
    <div style={{ padding: 24, maxWidth: 800, margin: '0 auto' }}>
      <div
        style={{
          height: 36,
          width: '40%',
          background: 'var(--clr-border)',
          borderRadius: 8,
          marginBottom: 20,
          animation: 'pulse 1.5s infinite ease-in-out',
        }}
      />
      <div
        style={{
          height: 140,
          background: 'var(--clr-card)',
          border: '1px solid var(--clr-border)',
          borderRadius: 14,
          marginBottom: 20,
          animation: 'pulse 1.5s infinite ease-in-out',
        }}
      />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
        <div style={{ height: 100, background: 'var(--clr-card)', border: '1px solid var(--clr-border)', borderRadius: 12, animation: 'pulse 1.5s infinite ease-in-out' }} />
        <div style={{ height: 100, background: 'var(--clr-card)', border: '1px solid var(--clr-border)', borderRadius: 12, animation: 'pulse 1.5s infinite ease-in-out' }} />
        <div style={{ height: 100, background: 'var(--clr-card)', border: '1px solid var(--clr-border)', borderRadius: 12, animation: 'pulse 1.5s infinite ease-in-out' }} />
      </div>
    </div>
  )
}
