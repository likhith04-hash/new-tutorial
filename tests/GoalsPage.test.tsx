import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import GoalsPage from '@/app/goals/page'
import { isoDaysAgo, makeMeal, readStorage, seedStorage, wrapper as Providers, type StoredState } from './helpers'

function renderPage(state: StoredState = {}) {
  seedStorage(state)
  return render(<Providers><GoalsPage /></Providers>)
}

describe('GoalsPage', () => {
  it('shows today\'s intake against each configured target', () => {
    renderPage({
      meals: [makeMeal({ date: isoDaysAgo(0), calories: 700, protein: 40, carbs: 60, fat: 20 })],
    })

    expect(screen.getByText('700 / 2100 kcal')).toBeInTheDocument()
    expect(screen.getByText('40g / 130g')).toBeInTheDocument()
    expect(screen.getByText('60g / 240g')).toBeInTheDocument()
    expect(screen.getByText('20g / 70g')).toBeInTheDocument()
    expect(screen.getByText('8 glasses / day')).toBeInTheDocument()
  })

  it('highlights the stored goal type and activity level', () => {
    renderPage({ goals: { goalType: 'gain', activityLevel: 'very_active' } })

    expect(screen.getByRole('button', { name: /Gain/ })).toHaveClass('active')
    expect(screen.getByRole('button', { name: /Very Active/ })).toHaveClass('active')
  })

  it('persists a goal type change on save', async () => {
    renderPage()

    await userEvent.click(screen.getByRole('button', { name: /Maintain/ }))
    expect(readStorage().goals.goalType).toBe('lose')

    await userEvent.click(screen.getByRole('button', { name: 'Save changes' }))
    expect(readStorage().goals.goalType).toBe('maintain')
  })

  it('persists an activity level change on save', async () => {
    renderPage()

    await userEvent.click(screen.getByRole('button', { name: /Sedentary/ }))
    await userEvent.click(screen.getByRole('button', { name: 'Save changes' }))

    expect(readStorage().goals.activityLevel).toBe('sedentary')
  })

  it('saves a numeric target when its input loses focus', async () => {
    renderPage()
    const input = screen.getByLabelText('Daily calorie target')

    await userEvent.clear(input)
    await userEvent.type(input, '1850')
    await userEvent.tab()

    expect(readStorage().goals.calories).toBe(1850)
  })

  it('saves every macro and water target together', async () => {
    renderPage()

    for (const [label, value] of [
      ['Daily protein target (g)', '150'],
      ['Daily carbs target (g)', '200'],
      ['Daily fat target (g)', '60'],
      ['Daily water glasses target', '10'],
    ] as const) {
      const input = screen.getByLabelText(label)
      await userEvent.clear(input)
      await userEvent.type(input, value)
    }
    await userEvent.click(screen.getByRole('button', { name: 'Save changes' }))

    expect(readStorage().goals).toMatchObject({ proteinG: 150, carbsG: 200, fatG: 60, waterGlasses: 10 })
  })
})
