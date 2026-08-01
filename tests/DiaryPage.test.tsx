import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import DiaryPage from '@/app/diary/page'
import { isoDaysAgo, makeMeal, readStorage, seedStorage, wrapper as Providers, type StoredState } from './helpers'

function renderPage(state: StoredState = {}) {
  seedStorage(state)
  return render(<Providers><DiaryPage /></Providers>)
}

function longDate(iso: string) {
  return new Date(iso + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
}

function shownDate() {
  return document.querySelector('.date-display')?.textContent ?? ''
}

function summary() {
  return [...document.querySelectorAll('.summary-item')].map(el => el.textContent)
}

describe('DiaryPage', () => {
  it('opens on today and totals the day\'s macros', () => {
    renderPage({
      meals: [
        makeMeal({ id: 'a', date: isoDaysAgo(0), calories: 400, protein: 30, carbs: 40, fat: 10 }),
        makeMeal({ id: 'b', date: isoDaysAgo(0), calories: 300, protein: 10, carbs: 20, fat: 5 }),
        makeMeal({ id: 'c', date: isoDaysAgo(1), calories: 999 }),
      ],
    })

    expect(shownDate()).toBe(`${longDate(isoDaysAgo(0))}Today`)
    expect(summary()).toEqual(['700kcal', '40gProtein', '60gCarbs', '15gFat'])
  })

  it('groups meals by type in canonical order with per-group totals', () => {
    renderPage({
      meals: [
        makeMeal({ id: 'd', type: 'Dinner', name: 'Dal', calories: 500 }),
        makeMeal({ id: 'b1', type: 'Breakfast', name: 'Poha', calories: 300 }),
        makeMeal({ id: 'b2', type: 'Breakfast', name: 'Idli', calories: 200 }),
      ],
    })

    const groups = [...document.querySelectorAll('.meal-group-header')].map(h => h.textContent)
    expect(groups).toEqual(['Breakfast500 kcal', 'Dinner500 kcal'])
  })

  it('shows the empty state when nothing is logged for the day', () => {
    renderPage()

    expect(screen.getByRole('heading', { name: 'No meals logged' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Add meal/ })).toBeInTheDocument()
  })

  it('steps back to previous days and refuses to go past today', async () => {
    renderPage({ meals: [makeMeal({ id: 'y', date: isoDaysAgo(1), name: 'Yesterday meal', calories: 250 })] })

    const [prev, next] = [...document.querySelectorAll('.date-nav-btn')] as HTMLButtonElement[]
    expect(next).toBeDisabled()

    await userEvent.click(prev)
    expect(shownDate()).toBe(longDate(isoDaysAgo(1)))
    expect(screen.getByRole('heading', { name: 'Yesterday meal' })).toBeInTheDocument()
    expect(next).toBeEnabled()

    await userEvent.click(next)
    expect(shownDate()).toBe(`${longDate(isoDaysAgo(0))}Today`)
  })

  it('logs a new meal onto the selected day', async () => {
    renderPage()

    const [prev] = [...document.querySelectorAll('.date-nav-btn')] as HTMLButtonElement[]
    await userEvent.click(prev)
    await userEvent.click(screen.getByRole('button', { name: /Add meal/ }))
    await userEvent.type(screen.getByLabelText('Meal name'), 'Late dinner')
    await userEvent.click(screen.getByRole('button', { name: /Add to diary/ }))

    expect(readStorage().meals[0]).toMatchObject({ name: 'Late dinner', date: isoDaysAgo(1) })
    expect(screen.queryByLabelText('Meal name')).toBeNull()
  })

  it('edits an existing meal through the meal card menu', async () => {
    renderPage({ meals: [makeMeal({ id: 'm1', name: 'Old name' })] })

    await userEvent.click(screen.getByRole('button', { name: 'Meal actions' }))
    await userEvent.click(screen.getByRole('button', { name: /Edit/ }))

    expect(screen.getByRole('heading', { name: 'Edit meal details' })).toBeInTheDocument()
    await userEvent.clear(screen.getByLabelText('Meal name'))
    await userEvent.type(screen.getByLabelText('Meal name'), 'New name')
    await userEvent.click(screen.getByRole('button', { name: /Save changes/ }))

    expect(readStorage().meals).toHaveLength(1)
    expect(readStorage().meals[0].name).toBe('New name')
  })
})
