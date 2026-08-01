import { describe, it, expect } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import CalorieHero from '@/app/components/CalorieHero'
import { isoDaysAgo, makeMeal, seedStorage, wrapper as Providers } from './helpers'

const day = isoDaysAgo(0)

function renderHero(calories: number[], target = 2100) {
  seedStorage({
    meals: calories.map((c, i) => makeMeal({ id: `m${i}`, date: day, calories: c })),
    goals: { calories: target },
  })
  return render(<Providers><CalorieHero date={day} /></Providers>)
}

describe('CalorieHero', () => {
  it('shows consumed vs target calories with thousands separators', () => {
    renderHero([1200, 300])

    expect(screen.getByText('1,500')).toBeInTheDocument()
    expect(screen.getByText('/ 2,100 kcal')).toBeInTheDocument()
    expect(screen.getByText('600 kcal')).toBeInTheDocument()
    expect(screen.getByText('71')).toBeInTheDocument()
  })

  it('clamps remaining calories and the ring percentage once the target is passed', () => {
    renderHero([2500], 2000)

    expect(screen.getByText('0 kcal')).toBeInTheDocument()
    expect(screen.getByText('100')).toBeInTheDocument()
  })

  it('renders a zeroed hero when nothing is logged for the date', () => {
    renderHero([])

    expect(document.querySelector('.calorie-line b')).toHaveTextContent('0')
    expect(screen.getByText('2,100 kcal')).toBeInTheDocument()
    expect(document.querySelector('.daily-ring b')).toHaveTextContent('0%')
  })

  it('animates the progress bar to the consumed percentage', async () => {
    renderHero([1050])

    await waitFor(() => {
      expect((document.querySelector('.progress i') as HTMLElement).style.width).toBe('50%')
    })
  })
})
