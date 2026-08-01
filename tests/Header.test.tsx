import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Header from '@/app/components/Header'
import { seedStorage, wrapper as Providers } from './helpers'

function freezeAt(hour: number) {
  const now = new Date()
  now.setHours(hour, 0, 0, 0)
  vi.useFakeTimers({ toFake: ['Date'], now })
}

function renderHeader(props: React.ComponentProps<typeof Header> = {}) {
  seedStorage({ profile: { name: 'Ananya Sharma', initials: 'AS' } })
  return render(<Providers><Header {...props} /></Providers>)
}

afterEach(() => {
  vi.useRealTimers()
})

describe('Header', () => {
  // Pre-dawn hours fall through to the afternoon branch, matching current behaviour.
  it.each([
    [7, 'Good morning'],
    [13, 'Good afternoon'],
    [19, 'Good evening'],
    [3, 'Good afternoon'],
  ])('greets with the right salutation at %i:00', (hour, greeting) => {
    freezeAt(hour)
    renderHeader()

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(`${greeting}, Ananya`)
  })

  it('shows the profile initials and an uppercase date', () => {
    renderHeader()

    expect(screen.getByText('AS')).toBeInTheDocument()
    expect(document.querySelector('.eyebrow')?.textContent).toBe(
      new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'long', day: 'numeric' }).format(new Date()).toUpperCase(),
    )
  })

  it('renders the log-food action only when a handler is supplied', async () => {
    const onLogFood = vi.fn()
    const { unmount } = renderHeader()
    expect(screen.queryByRole('button', { name: /Log food/ })).toBeNull()
    unmount()

    renderHeader({ onLogFood })
    await userEvent.click(screen.getByRole('button', { name: /Log food/ }))
    expect(onLogFood).toHaveBeenCalled()
  })

  it('calls the menu toggle handler', async () => {
    const onMenuToggle = vi.fn()
    renderHeader({ onMenuToggle })

    await userEvent.click(document.querySelector('.mobile-menu') as HTMLElement)

    expect(onMenuToggle).toHaveBeenCalled()
  })

  it('prefers the search handler over the global open-search event', async () => {
    const onSearch = vi.fn()
    const listener = vi.fn()
    window.addEventListener('open-search', listener)
    renderHeader({ onSearch })

    await userEvent.click(document.querySelector('.round') as HTMLElement)

    expect(onSearch).toHaveBeenCalled()
    expect(listener).not.toHaveBeenCalled()
    window.removeEventListener('open-search', listener)
  })

  it('broadcasts open-search when no handler is supplied', async () => {
    const listener = vi.fn()
    window.addEventListener('open-search', listener)
    renderHeader()

    await userEvent.click(document.querySelector('.round') as HTMLElement)

    expect(listener).toHaveBeenCalled()
    window.removeEventListener('open-search', listener)
  })
})
