import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { foods } from '@/lib/schema'
import { like, or, eq } from 'drizzle-orm'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q') || ''
  const dietType = searchParams.get('diet') || ''

  const conditions = []
  if (query) {
    conditions.push(or(
      like(foods.name, `%${query}%`),
      like(foods.category, `%${query}%`)
    ))
  }
  if (dietType) {
    conditions.push(eq(foods.dietType, dietType as any))
  }

  const where = conditions.length > 0 ? conditions[0] : undefined

  const results = await db.query.foods.findMany({
    where,
    limit: 30,
  })

  return NextResponse.json(results)
}
