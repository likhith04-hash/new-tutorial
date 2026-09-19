import { pgTable, text, varchar, integer, decimal, timestamp, pgEnum, primaryKey } from 'drizzle-orm/pg-core'
import type { AdapterAccount } from '@auth/core/adapters'

/* ───────── Enums ───────── */

export const roleEnum = pgEnum('role', ['user', 'admin'])
export const goalTypeEnum = pgEnum('goal_type', ['lose', 'maintain', 'gain'])
export const unitPrefEnum = pgEnum('unit_preference', ['metric', 'imperial'])
export const mealTypeEnum = pgEnum('meal_type', ['Breakfast', 'Lunch', 'Dinner', 'Snack'])
export const chatRoleEnum = pgEnum('chat_role', ['user', 'assistant'])
export const dietTypeEnum = pgEnum('diet_type', ['vegetarian', 'non_vegetarian', 'vegan'])
export const activityLevelEnum = pgEnum('activity_level', ['sedentary', 'light', 'moderate', 'active', 'very_active'])

const genId = () => crypto.randomUUID()

/* ───────── Users (auth) ───────── */

export const users = pgTable('users', {
  id: text('id').primaryKey().$defaultFn(genId),
  name: text('name'),
  email: text('email').notNull().unique(),
  emailVerified: timestamp('email_verified', { mode: 'date' }),
  image: text('image'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export type User = typeof users.$inferSelect
export type InsertUser = typeof users.$inferInsert

/* ───────── NextAuth: Accounts, Sessions, Verification ───────── */

export const accounts = pgTable('accounts', {
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  type: varchar('type', { length: 255 }).notNull().$type<AdapterAccount['type']>(),
  provider: varchar('provider', { length: 255 }).notNull(),
  providerAccountId: varchar('provider_account_id', { length: 255 }).notNull(),
  refresh_token: text('refresh_token'),
  access_token: text('access_token'),
  expires_at: integer('expires_at'),
  token_type: varchar('token_type', { length: 255 }),
  scope: varchar('scope', { length: 255 }),
  id_token: text('id_token'),
  session_state: varchar('session_state', { length: 255 }),
}, (t) => ({
  pk: primaryKey({ columns: [t.provider, t.providerAccountId] }),
}))

export const sessions = pgTable('sessions', {
  sessionToken: varchar('session_token', { length: 255 }).primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  expires: timestamp('expires').notNull(),
})

export const verificationTokens = pgTable('verification_tokens', {
  identifier: varchar('identifier', { length: 255 }).notNull(),
  token: varchar('token', { length: 255 }).notNull(),
  expires: timestamp('expires').notNull(),
}, (t) => ({
  pk: primaryKey({ columns: [t.identifier, t.token] }),
}))

/* ───────── Profiles ───────── */

export const profiles = pgTable('profiles', {
  id: text('id').primaryKey().$defaultFn(genId),
  userId: text('user_id').notNull().unique().references(() => users.id, { onDelete: 'cascade' }),
  age: integer('age'),
  weightKg: decimal('weight_kg', { precision: 5, scale: 2 }),
  heightCm: decimal('height_cm', { precision: 5, scale: 2 }),
  targetWeightKg: decimal('target_weight_kg', { precision: 5, scale: 2 }),
  activityLevel: activityLevelEnum('activity_level').default('moderate'),
  goalType: goalTypeEnum('goal_type').default('maintain'),
  dietType: dietTypeEnum('diet_type').default('non_vegetarian'),
  unitPreference: unitPrefEnum('unit_preference').default('metric'),
  theme: varchar('theme', { length: 16 }).default('light'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export type Profile = typeof profiles.$inferSelect
export type InsertProfile = typeof profiles.$inferInsert

/* ───────── Goals ───────── */

export const goals = pgTable('goals', {
  id: text('id').primaryKey().$defaultFn(genId),
  userId: text('user_id').notNull().unique().references(() => users.id, { onDelete: 'cascade' }),
  calorieTarget: integer('calorie_target').notNull().default(2000),
  proteinG: decimal('protein_g', { precision: 6, scale: 1 }).notNull().default('150'),
  carbsG: decimal('carbs_g', { precision: 6, scale: 1 }).notNull().default('200'),
  fatG: decimal('fat_g', { precision: 6, scale: 1 }).notNull().default('65'),
  waterGlasses: integer('water_glasses').notNull().default(8),
  weightGoalKg: decimal('weight_goal_kg', { precision: 5, scale: 2 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export type Goal = typeof goals.$inferSelect
export type InsertGoal = typeof goals.$inferInsert

/* ───────── Foods ───────── */

export const foods = pgTable('foods', {
  id: text('id').primaryKey().$defaultFn(genId),
  name: varchar('name', { length: 255 }).notNull(),
  calories: integer('calories').notNull(),
  proteinG: decimal('protein_g', { precision: 5, scale: 1 }).notNull(),
  carbsG: decimal('carbs_g', { precision: 5, scale: 1 }).notNull(),
  fatG: decimal('fat_g', { precision: 5, scale: 1 }).notNull(),
  servingSize: varchar('serving_size', { length: 64 }),
  category: varchar('category', { length: 64 }),
  dietType: dietTypeEnum('diet_type').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export type Food = typeof foods.$inferSelect
export type InsertFood = typeof foods.$inferInsert

/* ───────── Food Logs ───────── */

export const foodLogs = pgTable('food_logs', {
  id: text('id').primaryKey().$defaultFn(genId),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  foodId: text('food_id').references(() => foods.id),
  customName: varchar('custom_name', { length: 255 }),
  mealType: mealTypeEnum('meal_type').notNull(),
  quantity: decimal('quantity', { precision: 5, scale: 2 }).notNull().default('1'),
  calories: integer('calories').notNull(),
  proteinG: decimal('protein_g', { precision: 5, scale: 1 }).notNull(),
  carbsG: decimal('carbs_g', { precision: 5, scale: 1 }).notNull(),
  fatG: decimal('fat_g', { precision: 5, scale: 1 }).notNull(),
  detail: text('detail'),
  date: varchar('date', { length: 10 }).notNull(),
  loggedAt: timestamp('logged_at').defaultNow().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export type FoodLog = typeof foodLogs.$inferSelect
export type InsertFoodLog = typeof foodLogs.$inferInsert

/* ───────── Weight Entries ───────── */

export const weightEntries = pgTable('weight_entries', {
  id: text('id').primaryKey().$defaultFn(genId),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  weightKg: decimal('weight_kg', { precision: 5, scale: 2 }).notNull(),
  date: varchar('date', { length: 10 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export type WeightEntry = typeof weightEntries.$inferSelect
export type InsertWeightEntry = typeof weightEntries.$inferInsert

/* ───────── Hydration Logs ───────── */

export const hydrationLogs = pgTable('hydration_logs', {
  id: text('id').primaryKey().$defaultFn(genId),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  glasses: integer('glasses').notNull().default(1),
  date: varchar('date', { length: 10 }).notNull(),
  loggedAt: timestamp('logged_at').defaultNow().notNull(),
})

export type HydrationLog = typeof hydrationLogs.$inferSelect
export type InsertHydrationLog = typeof hydrationLogs.$inferInsert

/* ───────── Chat History ───────── */

export const chatHistory = pgTable('chat_history', {
  id: text('id').primaryKey().$defaultFn(genId),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  role: chatRoleEnum('role').notNull(),
  content: text('content').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export type ChatMessage = typeof chatHistory.$inferSelect
export type InsertChatMessage = typeof chatHistory.$inferInsert

/* ───────── Diet Plans ───────── */

export const dietPlans = pgTable('diet_plans', {
  id: text('id').primaryKey().$defaultFn(genId),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  dietType: dietTypeEnum('diet_type').notNull(),
  calorieTarget: integer('calorie_target').notNull(),
  proteinG: decimal('protein_g', { precision: 6, scale: 1 }).notNull(),
  carbsG: decimal('carbs_g', { precision: 6, scale: 1 }).notNull(),
  fatG: decimal('fat_g', { precision: 6, scale: 1 }).notNull(),
  meals: text('meals').notNull(),
  isActive: integer('is_active').default(1),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export type DietPlan = typeof dietPlans.$inferSelect
export type InsertDietPlan = typeof dietPlans.$inferInsert
