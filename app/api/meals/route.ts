import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { foodLogs, foods } from '@/lib/schema'
import { eq, and, desc } from 'drizzle-orm'

export async function GET(request: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const date = searchParams.get('date')

  const where = date
    ? and(eq(foodLogs.userId, session.user.id), eq(foodLogs.date, date))
    : eq(foodLogs.userId, session.user.id)

  const logs = await db.query.foodLogs.findMany({
    where,
    orderBy: [desc(foodLogs.loggedAt)],
    with: { foodId: true },
  })

  // Join with foods table for names
  const result = await Promise.all(
    logs.map(async (log) => {
      let foodName = log.customName || 'Custom food'
      let detail = log.detail || ''
      if (log.foodId) {
        const food = await db.query.foods.findFirst({
          where: eq(foods.id, log.foodId),
        })
        if (food) {
          foodName = food.name
          detail = detail || `${food.servingSize || ''} · ${food.category || ''}`
        }
      }
      return {
        id: log.id,
        type: log.mealType,
        name: foodName,
        detail,
        calories: log.calories,
        protein: Number(log.proteinG),
        carbs: Number(log.carbsG),
        fat: Number(log.fatG),
        date: log.date,
        tone: getMealTone(log.mealType),
      }
    })
  )

  return NextResponse.json(result)
}

export async function POST(request: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { foodId, customName, mealType, quantity, calories, protein, carbs, fat, detail, date } = body

  if (!mealType || !calories || !date) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const [log] = await db.insert(foodLogs).values({
    userId: session.user.id,
    foodId: foodId || null,
    customName: customName || null,
    mealType,
    quantity: String(quantity || '1'),
    calories,
    proteinG: String(protein || 0),
    carbsG: String(carbs || 0),
    fatG: String(fat || 0),
    detail: detail || null,
    date,
  }).returning()

  return NextResponse.json(log)
}

export async function DELETE(request: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  if (!id) {
    return NextResponse.json({ error: 'Missing id' }, { status: 400 })
  }

  await db.delete(foodLogs).where(
    and(eq(foodLogs.id, id), eq(foodLogs.userId, session.user.id))
  )

  return NextResponse.json({ success: true })
}

function getMealTone(type: string): string {
  const tones: Record<string, string> = {
    Breakfast: 'peach',
    Lunch: 'violet',
    Dinner: 'coral',
    Snack: 'green',
  }
  return tones[type] || 'peach'
}
