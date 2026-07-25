'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LandingPage() {
  const router = useRouter()
  const [activeCategory, setActiveCategory] = useState('all')
  const [email, setEmail] = useState('')
  const [coachQuery, setCoachQuery] = useState('')
  const [waterGlasses, setWaterGlasses] = useState(6)
  const [loggedMeals, setLoggedMeals] = useState([
    { name: 'Grilled Salmon Quinoa Bowl', cals: 580, protein: 42, carbs: 45, fat: 18, time: '1:15 PM', icon: '🥗' },
    { name: 'Avocado Toast & Poached Egg', cals: 360, protein: 16, carbs: 32, fat: 20, time: '8:30 AM', icon: '🥑' },
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
    if (!coachQuery.trim()) {
      router.push('/coach')
    } else {
      router.push(`/coach?prompt=${encodeURIComponent(coachQuery.trim())}`)
    }
  }

  const handleAddQuickMeal = (name: string, cals: number, protein: number, carbs: number, fat: number, icon: string) => {
    setLoggedMeals(prev => [
      { name, cals, protein, carbs, fat, time: 'Just now', icon },
      ...prev
    ])
  }

  const categories = [
    { id: 'all', label: '✦ All Features' },
    { id: 'logging', label: '🥗 Smart Food Logging' },
    { id: 'coach', label: '🤖 AI Nutritionist' },
    { id: 'hydration', label: '💧 Hydration Tracker' },
    { id: 'trends', label: '📈 Analytics & Streaks' },
  ]

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
    <div className="dark min-h-screen overflow-x-hidden bg-[#09090b] text-[#f4f4f5] font-sans selection:bg-emerald-500 selection:text-white">
      {/* Google Fonts */}
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
        rel="stylesheet"
      />

      <style jsx global>{`
        body {
          font-family: 'Inter', sans-serif;
          background-color: #09090b;
        }
        @keyframes lp-hero-in {
          from { opacity: 0; filter: blur(12px); transform: translateY(16px); }
          to   { opacity: 1; filter: blur(0);   transform: translateY(0); }
        }
        .lp-hero-in {
          animation: lp-hero-in 0.8s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
      `}</style>

      {/* 21st.dev Style Sticky Header */}
      <header className="sticky top-0 z-50 border-b border-zinc-800/80 bg-[#09090b]/80 backdrop-blur-md">
        <div className="relative mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2.5 outline-none group">
            <div className="w-7 h-7 rounded-lg bg-emerald-500 flex items-center justify-center text-zinc-950 font-bold text-sm group-hover:scale-105 transition-transform">
              N
            </div>
            <span className="font-bold text-lg tracking-tight text-white">
              Nourish<span className="text-emerald-400">.ai</span>
            </span>
          </Link>

          {/* Navigation items */}
          <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-7 md:flex">
            <a href="#showcase" className="-mx-2 rounded-md px-2 py-1 text-sm font-medium text-zinc-400 transition-colors hover:text-white">
              Showcase
            </a>
            <a href="#how-it-works" className="-mx-2 rounded-md px-2 py-1 text-sm font-medium text-zinc-400 transition-colors hover:text-white">
              How it works
            </a>
            <a href="#coach" className="-mx-2 rounded-md px-2 py-1 text-sm font-medium text-zinc-400 transition-colors hover:text-white">
              AI Coach
            </a>
            <a href="#analytics" className="-mx-2 rounded-md px-2 py-1 text-sm font-medium text-zinc-400 transition-colors hover:text-white">
              Analytics
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/dashboard')}
              className="inline-flex h-8 items-center rounded-full px-3.5 text-xs font-medium text-zinc-400 transition hover:bg-zinc-800 hover:text-white active:scale-95"
            >
              Log in
            </button>
            <button
              onClick={() => router.push('/dashboard')}
              className="inline-flex h-8 items-center rounded-full bg-emerald-500 px-4 text-xs font-medium text-zinc-950 transition hover:bg-emerald-400 active:scale-95 shadow-md shadow-emerald-950/40"
            >
              Launch App
            </button>
          </div>
        </div>
      </header>

      <main>
        {/* 21st.dev Style Hero Section */}
        <section className="pb-12 pt-20 md:pt-28">
          <div className="mx-auto max-w-6xl px-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-950/50 px-3.5 py-1 text-xs font-medium text-emerald-400 mb-6">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Intelligence for your body &amp; metabolism
            </div>

            <h1 className="lp-hero-in text-[clamp(42px,6.2vw,68px)] font-bold leading-[1.05] tracking-tight text-balance text-white max-w-4xl">
              The living engine<br />
              <span className="text-zinc-400 font-normal">for your nutrition.</span>
            </h1>

            <p className="lp-hero-in mt-6 max-w-xl text-[clamp(15px,1.6vw,19px)] font-normal leading-relaxed text-zinc-400 [animation-delay:0.2s]">
              Instant food recognition, real-time streaming AI coaching, and dynamic macro tracking — built by design engineers for absolute clarity.
            </p>

            {/* Form & Action Buttons */}
            <div className="lp-hero-in mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 max-w-md [animation-delay:0.3s]">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="flex-1 rounded-full border border-zinc-800 bg-zinc-900/90 px-4 py-3 text-sm text-white placeholder:text-zinc-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              <button
                onClick={handleStartTracking}
                className="inline-flex h-11 items-center justify-center rounded-full bg-white px-6 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200 active:scale-95 shadow-lg whitespace-nowrap"
              >
                Start Free →
              </button>
            </div>
          </div>
        </section>

        {/* 21st.dev Style Filter Chips & Interactive Showcase Stream */}
        <section id="showcase" className="pb-24 pt-6">
          <div className="mx-auto max-w-6xl px-6">
            {/* Category Filter Chips Bar */}
            <div className="flex items-center gap-2 overflow-x-auto pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden border-b border-zinc-800/80 mb-10">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`inline-flex shrink-0 items-center rounded-full px-4 py-1.5 text-xs font-medium transition-all ${
                    activeCategory === cat.id
                      ? 'bg-zinc-100 text-zinc-950 shadow-md font-semibold'
                      : 'bg-zinc-900/80 text-zinc-400 hover:bg-zinc-800 hover:text-white'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Interactive Grid of Component Showcase Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              
              {/* CARD 1: Calorie & Macro Target Ring */}
              <div className="rounded-2xl border border-zinc-800/90 bg-zinc-900/40 p-6 backdrop-blur hover:border-zinc-700 transition-all flex flex-col justify-between group">
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-400">Daily Targets</span>
                      <h3 className="text-xl font-bold text-white mt-1">Calorie Ring</h3>
                    </div>
                    <span className="rounded-full bg-emerald-950/80 border border-emerald-500/30 px-2.5 py-1 text-[11px] font-bold text-emerald-400">
                      56% Reached
                    </span>
                  </div>

                  {/* Ring Display */}
                  <div className="bg-[#111113] border border-zinc-800 rounded-xl p-5 mb-6 flex items-center justify-between">
                    <div>
                      <p className="text-3xl font-bold text-white">1,187 <span className="text-sm font-normal text-zinc-400">/ 2,100 kcal</span></p>
                      <p className="text-xs text-zinc-400 mt-1">913 kcal remaining for dinner</p>
                    </div>
                    <div className="w-12 h-12 rounded-full border-4 border-emerald-500 border-t-zinc-800 flex items-center justify-center font-bold text-xs text-white">
                      56%
                    </div>
                  </div>

                  {/* Macro Progress Bars */}
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-zinc-400 font-medium">Protein</span>
                        <span className="text-white font-bold">85g / 130g</span>
                      </div>
                      <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-500 w-[65%]" />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-zinc-400 font-medium">Carbs</span>
                        <span className="text-white font-bold">140g / 220g</span>
                      </div>
                      <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                        <div className="h-full bg-sky-400 w-[58%]" />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-zinc-400 font-medium">Fat</span>
                        <span className="text-white font-bold">42g / 70g</span>
                      </div>
                      <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-400 w-[60%]" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-400">
                  <span>Interactive Dashboard Widget</span>
                  <button onClick={() => router.push('/dashboard')} className="text-emerald-400 font-semibold hover:underline">View →</button>
                </div>
              </div>

              {/* CARD 2: Interactive AI Coach Stream */}
              <div className="rounded-2xl border border-zinc-800/90 bg-zinc-900/40 p-6 backdrop-blur hover:border-zinc-700 transition-all flex flex-col justify-between group">
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-400">AI Assistance</span>
                      <h3 className="text-xl font-bold text-white mt-1">Real-Time Coach</h3>
                    </div>
                    <span className="flex items-center gap-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/30 px-2.5 py-1 text-[11px] font-bold text-emerald-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Streaming
                    </span>
                  </div>

                  {/* Chat Message Box */}
                  <div className="space-y-3 bg-[#111113] border border-zinc-800 rounded-xl p-4 mb-4 text-xs">
                    <div className="bg-zinc-800/90 text-zinc-200 p-3 rounded-lg ml-auto max-w-[85%]">
                      What should I eat to hit my 45g protein target tonight?
                    </div>
                    <div className="bg-emerald-950/60 border border-emerald-800/50 text-emerald-200 p-3 rounded-lg mr-auto max-w-[90%] leading-relaxed">
                      ✦ Try a grilled salmon quinoa bowl with steamed broccoli. It delivers 42g protein with healthy omega-3 fats! 🥗
                    </div>
                  </div>

                  {/* Live Prompt Input */}
                  <form onSubmit={handleAskCoach} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Ask AI coach..."
                      value={coachQuery}
                      onChange={e => setCoachQuery(e.target.value)}
                      className="flex-1 bg-[#111113] border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-emerald-500"
                    />
                    <button type="submit" className="bg-emerald-500 text-zinc-950 font-bold px-3 py-2 rounded-lg text-xs hover:bg-emerald-400 transition-colors">
                      Ask
                    </button>
                  </form>
                </div>

                <div className="mt-6 pt-4 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-400">
                  <span>Edge Stream Integration</span>
                  <button onClick={() => router.push('/coach')} className="text-emerald-400 font-semibold hover:underline">Open Coach →</button>
                </div>
              </div>

              {/* CARD 3: Quick Food Journal Logging */}
              <div className="rounded-2xl border border-zinc-800/90 bg-zinc-900/40 p-6 backdrop-blur hover:border-zinc-700 transition-all flex flex-col justify-between group">
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-400">Fast Logging</span>
                      <h3 className="text-xl font-bold text-white mt-1">One-Tap Presets</h3>
                    </div>
                    <span className="rounded-full bg-zinc-800 px-2.5 py-1 text-[11px] font-bold text-zinc-300">
                      Instant Sync
                    </span>
                  </div>

                  {/* Preset Buttons */}
                  <p className="text-xs text-zinc-400 mb-3">Tap to test quick logging:</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <button
                      onClick={() => handleAddQuickMeal('Greek Yogurt Parfait', 280, 22, 30, 4, '🥣')}
                      className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs px-3 py-1.5 rounded-lg border border-zinc-700 transition-colors"
                    >
                      + 🥣 Parfait
                    </button>
                    <button
                      onClick={() => handleAddQuickMeal('Whey Protein Shake', 220, 30, 8, 3, '🥤')}
                      className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs px-3 py-1.5 rounded-lg border border-zinc-700 transition-colors"
                    >
                      + 🥤 Shake
                    </button>
                    <button
                      onClick={() => handleAddQuickMeal('Handful Almonds', 160, 6, 6, 14, '🥜')}
                      className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs px-3 py-1.5 rounded-lg border border-zinc-700 transition-colors"
                    >
                      + 🥜 Almonds
                    </button>
                  </div>

                  {/* Logged List */}
                  <div className="space-y-2 max-h-36 overflow-y-auto">
                    {loggedMeals.map((meal, i) => (
                      <div key={i} className="flex items-center justify-between bg-[#111113] border border-zinc-800 p-2.5 rounded-lg text-xs">
                        <div className="flex items-center gap-2">
                          <span>{meal.icon}</span>
                          <div>
                            <p className="font-semibold text-white truncate max-w-[140px]">{meal.name}</p>
                            <p className="text-[10px] text-zinc-400">{meal.time}</p>
                          </div>
                        </div>
                        <span className="font-bold text-emerald-400">{meal.cals} kcal</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-400">
                  <span>Food Journal Sync</span>
                  <button onClick={() => router.push('/diary')} className="text-emerald-400 font-semibold hover:underline">Open Diary →</button>
                </div>
              </div>

              {/* CARD 4: Hydration Tracker */}
              <div className="rounded-2xl border border-zinc-800/90 bg-zinc-900/40 p-6 backdrop-blur hover:border-zinc-700 transition-all flex flex-col justify-between group">
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-sky-400">Water Goal</span>
                      <h3 className="text-xl font-bold text-white mt-1">Hydration Tracker</h3>
                    </div>
                    <span className="rounded-full bg-sky-950/80 border border-sky-500/30 px-2.5 py-1 text-[11px] font-bold text-sky-400">
                      {waterGlasses * 250}ml / 2500ml
                    </span>
                  </div>

                  {/* Glass Grid */}
                  <div className="bg-[#111113] border border-zinc-800 rounded-xl p-4 mb-4">
                    <p className="text-xs text-zinc-400 mb-3">Tap glasses to add water:</p>
                    <div className="grid grid-cols-5 gap-2 text-center">
                      {Array.from({ length: 10 }).map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setWaterGlasses(idx + 1)}
                          className={`h-10 rounded-lg flex items-center justify-center text-sm transition-all ${
                            idx < waterGlasses
                              ? 'bg-sky-500 text-zinc-950 shadow-md shadow-sky-950/50 scale-100 font-bold'
                              : 'bg-zinc-800/60 text-zinc-600 hover:bg-zinc-800'
                          }`}
                        >
                          💧
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-400">
                  <span>Smart Reminders</span>
                  <button onClick={() => router.push('/dashboard')} className="text-sky-400 font-semibold hover:underline">Log Water →</button>
                </div>
              </div>

              {/* CARD 5: 7-Day Calorie Progress Chart */}
              <div className="rounded-2xl border border-zinc-800/90 bg-zinc-900/40 p-6 backdrop-blur hover:border-zinc-700 transition-all flex flex-col justify-between group">
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-400">Consistency</span>
                      <h3 className="text-xl font-bold text-white mt-1">Weekly Trends</h3>
                    </div>
                    <span className="rounded-full bg-emerald-950/80 border border-emerald-500/30 px-2.5 py-1 text-[11px] font-bold text-emerald-400">
                      7-Day Streak
                    </span>
                  </div>

                  {/* Bar Chart Container */}
                  <div className="bg-[#111113] border border-zinc-800 rounded-xl p-4 h-44 flex items-end justify-between gap-2">
                    {weeklyChartBars.map((bar, i) => (
                      <div key={i} className="flex-1 h-full flex flex-col justify-end items-center gap-1.5 group/bar">
                        <span className="text-[9px] font-bold text-zinc-400 opacity-0 group-hover/bar:opacity-100 transition-opacity">
                          {bar.day}
                        </span>
                        <div className="w-full bg-zinc-800/80 rounded-t h-full flex items-end p-0.5">
                          <div
                            className={`w-full rounded-t ${bar.isPeak ? 'bg-amber-400' : 'bg-emerald-500'} transition-all`}
                            style={{ height: `${bar.heightPct}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-400">
                  <span>Weekly Overviews</span>
                  <button onClick={() => router.push('/progress')} className="text-emerald-400 font-semibold hover:underline">View Analytics →</button>
                </div>
              </div>

              {/* CARD 6: Adaptive Target Goals */}
              <div className="rounded-2xl border border-zinc-800/90 bg-zinc-900/40 p-6 backdrop-blur hover:border-zinc-700 transition-all flex flex-col justify-between group">
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-400">Personalized</span>
                      <h3 className="text-xl font-bold text-white mt-1">Adaptive Goals</h3>
                    </div>
                    <span className="rounded-full bg-amber-950/80 border border-amber-500/30 px-2.5 py-1 text-[11px] font-bold text-amber-400">
                      Weight Loss Mode
                    </span>
                  </div>

                  <div className="bg-[#111113] border border-zinc-800 rounded-xl p-4 space-y-3 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-400">Target Pace</span>
                      <span className="font-bold text-white">-0.5 kg / week</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-400">Daily Deficit</span>
                      <span className="font-bold text-emerald-400">500 kcal deficit</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-400">Est. Reached In</span>
                      <span className="font-bold text-white">6 weeks</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-400">
                  <span>Goal Engine</span>
                  <button onClick={() => router.push('/goals')} className="text-amber-400 font-semibold hover:underline">Edit Goals →</button>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* 21st.dev Style Social Proof Banner */}
        <section className="border-y border-zinc-800/80 bg-zinc-900/30 py-16">
          <div className="mx-auto max-w-6xl px-6">
            <h2 className="max-w-2xl text-[clamp(24px,3vw,36px)] font-bold leading-snug tracking-tight text-white mb-10">
              Trusted by 15,000+ health builders.<br />
              <span className="text-zinc-400 font-normal">From athletes to everyday professionals.</span>
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
              <div className="p-4 bg-zinc-900/60 rounded-xl border border-zinc-800">
                <p className="text-3xl font-bold text-white">1.2M+</p>
                <p className="text-xs text-zinc-400 mt-1">Meals Logged</p>
              </div>
              <div className="p-4 bg-zinc-900/60 rounded-xl border border-zinc-800">
                <p className="text-3xl font-bold text-emerald-400">98.4%</p>
                <p className="text-xs text-zinc-400 mt-1">Streak Retention</p>
              </div>
              <div className="p-4 bg-zinc-900/60 rounded-xl border border-zinc-800">
                <p className="text-3xl font-bold text-amber-400">4.9 / 5</p>
                <p className="text-xs text-zinc-400 mt-1">User Rating</p>
              </div>
              <div className="p-4 bg-zinc-900/60 rounded-xl border border-zinc-800">
                <p className="text-3xl font-bold text-sky-400">Instant</p>
                <p className="text-xs text-zinc-400 mt-1">AI Response Time</p>
              </div>
            </div>
          </div>
        </section>

        {/* 21st.dev Style High-Contrast Prompts Feature Blocks */}
        <section id="how-it-works" className="py-24">
          <div className="mx-auto max-w-6xl px-6">
            <h2 className="text-3xl font-bold text-white mb-4">Crafted for effortless nutrition.</h2>
            <p className="text-zinc-400 text-base max-w-xl mb-12">One click — and your daily health tracking manages itself.</p>

            <div className="grid gap-6 md:grid-cols-3">
              {/* Feature Block 1 (Coral Accent) */}
              <div className="flex min-h-[380px] flex-col justify-between rounded-2xl bg-[#c86a50] p-8 text-white">
                <div>
                  <div className="inline-flex items-center rounded-md bg-black/20 px-3 py-1 text-xs font-mono mb-4 text-white/90">
                    01 • CAMERA &amp; VOICE
                  </div>
                  <h3 className="text-2xl font-bold mb-3">Snap &amp; Identify</h3>
                  <p className="text-white/80 text-sm leading-relaxed">
                    Point your camera at any dish. AI identifies ingredients, portions, and calculates exact calories in seconds.
                  </p>
                </div>
                <div className="mt-8 pt-4 border-t border-white/20 text-xs font-semibold">
                  Photo AI Recognition →
                </div>
              </div>

              {/* Feature Block 2 (Terminal Style) */}
              <div className="flex min-h-[380px] flex-col justify-between rounded-2xl bg-zinc-900 border border-zinc-800 p-8 text-white">
                <div>
                  <div className="inline-flex items-center rounded-md bg-emerald-950 border border-emerald-500/30 px-3 py-1 text-xs font-mono mb-4 text-emerald-400">
                    02 • EDGE STREAMING
                  </div>
                  <h3 className="text-2xl font-bold mb-3">Data-Aware AI Coach</h3>
                  <p className="text-zinc-400 text-sm leading-relaxed">
                    Connected directly to your intake logs. Get instant meal suggestions that fit your remaining calorie and macro budget.
                  </p>
                </div>
                <div className="mt-8 pt-4 border-t border-zinc-800 text-xs font-semibold text-emerald-400">
                  Real-time Stream Engine →
                </div>
              </div>

              {/* Feature Block 3 (Emerald Glow) */}
              <div className="flex min-h-[380px] flex-col justify-between rounded-2xl bg-gradient-to-br from-emerald-950 to-zinc-900 border border-emerald-800/60 p-8 text-white">
                <div>
                  <div className="inline-flex items-center rounded-md bg-emerald-900/60 px-3 py-1 text-xs font-mono mb-4 text-emerald-300">
                    03 • ZERO GUILT
                  </div>
                  <h3 className="text-2xl font-bold mb-3">Habits That Stay</h3>
                  <p className="text-zinc-300 text-sm leading-relaxed">
                    Build daily streaks, unlock consistency badges, and track your hydration without restrictive dieting or guilt.
                  </p>
                </div>
                <div className="mt-8 pt-4 border-t border-emerald-800/60 text-xs font-semibold text-emerald-300">
                  Dynamic Habit Loop →
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 21st.dev Style Final CTA Band */}
        <section className="py-20">
          <div className="mx-auto max-w-6xl px-6">
            <div className="rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-900 via-[#0d1712] to-zinc-950 p-12 text-center relative overflow-hidden shadow-2xl">
              <div className="max-w-2xl mx-auto space-y-6">
                <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-tight leading-tight">
                  Start your journey to clarity today.
                </h2>
                <p className="text-zinc-400 text-base">
                  Join 15,000+ builders tracking less and knowing more with Nourish AI.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 justify-center items-center pt-4">
                  <button
                    onClick={() => router.push('/dashboard')}
                    className="w-full sm:w-auto inline-flex h-12 items-center justify-center rounded-full bg-emerald-500 px-8 text-sm font-bold text-zinc-950 transition hover:bg-emerald-400 active:scale-95 shadow-xl shadow-emerald-950/60"
                  >
                    Start Tracking Free →
                  </button>
                  <button
                    onClick={() => router.push('/dashboard')}
                    className="w-full sm:w-auto inline-flex h-12 items-center justify-center rounded-full border border-zinc-700 bg-zinc-900 px-8 text-sm font-semibold text-white transition hover:bg-zinc-800 active:scale-95"
                  >
                    Explore Dashboard
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* 21st.dev Style Minimal Footer */}
      <footer className="border-t border-zinc-800/80 bg-[#09090b] py-12">
        <div className="mx-auto max-w-6xl px-6 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-zinc-400">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded bg-emerald-500 text-zinc-950 font-bold flex items-center justify-center text-xs">
              N
            </div>
            <span className="font-bold text-sm text-white">Nourish.ai</span>
          </div>

          <div className="flex gap-6 font-medium">
            <Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
            <Link href="/diary" className="hover:text-white transition-colors">Food Diary</Link>
            <Link href="/coach" className="hover:text-white transition-colors">AI Coach</Link>
            <Link href="/goals" className="hover:text-white transition-colors">Goals</Link>
            <Link href="/progress" className="hover:text-white transition-colors">Progress</Link>
            <Link href="/settings" className="hover:text-white transition-colors">Settings</Link>
          </div>

          <p>© {new Date().getFullYear()} Nourish AI. Crafted for clarity.</p>
        </div>
      </footer>
    </div>
  )
}
