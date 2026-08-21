import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import Anthropic from "@anthropic-ai/sdk";
import { COOKIE_NAME } from "@shared/const";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  profile: router({
    get: protectedProcedure.query(({ ctx }) =>
      db.getOrCreateProfile(ctx.user.id)
    ),
    update: protectedProcedure
      .input(z.object({
        age: z.number().optional(),
        weight: z.number().optional(),
        height: z.number().optional(),
        activityLevel: z.string().optional(),
        goalType: z.enum(["lose", "maintain", "gain"]).optional(),
        unitPreference: z.enum(["metric", "imperial"]).optional(),
      }))
      .mutation(({ ctx, input }) =>
        db.updateProfile(ctx.user.id, input)
      ),
  }),

  goals: router({
    get: protectedProcedure.query(({ ctx }) =>
      db.getOrCreateGoals(ctx.user.id)
    ),
    update: protectedProcedure
      .input(z.object({
        calorieTarget: z.number().optional(),
        proteinTarget: z.number().optional(),
        carbsTarget: z.number().optional(),
        fatTarget: z.number().optional(),
        hydrationTarget: z.number().optional(),
        weightGoal: z.number().optional(),
      }))
      .mutation(({ ctx, input }) =>
        db.updateGoals(ctx.user.id, input)
      ),
  }),

  foods: router({
    search: protectedProcedure
      .input(z.object({ query: z.string(), limit: z.number().default(20) }))
      .query(({ input }) => db.searchFoods(input.query, input.limit)),
    getById: protectedProcedure
      .input(z.number())
      .query(({ input }) => db.getFoodById(input)),
  }),

  foodLogs: router({
    today: protectedProcedure.query(({ ctx }) =>
      db.getTodaysFoodLogs(ctx.user.id)
    ),
    forDate: protectedProcedure
      .input(z.date())
      .query(({ ctx, input }) =>
        db.getFoodLogsForDate(ctx.user.id, input)
      ),
    recent: protectedProcedure
      .input(z.number().default(7))
      .query(({ ctx, input }) =>
        db.getRecentFoodLogs(ctx.user.id, input)
      ),
    log: protectedProcedure
      .input(z.object({
        foodId: z.number(),
        mealType: z.enum(["breakfast", "lunch", "dinner", "snack"]),
        quantity: z.number().default(1),
        calories: z.number(),
        protein: z.number(),
        carbs: z.number(),
        fat: z.number(),
      }))
      .mutation(({ ctx, input }) =>
        db.logFood({ ...input, userId: ctx.user.id })
      ),
    delete: protectedProcedure
      .input(z.number())
      .mutation(({ ctx, input }) => db.deleteFoodLog(ctx.user.id, input)),
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        quantity: z.number().optional(),
        mealType: z.enum(["breakfast", "lunch", "dinner", "snack"]).optional(),
      }))
      .mutation(({ ctx, input }) => db.updateFoodLog(ctx.user.id, input.id, input)),
  }),

  weights: router({
    log: protectedProcedure
      .input(z.number())
      .mutation(({ ctx, input }) => db.logWeight(ctx.user.id, input)),
    history: protectedProcedure
      .input(z.number().default(90))
      .query(({ ctx, input }) => db.getWeightHistory(ctx.user.id, input)),
  }),

  hydration: router({
    log: protectedProcedure
      .input(z.number())
      .mutation(({ ctx, input }) => db.logHydration(ctx.user.id, input)),
    today: protectedProcedure
      .query(({ ctx }) => db.getTodaysHydration(ctx.user.id)),
  }),

  chat: router({
    history: protectedProcedure
      .input(z.number().default(50))
      .query(({ ctx, input }) => db.getChatHistory(ctx.user.id, input)),
    send: protectedProcedure
      .input(z.object({ message: z.string() }))
      .mutation(async ({ ctx, input }) => {
        // Save user message
        await db.saveChatMessage(ctx.user.id, "user", input.message);

        try {
          // Get user context data for Claude
          const profile = await db.getOrCreateProfile(ctx.user.id);
          const goals = await db.getOrCreateGoals(ctx.user.id);
          const todayLogs = await db.getTodaysFoodLogs(ctx.user.id);
          const recentLogs = await db.getRecentFoodLogs(ctx.user.id, 7);

          // Calculate totals
          const totalCalories = todayLogs.reduce((sum: number, log: any) => sum + log.calories, 0);
          const totalProtein = todayLogs.reduce((sum: number, log: any) => sum + (typeof log.protein === "string" ? parseFloat(log.protein) : log.protein), 0);
          const totalCarbs = todayLogs.reduce((sum: number, log: any) => sum + (typeof log.carbs === "string" ? parseFloat(log.carbs) : log.carbs), 0);
          const totalFat = todayLogs.reduce((sum: number, log: any) => sum + (typeof log.fat === "string" ? parseFloat(log.fat) : log.fat), 0);

          const calorieTarget = goals?.calorieTarget || 2000;
          const calorieRemaining = calorieTarget - totalCalories;

          // Build context for Claude
          const systemPrompt = `You are a knowledgeable and supportive nutrition and fitness coach. You help users track their nutrition, achieve their fitness goals, and make healthy lifestyle choices.

Current user data:
- Goal: ${profile?.goalType || "maintain"} weight
- Today's calories: ${totalCalories} / ${calorieTarget} kcal (${calorieRemaining > 0 ? calorieRemaining + " remaining" : Math.abs(calorieRemaining) + " over"})
- Macros today: Protein ${Math.round(totalProtein)}g / ${Math.round(typeof goals?.proteinTarget === "string" ? parseFloat(goals.proteinTarget) : goals?.proteinTarget || 150)}g, Carbs ${Math.round(totalCarbs)}g / ${Math.round(typeof goals?.carbsTarget === "string" ? parseFloat(goals.carbsTarget) : goals?.carbsTarget || 200)}g, Fat ${Math.round(totalFat)}g / ${Math.round(typeof goals?.fatTarget === "string" ? parseFloat(goals.fatTarget) : goals?.fatTarget || 65)}g
- Activity level: ${profile?.activityLevel || "moderate"}

Provide personalized, encouraging advice based on their actual data. Be specific about their progress and give actionable recommendations.`;

          // Get chat history for context
          const chatHistory = await db.getChatHistory(ctx.user.id, 10);
          const messages = chatHistory
            .reverse()
            .map((msg: any) => ({
              role: msg.role as "user" | "assistant",
              content: msg.content,
            }));
          messages.push({ role: "user" as const, content: input.message });

          // Call Claude API
          const client = new Anthropic({
            apiKey: process.env.ANTHROPIC_API_KEY,
          });

          const response = await client.messages.create({
            model: "claude-3-5-sonnet-20241022",
            max_tokens: 500,
            system: systemPrompt,
            messages: messages,
          });

          const assistantMessage = response.content[0]?.type === "text" ? response.content[0].text : "I couldn't generate a response. Please try again.";

          // Save assistant response
          await db.saveChatMessage(ctx.user.id, "assistant", assistantMessage);

          return { success: true, message: assistantMessage };
        } catch (error: any) {
          console.error("Claude API error:", error);
          const errorMessage = "I encountered an error processing your request. Please try again later.";
          await db.saveChatMessage(ctx.user.id, "assistant", errorMessage);
          return { success: false, message: errorMessage };
        }
      }),
  }),
});

export type AppRouter = typeof appRouter;
