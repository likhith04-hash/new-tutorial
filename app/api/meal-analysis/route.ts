import { NextResponse } from 'next/server'

type MealResult = { name: string; type: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack'; detail: string; calories: number; protein: number; carbs: number; fat: number; confidence: 'low' | 'medium' | 'high' }
function valid(value: unknown): value is MealResult { if (!value || typeof value !== 'object') return false; const v = value as Record<string, unknown>; return typeof v.name === 'string' && ['Breakfast','Lunch','Dinner','Snack'].includes(String(v.type)) && ['calories','protein','carbs','fat'].every(key => typeof v[key] === 'number' && Number.isFinite(v[key]) && (v[key] as number) >= 0) }

export async function POST(request: Request) {
  const key = process.env.OPENAI_API_KEY
  if (!key) return NextResponse.json({ error: 'Meal analysis needs OPENAI_API_KEY. You can still log a meal manually.' }, { status: 503 })
  try {
    const { description } = await request.json()
    if (typeof description !== 'string' || description.trim().length < 3 || description.length > 500) return NextResponse.json({ error: 'Describe the meal in 3–500 characters.' }, { status: 400 })
    const response = await fetch('https://api.openai.com/v1/chat/completions', { method: 'POST', headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ model: process.env.OPENAI_MODEL || 'gpt-4o-mini', temperature: .2, response_format: { type: 'json_object' }, messages: [{ role: 'system', content: 'Estimate a single meal from the description. Return JSON only with name, type (Breakfast/Lunch/Dinner/Snack), detail, calories, protein, carbs, fat, confidence (low/medium/high). Values must be realistic non-negative numbers. Nutrition is an estimate.' }, { role: 'user', content: description }] }) })
    if (!response.ok) return NextResponse.json({ error: 'Meal analysis is temporarily unavailable. Please log this meal manually.' }, { status: 502 })
    const payload = await response.json() as { choices?: Array<{ message?: { content?: string } }> }; const raw = payload.choices?.[0]?.message?.content
    const result: unknown = raw ? JSON.parse(raw) : null
    if (!valid(result)) return NextResponse.json({ error: 'Could not validate the nutrition estimate. Please try again or log manually.' }, { status: 502 })
    return NextResponse.json({ meal: result })
  } catch { return NextResponse.json({ error: 'Meal analysis is temporarily unavailable. Please log this meal manually.' }, { status: 500 }) }
}
