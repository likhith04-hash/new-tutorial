import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import MealCard from '@/app/components/MealCard'
import { isoDaysAgo, makeMeal, readStorage, seedStorage, wrapper as Providers } from './helpers'
import type { Meal } from '@/app/components/NutritionContext'

function renderCard(meal: Meal, onEdit?: (m: Meal) => void) {
  seedStorage({ meals: [meal] })
  return render(<Providers><MealCard meal={meal} onEdit={onEdit} /></Providers>)
}

describe('MealCard', () => {
  it('renders the meal summary and macros', () => {
    renderCard(makeMeal({ type: 'Lunch', name: 'Tandoori bowl', detail: 'Brown rice', calories: 542, protein: 43 }))

    expect(screen.getByRole('heading', { name: 'Tandoori bowl' })).toBeInTheDocument()
    expect(screen.getByText('Brown rice')).toBeInTheDocument()
    expect(screen.getByText('542')).toBeInTheDocument()
    expect(screen.getByText('43g protein')).toBeInTheDocument()
  })

  it.each([
    ['Breakfast', '☼'],
    ['Lunch', '◒'],
    ['Dinner', '●'],
    ['Snack', '◆'],
  ] as const)('uses the %s glyph', (type, glyph) => {
    renderCard(makeMeal({ type }))

    expect(screen.getByTitle(type)).toHaveTextContent(glyph)
  })

  it('keeps the action menu closed until requested', async () => {
    renderCard(makeMeal())

    expect(screen.queryByRole('button', { name: /Log again/ })).toBeNull()

    await userEvent.click(screen.getByRole('button', { name: 'Meal actions' }))
    expect(screen.getByRole('button', { name: /Log again/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Delete/ })).toBeInTheDocument()
  })

  it('omits Edit when no handler is provided and wires it up when there is one', async () => {
    const meal = makeMeal({ id: 'm1' })
    const onEdit = vi.fn()
    const { unmount } = renderCard(meal)

    await userEvent.click(screen.getByRole('button', { name: 'Meal actions' }))
    expect(screen.queryByRole('button', { name: /Edit/ })).toBeNull()
    unmount()

    renderCard(meal, onEdit)
    await userEvent.click(screen.getByRole('button', { name: 'Meal actions' }))
    await userEvent.click(screen.getByRole('button', { name: /Edit/ }))

    expect(onEdit).toHaveBeenCalledWith(meal)
    expect(screen.queryByRole('button', { name: /Edit/ })).toBeNull()
  })

  it('logs the meal again for today', async () => {
    renderCard(makeMeal({ id: 'm1', detail: 'Brown rice', date: isoDaysAgo(4) }))

    await userEvent.click(screen.getByRole('button', { name: 'Meal actions' }))
    await userEvent.click(screen.getByRole('button', { name: /Log again/ }))

    const stored = readStorage().meals
    expect(stored).toHaveLength(2)
    expect(stored[1]).toMatchObject({ date: isoDaysAgo(0), detail: 'Brown rice · repeated' })
  })

  it('deletes the meal', async () => {
    renderCard(makeMeal({ id: 'm1' }))

    await userEvent.click(screen.getByRole('button', { name: 'Meal actions' }))
    await userEvent.click(screen.getByRole('button', { name: /Delete/ }))

    expect(readStorage().meals).toEqual([])
  })

  it('closes the menu on an outside click', async () => {
    renderCard(makeMeal())

    await userEvent.click(screen.getByRole('button', { name: 'Meal actions' }))
    expect(screen.getByRole('button', { name: /Delete/ })).toBeInTheDocument()

    await userEvent.click(document.body)
    expect(screen.queryByRole('button', { name: /Delete/ })).toBeNull()
  })
})
