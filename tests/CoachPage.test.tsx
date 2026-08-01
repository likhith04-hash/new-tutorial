import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CoachPage from '@/app/coach/page'
import { isoDaysAgo, makeMeal, seedStorage, wrapper as Providers, type StoredState } from './helpers'

const searchParams = new URLSearchParams()
vi.mock('next/navigation', () => ({ useSearchParams: () => searchParams }))

function streamOf(text: string): Response {
  const body = new ReadableStream<Uint8Array>({
    start(controller) {
      const encoder = new TextEncoder()
      for (const part of text.split(' ')) controller.enqueue(encoder.encode(part + ' '))
      controller.close()
    },
  })
  return { ok: true, body } as unknown as Response
}

function renderPage(state: StoredState = {}) {
  seedStorage(state)
  return render(<Providers><CoachPage /></Providers>)
}

function bubbles() {
  return [...document.querySelectorAll('.message-bubble')].map(b => b.textContent)
}

beforeEach(() => {
  searchParams.delete('prompt')
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('CoachPage', () => {
  it('welcomes the user and reports the remaining calorie budget', () => {
    renderPage({ meals: [makeMeal({ date: isoDaysAgo(0), calories: 500 })] })

    expect(screen.getByRole('heading', { name: /Hi Ananya/ })).toBeInTheDocument()
    expect(screen.getByText('You have 1600 kcal left today.')).toBeInTheDocument()
    expect(screen.getByText(/I recommend a calorie-conscious, high-protein dinner/)).toBeInTheDocument()
  })

  it('switches the nudge copy when close to the target', () => {
    renderPage({ meals: [makeMeal({ date: isoDaysAgo(0), calories: 1800 })], goals: { goalType: 'gain' } })

    expect(screen.getByText('You are close to today’s calorie target.')).toBeInTheDocument()
    expect(screen.getByText(/a protein-rich, energy-dense dinner/)).toBeInTheDocument()
  })

  it('streams the API reply into the conversation', async () => {
    const fetchMock = vi.fn(async () => streamOf('Here is a great dinner idea'))
    vi.stubGlobal('fetch', fetchMock)
    renderPage()

    await userEvent.type(screen.getByPlaceholderText('Ask your nutrition coach...'), 'What is for dinner?{Enter}')

    await waitFor(() => expect(bubbles()).toEqual(['What is for dinner?', 'Here is a great dinner idea ']))
    const body = JSON.parse((fetchMock.mock.calls[0] as unknown as [string, RequestInit])[1].body as string)
    expect(body).toMatchObject({ prompt: 'What is for dinner?', goalType: 'lose', name: 'Ananya Sharma', caloriesLeft: 2100 })
    expect(screen.getByPlaceholderText('Ask your nutrition coach...')).toHaveValue('')
  })

  it('keeps the send button disabled until something is typed', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => streamOf('ok')))
    renderPage()

    const send = document.querySelector('.chat-send') as HTMLButtonElement
    expect(send).toBeDisabled()

    await userEvent.type(screen.getByPlaceholderText('Ask your nutrition coach...'), 'hello')
    expect(send).toBeEnabled()

    await userEvent.click(send)
    await waitFor(() => expect(bubbles()).toHaveLength(2))
  })

  it('sends the proactive dinner plan prompt', async () => {
    const fetchMock = vi.fn(async () => streamOf('Plan'))
    vi.stubGlobal('fetch', fetchMock)
    renderPage()

    await userEvent.click(screen.getByRole('button', { name: /Plan dinner/ }))

    await waitFor(() => expect(bubbles()[0]).toContain('Suggest a calorie-conscious, high-protein dinner with about 650 kcal and 130g protein.'))
  })

  it('auto-sends a prompt supplied in the URL', async () => {
    searchParams.set('prompt', 'Suggest a snack')
    const fetchMock = vi.fn(async () => streamOf('Try almonds'))
    vi.stubGlobal('fetch', fetchMock)
    renderPage()

    await waitFor(() => expect(bubbles()).toContain('Try almonds '))
    const body = JSON.parse((fetchMock.mock.calls[0] as unknown as [string, RequestInit])[1].body as string)
    expect(body.prompt).toBe('Suggest a snack')
  })
})

describe('CoachPage offline fallback', () => {
  const failing = () => vi.stubGlobal('fetch', vi.fn(async () => ({ ok: false, body: null } as unknown as Response)))

  it('answers dinner locally for a weight-loss goal', async () => {
    failing()
    renderPage({ meals: [makeMeal({ date: isoDaysAgo(0), calories: 1800 })] })

    await userEvent.click(screen.getByRole('button', { name: 'What should I eat for dinner?' }))

    await waitFor(() => expect(bubbles()[1]).toContain('primary goal is weight loss'))
    expect(bubbles()[1]).toContain('(350 kcal)')
  })

  it('answers dinner locally for a muscle-gain goal', async () => {
    failing()
    renderPage({ goals: { goalType: 'gain' } })

    await userEvent.click(screen.getByRole('button', { name: 'What should I eat for dinner?' }))

    await waitFor(() => expect(bubbles()[1]).toContain('working on muscle gain'))
    expect(bubbles()[1]).toContain('~2100 kcal')
  })

  it('answers dinner locally for a maintenance goal', async () => {
    failing()
    renderPage({ goals: { goalType: 'maintain' }, meals: [makeMeal({ date: isoDaysAgo(0), calories: 2000 })] })

    await userEvent.click(screen.getByRole('button', { name: 'What should I eat for dinner?' }))

    await waitFor(() => expect(bubbles()[1]).toContain('Based on your 2100 kcal target'))
    expect(bubbles()[1]).toContain('(400 kcal)')
  })

  it('answers protein questions from the local log', async () => {
    failing()
    renderPage({ meals: [makeMeal({ date: isoDaysAgo(0), protein: 65 })] })

    await userEvent.click(screen.getByRole('button', { name: 'Am I getting enough protein?' }))

    await waitFor(() => expect(bubbles()[1]).toContain("you've consumed 65g of protein (50% of your 130g target)"))
    expect(bubbles()[1]).toContain('You still need 65g more today')
  })

  it('answers snack questions with the goal type', async () => {
    failing()
    renderPage()

    await userEvent.click(screen.getByRole('button', { name: 'Suggest a healthy snack' }))

    await waitFor(() => expect(bubbles()[1]).toContain('aligned with your LOSE goal'))
  })

  it('summarises the week and classifies the calorie balance', async () => {
    failing()
    renderPage({ meals: Array.from({ length: 7 }, (_, i) => makeMeal({ id: `m${i}`, date: isoDaysAgo(i), calories: 2100 })) })

    await userEvent.click(screen.getByRole('button', { name: 'Review my week' }))

    await waitFor(() => expect(bubbles()[1]).toContain('7-Day Review for Ananya Sharma'))
    expect(bubbles()[1]).toContain('2100 kcal (right on target')
  })

  it('flags a weekly surplus', async () => {
    failing()
    renderPage({ meals: Array.from({ length: 7 }, (_, i) => makeMeal({ id: `m${i}`, date: isoDaysAgo(i), calories: 3000 })) })

    await userEvent.click(screen.getByRole('button', { name: 'Review my week' }))

    await waitFor(() => expect(bubbles()[1]).toContain('in a slight surplus'))
  })

  it('flags a weekly deficit', async () => {
    failing()
    renderPage()

    await userEvent.click(screen.getByRole('button', { name: 'Review my week' }))

    await waitFor(() => expect(bubbles()[1]).toContain('in a slight deficit'))
  })

  it('falls back to a generic reply for anything else', async () => {
    failing()
    renderPage()

    await userEvent.type(screen.getByPlaceholderText('Ask your nutrition coach...'), 'hello there{Enter}')

    await waitFor(() => expect(bubbles()[1]).toContain('Thanks for reaching out, Ananya!'))
  })

  it('recovers when the request throws', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => { throw new Error('offline') }))
    renderPage()

    await userEvent.type(screen.getByPlaceholderText('Ask your nutrition coach...'), 'hello there{Enter}')

    await waitFor(() => expect(bubbles()[1]).toContain('Thanks for reaching out, Ananya!'))
  })
})
