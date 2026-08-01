import { describe, it, expect } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import MacroRing from '@/app/components/MacroRing'

/** The arc animates in after a short timeout, so wait for the final gradient. */
async function expectArcDegrees(degrees: string) {
  await waitFor(() => {
    expect((document.querySelector('.ring') as HTMLElement).style.background).toContain(degrees)
  })
}

describe('MacroRing', () => {
  it('labels the ring for assistive tech with grams by default', () => {
    render(<MacroRing value={60} total={130} label="Protein" color="#e5966b" />)

    const ring = screen.getByRole('progressbar')
    expect(ring).toHaveAttribute('aria-valuenow', '60')
    expect(ring).toHaveAttribute('aria-valuemax', '130')
    expect(ring).toHaveAccessibleName('Protein: 60 of 130 g')
    expect(screen.getByText('60g')).toBeInTheDocument()
    expect(screen.getByText('of 130 g')).toBeInTheDocument()
  })

  it('drops the gram suffix for calorie rings', () => {
    render(<MacroRing value={800} total={2100} label="Calories" color="#e5966b" />)

    expect(screen.getByRole('progressbar')).toHaveAccessibleName('Calories: 800 of 2100 kcal')
    expect(screen.getByText('800')).toBeInTheDocument()
    expect(screen.getByText('of 2100 kcal')).toBeInTheDocument()
  })

  it('treats an explicit kcal unit as a calorie ring', () => {
    render(<MacroRing value={100} total={500} label="Burned" color="#000" unit="kcal" />)

    expect(screen.getByText('of 500 kcal')).toBeInTheDocument()
  })

  it('supports a custom unit', () => {
    render(<MacroRing value={5} total={8} label="Water" color="#000" unit="glasses" />)

    expect(screen.getByText('5glasses')).toBeInTheDocument()
    expect(screen.getByText('of 8 glasses')).toBeInTheDocument()
  })

  it('fills the arc proportionally after animating in', async () => {
    render(<MacroRing value={50} total={200} label="Fat" color="rgb(1, 2, 3)" />)

    await expectArcDegrees('90deg')
  })

  it('caps the arc at a full circle when the target is exceeded', async () => {
    render(<MacroRing value={400} total={200} label="Fat" color="rgb(1, 2, 3)" />)

    await expectArcDegrees('360deg')
  })

  it('renders an empty arc instead of dividing by a zero target', async () => {
    render(<MacroRing value={40} total={0} label="Carbs" color="rgb(1, 2, 3)" />)

    await expectArcDegrees('0deg')
  })

  it('sizes the ring and its hole from the size prop', () => {
    render(<MacroRing value={1} total={2} label="Carbs" color="#000" size={100} />)

    const arc = document.querySelector('.ring') as HTMLElement
    const hole = document.querySelector('.ring-hole') as HTMLElement
    expect(arc.style.width).toBe('100px')
    expect(hole.style.width).toBe('84px')
  })
})
