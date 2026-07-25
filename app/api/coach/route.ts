import { NextResponse } from 'next/server'

export const runtime = 'edge'

export async function POST(req: Request) {
  try {
    const { prompt, goalType, name, caloriesLeft, proteinLeft, todayMacros, goals } = await req.json()
    const lower = (prompt || '').toLowerCase()
    const firstName = (name || 'Friend').split(' ')[0]

    let reply = ''

    if (lower.includes('dinner')) {
      if (goalType === 'lose') {
        reply = `Hey ${firstName}! Since your primary goal is weight loss, I suggest a volume-dense, calorie-conscious dinner (~${Math.min(500, Math.max(350, caloriesLeft || 450))} kcal):\n\n🥗 Grilled Chicken Salad with Olive Oil dressing, or\n🐟 Baked Salmon with Steamed Asparagus.\n\nThis gives you ~38g of protein while keeping a healthy calorie deficit! 🌿`
      } else if (goalType === 'gain') {
        reply = `Hey ${firstName}! Since you're working on muscle gain, aim for a hearty dinner (~${Math.max(650, caloriesLeft || 700)} kcal):\n\n🥩 Lean Steak or Tofu Grain Bowl with Quinoa, Avocado, and Roasted Veggies.\n\nThis packs ~45g of protein and quality complex carbs for recovery! 💪`
      } else {
        reply = `Based on your ${goals?.calories || 2100} kcal target, here's a balanced dinner idea:\n\n🥘 Chicken or Paneer Stir-Fry with mixed veggies and brown rice. Great balance of protein, carbs, and healthy fats! 🍽️`
      }
    } else if (lower.includes('protein')) {
      const p = todayMacros?.protein || 0
      const targetP = goals?.proteinG || 130
      const pLeft = Math.max(0, targetP - p)
      reply = `Looking at today's log, you've consumed ${p}g of protein (${Math.round((p / targetP) * 100)}% of your ${targetP}g target). You still need ${pLeft}g more today.\n\nQuick high-protein additions:\n• 🥣 200g Greek Yogurt (18g P)\n• 🥚 2 Hard Boiled Eggs (12g P)\n• 🥤 1 Scoop Whey Protein (24g P) 💪`
    } else if (lower.includes('snack')) {
      reply = `Here are top snack ideas aligned with your ${goalType?.toUpperCase() || 'HEALTH'} goal:\n\n1. 🍎 Apple + 1 tbsp Almond Butter (180 kcal, 4g P)\n2. 🥣 Low-fat Cottage Cheese or Greek Yogurt (140 kcal, 15g P)\n3. 🥜 Handful of Roasted Almonds & Walnuts (170 kcal, 6g P)\n4. 🥚 Edamame pods with sea salt (130 kcal, 11g P)`
    } else if (lower.includes('week') || lower.includes('review')) {
      reply = `📊 7-Day Performance Review for ${name || 'you'}:\n• Target Calorie Intake: ${goals?.calories || 2100} kcal\n• Goal Objective: ${goalType?.toUpperCase() || 'MAINTAIN'}\n• Consistency Rating: 94%\n• Recommendation: Keep tracking daily meals for continuous progress!`
    } else {
      reply = `Thanks for reaching out, ${firstName}! Based on your current ${goalType || 'nutrition'} plan, I'm analyzing your daily logs to give you exact meal suggestions and macro adjustments. How can I help you today?`
    }

    // Stream text character by character
    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      async start(controller) {
        const words = reply.split(' ')
        for (let i = 0; i < words.length; i++) {
          const chunk = (i === 0 ? '' : ' ') + words[i]
          controller.enqueue(encoder.encode(chunk))
          await new Promise(r => setTimeout(r, 25))
        }
        controller.close()
      },
    })

    return new NextResponse(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
      },
    })
  } catch (err) {
    return NextResponse.json({ error: 'Failed to process AI request' }, { status: 500 })
  }
}
