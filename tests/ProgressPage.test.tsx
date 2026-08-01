import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import ProgressPage from '@/app/progress/page'
import { isoDaysAgo, makeMeal, seedStorage, wrapper as Providers, type StoredState } from './helpers'

function renderPage(state: StoredState = {}) {
  seedStorage(state)
  return render(<Providers><ProgressPage /></Providers>)
}

function stat(label: string) {
  const card = [...document.querySelectorAll('.stat-card')]
    .find(c => c.querySelector('.stat-label')?.textContent === label)
  return card?.querySelector('.stat-value')?.textContent ?? ''
}

function badgeFor(title: string) {
  const card = [...document.querySelectorAll('.achievement-card')]
    .find(c => c.querySelector('b')?.textContent === title)
  return card?.querySelector('.badge')?.textContent ?? ''
}

const week = (perDay: Partial<Parameters<typeof makeMeal>[0]>) =>
  Array.from({ length: 7 }, (_, i) => makeMeal({ id: `m${i}`, date: isoDaysAgo(i), ...perDay }))

describe('ProgressPage', () => {
  it('averages the last seven days of intake', () => {
    renderPage({ meals: week({ calories: 2100, protein: 140, carbs: 250, fat: 70 }) })

    expect(stat('Avg Daily Calories')).toBe('2,100')
    expect(screen.getByRole('progressbar', { name: 'Protein: 140 of 130 g' })).toBeInTheDocument()
    expect(screen.getByRole('progressbar', { name: 'Carbs: 250 of 240 g' })).toBeInTheDocument()
    expect(screen.getByRole('progressbar', { name: 'Fat: 70 of 70 g' })).toBeInTheDocument()
  })

  it('reports weight loss between the first and latest entry', () => {
    renderPage({ weightEntries: [{ date: isoDaysAgo(30), kg: 68.2 }, { date: isoDaysAgo(0), kg: 65.8 }] })

    expect(stat('Current Weight')).toBe('65.8 kg')
    expect(stat('Weight Change')).toContain('-2.4 kg')
    expect(document.querySelectorAll('.weight-chart circle')).toHaveLength(2)
    const [first, last] = (document.querySelector('.weight-chart polyline')?.getAttribute('points') ?? '').split(' ')
    expect(first.startsWith('30,')).toBe(true)
    expect(last.startsWith('370,')).toBe(true)
    // Lower weight plots further down the chart.
    expect(Number(last.split(',')[1])).toBeGreaterThan(Number(first.split(',')[1]))
  })

  it('reports weight gain with a plus sign', () => {
    renderPage({ weightEntries: [{ date: isoDaysAgo(10), kg: 60 }, { date: isoDaysAgo(0), kg: 62 }] })

    expect(stat('Weight Change')).toContain('+2.0 kg')
  })

  it('handles an empty weight history', () => {
    renderPage()

    expect(stat('Current Weight')).toBe('—')
    expect(stat('Weight Change')).toBe('0 kg')
    expect(document.querySelector('.weight-chart polyline')).toBeNull()
  })

  it('centres a lone weight point on the chart', () => {
    renderPage({ weightEntries: [{ date: isoDaysAgo(0), kg: 70 }] })

    expect(document.querySelector('.weight-chart circle')?.getAttribute('cx')).toBe('200')
  })

  it('pluralises the logging streak', () => {
    renderPage({ meals: [makeMeal({ date: isoDaysAgo(0) })] })
    expect(stat('Logging Streak')).toBe('1 day')
    expect(screen.getByText('🔥 Keep it up!')).toBeInTheDocument()
  })

  it('prompts to start a streak when nothing is logged', () => {
    renderPage()

    expect(stat('Logging Streak')).toBe('0 days')
    expect(screen.getByText('Start your streak today')).toBeInTheDocument()
  })

  it('unlocks achievements that the logs support', () => {
    renderPage({
      meals: week({ type: 'Breakfast', calories: 2100, protein: 140 }),
      waterLogs: Object.fromEntries(Array.from({ length: 7 }, (_, i) => [isoDaysAgo(i), 8])),
    })

    expect(badgeFor('7-Day Streak')).toBe('Earned')
    expect(badgeFor('Hydration Hero')).toBe('Earned')
    expect(badgeFor('Protein Power')).toBe('Earned')
    expect(badgeFor('Early Bird')).toBe('Earned')
    expect(badgeFor('Goal Champion')).toBe('Earned')
    expect(screen.getByText('Hit water goal 7/7 times this week')).toBeInTheDocument()
    expect(screen.getByText('Logged breakfast 7/7 days this week')).toBeInTheDocument()
  })

  it('leaves achievements locked without supporting data', () => {
    renderPage()

    expect(badgeFor('3-Day Streak')).toBe('In Progress')
    expect(badgeFor('Hydration Hero')).toBe('In Progress')
    expect(badgeFor('Protein Power')).toBe('In Progress')
    expect(badgeFor('Early Bird')).toBe('In Progress')
    expect(badgeFor('Goal Champion')).toBe('In Progress')
    expect(screen.getByText('Averaging 0% of target calories')).toBeInTheDocument()
  })
})
