/* ───────── SVG Icon Library ───────── */

interface IconProps {
  name: string
  size?: number
  className?: string
}

const paths: Record<string, string> = {
  grid: 'M3 3h7v7H3V3zm11 0h7v7h-7V3zM3 14h7v7H3v-7zm11 0h7v7h-7v-7z',
  chart: 'M3 20V4h2v14h16v2H3zm4-4V10h3v6H7zm5 0V6h3v10h-3zm5 0V8h3v8h-3z',
  fork: 'M7 2v8a3 3 0 003 3v9h2v-9a3 3 0 003-3V2h-2v7a1 1 0 01-1 1h-2a1 1 0 01-1-1V2H7z',
  sparkle: 'M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8L12 2z',
  target: 'M12 2a10 10 0 100 20 10 10 0 000-20zm0 4a6 6 0 110 12 6 6 0 010-12zm0 4a2 2 0 100 4 2 2 0 000-4z',
  water: 'M12 2c-4.5 7-8 10.5-8 14a8 8 0 0016 0c0-3.5-3.5-7-8-14z',
  settings: 'M12 15a3 3 0 100-6 3 3 0 000 6zm7.43-2.56l1.77 1.38-2 3.46-2.01-.83a7 7 0 01-1.74 1l-.34 2.15h-4l-.35-2.15a7 7 0 01-1.74-1l-2 .83-2-3.46 1.77-1.38a7 7 0 010-2.01L5.37 9.05l2-3.46 2.01.83a7 7 0 011.74-1L11.46 3.3h4l.35 2.12a7 7 0 011.74 1l2.01-.83 2 3.46-1.77 1.38a7 7 0 010 2.01z',
  plus: 'M12 5v14m-7-7h14',
  bell: 'M15 17h5l-1.4-1.4A3.5 3.5 0 0117 13V10a5 5 0 00-10 0v3c0 .9-.4 1.8-1.1 2.4L4.5 17H10m5 0v1a3 3 0 01-6 0v-1m6 0H9',
  arrow: 'M5 12h14m-7-7l7 7-7 7',
  search: 'M21 21l-5.2-5.2M17 10a7 7 0 11-14 0 7 7 0 0114 0z',
  fire: 'M12 23c-4-1.5-7-5-7-9.5 0-3 1.5-5 3.5-7C10 5 10.5 3 10 1c3 1.5 5 4 5 7.5 0 1-.5 2-1.5 2.5 1 0 2-.5 2.5-1.5.5 2 .5 3.5 0 5-1 2.5-3 4.5-4 8.5z',
  check: 'M5 13l4 4L19 7',
  menu: 'M4 6h16M4 12h16M4 18h16',
  weight: 'M12 3c-1.7 0-3 1.3-3 3s1.3 3 3 3 3-1.3 3-3-1.3-3-3-3zm-4 8l-3 10h14l-3-10H8z',
  moon: 'M21 12.79A9 9 0 1111.21 3a7 7 0 009.79 9.79z',
  sun: 'M12 18a6 6 0 100-12 6 6 0 000 12zM12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.73 12.73l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42',
  send: 'M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z',
  edit: 'M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.12 2.12 0 013 3L12 15l-4 1 1-4 9.5-9.5z',
  trash: 'M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14zM10 11v6M14 11v6',
  user: 'M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 3a4 4 0 100 8 4 4 0 000-8z',
  clock: 'M12 22c5.5 0 10-4.5 10-10S17.5 2 12 2 2 6.5 2 12s4.5 10 10 10zM12 6v6l4 2',
  chevronLeft: 'M15 18l-6-6 6-6',
  chevronRight: 'M9 18l6-6-6-6',
  logout: 'M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9',
  download: 'M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3',
  trophy: 'M6 9H3v3a4 4 0 004 4h1m10-7h3v3a4 4 0 01-4 4h-1M8 2h8v8a4 4 0 01-8 0V2zM10 16h4v2a2 2 0 01-2 2 2 2 0 01-2-2v-2zM7 22h10',
  zap: 'M13 2L3 14h9l-1 8 10-12h-9l1-8z',
  info: 'M12 22c5.5 0 10-4.5 10-10S17.5 2 12 2 2 6.5 2 12s4.5 10 10 10zM12 16v-4M12 8h.01',
}

export default function Icon({ name, size = 19, className = '' }: IconProps) {
  const d = paths[name]
  if (!d) return <span className={className} style={{ fontSize: size, lineHeight: 1 }}>•</span>
  const isStroke = ['plus', 'bell', 'arrow', 'search', 'check', 'menu', 'moon', 'sun', 'send', 'edit', 'trash', 'user', 'clock', 'chevronLeft', 'chevronRight', 'logout', 'download', 'trophy', 'zap', 'info'].includes(name)
  return (
    <svg
      width={size} height={size} viewBox="0 0 24 24" className={className}
      fill={isStroke ? 'none' : 'currentColor'}
      stroke={isStroke ? 'currentColor' : 'none'}
      strokeWidth={isStroke ? 2 : 0}
      strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={d} />
    </svg>
  )
}
