import { eq, desc, and, gte, lte, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, profiles, goals, foods, foodLogs, weightEntries, chatHistory, hydrationLogs } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Profile queries
export async function getOrCreateProfile(userId: number) {
  const db = await getDb();
  if (!db) return null;

  let profile = await db.select().from(profiles).where(eq(profiles.userId, userId)).limit(1);
  
  if (profile.length === 0) {
    await db.insert(profiles).values({ userId });
    profile = await db.select().from(profiles).where(eq(profiles.userId, userId)).limit(1);
  }

  return profile[0] || null;
}

export async function updateProfile(userId: number, data: any) {
  const db = await getDb();
  if (!db) return null;

  await db.update(profiles).set(data).where(eq(profiles.userId, userId));
  return getOrCreateProfile(userId);
}

// Goals queries
export async function getOrCreateGoals(userId: number) {
  const db = await getDb();
  if (!db) return null;

  let goal = await db.select().from(goals).where(eq(goals.userId, userId)).limit(1);
  
  if (goal.length === 0) {
    await db.insert(goals).values({ userId });
    goal = await db.select().from(goals).where(eq(goals.userId, userId)).limit(1);
  }

  return goal[0] || null;
}

export async function updateGoals(userId: number, data: any) {
  const db = await getDb();
  if (!db) return null;

  await db.update(goals).set(data).where(eq(goals.userId, userId));
  return getOrCreateGoals(userId);
}

// Food queries
export async function searchFoods(query: string, limit: number = 20) {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(foods).where(
    sql`LOWER(${foods.name}) LIKE LOWER(${`%${query}%`})`
  ).limit(limit);
}

export async function getFoodById(foodId: number) {
  const db = await getDb();
  if (!db) return null;

  const result = await db.select().from(foods).where(eq(foods.id, foodId)).limit(1);
  return result[0] || null;
}

// Food log queries
export async function logFood(data: any) {
  const db = await getDb();
  if (!db) return null;

  const result = await db.insert(foodLogs).values(data);
  return result;
}

export async function getTodaysFoodLogs(userId: number) {
  const db = await getDb();
  if (!db) return [];

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  return db.select({
    id: foodLogs.id,
    userId: foodLogs.userId,
    foodId: foodLogs.foodId,
    mealType: foodLogs.mealType,
    quantity: foodLogs.quantity,
    calories: foodLogs.calories,
    protein: foodLogs.protein,
    carbs: foodLogs.carbs,
    fat: foodLogs.fat,
    loggedAt: foodLogs.loggedAt,
    createdAt: foodLogs.createdAt,
    updatedAt: foodLogs.updatedAt,
    foodName: foods.name,
  }).from(foodLogs)
    .leftJoin(foods, eq(foodLogs.foodId, foods.id))
    .where(and(
      eq(foodLogs.userId, userId),
      gte(foodLogs.loggedAt, today),
      lte(foodLogs.loggedAt, tomorrow)
    ))
    .orderBy(desc(foodLogs.loggedAt));
}

export async function getFoodLogsForDate(userId: number, date: Date) {
  const db = await getDb();
  if (!db) return [];

  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  return db.select({
    id: foodLogs.id,
    userId: foodLogs.userId,
    foodId: foodLogs.foodId,
    mealType: foodLogs.mealType,
    quantity: foodLogs.quantity,
    calories: foodLogs.calories,
    protein: foodLogs.protein,
    carbs: foodLogs.carbs,
    fat: foodLogs.fat,
    loggedAt: foodLogs.loggedAt,
    createdAt: foodLogs.createdAt,
    updatedAt: foodLogs.updatedAt,
    foodName: foods.name,
  }).from(foodLogs)
    .leftJoin(foods, eq(foodLogs.foodId, foods.id))
    .where(and(
      eq(foodLogs.userId, userId),
      gte(foodLogs.loggedAt, startOfDay),
      lte(foodLogs.loggedAt, endOfDay)
    ))
    .orderBy(desc(foodLogs.loggedAt));
}

export async function getRecentFoodLogs(userId: number, days: number = 7) {
  const db = await getDb();
  if (!db) return [];

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  startDate.setHours(0, 0, 0, 0);

  return db.select({
    id: foodLogs.id,
    userId: foodLogs.userId,
    foodId: foodLogs.foodId,
    mealType: foodLogs.mealType,
    quantity: foodLogs.quantity,
    calories: foodLogs.calories,
    protein: foodLogs.protein,
    carbs: foodLogs.carbs,
    fat: foodLogs.fat,
    loggedAt: foodLogs.loggedAt,
    createdAt: foodLogs.createdAt,
    updatedAt: foodLogs.updatedAt,
    foodName: foods.name,
  }).from(foodLogs)
    .leftJoin(foods, eq(foodLogs.foodId, foods.id))
    .where(and(
      eq(foodLogs.userId, userId),
      gte(foodLogs.loggedAt, startDate)
    ))
    .orderBy(desc(foodLogs.loggedAt));
}

export async function deleteFoodLog(userId: number, foodLogId: number) {
  const db = await getDb();
  if (!db) return null;

  await db.delete(foodLogs).where(and(
    eq(foodLogs.id, foodLogId),
    eq(foodLogs.userId, userId)
  ));
}

export async function updateFoodLog(userId: number, foodLogId: number, data: any) {
  const db = await getDb();
  if (!db) return null;

  await db.update(foodLogs).set(data).where(and(
    eq(foodLogs.id, foodLogId),
    eq(foodLogs.userId, userId)
  ));
}

// Weight entry queries
export async function logWeight(userId: number, weight: number) {
  const db = await getDb();
  if (!db) return null;

  return db.insert(weightEntries).values({ userId, weight: weight.toString() } as any);
}

export async function getWeightHistory(userId: number, days: number = 90) {
  const db = await getDb();
  if (!db) return [];

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  return db.select().from(weightEntries)
    .where(and(
      eq(weightEntries.userId, userId),
      gte(weightEntries.recordedAt, startDate)
    ))
    .orderBy(desc(weightEntries.recordedAt));
}

// Chat history queries
export async function saveChatMessage(userId: number, role: 'user' | 'assistant', content: string) {
  const db = await getDb();
  if (!db) return null;

  return db.insert(chatHistory).values({ userId, role, content });
}

export async function getChatHistory(userId: number, limit: number = 50) {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(chatHistory)
    .where(eq(chatHistory.userId, userId))
    .orderBy(desc(chatHistory.createdAt))
    .limit(limit);
}

// Hydration queries
export async function logHydration(userId: number, amount: number) {
  const db = await getDb();
  if (!db) return null;

  return db.insert(hydrationLogs).values({ userId, amount });
}

export async function getTodaysHydration(userId: number) {
  const db = await getDb();
  if (!db) return 0;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const logs = await db.select().from(hydrationLogs)
    .where(and(
      eq(hydrationLogs.userId, userId),
      gte(hydrationLogs.loggedAt, today),
      lte(hydrationLogs.loggedAt, tomorrow)
    ))
    .orderBy(desc(hydrationLogs.loggedAt));

  return logs.reduce((sum: number, log: any) => sum + log.amount, 0);
}
