import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'
import { POST } from '@/app/api/coach/route'

interface CoachBody {
  prompt?: string
  goalType?: string
  name?: string
  caloriesLeft?: number
  proteinLeft?: number
  todayMacros?: { protein?: number; carbs?: number; fat?: number }
  goals?: { calories?: number; proteinG?: number }
}

function request(body: CoachBody | string): Request {
  return new Request('http://localhost/api/coach', {
    method: 'POST',
    body: typeof body === 'string' ? body : JSON.stringify(body),
  })
}

const realSetTimeout = globalThis.setTimeout

/** The handler paces the stream with a 25ms delay per word; run those delays instantly. */
beforeAll(() => {
  vi.stubGlobal('setTimeout', ((fn: () => void, ms?: number) =>
    ms === 25 ? (fn(), 0) : realSetTimeout(fn, ms)) as unknown as typeof setTimeout)
})

afterAll(() => {
  vi.unstubAllGlobals()
})

async function replyFor(body: CoachBody): Promise<string> {
  const res = await POST(request(body))
  expect(res.headers.get('Content-Type')).toBe('text/plain; charset=utf-8')
  return await res.text()
}

describe('POST /api/coach', () => {
  it('streams a weight-loss dinner suggestion clamped to the 350-500 kcal band', async () => {
    const low = await replyFor({ prompt: 'What should I eat for dinner?', goalType: 'lose', name: 'Likhith Muniraju', caloriesLeft: 100 })
    const high = await replyFor({ prompt: 'dinner ideas', goalType: 'lose', caloriesLeft: 5000 })

    expect(low).toContain('Hey Likhith!')
    expect(low).toContain('weight loss')
    expect(low).toContain('~350 kcal')
    expect(high).toContain('~500 kcal')
  })

  it('suggests a hearty dinner with a 650 kcal floor for muscle gain', async () => {
    const low = await replyFor({ prompt: 'DINNER please', goalType: 'gain', caloriesLeft: 200 })
    const high = await replyFor({ prompt: 'dinner', goalType: 'gain', caloriesLeft: 900 })

    expect(low).toContain('~650 kcal')
    expect(high).toContain('~900 kcal')
    expect(low).toContain('muscle gain')
  })

  it('falls back to the calorie target for a maintain-goal dinner', async () => {
    const reply = await replyFor({ prompt: 'dinner', goalType: 'maintain', goals: { calories: 2400 } })
    const withoutGoals = await replyFor({ prompt: 'dinner' })

    expect(reply).toContain('Based on your 2400 kcal target')
    expect(withoutGoals).toContain('Based on your 2100 kcal target')
  })

  it('reports protein progress against the target', async () => {
    const reply = await replyFor({ prompt: 'How much protein do I need?', todayMacros: { protein: 65 }, goals: { proteinG: 130 } })

    expect(reply).toContain("you've consumed 65g of protein")
    expect(reply).toContain('50% of your 130g target')
    expect(reply).toContain('You still need 65g more today')
  })

  it('never reports negative remaining protein once the target is exceeded', async () => {
    const reply = await replyFor({ prompt: 'protein check', todayMacros: { protein: 200 }, goals: { proteinG: 130 } })

    expect(reply).toContain('You still need 0g more today')
  })

  it('lists snack ideas tagged with the goal type', async () => {
    const withGoal = await replyFor({ prompt: 'snack ideas', goalType: 'lose' })
    const withoutGoal = await replyFor({ prompt: 'snack ideas' })

    expect(withGoal).toContain('LOSE goal')
    expect(withoutGoal).toContain('HEALTH goal')
    expect(withGoal).toContain('Almond Butter')
  })

  it('produces a weekly review for both "week" and "review" prompts', async () => {
    const week = await replyFor({ prompt: 'how was my week?', name: 'Ananya', goals: { calories: 1900 }, goalType: 'gain' })
    const review = await replyFor({ prompt: 'give me a review' })

    expect(week).toContain('7-Day Performance Review for Ananya')
    expect(week).toContain('1900 kcal')
    expect(week).toContain('GAIN')
    expect(review).toContain('7-Day Performance Review for you')
    expect(review).toContain('MAINTAIN')
  })

  it('greets with a generic reply for unrecognised prompts', async () => {
    const reply = await replyFor({ prompt: 'hello there', goalType: 'lose', name: 'Sam Smith' })

    expect(reply).toContain('Thanks for reaching out, Sam!')
    expect(reply).toContain('current lose plan')
  })

  it('defaults the name to "Friend" and the plan to "nutrition" when unknown', async () => {
    const reply = await replyFor({ prompt: 'hello' })

    expect(reply).toContain('Thanks for reaching out, Friend!')
    expect(reply).toContain('current nutrition plan')
  })

  it('handles a missing prompt without throwing', async () => {
    const reply = await replyFor({})

    expect(reply).toContain('Thanks for reaching out, Friend!')
  })

  it('returns a 500 JSON error when the body is not valid JSON', async () => {
    const res = await POST(request('not-json'))

    expect(res.status).toBe(500)
    await expect(res.json()).resolves.toEqual({ error: 'Failed to process AI request' })
  })
})
