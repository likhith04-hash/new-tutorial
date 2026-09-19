import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { users, profiles, goals } from '@/lib/schema'
import { eq } from 'drizzle-orm'

export async function getCurrentUser() {
  const session = await auth()
  if (!session?.user?.id) return null

  const user = await db.query.users.findFirst({
    where: eq(users.id, session.user.id),
  })
  if (!user) return null

  const profile = await db.query.profiles.findFirst({
    where: eq(profiles.userId, user.id),
  })

  const goal = await db.query.goals.findFirst({
    where: eq(goals.userId, user.id),
  })

  return { user, profile, goal }
}
