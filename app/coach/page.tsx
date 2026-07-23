'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import Header from '@/app/components/Header'
import Icon from '@/app/components/Icon'
import { useNutrition } from '@/app/components/NutritionContext'

export default function CoachPage() {
  const { chatMessages, addChatMessage, goals, getCaloriesForDate, getMacrosForDate, profile } = useNutrition()
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [chatMessages, isTyping])

  const generateResponse = useCallback((text: string) => {
    const lower = text.toLowerCase()
    const today = new Date().toISOString().slice(0, 10)
    const todayMacros = getMacrosForDate(today)

    if (lower.includes('dinner')) {
      return 'Based on your meals today, I\'d suggest a light dinner around 450–550 kcal. How about grilled fish with roasted vegetables? It would give you a good protein boost while keeping your calories in check. 🐟'
    }
    if (lower.includes('protein')) {
      const pct = Math.round((todayMacros.protein / goals.proteinG) * 100)
      return `Looking at your logs, you've had ${todayMacros.protein}g protein today — that's ${pct}% of your ${goals.proteinG}g target. Try adding Greek yogurt or eggs to boost your intake! 💪`
    }
    if (lower.includes('snack')) {
      return 'Here are some great snack ideas under 200 kcal:\n\n1. 🍎 Apple slices with almond butter (180 kcal)\n2. 🥜 Handful of mixed nuts (170 kcal)\n3. 🥕 Carrot sticks with hummus (130 kcal)\n4. 🫐 Greek yogurt with berries (150 kcal)'
    }
    if (lower.includes('week') || lower.includes('review')) {
      const avg = Math.round(Array.from({ length: 7 }, (_, i) => {
        const d = new Date(); d.setDate(d.getDate() - i)
        return getCaloriesForDate(d.toISOString().slice(0, 10))
      }).reduce((s, v) => s + v, 0) / 7)
      return `This week you averaged ${avg} kcal/day against your ${goals.calories} kcal target. Your protein intake has been consistent. Keep focusing on hydration — you missed your water goal on a couple of days. 📊`
    }
    return 'That\'s a great question! Based on your nutrition profile, I\'d recommend focusing on balanced meals with adequate protein. Would you like me to suggest specific meals or give tips for your current goals? 🌱'
  }, [goals, getCaloriesForDate, getMacrosForDate])

  const handleSend = useCallback((text: string) => {
    if (!text.trim() || isTyping) return
    addChatMessage({ role: 'user', content: text.trim() })
    setInput('')
    setIsTyping(true)

    setTimeout(() => {
      setIsTyping(false)
      addChatMessage({ role: 'assistant', content: generateResponse(text) })
    }, 1500 + Math.random() * 1000)
  }, [isTyping, addChatMessage, generateResponse])

  const chips = ['What should I eat for dinner?', 'Am I getting enough protein?', 'Suggest a healthy snack', 'Review my week']
  const firstName = profile.name.split(' ')[0]

  return (
    <>
      <Header />
      <div className="coach-page">
        <div className="chat-container">
          <div className="chat-messages">
            {chatMessages.length === 0 ? (
              <div className="chat-welcome">
                <div className="welcome-icon"><Icon name="sparkle" size={26} /></div>
                <h3>Hi {firstName}! 👋</h3>
                <p>I&apos;m your AI nutrition coach. Ask me anything about your diet, get meal suggestions, or learn about nutrition.</p>
              </div>
            ) : (
              chatMessages.map(msg => (
                <div key={msg.id} className={`message ${msg.role}`}>
                  <div className="message-avatar">{msg.role === 'user' ? profile.initials : '✦'}</div>
                  <div className="message-bubble">{msg.content}</div>
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
    </>
  )
}
