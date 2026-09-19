import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { hydrationLogs } from '@/lib/schema'
import { eq, and, desc } from 'drizzle-orm'

export async function GET(request: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const date = searchParams.get('date')

  const where = date
    ? and(eq(hydrationLogs.userId, session.user.id), eq(hydrationLogs.date, date))
    : eq(hydrationLogs.userId, session.user.id)

  const logs = await db.query.hydrationLogs.findMany({
    where,
    orderBy: [desc(hydrationLogs.loggedAt)],
  })

  // Aggregate by date
  const byDate: Record<string, number> = {}
  for (const log of logs) {
    byDate[log.date] = (byDate[log.date] || 0) + log.glasses
  }

  return NextResponse.json({ logs, byDate })
}

export async function POST(request: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { date, glasses } = body

  if (!date) {
    return NextResponse.json({ error: 'Missing date' }, { status: 400 })
  }

  const [log] = await db.insert(hydrationLogs).values({
    userId: session.user.id,
    glasses: glasses || 1,
    date,
  }).returning()

  return NextResponse.json(log)
}
