import { decimal, int, mysqlEnum, mysqlTable, text, timestamp, varchar, json } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * User profile with onboarding and personal info
 */
export const profiles = mysqlTable("profiles", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  age: int("age"),
  weight: decimal("weight", { precision: 5, scale: 2 }), // in kg
  height: decimal("height", { precision: 5, scale: 2 }), // in cm
  activityLevel: varchar("activityLevel", { length: 64 }), // sedentary, lightly_active, moderately_active, very_active
  goalType: mysqlEnum("goalType", ["lose", "maintain", "gain"]).default("maintain"),
  unitPreference: mysqlEnum("unitPreference", ["metric", "imperial"]).default("metric"), // kg/lbs, ml/oz
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Profile = typeof profiles.$inferSelect;
export type InsertProfile = typeof profiles.$inferInsert;

/**
 * User's daily nutrition goals
 */
export const goals = mysqlTable("goals", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  calorieTarget: int("calorieTarget").notNull().default(2000), // kcal
  proteinTarget: decimal("proteinTarget", { precision: 5, scale: 1 }).notNull().default("150"), // grams
  carbsTarget: decimal("carbsTarget", { precision: 5, scale: 1 }).notNull().default("200"), // grams
  fatTarget: decimal("fatTarget", { precision: 5, scale: 1 }).notNull().default("65"), // grams
  hydrationTarget: int("hydrationTarget").notNull().default(2000), // ml
  weightGoal: decimal("weightGoal", { precision: 5, scale: 2 }), // target weight in kg
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Goal = typeof goals.$inferSelect;
export type InsertGoal = typeof goals.$inferInsert;

/**
 * Food database for logging
 */
export const foods = mysqlTable("foods", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  calories: int("calories").notNull(), // per serving
  protein: decimal("protein", { precision: 5, scale: 1 }).notNull(), // grams
  carbs: decimal("carbs", { precision: 5, scale: 1 }).notNull(), // grams
  fat: decimal("fat", { precision: 5, scale: 1 }).notNull(), // grams
  servingSize: varchar("servingSize", { length: 64 }), // e.g., "100g", "1 cup"
  category: varchar("category", { length: 64 }), // e.g., "protein", "vegetable", "fruit"
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Food = typeof foods.$inferSelect;
export type InsertFood = typeof foods.$inferInsert;

/**
 * User's logged food entries
 */
export const foodLogs = mysqlTable("foodLogs", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  foodId: int("foodId").notNull(),
  mealType: mysqlEnum("mealType", ["breakfast", "lunch", "dinner", "snack"]).notNull(),
  quantity: decimal("quantity", { precision: 5, scale: 2 }).notNull().default("1"), // multiplier for serving
  calories: int("calories").notNull(),
  protein: decimal("protein", { precision: 5, scale: 1 }).notNull(),
  carbs: decimal("carbs", { precision: 5, scale: 1 }).notNull(),
  fat: decimal("fat", { precision: 5, scale: 1 }).notNull(),
  loggedAt: timestamp("loggedAt").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type FoodLog = typeof foodLogs.$inferSelect;
export type InsertFoodLog = typeof foodLogs.$inferInsert;

/**
 * User's weight entries for progress tracking
 */
export const weightEntries = mysqlTable("weightEntries", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  weight: decimal("weight", { precision: 5, scale: 2 }).notNull(), // in kg
  recordedAt: timestamp("recordedAt").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type WeightEntry = typeof weightEntries.$inferSelect;
export type InsertWeightEntry = typeof weightEntries.$inferInsert;

/**
 * Chat history with AI coach
 */
export const chatHistory = mysqlTable("chatHistory", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  role: mysqlEnum("role", ["user", "assistant"]).notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ChatMessage = typeof chatHistory.$inferSelect;
export type InsertChatMessage = typeof chatHistory.$inferInsert;

/**
 * User's daily hydration logs
 */
export const hydrationLogs = mysqlTable("hydrationLogs", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  amount: int("amount").notNull(), // in ml
  loggedAt: timestamp("loggedAt").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type HydrationLog = typeof hydrationLogs.$inferSelect;
export type InsertHydrationLog = typeof hydrationLogs.$inferInsert;