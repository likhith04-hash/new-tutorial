import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import Icon from '@/app/components/Icon'
import SkeletonLoader from '@/app/components/SkeletonLoader'

describe('Icon', () => {
  it('renders a filled glyph for a known solid icon', () => {
    const { container } = render(<Icon name="grid" />)

    const svg = container.querySelector('svg') as SVGElement
    expect(svg).toHaveAttribute('fill', 'currentColor')
    expect(svg).toHaveAttribute('stroke', 'none')
    expect(svg).toHaveAttribute('aria-hidden', 'true')
    expect(svg.querySelector('path')).toHaveAttribute('d')
  })

  it('renders stroked icons without a fill', () => {
    const { container } = render(<Icon name="search" />)

    const svg = container.querySelector('svg') as SVGElement
    expect(svg).toHaveAttribute('fill', 'none')
    expect(svg).toHaveAttribute('stroke', 'currentColor')
    expect(svg).toHaveAttribute('stroke-width', '2')
  })

  it('applies size and className', () => {
    const { container } = render(<Icon name="grid" size={32} className="nav-icon" />)

    const svg = container.querySelector('svg') as SVGElement
    expect(svg).toHaveAttribute('width', '32')
    expect(svg).toHaveAttribute('height', '32')
    expect(svg).toHaveClass('nav-icon')
  })

  it('falls back to a bullet for unknown icon names', () => {
    const { container } = render(<Icon name="does-not-exist" size={24} className="fallback" />)

    expect(container.querySelector('svg')).toBeNull()
    const span = container.querySelector('span') as HTMLElement
    expect(span).toHaveTextContent('•')
    expect(span).toHaveClass('fallback')
    expect(span.style.fontSize).toBe('24px')
  })
})

describe('SkeletonLoader', () => {
  it('renders placeholder blocks', () => {
    const { container } = render(<SkeletonLoader />)

    expect(container.querySelectorAll('div').length).toBeGreaterThan(4)
  })
})
