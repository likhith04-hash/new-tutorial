'use client'

import { useState, useRef, useEffect, useCallback, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Header from '@/app/components/Header'
import Icon from '@/app/components/Icon'
import { useNutrition } from '@/app/components/NutritionContext'

function CoachContent() {
  const { chatMessages, addChatMessage, goals, getCaloriesForDate, getMacrosForDate, profile } = useNutrition()
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
    const goalType = goals.goalType // 'lose' | 'maintain' | 'gain'
    const firstName = profile.name.split(' ')[0]

    if (lower.includes('dinner')) {
      if (goalType === 'lose') {
        return `Hey ${firstName}! Since your primary goal is weight loss, I'd suggest a volume-dense, calorie-conscious dinner (${Math.min(500, Math.max(350, calsLeft))} kcal):\n\n🥗 Grilled Chicken Salad with Olive Oil dressing, or\n🐟 Baked Salmon with Steamed Broccoli.\n\nThis gives you ~38g of protein while keeping a healthy calorie deficit!`
      } else if (goalType === 'gain') {
        return `Hey ${firstName}! Since you're working on muscle gain, aim for a hearty dinner (~${Math.max(650, calsLeft)} kcal):\n\n🥩 Lean Steak or Tofu Grain Bowl with Quinoa, Avocado, and Roasted Veggies.\n\nThis packs ~45g of protein and quality complex carbs for recovery! 💪`
      } else {
        return `Based on your ${goals.calories} kcal target, here's a balanced dinner idea (${Math.max(400, calsLeft)} kcal):\n\n🥘 Chicken or Paneer Stir-Fry with mixed veggies and brown rice. Great balance of protein, carbs, and healthy fats!`
      }
    }

    if (lower.includes('protein')) {
      const pct = Math.round((todayMacros.protein / goals.proteinG) * 100)
      const pLeft = Math.max(0, goals.proteinG - todayMacros.protein)
      return `Looking at today's log, you've consumed ${todayMacros.protein}g of protein (${pct}% of your ${goals.proteinG}g target). You still need ${pLeft}g more today.\n\nQuick high-protein additions:\n• 🥣 200g Greek Yogurt (18g P)\n• 🥚 2 Hard Boiled Eggs (12g P)\n• 🥤 1 Scoop Whey Protein (24g P)`
    }

    if (lower.includes('snack')) {
      return `Here are top snack ideas aligned with your ${goalType.toUpperCase()} goal:\n\n1. 🍎 Apple + 1 tbsp Almond Butter (180 kcal, 4g P)\n2. 🥣 Low-fat Cottage Cheese or Greek Yogurt (140 kcal, 15g P)\n3. 🥜 Handful of Roasted Almonds & Walnuts (170 kcal, 6g P)\n4. 🥚 Edamame pods with sea salt (130 kcal, 11g P)`
    }

    if (lower.includes('week') || lower.includes('review')) {
      const avg = Math.round(Array.from({ length: 7 }, (_, i) => {
        const d = new Date(); d.setDate(d.getDate() - i)
        return getCaloriesForDate(d.toISOString().slice(0, 10))
      }).reduce((s, v) => s + v, 0) / 7)
      
      const status = avg < goals.calories - 100 ? 'in a slight deficit' : avg > goals.calories + 100 ? 'in a slight surplus' : 'right on target'
      return `📊 7-Day Review for ${profile.name}:\n• Average Daily Intake: ${avg} kcal (${status} relative to your ${goals.calories} kcal ${goalType} goal).\n• Protein Consistency: Good!\n• Recommendation: Keep tracking your meals daily for maximum results.`
    }

    return `Thanks for reaching out, ${firstName}! Based on your current ${goalType} plan (${goals.calories} kcal target), I'm here to analyze your logs, suggest customized recipes, or help you adjust your macros. What would you like to work on?`
  }, [goals, getCaloriesForDate, getMacrosForDate, profile])

  const handleSend = useCallback((text: string) => {
    if (!text.trim() || isTyping) return
    addChatMessage({ role: 'user', content: text.trim() })
    setInput('')
    setIsTyping(true)

    setTimeout(() => {
      setIsTyping(false)
      addChatMessage({ role: 'assistant', content: generateResponse(text) })
    }, 1200 + Math.random() * 600)
  }, [isTyping, addChatMessage, generateResponse])

  // Handle URL prompt query param on mount
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
  const proteinLeft = Math.max(0, goals.proteinG - getMacrosForDate(today).protein)
  const goalCopy = goals.goalType === 'lose' ? 'a calorie-conscious, high-protein dinner' : goals.goalType === 'gain' ? 'a protein-rich, energy-dense dinner' : 'a balanced dinner that keeps you on target'
  const proactivePrompt = `Suggest ${goalCopy} with about ${Math.max(350, Math.min(650, caloriesLeft))} kcal and ${Math.max(20, proteinLeft)}g protein.`

  return (
    <div className="coach-page">
      <section className="proactive-nudge">
        <div className="nudge-icon"><Icon name="sparkle" size={19} /></div>
        <div>
          <span>PROACTIVE COACHING</span>
          <b>{caloriesLeft > 550 ? `You have ${caloriesLeft} kcal left today.` : 'You are close to today’s calorie target.'}</b>
          <p>For your {goals.goalType} goal, I recommend {goalCopy}.</p>
        </div>
        <button onClick={() => handleSend(proactivePrompt)}>Plan dinner <Icon name="arrow" size={14} /></button>
      </section>
      <div className="chat-container">
        <div className="chat-messages">
          {chatMessages.length === 0 ? (
            <div className="chat-welcome">
              <div className="welcome-icon"><Icon name="sparkle" size={26} /></div>
              <h3>Hi {firstName}! 👋</h3>
              <p>I&apos;m your AI nutrition coach tailored for your <b>{goals.goalType.toUpperCase()}</b> goal. Ask me anything about your diet or get meal ideas.</p>
            </div>
          ) : (
            chatMessages.map(msg => (
              <div key={msg.id} className={`message ${msg.role}`}>
                <div className="message-avatar">{msg.role === 'user' ? profile.initials : '✦'}</div>
                <div className="message-bubble" style={{ whiteSpace: 'pre-line' }}>{msg.content}</div>
              </div>
            ))
          )}
          {isTyping && (
            <div className="message assistant">
              <div className="message-avatar">✦</div>
              <div className="typing-indicator"><span /><span /><span /></div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        <div className="suggestion-chips">
          {chips.map(chip => (
            <button key={chip} className="chip" onClick={() => handleSend(chip)}>{chip}</button>
          ))}
        </div>

        <div className="chat-input-area">
          <input
            className="chat-input"
            placeholder="Ask your nutrition coach..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend(input)}
          />
          <button className="chat-send" onClick={() => handleSend(input)} disabled={!input.trim() || isTyping}>
            <Icon name="send" size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}

import SkeletonLoader from '@/app/components/SkeletonLoader'

export default function CoachPage() {
  return (
    <>
      <Header />
      <Suspense fallback={<SkeletonLoader />}>
        <CoachContent />
      </Suspense>
    </>
  )
}

