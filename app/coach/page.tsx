'use client'

import { useState, useRef, useEffect, useCallback, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Header from '@/app/components/Header'
import Icon from '@/app/components/Icon'
import { useNutrition } from '@/app/components/NutritionContext'
import { generateCoachReply } from '@/app/lib/coach'
import { firstName as firstNameOf, lastNDays, todayISO } from '@/app/lib/date'
import { average } from '@/app/lib/nutrition'

function CoachContent() {
  const { chatMessages, addChatMessage, updateLastChatMessage, goals, getCaloriesForDate, getMacrosForDate, profile } = useNutrition()
  const searchParams = useSearchParams()
  const initialPromptProcessed = useRef(false)

  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [chatMessages, isTyping])

  const generateResponse = useCallback((text: string) => {
    const today = todayISO()
    return generateCoachReply({
      prompt: text,
      name: profile.name,
      goalType: goals.goalType,
      calorieTarget: goals.calories,
      proteinTarget: goals.proteinG,
      caloriesLeft: goals.calories - getCaloriesForDate(today),
      todayMacros: getMacrosForDate(today),
      weeklyAvgCalories: average(lastNDays(7).map(getCaloriesForDate)),
    })
  }, [goals, getCaloriesForDate, getMacrosForDate, profile])

  const handleSend = useCallback(async (text: string) => {
    if (!text.trim() || isTyping) return
    const userMsg = text.trim()
    addChatMessage({ role: 'user', content: userMsg })
    setInput('')
    setIsTyping(true)

    const todayStr = todayISO()
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
          weeklyAvgCalories: average(lastNDays(7).map(getCaloriesForDate)),
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

      // Add empty assistant message to accumulate stream
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

  const firstName = firstNameOf(profile.name)
  const today = todayISO()
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

