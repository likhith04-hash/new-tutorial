import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { weightEntries } from '@/lib/schema'
import { eq, and, desc } from 'drizzle-orm'

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const entries = await db.query.weightEntries.findMany({
    where: eq(weightEntries.userId, session.user.id),
    orderBy: [desc(weightEntries.date)],
  })

  return NextResponse.json(entries)
}

export async function POST(request: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { weightKg, date } = body

  if (!weightKg || !date) {
    return NextResponse.json({ error: 'Missing weight or date' }, { status: 400 })
  }

  // Upsert: delete existing entry for same date, then insert
  await db.delete(weightEntries).where(
    and(eq(weightEntries.userId, session.user.id), eq(weightEntries.date, date))
  )

  const [entry] = await db.insert(weightEntries).values({
    userId: session.user.id,
    weightKg: String(weightKg),
    date,
  }).returning()

  return NextResponse.json(entry)
}
