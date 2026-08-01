import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SettingsPage from '@/app/settings/page'
import { isoDaysAgo, makeMeal, readStorage, seedStorage, wrapper as Providers, type StoredState } from './helpers'

function renderPage(state: StoredState = {}) {
  seedStorage(state)
  return render(<Providers><SettingsPage /></Providers>)
}

afterEach(() => {
  vi.restoreAllMocks()
})

describe('SettingsPage profile', () => {
  it('saves profile text fields on blur', async () => {
    renderPage()
    const name = screen.getByLabelText('Name')

    await userEvent.clear(name)
    await userEvent.type(name, 'Likhith Muniraju')
    await userEvent.tab()

    const email = screen.getByLabelText('Email')
    await userEvent.clear(email)
    await userEvent.type(email, 'likhith@example.com')
    await userEvent.tab()

    // The page patches the whole profile, so the previously stored initials are preserved.
    expect(readStorage().profile).toMatchObject({
      name: 'Likhith Muniraju',
      email: 'likhith@example.com',
      initials: 'AS',
    })
  })

  it('saves numeric body metrics, coercing blanks to zero', async () => {
    renderPage()

    const height = screen.getByLabelText('Height (cm)')
    await userEvent.clear(height)
    await userEvent.type(height, '172')
    await userEvent.tab()

    const target = screen.getByLabelText('Target Weight (kg)')
    await userEvent.clear(target)
    await userEvent.tab()

    expect(readStorage().profile).toMatchObject({ heightCm: 172, targetWeightKg: 0 })
  })

  it('adds an allergy on Enter and removes it on click', async () => {
    renderPage({ profile: { allergies: ['Shellfish'] } })
    const input = screen.getByLabelText('Allergies & Restrictions')

    await userEvent.type(input, 'Peanuts{Enter}')
    expect(screen.getByText('Peanuts')).toBeInTheDocument()
    expect(input).toHaveValue('')

    await userEvent.tab()
    expect(readStorage().profile.allergies).toEqual(['Shellfish', 'Peanuts'])

    await userEvent.click(screen.getByText('Peanuts').querySelector('.tag-remove') as HTMLElement)
    await userEvent.click(screen.getByLabelText('Allergies & Restrictions'))
    await userEvent.tab()
    expect(readStorage().profile.allergies).toEqual(['Shellfish'])
  })

  it('ignores an empty allergy submission', async () => {
    renderPage({ profile: { allergies: [] } })

    await userEvent.type(screen.getByLabelText('Allergies & Restrictions'), '   {Enter}')
    await userEvent.tab()

    expect(readStorage().profile.allergies).toEqual([])
  })
})

describe('SettingsPage plan', () => {
  it('upgrades to Pro and back down again', async () => {
    renderPage({ profile: { plan: 'Free plan' } })

    expect(screen.getByText('PRO FEATURE')).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: /Upgrade to Nourish Pro/ }))

    expect(readStorage().profile.plan).toBe('Pro Plan')
    expect(screen.queryByText('PRO FEATURE')).toBeNull()

    await userEvent.click(screen.getByRole('button', { name: 'Manage Subscription' }))
    expect(readStorage().profile.plan).toBe('Free plan')
  })
})

describe('SettingsPage preferences', () => {
  it('switches units immediately', async () => {
    renderPage()

    expect(screen.getByRole('button', { name: 'Metric' })).toHaveClass('active')
    await userEvent.click(screen.getByRole('button', { name: 'Imperial' }))

    expect(readStorage().profile.units).toBe('imperial')
    expect(screen.getByRole('button', { name: 'Imperial' })).toHaveClass('active')
  })

  it('switches theme and reflects it on the document element', async () => {
    renderPage()

    await userEvent.click(screen.getByRole('button', { name: /Dark/ }))
    expect(readStorage().profile.theme).toBe('dark')
    expect(document.documentElement).toHaveAttribute('data-theme', 'dark')

    await userEvent.click(screen.getByRole('button', { name: /Light/ }))
    expect(document.documentElement).toHaveAttribute('data-theme', 'light')
  })

  it('toggles each notification preference', async () => {
    renderPage()
    const [meal, water, weekly] = screen.getAllByRole('checkbox')

    await userEvent.click(meal)
    await userEvent.click(water)
    await userEvent.click(weekly)

    expect(readStorage().profile.notifications).toEqual({
      mealReminders: false, waterReminders: false, weeklyReport: true,
    })
  })
})

describe('SettingsPage data management', () => {
  it('exports the tracked data as a JSON download', async () => {
    const createObjectURL = vi.fn((_blob: Blob) => 'blob:mock')
    const revokeObjectURL = vi.fn()
    vi.stubGlobal('URL', { ...URL, createObjectURL, revokeObjectURL })
    const downloads: string[] = []
    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(function (this: HTMLAnchorElement) {
      downloads.push(this.download)
    })
    renderPage({ meals: [makeMeal({ date: isoDaysAgo(0) })] })

    await userEvent.click(screen.getByRole('button', { name: /Export data/ }))

    expect(createObjectURL).toHaveBeenCalledOnce()
    const blob = createObjectURL.mock.calls[0][0] as unknown as Blob
    expect(blob.type).toBe('application/json')
    expect(blob.size).toBeGreaterThan(0)
    expect(downloads).toEqual(['nourish-ai-data.json'])
    expect(revokeObjectURL).toHaveBeenCalledWith('blob:mock')
    vi.unstubAllGlobals()
  })

  it('wipes all data once the reset is confirmed', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true)
    renderPage({ meals: [makeMeal()], goals: { calories: 3000 } })

    await userEvent.click(screen.getByRole('button', { name: /Reset all data/ }))

    expect(readStorage()).toMatchObject({ meals: [], waterLogs: {}, weightEntries: [], goals: { calories: 2100 } })
  })

  it('keeps the data when the reset is cancelled', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(false)
    renderPage({ meals: [makeMeal()] })

    await userEvent.click(screen.getByRole('button', { name: /Reset all data/ }))

    expect(readStorage().meals).toHaveLength(1)
  })
})
