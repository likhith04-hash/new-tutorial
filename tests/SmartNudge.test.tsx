import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SmartNudge from '@/app/components/SmartNudge'
import { isoDaysAgo, makeMeal, seedStorage, wrapper as Providers, type StoredState } from './helpers'

const push = vi.fn()
vi.mock('next/navigation', () => ({ useRouter: () => ({ push }) }))

/** Freezes the clock (Date only, so React timers keep working) at a given hour today. */
function freezeAt(hour: number) {
  const now = new Date()
  now.setHours(hour, 0, 0, 0)
  vi.useFakeTimers({ toFake: ['Date'], now })
}

function renderNudge(state: StoredState) {
  seedStorage(state)
  return render(<Providers><SmartNudge /></Providers>)
}

/** Meals that hit the protein target every day, so the protein-pattern branch stays quiet. */
function proteinRichWeek(caloriesPerDay = 2000) {
  return Array.from({ length: 7 }, (_, i) =>
    makeMeal({ id: `m${i}`, date: isoDaysAgo(i), calories: caloriesPerDay, protein: 150 }))
}

beforeEach(() => {
  push.mockClear()
})

afterEach(() => {
  vi.useRealTimers()
})

describe('SmartNudge', () => {
  it('nudges about the remaining calorie budget in the evening', async () => {
    freezeAt(18)
    renderNudge({ meals: [makeMeal({ date: isoDaysAgo(0), calories: 800, protein: 150 })] })

    expect(screen.getByText('Proactive AI Suggestion')).toBeInTheDocument()
    expect(screen.getByText(/You have 1300 kcal left for today/)).toBeInTheDocument()
    expect(screen.getByText('Evening Nudge')).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: /Ask AI Coach/ }))
    expect(push).toHaveBeenCalledWith(`/coach?prompt=${encodeURIComponent('Suggest a light dinner under 1300 kcal.')}`)
  })

  it('asks for a protein-packed dinner when the goal is muscle gain', () => {
    freezeAt(20)
    renderNudge({
      meals: [makeMeal({ date: isoDaysAgo(0), calories: 800, protein: 150 })],
      goals: { goalType: 'gain' },
    })

    expect(screen.getByText(/protein-packed meal suggestion/)).toBeInTheDocument()
  })

  it('flags low hydration in the afternoon', () => {
    freezeAt(15)
    renderNudge({
      meals: proteinRichWeek(),
      waterLogs: { [isoDaysAgo(0)]: 1 },
    })

    expect(screen.getByText('Hydration Alert')).toBeInTheDocument()
    expect(screen.getByText(/logged 1 of 8 glasses/)).toBeInTheDocument()
    expect(screen.queryByRole('button')).toBeNull()
  })

  it('surfaces a multi-day protein shortfall pattern', async () => {
    freezeAt(9)
    renderNudge({
      meals: [0, 1, 2].map(i => makeMeal({ id: `m${i}`, date: isoDaysAgo(i), calories: 2000, protein: 150 })),
    })

    expect(screen.getByText('Real Data Pattern')).toBeInTheDocument()
    expect(screen.getByText(/Protein fell below target on 4 of the last 7 days/)).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: /Protein Tips/ }))
    expect(push).toHaveBeenCalledWith(`/coach?prompt=${encodeURIComponent('How can I easily add 20g more protein to my daily routine?')}`)
  })

  it('celebrates a logging streak when no other signal fires', () => {
    freezeAt(9)
    renderNudge({ meals: proteinRichWeek() })

    expect(screen.getByText('Logging Momentum')).toBeInTheDocument()
    expect(screen.getByText(/7-day logging streak/)).toBeInTheDocument()
    expect(screen.getByText('7 Day Streak')).toBeInTheDocument()
  })

  it('falls back to the weekly intake average and links to progress', async () => {
    freezeAt(9)
    renderNudge({
      meals: [0, 1].map(i => makeMeal({ id: `m${i}`, date: isoDaysAgo(i), calories: 2100, protein: 150 })),
      goals: { proteinG: 0 },
    })

    expect(screen.getByText('Weekly Intake Trend')).toBeInTheDocument()
    expect(screen.getByText(/averaging 600 kcal\/day/)).toBeInTheDocument()
    expect(screen.getByText(/29% of your 2100 kcal lose target/)).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: /View Progress/ }))
    expect(push).toHaveBeenCalledWith('/progress')
  })

  it('does not fire the evening nudge before 16:00', () => {
    freezeAt(10)
    renderNudge({ meals: proteinRichWeek() })

    expect(screen.queryByText('Proactive AI Suggestion')).toBeNull()
  })
})
