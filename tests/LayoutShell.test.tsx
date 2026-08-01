import { describe, it, expect, vi } from 'vitest'
import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import LayoutShell from '@/app/components/LayoutShell'

vi.mock('next/navigation', () => ({ usePathname: () => '/dashboard' }))

describe('LayoutShell', () => {
  it('renders its children inside the shell with the sidebar', () => {
    render(<LayoutShell><p>Page body</p></LayoutShell>)

    expect(screen.getByText('Page body')).toBeInTheDocument()
    expect(document.querySelector('.shell .content')).toBeInTheDocument()
    expect(document.querySelector('.sidebar')).toBeInTheDocument()
  })

  it('keeps the search modal closed by default', () => {
    render(<LayoutShell><p>Page body</p></LayoutShell>)

    expect(document.querySelector('.search-modal')).toBeNull()
  })

  it('opens search on the open-search event and closes it on Escape', async () => {
    render(<LayoutShell><p>Page body</p></LayoutShell>)

    act(() => { window.dispatchEvent(new Event('open-search')) })
    expect(document.querySelector('.search-modal')).not.toBeNull()

    await userEvent.keyboard('{Escape}')
    expect(document.querySelector('.search-modal')).toBeNull()
  })

  it('opens search with the Ctrl+K and Cmd+K shortcuts', async () => {
    render(<LayoutShell><p>Page body</p></LayoutShell>)

    await userEvent.keyboard('{Control>}k{/Control}')
    expect(document.querySelector('.search-modal')).not.toBeNull()

    await userEvent.keyboard('{Escape}')
    await userEvent.keyboard('{Meta>}k{/Meta}')
    expect(document.querySelector('.search-modal')).not.toBeNull()
  })

  it('ignores an unmodified k keypress', async () => {
    render(<LayoutShell><p>Page body</p></LayoutShell>)

    await userEvent.keyboard('k')

    expect(document.querySelector('.search-modal')).toBeNull()
  })
})
