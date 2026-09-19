import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const key = process.env.OPENAI_API_KEY
  if (!key) return NextResponse.json({ error: 'Nutrition AI is not configured. Add OPENAI_API_KEY to enable coaching.' }, { status: 503 })
  try {
    const body = await request.json()
    const context = {
      name: body.name,
      goal: body.goalType,
      caloriesRemaining: Math.max(0, Number(body.caloriesLeft) || 0),
      proteinRemaining: Math.max(0, Number(body.proteinLeft) || 0),
      todayMacros: body.todayMacros,
      targets: body.goals,
      weeklyTrend: body.weeklyTrend,
      recentMeals: body.recentMeals,
    }
    const response = await fetch('https://api.openai.com/v1/chat/completions', { method: 'POST', headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ model: process.env.OPENAI_MODEL || 'gpt-4o-mini', temperature: .45, max_tokens: 500, messages: [{ role: 'system', content: 'You are Nourish AI, a careful nutrition coach. Use the supplied personal context (today\'s remaining macros, 7-day weekly trend, and recent meals) to give grounded, concise advice. Prioritise practical food choices; mention Indian options when helpful. Do not diagnose medical conditions. Mention that estimates vary where relevant. If the user asks about trends, reference the weeklyTrend data directly.' }, { role: 'user', content: `User question: ${String(body.prompt || '').slice(0, 1000)}\nContext: ${JSON.stringify(context)}` }] }) })
    if (!response.ok) return NextResponse.json({ error: 'Nutrition AI is temporarily unavailable. Your saved meals are safe.' }, { status: 502 })
    const payload = await response.json() as { choices?: Array<{ message?: { content?: string } }> }
    const reply = payload.choices?.[0]?.message?.content?.trim()
    if (!reply) return NextResponse.json({ error: 'Nutrition AI returned an empty response. Please try again.' }, { status: 502 })
    return NextResponse.json({ reply })
  } catch { return NextResponse.json({ error: 'Nutrition AI is temporarily unavailable. Please try again.' }, { status: 500 }) }
}
