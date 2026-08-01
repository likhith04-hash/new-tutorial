import { NextResponse } from 'next/server'

export const runtime = 'edge'

const MAX_BODY_BYTES = 8 * 1024
const MAX_PROMPT_CHARS = 1000
const MAX_NAME_CHARS = 80
const GOAL_TYPES = ['lose', 'maintain', 'gain'] as const

type GoalTypeValue = (typeof GOAL_TYPES)[number]

type CoachRequest = {
  prompt: string
  goalType: GoalTypeValue | null
  name: string
  caloriesLeft: number | null
  todayProtein: number
  goalCalories: number
  goalProteinG: number
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const boundedNumber = (value: unknown, min: number, max: number, fallback: number): number =>
  typeof value === 'number' && Number.isFinite(value) ? Math.min(max, Math.max(min, Math.round(value))) : fallback

/** Strips control characters so untrusted values cannot forge structure in the streamed reply. */
const sanitizeText = (value: unknown, maxChars: number): string =>
  typeof value === 'string' ? value.replace(/[\u0000-\u001f\u007f]/g, ' ').trim().slice(0, maxChars) : ''

function parseRequest(body: unknown): CoachRequest | null {
  if (!isRecord(body)) return null

  const prompt = sanitizeText(body.prompt, MAX_PROMPT_CHARS)
  if (!prompt) return null

  const rawGoalType = typeof body.goalType === 'string' ? body.goalType.toLowerCase() : ''
  const goalType = (GOAL_TYPES as readonly string[]).includes(rawGoalType) ? (rawGoalType as GoalTypeValue) : null

  const goals = isRecord(body.goals) ? body.goals : {}
  const todayMacros = isRecord(body.todayMacros) ? body.todayMacros : {}

  return {
    prompt,
    goalType,
    name: sanitizeText(body.name, MAX_NAME_CHARS),
    caloriesLeft: typeof body.caloriesLeft === 'number' && Number.isFinite(body.caloriesLeft)
      ? Math.min(10000, Math.max(-10000, Math.round(body.caloriesLeft)))
      : null,
    todayProtein: boundedNumber(todayMacros.protein, 0, 2000, 0),
    goalCalories: boundedNumber(goals.calories, 500, 10000, 2100),
    goalProteinG: boundedNumber(goals.proteinG, 1, 1000, 130),
  }
}

function buildReply(req: CoachRequest): string {
  const lower = req.prompt.toLowerCase()
  const displayName = req.name || 'Friend'
  const firstName = displayName.split(' ')[0] || 'Friend'
  const goalLabel = req.goalType ? req.goalType.toUpperCase() : 'MAINTAIN'

  if (lower.includes('dinner')) {
    if (req.goalType === 'lose') {
      return `Hey ${firstName}! Since your primary goal is weight loss, I suggest a volume-dense, calorie-conscious dinner (~${Math.min(500, Math.max(350, req.caloriesLeft ?? 450))} kcal):\n\n🥗 Grilled Chicken Salad with Olive Oil dressing, or\n🐟 Baked Salmon with Steamed Asparagus.\n\nThis gives you ~38g of protein while keeping a healthy calorie deficit! 🌿`
    }
    if (req.goalType === 'gain') {
      return `Hey ${firstName}! Since you're working on muscle gain, aim for a hearty dinner (~${Math.max(650, req.caloriesLeft ?? 700)} kcal):\n\n🥩 Lean Steak or Tofu Grain Bowl with Quinoa, Avocado, and Roasted Veggies.\n\nThis packs ~45g of protein and quality complex carbs for recovery! 💪`
    }
    return `Based on your ${req.goalCalories} kcal target, here's a balanced dinner idea:\n\n🥘 Chicken or Paneer Stir-Fry with mixed veggies and brown rice. Great balance of protein, carbs, and healthy fats! 🍽️`
  }

  if (lower.includes('protein')) {
    const consumed = req.todayProtein
    const target = req.goalProteinG
    const left = Math.max(0, target - consumed)
    return `Looking at today's log, you've consumed ${consumed}g of protein (${Math.round((consumed / target) * 100)}% of your ${target}g target). You still need ${left}g more today.\n\nQuick high-protein additions:\n• 🥣 200g Greek Yogurt (18g P)\n• 🥚 2 Hard Boiled Eggs (12g P)\n• 🥤 1 Scoop Whey Protein (24g P) 💪`
  }

  if (lower.includes('snack')) {
    return `Here are top snack ideas aligned with your ${req.goalType ? goalLabel : 'HEALTH'} goal:\n\n1. 🍎 Apple + 1 tbsp Almond Butter (180 kcal, 4g P)\n2. 🥣 Low-fat Cottage Cheese or Greek Yogurt (140 kcal, 15g P)\n3. 🥜 Handful of Roasted Almonds & Walnuts (170 kcal, 6g P)\n4. 🥚 Edamame pods with sea salt (130 kcal, 11g P)`
  }

  if (lower.includes('week') || lower.includes('review')) {
    return `📊 7-Day Performance Review for ${displayName || 'you'}:\n• Target Calorie Intake: ${req.goalCalories} kcal\n• Goal Objective: ${goalLabel}\n• Consistency Rating: 94%\n• Recommendation: Keep tracking daily meals for continuous progress!`
  }

  return `Thanks for reaching out, ${firstName}! Based on your current ${req.goalType ?? 'nutrition'} plan, I'm analyzing your daily logs to give you exact meal suggestions and macro adjustments. How can I help you today?`
}

export async function POST(req: Request) {
  if (!(req.headers.get('content-type') || '').toLowerCase().includes('application/json')) {
    return NextResponse.json({ error: 'Unsupported content type' }, { status: 415 })
  }

  const declaredLength = Number(req.headers.get('content-length'))
  if (Number.isFinite(declaredLength) && declaredLength > MAX_BODY_BYTES) {
    return NextResponse.json({ error: 'Request body too large' }, { status: 413 })
  }

  let raw: string
  try {
    raw = await req.text()
  } catch (err) {
    console.error('[api/coach] Failed to read request body:', err)
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  if (raw.length > MAX_BODY_BYTES) {
    return NextResponse.json({ error: 'Request body too large' }, { status: 413 })
  }

  let parsed: CoachRequest | null
  try {
    parsed = parseRequest(JSON.parse(raw))
  } catch (err) {
    console.error('[api/coach] Invalid JSON body:', err)
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  if (!parsed) {
    return NextResponse.json({ error: 'Invalid request payload' }, { status: 400 })
  }

  const reply = buildReply(parsed)
  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    async start(controller) {
      const words = reply.split(' ')
      for (let i = 0; i < words.length; i++) {
        controller.enqueue(encoder.encode((i === 0 ? '' : ' ') + words[i]))
        await new Promise(r => setTimeout(r, 25))
      }
      controller.close()
    },
  })

  return new NextResponse(stream, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
      'Transfer-Encoding': 'chunked',
    },
  })
}
