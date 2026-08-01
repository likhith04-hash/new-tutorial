import { firstName } from '@/app/lib/date'
import { percentOf, type MacroTotals } from '@/app/lib/nutrition'

export type GoalType = 'lose' | 'maintain' | 'gain'

export interface CoachContext {
  prompt: string
  name: string
  goalType: GoalType
  calorieTarget: number
  proteinTarget: number
  caloriesLeft: number
  todayMacros: MacroTotals
  /** Average daily calories over the last 7 days, when logs are available. */
  weeklyAvgCalories?: number
}

/** Single source of truth for coach replies, used by the API route and the client fallback. */
export function generateCoachReply(ctx: CoachContext): string {
  const lower = (ctx.prompt || '').toLowerCase()
  const who = firstName(ctx.name)

  if (lower.includes('dinner')) {
    if (ctx.goalType === 'lose') {
      return `Hey ${who}! Since your primary goal is weight loss, I'd suggest a volume-dense, calorie-conscious dinner (~${Math.min(500, Math.max(350, ctx.caloriesLeft))} kcal):\n\n🥗 Grilled Chicken Salad with Olive Oil dressing, or\n🐟 Baked Salmon with Steamed Broccoli.\n\nThis gives you ~38g of protein while keeping a healthy calorie deficit! 🌿`
    }
    if (ctx.goalType === 'gain') {
      return `Hey ${who}! Since you're working on muscle gain, aim for a hearty dinner (~${Math.max(650, ctx.caloriesLeft)} kcal):\n\n🥩 Lean Steak or Tofu Grain Bowl with Quinoa, Avocado, and Roasted Veggies.\n\nThis packs ~45g of protein and quality complex carbs for recovery! 💪`
    }
    return `Based on your ${ctx.calorieTarget} kcal target, here's a balanced dinner idea (~${Math.max(400, ctx.caloriesLeft)} kcal):\n\n🥘 Chicken or Paneer Stir-Fry with mixed veggies and brown rice. Great balance of protein, carbs, and healthy fats! 🍽️`
  }

  if (lower.includes('protein')) {
    const eaten = ctx.todayMacros.protein
    const left = Math.max(0, ctx.proteinTarget - eaten)
    return `Looking at today's log, you've consumed ${eaten}g of protein (${percentOf(eaten, ctx.proteinTarget)}% of your ${ctx.proteinTarget}g target). You still need ${left}g more today.\n\nQuick high-protein additions:\n• 🥣 200g Greek Yogurt (18g P)\n• 🥚 2 Hard Boiled Eggs (12g P)\n• 🥤 1 Scoop Whey Protein (24g P) 💪`
  }

  if (lower.includes('snack')) {
    return `Here are top snack ideas aligned with your ${ctx.goalType.toUpperCase()} goal:\n\n1. 🍎 Apple + 1 tbsp Almond Butter (180 kcal, 4g P)\n2. 🥣 Low-fat Cottage Cheese or Greek Yogurt (140 kcal, 15g P)\n3. 🥜 Handful of Roasted Almonds & Walnuts (170 kcal, 6g P)\n4. 🥚 Edamame pods with sea salt (130 kcal, 11g P)`
  }

  if (lower.includes('week') || lower.includes('review')) {
    if (typeof ctx.weeklyAvgCalories === 'number') {
      const avg = ctx.weeklyAvgCalories
      const status = avg < ctx.calorieTarget - 100
        ? 'in a slight deficit'
        : avg > ctx.calorieTarget + 100 ? 'in a slight surplus' : 'right on target'
      return `📊 7-Day Review for ${ctx.name}:\n• Average Daily Intake: ${avg} kcal (${status} relative to your ${ctx.calorieTarget} kcal ${ctx.goalType} goal).\n• Protein Consistency: Good!\n• Recommendation: Keep tracking your meals daily for maximum results.`
    }
    return `📊 7-Day Performance Review for ${ctx.name}:\n• Target Calorie Intake: ${ctx.calorieTarget} kcal\n• Goal Objective: ${ctx.goalType.toUpperCase()}\n• Recommendation: Keep tracking daily meals for continuous progress!`
  }

  return `Thanks for reaching out, ${who}! Based on your current ${ctx.goalType} plan (${ctx.calorieTarget} kcal target), I'm here to analyze your logs, suggest customized recipes, or help you adjust your macros. What would you like to work on?`
}
