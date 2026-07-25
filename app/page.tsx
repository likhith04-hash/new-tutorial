'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LandingPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [coachQuery, setCoachQuery] = useState('')
  const [activeTab, setActiveTab] = useState('all')
  const [waterGlasses, setWaterGlasses] = useState(6)
  const [loggedMeals, setLoggedMeals] = useState([
    { name: 'Grilled Salmon Quinoa Bowl', cals: 580, protein: 42, carbs: 45, fat: 18, time: '1:15 PM', icon: '🥗' },
    { name: 'Avocado Toast & Poached Egg', cals: 360, protein: 16, carbs: 32, fat: 20, time: '8:30 AM', icon: '🥑' },
  ])
  const [coachMessages, setCoachMessages] = useState([
    { role: 'user', content: 'What should I eat to hit my 45g protein target tonight?' },
    { role: 'assistant', content: '✦ Based on your remaining 913 kcal and 45g protein target, I recommend a Grilled Salmon Quinoa Bowl with steamed broccoli. It delivers 42g protein with heart-healthy omega-3 fats.' }
  ])

  useEffect(() => {
    // Entrance animations observer
    const observerOptions = { threshold: 0.1 }
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('opacity-100', 'translate-y-0')
          entry.target.classList.remove('opacity-0', 'translate-y-8')
        }
      })
    }, observerOptions)

    const animatedElements = document.querySelectorAll('.animate-on-scroll')
    animatedElements.forEach(el => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  const handleStartTracking = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    router.push('/dashboard')
  }

  const handleAskCoach = (e: React.FormEvent) => {
    e.preventDefault()
    if (!coachQuery.trim()) return
    const userMsg = coachQuery.trim()
    setCoachQuery('')
    setCoachMessages(prev => [
      ...prev,
      { role: 'user', content: userMsg },
      { role: 'assistant', content: `✦ Analyzing your daily intake: For "${userMsg}", consider a lean protein option like Greek Yogurt (22g protein) or Edamame (17g protein) to maintain your daily deficit while staying in your macro window.` }
    ])
  }

  const handleAddQuickMeal = (name: string, cals: number, protein: number, carbs: number, fat: number, icon: string) => {
    setLoggedMeals(prev => [
      { name, cals, protein, carbs, fat, time: 'Just now', icon },
      ...prev
    ])
  }

  const weeklyChartBars = [
    { day: 'Sun', heightPct: 65, cals: '1,820 kcal' },
    { day: 'Mon', heightPct: 85, cals: '2,050 kcal' },
    { day: 'Tue', heightPct: 100, cals: '2,100 kcal', isPeak: true },
    { day: 'Wed', heightPct: 75, cals: '1,910 kcal' },
    { day: 'Thu', heightPct: 90, cals: '2,080 kcal' },
    { day: 'Fri', heightPct: 60, cals: '1,750 kcal' },
    { day: 'Sat', heightPct: 45, cals: '1,500 kcal' },
  ]

  return (
    <div className="dark min-h-screen overflow-x-hidden bg-[#09090B] text-[#FFFFFF] font-sans selection:bg-[#22D3EE] selection:text-[#09090B]">
      {/* Google Fonts - Geist & Geist Mono */}
      <link
        href="https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700;800&family=Geist+Mono:wght@400;500;600&display=swap"
        rel="stylesheet"
      />

      <style jsx global>{`
        body {
          font-family: 'Geist', -apple-system, BlinkMacSystemFont, sans-serif;
          background-color: #09090B;
          color: #FFFFFF;
        }
        @keyframes lp-hero-in {
          from { opacity: 0; filter: blur(14px); transform: translateY(16px); }
          to   { opacity: 1; filter: blur(0);   transform: translateY(0); }
        }
        .lp-hero-in {
          animation: lp-hero-in 0.8s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        .os-glow {
          background: radial-gradient(circle at 50% 0%, rgba(34, 211, 238, 0.12), transparent 70%);
        }
      `}</style>

      {/* 21st.dev Style Glass Navbar */}
      <header className="sticky top-0 z-50 border-b border-white/[0.08] bg-[#09090B]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between px-6 md:px-8">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 outline-none group">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#22D3EE] to-[#34D399] flex items-center justify-center text-[#09090B] font-bold text-sm shadow-[0_0_20px_rgba(34,211,238,0.3)] group-hover:scale-105 transition-transform">
              ✦
            </div>
            <span className="font-bold text-lg tracking-tight text-[#FFFFFF]">
              Nourish<span className="text-[#22D3EE]">.os</span>
            </span>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden items-center gap-8 md:flex">
            <a href="#dashboard" className="text-[14px] font-medium text-[#A1A1AA] transition-colors hover:text-[#FFFFFF]">
              Dashboard
            </a>
            <a href="#features" className="text-[14px] font-medium text-[#A1A1AA] transition-colors hover:text-[#FFFFFF]">
              Features
            </a>
            <a href="#coach" className="text-[14px] font-medium text-[#A1A1AA] transition-colors hover:text-[#FFFFFF]">
              AI Intelligence
            </a>
            <a href="#analytics" className="text-[14px] font-medium text-[#A1A1AA] transition-colors hover:text-[#FFFFFF]">
              Analytics
            </a>
          </nav>

          {/* Right Action CTA */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/dashboard')}
              className="hidden sm:inline-flex text-[14px] font-medium text-[#A1A1AA] hover:text-[#FFFFFF] transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={() => router.push('/dashboard')}
              className="inline-flex h-10 items-center justify-center rounded-full bg-[#FFFFFF] px-5 text-[14px] font-semibold text-[#09090B] hover:bg-[#22D3EE] transition-all duration-300 shadow-[0_0_20px_rgba(34,211,238,0.2)] active:scale-95"
            >
              Launch OS →
            </button>
          </div>
        </div>
      </header>

      <main className="relative">
        {/* Subtle Ambient Radial Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1280px] h-[600px] os-glow pointer-events-none" />

        {/* ---------------------------------------------------- */}
        {/* HERO SECTION (Left Text + Right Interactive OS Bento Preview) */}
        {/* ---------------------------------------------------- */}
        <section className="relative z-10 pt-16 pb-24 md:pt-24 md:pb-32 max-w-[1280px] mx-auto px-6 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* LEFT HERO COLUMN */}
            <div className="lg:col-span-6 space-y-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-[#111113] px-4 py-1.5 text-[13px] font-medium text-[#22D3EE]">
                <span className="h-2 w-2 rounded-full bg-[#22D3EE] animate-pulse" />
                AI OPERATING SYSTEM FOR NUTRITION v2.0
              </div>

              {/* Hero Title: 72px Bold */}
              <h1 className="lp-hero-in text-5xl md:text-[72px] font-bold tracking-[-0.02em] leading-[1.05] text-[#FFFFFF]">
                Intelligence for<br />
                <span className="bg-gradient-to-r from-[#22D3EE] via-[#34D399] to-[#FACC15] bg-clip-text text-transparent">
                  your metabolism.
                </span>
              </h1>

              {/* Supporting Body Text: 18px */}
              <p className="lp-hero-in text-[18px] text-[#A1A1AA] leading-[1.6] max-w-xl [animation-delay:0.2s]">
                Nourish turns every meal, glass of water, and body metric into clear, automated health intelligence — zero spreadsheets, zero guesswork, zero friction.
              </p>

              {/* Input & Action Buttons */}
              <form onSubmit={handleStartTracking} className="lp-hero-in flex flex-col sm:flex-row gap-3 max-w-md [animation-delay:0.3s]">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="flex-1 h-12 rounded-full bg-[#111113] border border-white/[0.08] px-5 text-sm text-[#FFFFFF] placeholder:text-[#A1A1AA] focus:border-[#22D3EE] focus:ring-1 focus:ring-[#22D3EE]/30 focus:outline-none transition-all"
                />
                <button
                  type="submit"
                  className="h-12 rounded-full bg-[#22D3EE] hover:bg-[#34D399] text-[#09090B] font-bold px-7 text-sm transition-all duration-300 shadow-[0_0_25px_rgba(34,211,238,0.3)] active:scale-95 whitespace-nowrap"
                >
                  Start Free →
                </button>
              </form>

              {/* Trust Indicators */}
              <div className="flex items-center gap-6 pt-2 text-[13px] font-medium text-[#A1A1AA]">
                <span className="flex items-center gap-2 text-[#34D399]">
                  ✓ 15,000+ Active Users
                </span>
                <span className="flex items-center gap-2 text-[#22D3EE]">
                  ✓ 1.2M+ Meals Logged
                </span>
                <span className="flex items-center gap-2 text-[#FACC15]">
                  ✓ 98.4% Retention
                </span>
              </div>
            </div>

            {/* RIGHT HERO COLUMN: Interactive Dashboard Preview Box (NOT an image) */}
            <div className="lg:col-span-6 relative">
              <div className="bg-[#111113] border border-white/[0.08] rounded-[20px] p-6 sm:p-8 shadow-2xl shadow-black/90 relative hover:border-[#22D3EE]/30 transition-all duration-500 group">
                
                {/* OS Header */}
                <div className="flex justify-between items-start mb-8 pb-6 border-b border-white/[0.08]">
                  <div>
                    <span className="text-[13px] font-medium uppercase tracking-wider text-[#22D3EE]">Daily Calorie Target</span>
                    <div className="flex items-baseline gap-3 mt-1">
                      <span className="text-[40px] font-bold text-[#FFFFFF] tracking-tight leading-none">1,187</span>
                      <span className="text-[18px] text-[#A1A1AA] font-normal">/ 2,100 kcal</span>
                    </div>
                  </div>
                  <div className="w-16 h-16 rounded-2xl bg-[#09090B] border border-white/[0.08] flex flex-col items-center justify-center text-center">
                    <span className="text-[13px] text-[#22D3EE] font-medium">56%</span>
                    <span className="text-[11px] text-[#A1A1AA] uppercase font-bold">Goal</span>
                  </div>
                </div>

                {/* Macros Bento Grid */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-[#09090B] border border-white/[0.08] rounded-[16px] p-4">
                    <span className="text-[13px] font-medium uppercase text-[#34D399] tracking-wider">Protein</span>
                    <p className="text-[40px] font-bold text-[#FFFFFF] leading-none mt-2">85g</p>
                    <p className="text-[13px] text-[#A1A1AA] mt-1">Goal: 130g</p>
                    <div className="w-full bg-[#111113] h-1.5 rounded-full mt-3 overflow-hidden">
                      <div className="bg-[#34D399] h-full w-[65%]" />
                    </div>
                  </div>

                  <div className="bg-[#09090B] border border-white/[0.08] rounded-[16px] p-4">
                    <span className="text-[13px] font-medium uppercase text-[#FACC15] tracking-wider">Carbs</span>
                    <p className="text-[40px] font-bold text-[#FFFFFF] leading-none mt-2">140g</p>
                    <p className="text-[13px] text-[#A1A1AA] mt-1">Goal: 220g</p>
                    <div className="w-full bg-[#111113] h-1.5 rounded-full mt-3 overflow-hidden">
                      <div className="bg-[#FACC15] h-full w-[58%]" />
                    </div>
                  </div>

                  <div className="bg-[#09090B] border border-white/[0.08] rounded-[16px] p-4">
                    <span className="text-[13px] font-medium uppercase text-[#22D3EE] tracking-wider">Fat</span>
                    <p className="text-[40px] font-bold text-[#FFFFFF] leading-none mt-2">42g</p>
                    <p className="text-[13px] text-[#A1A1AA] mt-1">Goal: 70g</p>
                    <div className="w-full bg-[#111113] h-1.5 rounded-full mt-3 overflow-hidden">
                      <div className="bg-[#22D3EE] h-full w-[60%]" />
                    </div>
                  </div>
                </div>

                {/* AI Edge Nudge Alert */}
                <div className="bg-[#09090B] border border-[#22D3EE]/30 rounded-[16px] p-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#22D3EE]/10 text-[#22D3EE] flex items-center justify-center font-bold text-lg flex-shrink-0">
                    ✦
                  </div>
                  <div className="flex-1">
                    <p className="text-[13px] font-medium text-[#22D3EE]">Proactive AI Insight</p>
                    <p className="text-[14px] text-[#A1A1AA] mt-0.5">&ldquo;You have 913 kcal remaining today. Need a protein-rich dinner recommendation?&rdquo;</p>
                  </div>
                  <button
                    onClick={() => router.push('/coach?prompt=Suggest%20a%20high-protein%20dinner')}
                    className="bg-[#22D3EE] hover:bg-[#34D399] text-[#09090B] font-bold text-[13px] px-3.5 py-2 rounded-full transition-colors whitespace-nowrap"
                  >
                    Ask Coach
                  </button>
                </div>
              </div>

              {/* Floating Hydration Widget Overlay */}
              <div className="absolute -bottom-6 -left-4 sm:-left-6 bg-[#111113] border border-white/[0.08] rounded-[20px] p-4 flex items-center gap-4 shadow-2xl z-20">
                <div className="w-11 h-11 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center text-xl font-bold">
                  💧
                </div>
                <div>
                  <p className="text-[13px] font-medium uppercase tracking-wider text-blue-400">Hydration OS</p>
                  <p className="text-[18px] font-medium text-[#FFFFFF]">1.8L <span className="text-[#A1A1AA] text-sm">/ 2.5L</span></p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------- */}
        {/* BENTO GRID DASHBOARD WIDGETS SECTION */}
        {/* ---------------------------------------------------- */}
        <section id="dashboard" className="py-24 border-t border-white/[0.08] bg-[#09090B]">
          <div className="max-w-[1280px] mx-auto px-6 md:px-8">
            
            {/* Section Title: 44px Semibold */}
            <div className="max-w-3xl mb-16 space-y-4">
              <span className="text-[13px] font-medium uppercase tracking-wider text-[#22D3EE] bg-[#111113] border border-white/[0.08] px-4 py-1.5 rounded-full">
                RE-ENGINEERED OPERATING SYSTEM
              </span>
              <h2 className="text-3xl md:text-[44px] font-semibold text-[#FFFFFF] tracking-tight leading-tight">
                Designed for high-performance health tracking.
              </h2>
              <p className="text-[18px] text-[#A1A1AA] leading-[1.6]">
                Every component built from scratch with Geist typography, strict 12-column grid alignment, and micro interactions.
              </p>
            </div>

            {/* BENTO GRID (12-Column Responsive Layout) */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
              
              {/* FEATURE CARD 1: Calorie Overview Ring (8 Columns) */}
              <div className="col-span-12 md:col-span-8 bg-[#111113] border border-white/[0.08] rounded-[20px] p-8 shadow-2xl hover:border-[#22D3EE]/40 transition-all duration-300 group flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-8">
                    <div>
                      <span className="text-[13px] font-medium uppercase tracking-wider text-[#22D3EE]">Widget 01</span>
                      <h3 className="text-[18px] font-medium text-[#FFFFFF] mt-1">Calorie Intake &amp; Goal Ring</h3>
                    </div>
                    <span className="bg-[#22D3EE]/10 border border-[#22D3EE]/30 text-[#22D3EE] text-[13px] font-medium px-3.5 py-1 rounded-full">
                      56% Reached
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 items-center">
                    {/* Ring Visualization */}
                    <div className="relative w-44 h-44 mx-auto flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                        <path
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="rgba(255,255,255,0.06)"
                          strokeWidth="3.5"
                        />
                        <path
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="#22D3EE"
                          strokeDasharray="56, 100"
                          strokeWidth="3.5"
                          className="transition-all duration-1000"
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                        <span className="text-[40px] font-bold text-[#FFFFFF] tracking-tight leading-none">1,187</span>
                        <span className="text-[13px] text-[#A1A1AA] font-medium mt-1">kcal consumed</span>
                      </div>
                    </div>

                    {/* Stats List */}
                    <div className="space-y-4">
                      <div className="bg-[#09090B] border border-white/[0.08] p-4 rounded-[16px] flex justify-between items-center">
                        <span className="text-[13px] text-[#A1A1AA] font-medium">Daily Target</span>
                        <span className="text-[18px] font-medium text-[#FFFFFF]">2,100 kcal</span>
                      </div>
                      <div className="bg-[#09090B] border border-white/[0.08] p-4 rounded-[16px] flex justify-between items-center">
                        <span className="text-[13px] text-[#A1A1AA] font-medium">Remaining</span>
                        <span className="text-[18px] font-medium text-[#34D399]">913 kcal</span>
                      </div>
                      <div className="bg-[#09090B] border border-white/[0.08] p-4 rounded-[16px] flex justify-between items-center">
                        <span className="text-[13px] text-[#A1A1AA] font-medium">Burned Energy</span>
                        <span className="text-[18px] font-medium text-[#FACC15]">420 kcal</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-white/[0.08] flex items-center justify-between text-[13px] text-[#A1A1AA]">
                  <span>Updated real-time</span>
                  <button onClick={() => router.push('/dashboard')} className="text-[#22D3EE] font-medium hover:underline">Open Dashboard →</button>
                </div>
              </div>

              {/* CARD 2: AI Coach Edge Streaming (4 Columns) */}
              <div className="col-span-12 md:col-span-4 bg-[#111113] border border-white/[0.08] rounded-[20px] p-8 shadow-2xl hover:border-[#22D3EE]/40 transition-all duration-300 group flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <span className="text-[13px] font-medium uppercase tracking-wider text-[#22D3EE]">Widget 02</span>
                      <h3 className="text-[18px] font-medium text-[#FFFFFF] mt-1">Real-Time AI Coach</h3>
                    </div>
                    <span className="h-2 w-2 rounded-full bg-[#34D399] animate-pulse" />
                  </div>

                  {/* Chat Messages */}
                  <div className="space-y-4 max-h-[220px] overflow-y-auto mb-4 pr-1">
                    {coachMessages.map((msg, idx) => (
                      <div
                        key={idx}
                        className={`p-4 rounded-[14px] text-xs leading-relaxed ${
                          msg.role === 'user'
                            ? 'bg-[#09090B] text-[#FFFFFF] border border-white/[0.08] ml-4'
                            : 'bg-[#22D3EE]/10 border border-[#22D3EE]/20 text-[#FFFFFF] mr-4'
                        }`}
                      >
                        {msg.content}
                      </div>
                    ))}
                  </div>

                  {/* Input Form */}
                  <form onSubmit={handleAskCoach} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Ask coach anything..."
                      value={coachQuery}
                      onChange={e => setCoachQuery(e.target.value)}
                      className="flex-1 h-10 bg-[#09090B] border border-white/[0.08] rounded-full px-4 text-xs text-[#FFFFFF] placeholder:text-[#A1A1AA] focus:border-[#22D3EE] focus:outline-none"
                    />
                    <button type="submit" className="h-10 bg-[#22D3EE] text-[#09090B] font-bold px-4 rounded-full text-xs hover:bg-[#34D399] transition-colors">
                      Send
                    </button>
                  </form>
                </div>

                <div className="mt-6 pt-4 border-t border-white/[0.08] flex items-center justify-between text-[13px] text-[#A1A1AA]">
                  <span>Edge Stream Engine</span>
                  <button onClick={() => router.push('/coach')} className="text-[#22D3EE] font-medium hover:underline">Full Coach →</button>
                </div>
              </div>

              {/* CARD 3: One-Tap Preset Food Logging (4 Columns) */}
              <div className="col-span-12 md:col-span-4 bg-[#111113] border border-white/[0.08] rounded-[20px] p-8 shadow-2xl hover:border-[#22D3EE]/40 transition-all duration-300 group flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <span className="text-[13px] font-medium uppercase tracking-wider text-[#34D399]">Widget 03</span>
                      <h3 className="text-[18px] font-medium text-[#FFFFFF] mt-1">One-Tap Presets</h3>
                    </div>
                    <span className="text-[13px] font-medium text-[#A1A1AA]">Instant</span>
                  </div>

                  <p className="text-[13px] text-[#A1A1AA] mb-4">Tap to quickly add meals:</p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    <button
                      onClick={() => handleAddQuickMeal('Greek Yogurt Parfait', 280, 22, 30, 4, '🥣')}
                      className="bg-[#09090B] hover:bg-white/[0.08] text-[#FFFFFF] text-xs px-3.5 py-2 rounded-full border border-white/[0.08] transition-colors"
                    >
                      + 🥣 Yogurt Parfait
                    </button>
                    <button
                      onClick={() => handleAddQuickMeal('Whey Protein Shake', 220, 30, 8, 3, '🥤')}
                      className="bg-[#09090B] hover:bg-white/[0.08] text-[#FFFFFF] text-xs px-3.5 py-2 rounded-full border border-white/[0.08] transition-colors"
                    >
                      + 🥤 Protein Shake
                    </button>
                    <button
                      onClick={() => handleAddQuickMeal('Handful Almonds', 160, 6, 6, 14, '🥜')}
                      className="bg-[#09090B] hover:bg-white/[0.08] text-[#FFFFFF] text-xs px-3.5 py-2 rounded-full border border-white/[0.08] transition-colors"
                    >
                      + 🥜 Almonds
                    </button>
                  </div>

                  {/* Meal Feed */}
                  <div className="space-y-2 max-h-36 overflow-y-auto">
                    {loggedMeals.map((meal, idx) => (
                      <div key={idx} className="flex items-center justify-between bg-[#09090B] border border-white/[0.08] p-3 rounded-[12px] text-xs">
                        <div className="flex items-center gap-2.5">
                          <span>{meal.icon}</span>
                          <div>
                            <p className="font-medium text-[#FFFFFF] truncate max-w-[130px]">{meal.name}</p>
                            <p className="text-[10px] text-[#A1A1AA]">{meal.time}</p>
                          </div>
                        </div>
                        <span className="font-bold text-[#34D399]">{meal.cals} kcal</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-white/[0.08] flex items-center justify-between text-[13px] text-[#A1A1AA]">
                  <span>Journal Sync</span>
                  <button onClick={() => router.push('/diary')} className="text-[#34D399] font-medium hover:underline">Open Diary →</button>
                </div>
              </div>

              {/* CARD 4: Water Tracker (4 Columns) */}
              <div className="col-span-12 md:col-span-4 bg-[#111113] border border-white/[0.08] rounded-[20px] p-8 shadow-2xl hover:border-[#22D3EE]/40 transition-all duration-300 group flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <span className="text-[13px] font-medium uppercase tracking-wider text-blue-400">Widget 04</span>
                      <h3 className="text-[18px] font-medium text-[#FFFFFF] mt-1">Water Tracker</h3>
                    </div>
                    <span className="text-[13px] font-bold text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
                      {waterGlasses * 250}ml / 2,500ml
                    </span>
                  </div>

                  <div className="bg-[#09090B] border border-white/[0.08] rounded-[16px] p-5 mb-4">
                    <p className="text-[13px] text-[#A1A1AA] mb-4">Tap glasses to log hydration:</p>
                    <div className="grid grid-cols-5 gap-2.5 text-center">
                      {Array.from({ length: 10 }).map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setWaterGlasses(idx + 1)}
                          className={`h-11 rounded-[12px] flex items-center justify-center text-sm transition-all ${
                            idx < waterGlasses
                              ? 'bg-blue-500 text-[#09090B] font-bold shadow-lg shadow-blue-500/20 scale-100'
                              : 'bg-[#111113] text-[#A1A1AA] hover:bg-white/[0.08]'
                          }`}
                        >
                          💧
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-white/[0.08] flex items-center justify-between text-[13px] text-[#A1A1AA]">
                  <span>Hydration Goal</span>
                  <button onClick={() => router.push('/dashboard')} className="text-blue-400 font-medium hover:underline">Log Water →</button>
                </div>
              </div>

              {/* CARD 5: 7-Day Calorie Progress Analytics (4 Columns) */}
              <div className="col-span-12 md:col-span-4 bg-[#111113] border border-white/[0.08] rounded-[20px] p-8 shadow-2xl hover:border-[#22D3EE]/40 transition-all duration-300 group flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <span className="text-[13px] font-medium uppercase tracking-wider text-[#22D3EE]">Widget 05</span>
                      <h3 className="text-[18px] font-medium text-[#FFFFFF] mt-1">Weekly Analytics</h3>
                    </div>
                    <span className="text-[13px] font-bold text-[#22D3EE] bg-[#22D3EE]/10 px-3 py-1 rounded-full border border-[#22D3EE]/20">
                      7-Day Streak
                    </span>
                  </div>

                  <div className="bg-[#09090B] border border-white/[0.08] rounded-[16px] p-4 h-48 flex items-end justify-between gap-2.5">
                    {weeklyChartBars.map((bar, idx) => (
                      <div key={idx} className="flex-1 h-full flex flex-col justify-end items-center gap-1.5 group/bar">
                        <span className="text-[10px] font-bold text-[#A1A1AA] opacity-0 group-hover/bar:opacity-100 transition-opacity">
                          {bar.day}
                        </span>
                        <div className="w-full bg-[#111113] rounded-t h-full flex items-end p-0.5">
                          <div
                            className={`w-full rounded-t ${bar.isPeak ? 'bg-[#FACC15]' : 'bg-[#22D3EE]'} transition-all`}
                            style={{ height: `${bar.heightPct}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-white/[0.08] flex items-center justify-between text-[13px] text-[#A1A1AA]">
                  <span>Deficit / Surplus Reports</span>
                  <button onClick={() => router.push('/progress')} className="text-[#22D3EE] font-medium hover:underline">Full Trends →</button>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ---------------------------------------------------- */}
        {/* 21st.dev STYLE HIGH-CONTRAST FEATURE PROMPT BLOCKS */}
        {/* ---------------------------------------------------- */}
        <section id="features" className="py-24 border-t border-white/[0.08]">
          <div className="max-w-[1280px] mx-auto px-6 md:px-8">
            <h2 className="text-3xl md:text-[44px] font-semibold text-[#FFFFFF] tracking-tight mb-4">
              Engineered for absolute clarity.
            </h2>
            <p className="text-[18px] text-[#A1A1AA] leading-[1.6] max-w-xl mb-12">
              Three intelligent core pillars built into a single, seamless operating system.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              
              {/* Block 1 */}
              <div className="flex min-h-[420px] flex-col justify-between rounded-[20px] bg-[#111113] border border-white/[0.08] p-8 hover:border-[#22D3EE]/40 transition-all duration-300">
                <div>
                  <div className="inline-flex items-center rounded-full bg-[#22D3EE]/10 border border-[#22D3EE]/30 px-3.5 py-1 text-[13px] font-medium text-[#22D3EE] mb-6">
                    01 • VISION RECOGNITION
                  </div>
                  <h3 className="text-[40px] font-bold text-[#FFFFFF] tracking-tight leading-none mb-4">Snap &amp; Log</h3>
                  <p className="text-[18px] text-[#A1A1AA] leading-[1.6]">
                    Point your camera at any meal. Nourish AI breaks down ingredients, portions, and macros in under 1 second.
                  </p>
                </div>
                <div className="pt-6 border-t border-white/[0.08] text-[13px] font-medium text-[#22D3EE]">
                  AI Vision Pipeline →
                </div>
              </div>

              {/* Block 2 */}
              <div className="flex min-h-[420px] flex-col justify-between rounded-[20px] bg-[#111113] border border-white/[0.08] p-8 hover:border-[#34D399]/40 transition-all duration-300">
                <div>
                  <div className="inline-flex items-center rounded-full bg-[#34D399]/10 border border-[#34D399]/30 px-3.5 py-1 text-[13px] font-medium text-[#34D399] mb-6">
                    02 • EDGE STREAMING
                  </div>
                  <h3 className="text-[40px] font-bold text-[#FFFFFF] tracking-tight leading-none mb-4">Data-Aware AI</h3>
                  <p className="text-[18px] text-[#A1A1AA] leading-[1.6]">
                    Direct connection to your calorie intake. Receive intelligent dinner recommendations that match your macro deficit.
                  </p>
                </div>
                <div className="pt-6 border-t border-white/[0.08] text-[13px] font-medium text-[#34D399]">
                  Real-time Stream Engine →
                </div>
              </div>

              {/* Block 3 */}
              <div className="flex min-h-[420px] flex-col justify-between rounded-[20px] bg-[#111113] border border-white/[0.08] p-8 hover:border-[#FACC15]/40 transition-all duration-300">
                <div>
                  <div className="inline-flex items-center rounded-full bg-[#FACC15]/10 border border-[#FACC15]/30 px-3.5 py-1 text-[13px] font-medium text-[#FACC15] mb-6">
                    03 • DYNAMIC HABITS
                  </div>
                  <h3 className="text-[40px] font-bold text-[#FFFFFF] tracking-tight leading-none mb-4">Habits That Stay</h3>
                  <p className="text-[18px] text-[#A1A1AA] leading-[1.6]">
                    Build lasting daily streaks, unlock achievement badges, and hit water targets with zero guilt or judgment.
                  </p>
                </div>
                <div className="pt-6 border-t border-white/[0.08] text-[13px] font-medium text-[#FACC15]">
                  Habit Loop Engine →
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ---------------------------------------------------- */}
        {/* FINAL CTA BANNER SECTION */}
        {/* ---------------------------------------------------- */}
        <section className="py-24 border-t border-white/[0.08]">
          <div className="max-w-[1280px] mx-auto px-6 md:px-8">
            <div className="rounded-[20px] border border-white/[0.08] bg-[#111113] p-12 md:p-20 text-center shadow-2xl relative overflow-hidden">
              <div className="max-w-2xl mx-auto space-y-8">
                <h2 className="text-3xl md:text-[44px] font-semibold text-[#FFFFFF] tracking-tight leading-tight">
                  Start your journey to health clarity today.
                </h2>
                <p className="text-[18px] text-[#A1A1AA] leading-[1.6]">
                  Join 15,000+ builders tracking less and knowing more with Nourish OS.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
                  <button
                    onClick={() => router.push('/dashboard')}
                    className="w-full sm:w-auto h-12 inline-flex items-center justify-center rounded-full bg-[#22D3EE] px-8 text-sm font-bold text-[#09090B] hover:bg-[#34D399] transition-all duration-300 shadow-[0_0_25px_rgba(34,211,238,0.3)] active:scale-95"
                  >
                    Start Free Trial →
                  </button>
                  <button
                    onClick={() => router.push('/dashboard')}
                    className="w-full sm:w-auto h-12 inline-flex items-center justify-center rounded-full border border-white/[0.08] bg-[#09090B] px-8 text-sm font-semibold text-[#FFFFFF] hover:bg-white/[0.08] transition-all duration-300 active:scale-95"
                  >
                    Explore Interactive OS
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* 21st.dev Style Minimal Footer */}
      <footer className="border-t border-white/[0.08] bg-[#09090B] py-12">
        <div className="max-w-[1280px] mx-auto px-6 md:px-8 flex flex-col md:flex-row items-center justify-between gap-6 text-[13px] text-[#A1A1AA]">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-xl bg-[#22D3EE] text-[#09090B] font-bold flex items-center justify-center text-xs">
              ✦
            </div>
            <span className="font-bold text-sm text-[#FFFFFF]">Nourish.os</span>
          </div>

          <div className="flex gap-8 font-medium">
            <Link href="/dashboard" className="hover:text-[#FFFFFF] transition-colors">Dashboard</Link>
            <Link href="/diary" className="hover:text-[#FFFFFF] transition-colors">Food Journal</Link>
            <Link href="/coach" className="hover:text-[#FFFFFF] transition-colors">AI Coach</Link>
            <Link href="/goals" className="hover:text-[#FFFFFF] transition-colors">Goals</Link>
            <Link href="/progress" className="hover:text-[#FFFFFF] transition-colors">Progress</Link>
            <Link href="/settings" className="hover:text-[#FFFFFF] transition-colors">Settings</Link>
          </div>

          <p>© {new Date().getFullYear()} Nourish OS. Engineered for clarity.</p>
        </div>
      </footer>
    </div>
  )
}
