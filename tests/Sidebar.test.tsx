import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Sidebar from '@/app/components/Sidebar'
import { seedStorage, wrapper as Providers } from './helpers'

const pathname = vi.fn(() => '/dashboard')
vi.mock('next/navigation', () => ({ usePathname: () => pathname() }))

function renderSidebar(mobileOpen = false) {
  const onClose = vi.fn()
  seedStorage({ profile: { name: 'Ananya Sharma', initials: 'AS', plan: 'Free plan' } })
  const view = render(<Providers><Sidebar mobileOpen={mobileOpen} onClose={onClose} /></Providers>)
  return { ...view, onClose }
}

describe('Sidebar', () => {
  it('renders every navigation destination plus settings', () => {
    renderSidebar()

    const hrefs = [...document.querySelectorAll('a')].map(a => a.getAttribute('href'))
    expect(hrefs).toEqual(['/dashboard', '/progress', '/diary', '/coach', '/goals', '/', '/settings'])
    expect(screen.getByText('New')).toBeInTheDocument()
  })

  it('marks the link matching the current route as active', () => {
    pathname.mockReturnValue('/goals')
    renderSidebar()

    expect(screen.getByRole('link', { name: /Goals/ })).toHaveClass('active')
    expect(screen.getByRole('link', { name: /Dashboard/ })).not.toHaveClass('active')
  })

  it('marks settings active on the settings route', () => {
    pathname.mockReturnValue('/settings')
    renderSidebar()

    expect(screen.getByRole('link', { name: /Settings/ })).toHaveClass('active')
  })

  it('shows the profile summary', () => {
    pathname.mockReturnValue('/dashboard')
    renderSidebar()

    expect(screen.getByText('Ananya Sharma')).toBeInTheDocument()
    expect(screen.getByText('Free plan')).toBeInTheDocument()
    expect(document.querySelector('.avatar')).toHaveTextContent('AS')
  })

  it('applies the open class on mobile and closes on overlay click', async () => {
    const { onClose } = renderSidebar(true)

    expect(document.querySelector('.sidebar')).toHaveClass('open')
    expect(document.querySelector('.mobile-overlay')).toHaveClass('open')

    await userEvent.click(document.querySelector('.mobile-overlay') as HTMLElement)
    expect(onClose).toHaveBeenCalled()
  })

  it('closes the mobile drawer when a link is followed', async () => {
    const { onClose } = renderSidebar(true)

    await userEvent.click(screen.getByRole('link', { name: /Food diary/ }))

    expect(onClose).toHaveBeenCalled()
  })
})
