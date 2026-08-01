import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import DashboardPage from '@/app/dashboard/page'
import Home from '@/app/page'
import { isoDaysAgo, makeMeal, readStorage, seedStorage, wrapper as Providers, type StoredState } from './helpers'

vi.mock('next/navigation', () => ({ useRouter: () => ({ push: vi.fn() }) }))

function renderPage(state: StoredState = {}) {
  seedStorage(state)
  return render(<Providers><DashboardPage /></Providers>)
}

describe('DashboardPage', () => {
  it('summarises today\'s meals and macros', () => {
    renderPage({
      meals: [
        makeMeal({ id: 'a', name: 'Yogurt bowl', calories: 386, protein: 26, carbs: 42, fat: 12 }),
        makeMeal({ id: 'b', name: 'Chicken bowl', calories: 542, protein: 43, carbs: 52, fat: 14 }),
      ],
    })

    expect(screen.getByText('2 items logged · 928 kcal')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Yogurt bowl' })).toBeInTheDocument()
    expect(screen.getByRole('progressbar', { name: 'Protein: 69 of 130 g' })).toBeInTheDocument()
    expect(screen.getByRole('progressbar', { name: 'Carbs: 94 of 240 g' })).toBeInTheDocument()
    expect(screen.getByRole('progressbar', { name: 'Fat: 26 of 70 g' })).toBeInTheDocument()
  })

  it('plots the last seven days of calories against the goal', () => {
    renderPage({
      meals: [
        makeMeal({ id: 'a', date: isoDaysAgo(0), calories: 500 }),
        makeMeal({ id: 'b', date: isoDaysAgo(6), calories: 900 }),
      ],
    })

    const bars = screen.getAllByRole('graphics-symbol')
    expect(bars).toHaveLength(7)
    expect(bars[0]).toHaveAccessibleName(/900 kcal \(target: 2100 kcal\)/)
    expect(bars[6]).toHaveAccessibleName(/500 kcal \(target: 2100 kcal\)/)
  })

  it('prompts for a first meal when the day is empty', () => {
    renderPage()

    expect(screen.getByRole('heading', { name: 'No meals logged yet today' })).toBeInTheDocument()
    expect(screen.getByText('0 items logged · 0 kcal')).toBeInTheDocument()
  })

  it('logs a meal from the empty-state call to action', async () => {
    renderPage()

    await userEvent.click(screen.getByRole('button', { name: /Add first meal/ }))
    await userEvent.type(screen.getByLabelText('Meal name'), 'Omelette')
    await userEvent.click(screen.getByRole('button', { name: /Add to diary/ }))

    expect(readStorage().meals[0]).toMatchObject({ name: 'Omelette', date: isoDaysAgo(0) })
  })

  it('opens the add-meal modal from the header and the section link', async () => {
    renderPage()

    await userEvent.click(screen.getByRole('button', { name: /Log food/ }))
    expect(screen.getByRole('heading', { name: 'Add a meal' })).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: '×' }))

    await userEvent.click(screen.getByRole('button', { name: /Add meal/ }))
    expect(screen.getByRole('heading', { name: 'Add a meal' })).toBeInTheDocument()
  })

  it('edits a logged meal from its card', async () => {
    renderPage({ meals: [makeMeal({ id: 'm1', name: 'Old name' })] })

    await userEvent.click(screen.getByRole('button', { name: 'Meal actions' }))
    await userEvent.click(screen.getByRole('button', { name: /Edit/ }))
    await userEvent.clear(screen.getByLabelText('Meal name'))
    await userEvent.type(screen.getByLabelText('Meal name'), 'New name')
    await userEvent.click(screen.getByRole('button', { name: /Save changes/ }))

    expect(readStorage().meals[0].name).toBe('New name')
  })

  it('tracks hydration for today', async () => {
    renderPage({ waterLogs: { [isoDaysAgo(0)]: 4 } })

    expect(screen.getByText('1.00L')).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: '+ Add' }))
    expect(screen.getByText('1.25L')).toBeInTheDocument()
  })
})

describe('Home', () => {
  it('renders the dashboard at the root route', () => {
    seedStorage({})
    render(<Providers><Home /></Providers>)

    expect(screen.getByRole('heading', { name: /Today's nutrition/ })).toBeInTheDocument()
  })
})
