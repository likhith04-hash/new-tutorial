'use client'

import { useState, useRef, useEffect, useCallback, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Header from '@/app/components/Header'
import Icon from '@/app/components/Icon'
import { useNutrition } from '@/app/components/NutritionContext'

function CoachContent() {
  const { chatMessages, addChatMessage, goals, getCaloriesForDate, getMacrosForDate, getWaterForDate, meals, profile } = useNutrition()
  const searchParams = useSearchParams()
  const initialPromptProcessed = useRef(false)

  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [chatMessages, isTyping])

  const handleSend = useCallback(async (text: string) => {
    if (!text.trim() || isTyping) return
    const userMsg = text.trim()
    addChatMessage({ role: 'user', content: userMsg })
    setInput('')
    setIsTyping(true)

    const todayStr = new Date().toISOString().slice(0, 10)
    const todayCals = getCaloriesForDate(todayStr)
    const todayMacros = getMacrosForDate(todayStr)

    // Build 7-day trend and recent meals for richer context
    const last7 = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(); d.setDate(d.getDate() - i)
      return d.toISOString().slice(0, 10)
    })
    const weeklyTrend = last7.map(date => ({
      date,
      calories: getCaloriesForDate(date),
      ...getMacrosForDate(date),
      water: getWaterForDate(date),
    }))
    const recentMeals = meals
      .filter(m => last7.includes(m.date))
      .sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id))
      .slice(0, 15)
      .map(m => `${m.date} ${m.type}: ${m.name} (${m.calories} kcal, P${m.protein}g C${m.carbs}g F${m.fat}g)`)

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
          weeklyTrend,
          recentMeals,
        }),
      })

      const data = await res.json() as { reply?: string; error?: string }
      addChatMessage({ role: 'assistant', content: data.reply || data.error || 'Nutrition AI is temporarily unavailable. Please try again.' })
    } catch {
      addChatMessage({ role: 'assistant', content: 'Nutrition AI is temporarily unavailable. Your saved meals are safe.' })
    } finally { setIsTyping(false) }
  }, [isTyping, addChatMessage, goals, getCaloriesForDate, getMacrosForDate, getWaterForDate, meals, profile.name])

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

