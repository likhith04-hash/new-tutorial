import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { profiles, goals, users } from '@/lib/schema'
import { eq } from 'drizzle-orm'

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const user = await db.query.users.findFirst({
    where: eq(users.id, session.user.id),
  })

  const profile = await db.query.profiles.findFirst({
    where: eq(profiles.userId, session.user.id),
  })

  const goal = await db.query.goals.findFirst({
    where: eq(goals.userId, session.user.id),
  })

  return NextResponse.json({ user, profile, goal })
}

export async function PUT(request: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { profile: profileUpdates, goal: goalUpdates } = body

  if (profileUpdates) {
    const existing = await db.query.profiles.findFirst({
      where: eq(profiles.userId, session.user.id),
    })

    if (existing) {
      await db.update(profiles)
        .set({ ...profileUpdates, updatedAt: new Date() })
        .where(eq(profiles.userId, session.user.id))
    } else {
      await db.insert(profiles).values({
        userId: session.user.id,
        ...profileUpdates,
      })
    }
  }

  if (goalUpdates) {
    const existing = await db.query.goals.findFirst({
      where: eq(goals.userId, session.user.id),
    })

    if (existing) {
      await db.update(goals)
        .set({ ...goalUpdates, updatedAt: new Date() })
        .where(eq(goals.userId, session.user.id))
    } else {
      await db.insert(goals).values({
        userId: session.user.id,
        ...goalUpdates,
      })
    }
  }

  return NextResponse.json({ success: true })
}
