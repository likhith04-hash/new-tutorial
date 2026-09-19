import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { profiles, goals, dietPlans } from '@/lib/schema'
import { eq } from 'drizzle-orm'
import { generateDailyPlan } from '@/lib/mealPlan'

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const profile = await db.query.profiles.findFirst({
    where: eq(profiles.userId, session.user.id),
  })

  const goal = await db.query.goals.findFirst({
    where: eq(goals.userId, session.user.id),
  })

  if (!profile || !goal) {
    return NextResponse.json({ error: 'Complete onboarding first' }, { status: 400 })
  }

  const dietType = profile.dietType || 'non_vegetarian'
  const calorieTarget = goal.calorieTarget || 2000
  const proteinTarget = Number(goal.proteinG) || 150

  const plan = await generateDailyPlan(dietType, calorieTarget, proteinTarget)

  return NextResponse.json({
    dietType,
    calorieTarget,
    proteinTarget,
    plan,
  })
}

export async function POST(request: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { name, description, dietType, calorieTarget, proteinG, carbsG, fatG, meals } = body

  const [saved] = await db.insert(dietPlans).values({
    userId: session.user.id,
    name: name || 'My Diet Plan',
    description: description || null,
    dietType,
    calorieTarget,
    proteinG: String(proteinG),
    carbsG: String(carbsG),
    fatG: String(fatG),
    meals: JSON.stringify(meals),
  }).returning()

  return NextResponse.json(saved)
}
