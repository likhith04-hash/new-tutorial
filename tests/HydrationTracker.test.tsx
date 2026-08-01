import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import HydrationTracker from '@/app/components/HydrationTracker'
import { isoDaysAgo, seedStorage, wrapper as Providers } from './helpers'

const day = isoDaysAgo(0)

function renderTracker(glasses: number, waterGlasses = 8) {
  seedStorage({ waterLogs: { [day]: glasses }, goals: { waterGlasses } })
  return render(<Providers><HydrationTracker date={day} /></Providers>)
}

describe('HydrationTracker', () => {
  it('converts glasses to litres against the daily goal', () => {
    renderTracker(5)

    expect(screen.getByText('1.25L')).toBeInTheDocument()
    expect(screen.getByText('of 2.0L goal')).toBeInTheDocument()
  })

  it('renders one droplet per goal glass and fills the logged ones', () => {
    renderTracker(3, 6)

    const droplets = document.querySelectorAll('.droplets span')
    expect(droplets).toHaveLength(6)
    expect(document.querySelectorAll('.droplets span.filled')).toHaveLength(3)
  })

  it('counts down the glasses left to reach the goal', () => {
    renderTracker(6)

    expect(screen.getByText('2 glasses to reach your goal')).toBeInTheDocument()
  })

  it('celebrates once the goal is met or exceeded', () => {
    renderTracker(9)

    expect(screen.getByText('Goal complete — beautifully hydrated!')).toBeInTheDocument()
  })

  it('logs another glass when Add is clicked', async () => {
    const user = userEvent.setup()
    renderTracker(5)

    await user.click(screen.getByRole('button', { name: '+ Add' }))

    expect(screen.getByText('1.50L')).toBeInTheDocument()
    expect(document.querySelectorAll('.droplets span.filled')).toHaveLength(6)
  })
})
