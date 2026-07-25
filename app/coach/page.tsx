'use client'

import { useState, useRef, useEffect, useCallback, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Header from '@/app/components/Header'
import Icon from '@/app/components/Icon'
import { useNutrition } from '@/app/components/NutritionContext'
import { Button, Card, Badge, PageHeader, Input } from '@/app/components/ui/DesignSystem'
import SkeletonLoader from '@/app/components/SkeletonLoader'

function CoachContent() {
  const { chatMessages, addChatMessage, updateLastChatMessage, goals, getCaloriesForDate, getMacrosForDate, profile } = useNutrition()
  const searchParams = useSearchParams()
  const initialPromptProcessed = useRef(false)

  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [chatMessages, isTyping])

  const generateResponse = useCallback((text: string) => {
    const lower = text.toLowerCase()
    const today = new Date().toISOString().slice(0, 10)
    const todayMacros = getMacrosForDate(today)
    const todayCals = getCaloriesForDate(today)
    const calsLeft = goals.calories - todayCals
    const goalType = goals.goalType
    const firstName = profile.name.split(' ')[0]

    if (lower.includes('dinner')) {
      if (goalType === 'lose') {
        return `Hey ${firstName}! Since your primary goal is weight loss, I recommend a volume-dense dinner (${Math.min(500, Math.max(350, calsLeft))} kcal):\n\n🥗 Grilled Chicken Salad with Olive Oil dressing, or\n🐟 Baked Salmon with Steamed Broccoli.\n\nThis delivers ~38g protein while maintaining a healthy calorie deficit!`
      } else if (goalType === 'gain') {
        return `Hey ${firstName}! Since you are working on muscle gain, aim for a hearty dinner (~${Math.max(650, calsLeft)} kcal):\n\n🥩 Lean Steak or Tofu Grain Bowl with Quinoa, Avocado, and Veggies.\n\nThis packs ~45g of protein for muscle recovery! 💪`
      } else {
        return `Based on your ${goals.calories} kcal target, here is a balanced dinner idea (${Math.max(400, calsLeft)} kcal):\n\n🥘 Chicken or Paneer Stir-Fry with mixed veggies and brown rice!`
      }
    }

    if (lower.includes('protein')) {
      const pct = Math.round((todayMacros.protein / goals.proteinG) * 100)
      const pLeft = Math.max(0, goals.proteinG - todayMacros.protein)
      return `Looking at today's log, you've consumed ${todayMacros.protein}g of protein (${pct}% of your ${goals.proteinG}g target). You still need ${pLeft}g more today.\n\nQuick high-protein additions:\n• 🥣 200g Greek Yogurt (18g P)\n• 🥚 2 Hard Boiled Eggs (12g P)\n• 🥤 1 Scoop Whey Protein (24g P)`
    }

    return `Thanks for reaching out, ${firstName}! Based on your current ${goalType} plan (${goals.calories} kcal target), I'm here to analyze your logs and suggest customized recipes. What would you like to work on?`
  }, [goals, getCaloriesForDate, getMacrosForDate, profile])

  const handleSend = useCallback(async (text: string) => {
    if (!text.trim() || isTyping) return
    const userMsg = text.trim()
    addChatMessage({ role: 'user', content: userMsg })
    setInput('')
    setIsTyping(true)

    const todayStr = new Date().toISOString().slice(0, 10)
    const todayCals = getCaloriesForDate(todayStr)
    const todayMacros = getMacrosForDate(todayStr)

    try {
      const res = await fetch('/api/coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: userMsg,
          goalType: goals.goalType,
          name: profile.name,
          caloriesLeft: goals.calories - todayCals,
          proteinLeft: Math.max(0, goals.proteinG - todayMacros.protein),
          todayMacros,
          goals,
        }),
      })

      if (!res.ok || !res.body) {
        setIsTyping(false)
        addChatMessage({ role: 'assistant', content: generateResponse(userMsg) })
        return
      }

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let streamedContent = ''
      setIsTyping(false)

      addChatMessage({ role: 'assistant', content: '' })

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value, { stream: true })
        streamedContent += chunk
        updateLastChatMessage(streamedContent)
      }
    } catch {
      setIsTyping(false)
      addChatMessage({ role: 'assistant', content: generateResponse(userMsg) })
    }
  }, [isTyping, addChatMessage, generateResponse, goals, getCaloriesForDate, getMacrosForDate, profile.name])

  useEffect(() => {
    const promptParam = searchParams.get('prompt')
    if (promptParam && !initialPromptProcessed.current) {
      initialPromptProcessed.current = true
      handleSend(promptParam)
    }
  }, [searchParams, handleSend])

  const chips = [
    'What should I eat for dinner?',
    'Am I getting enough protein?',
    'Suggest a healthy snack',
    'Review my week',
  ]

  const firstName = profile.name.split(' ')[0]
  const today = new Date().toISOString().slice(0, 10)
  const caloriesLeft = goals.calories - getCaloriesForDate(today)

  return (
    <div className="dark min-h-screen bg-[#09090B] text-[#FFFFFF] font-sans px-6 md:px-8 py-8 max-w-[1280px] mx-auto space-y-8">
      <Header />

      <PageHeader
        badge="AI COACH OS v2.0"
        title="Nourish Intelligence Coach"
        subtitle={`Real-time streaming advice tailored for your ${goals.goalType.toUpperCase()} goal.`}
        action={<Badge variant="cyan">Streaming Connected</Badge>}
      />

      {/* Proactive AI Nudge Card */}
      <Card variant="highlight" radius="md" className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-[#22D3EE]/20 text-[#22D3EE] flex items-center justify-center font-bold text-lg">
            ✦
          </div>
          <div>
            <span className="text-[13px] font-medium uppercase tracking-wider text-[#22D3EE]">PROACTIVE COACHING</span>
            <p className="text-[16px] font-semibold text-white">
              {caloriesLeft > 0 ? `You have ${caloriesLeft} kcal remaining today.` : 'You are right on target today.'}
            </p>
          </div>
        </div>
        <Button variant="secondary" size="sm" onClick={() => handleSend('Suggest a healthy dinner based on my remaining calories')}>
          Plan Dinner →
        </Button>
      </Card>

      {/* ChatGPT / Linear Style Chat Container */}
      <Card variant="default" radius="lg" className="min-h-[500px] flex flex-col justify-between p-6 md:p-8">
        
        {/* Messages Feed */}
        <div className="space-y-6 max-h-[480px] overflow-y-auto pr-2 mb-6">
          {chatMessages.length === 0 ? (
            <div className="text-center py-16 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-[#22D3EE]/10 text-[#22D3EE] flex items-center justify-center mx-auto text-2xl font-bold border border-[#22D3EE]/20">
                ✦
              </div>
              <h3 className="text-[20px] font-medium text-white">Welcome back, {firstName}! 👋</h3>
              <p className="text-[16px] text-[#A1A1AA] max-w-md mx-auto">
                Ask me any question about your nutrition, meal plans, or macro goals.
              </p>
            </div>
          ) : (
            chatMessages.map(msg => (
              <div key={msg.id} className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-xl bg-[#22D3EE] text-[#09090B] flex items-center justify-center font-bold text-xs flex-shrink-0">
                    ✦
                  </div>
                )}
                <div
                  className={`p-4 rounded-[16px] text-sm leading-relaxed max-w-[80%] whitespace-pre-line ${
                    msg.role === 'user'
                      ? 'bg-[#09090B] text-white border border-white/[0.08]'
                      : 'bg-[#18181B] text-white border border-white/[0.08]'
                  }`}
                >
                  {msg.content}
                </div>
                {msg.role === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-[#22D3EE] text-[#09090B] flex items-center justify-center font-bold text-xs flex-shrink-0">
                    {profile.initials}
                  </div>
                )}
              </div>
            ))
          )}
          {isTyping && (
            <div className="flex items-center gap-3 text-[#22D3EE] text-xs">
              <span className="w-2 h-2 rounded-full bg-[#22D3EE] animate-ping" />
              AI Coach is thinking...
            </div>
          )}
          <div ref={endRef} />
        </div>

        {/* Suggestion Chips */}
        <div className="flex flex-wrap gap-2 pb-4 border-b border-white/[0.08] mb-4">
          {chips.map(chip => (
            <button
              key={chip}
              onClick={() => handleSend(chip)}
              className="bg-[#09090B] hover:bg-white/[0.08] text-[#A1A1AA] hover:text-white text-xs px-3.5 py-1.5 rounded-full border border-white/[0.08] transition-colors"
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Input Area */}
        <div className="flex items-center gap-3">
          <Input
            placeholder="Ask your nutrition coach anything..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend(input)}
          />
          <Button variant="secondary" onClick={() => handleSend(input)} disabled={!input.trim() || isTyping}>
            Send →
          </Button>
        </div>
      </Card>
    </div>
  )
}

export default function CoachPage() {
  return (
    <Suspense fallback={<SkeletonLoader />}>
      <CoachContent />
    </Suspense>
  )
}
