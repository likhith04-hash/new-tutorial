import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SearchModal from '@/app/components/SearchModal'
import { isoDaysAgo, makeMeal, seedStorage, wrapper as Providers } from './helpers'

const meals = [
  makeMeal({ id: '1', name: 'Greek yogurt bowl', type: 'Breakfast', detail: 'berries, granola', date: isoDaysAgo(0) }),
  makeMeal({ id: '2', name: 'Tandoori chicken bowl', type: 'Lunch', detail: 'brown rice', date: isoDaysAgo(1) }),
  makeMeal({ id: '3', name: 'Almonds & apple', type: 'Snack', detail: 'raw almonds', date: isoDaysAgo(2) }),
  makeMeal({ id: '4', name: 'Dal tadka', type: 'Dinner', detail: 'lentils, ghee', date: isoDaysAgo(3) }),
  makeMeal({ id: '5', name: 'Poha', type: 'Breakfast', detail: 'flattened rice', date: isoDaysAgo(4) }),
  makeMeal({ id: '6', name: 'Idli sambar', type: 'Breakfast', detail: 'steamed idli', date: isoDaysAgo(5) }),
]

function renderModal(open = true, onClose = vi.fn()) {
  seedStorage({ meals })
  const view = render(<Providers><SearchModal open={open} onClose={onClose} /></Providers>)
  return { ...view, onClose }
}

describe('SearchModal', () => {
  it('renders nothing while closed', () => {
    const { container } = renderModal(false)
    expect(container).toBeEmptyDOMElement()
  })

  it('shows the five most recent meals before any query is typed', () => {
    renderModal()

    expect(screen.getByText('Recent Meals')).toBeInTheDocument()
    const results = document.querySelectorAll('.search-result')
    expect(results).toHaveLength(5)
    expect(results[0]).toHaveTextContent('Greek yogurt bowl')
    expect(screen.queryByText('Idli sambar')).toBeNull()
  })

  it('filters by meal name, type and detail', async () => {
    renderModal()
    const input = screen.getByPlaceholderText('Search meals by name, type...')

    await userEvent.type(input, 'bowl')
    expect(document.querySelectorAll('.search-result')).toHaveLength(2)

    await userEvent.clear(input)
    await userEvent.type(input, 'breakfast')
    expect(document.querySelectorAll('.search-result')).toHaveLength(3)

    await userEvent.clear(input)
    await userEvent.type(input, 'GHEE')
    expect(screen.getByText('Dal tadka')).toBeInTheDocument()
  })

  it('reports when nothing matches', async () => {
    renderModal()

    await userEvent.type(screen.getByPlaceholderText('Search meals by name, type...'), 'pizza')

    expect(screen.getByText('No meals found for "pizza"')).toBeInTheDocument()
    expect(document.querySelectorAll('.search-result')).toHaveLength(0)
  })

  it('shows a meal emoji per type', () => {
    renderModal()

    const icons = [...document.querySelectorAll('.search-result .meal-icon')].map(el => el.textContent)
    expect(icons).toEqual(['🍳', '🥗', '🍎', '🍲', '🍳'])
  })

  it('closes on Escape, backdrop click and result selection', async () => {
    const { onClose } = renderModal()

    await userEvent.keyboard('{Escape}')
    expect(onClose).toHaveBeenCalledTimes(1)

    await userEvent.click(document.querySelector('.search-backdrop') as HTMLElement)
    expect(onClose).toHaveBeenCalledTimes(2)

    await userEvent.click(document.querySelector('.search-result') as HTMLElement)
    expect(onClose).toHaveBeenCalledTimes(3)
  })

  it('keeps the modal open when the panel itself is clicked', async () => {
    const { onClose } = renderModal()

    await userEvent.click(document.querySelector('.search-input-wrap') as HTMLElement)

    expect(onClose).not.toHaveBeenCalled()
  })
})
