import { NextResponse } from 'next/server'
import { generateCoachReply, type GoalType } from '@/app/lib/coach'

export const runtime = 'edge'

export async function POST(req: Request) {
  try {
    const { prompt, goalType, name, caloriesLeft, todayMacros, goals, weeklyAvgCalories } = await req.json()

    const reply = generateCoachReply({
      prompt: prompt || '',
      name: name || 'Friend',
      goalType: (goalType as GoalType) || 'maintain',
      calorieTarget: goals?.calories || 2100,
      proteinTarget: goals?.proteinG || 130,
      caloriesLeft: caloriesLeft ?? 450,
      todayMacros: {
        protein: todayMacros?.protein || 0,
        carbs: todayMacros?.carbs || 0,
        fat: todayMacros?.fat || 0,
      },
      weeklyAvgCalories: typeof weeklyAvgCalories === 'number' ? weeklyAvgCalories : undefined,
    })

    // Stream text word by word
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
  } catch {
    return NextResponse.json({ error: 'Failed to process AI request' }, { status: 500 })
  }
}
