'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LandingPage() {
  const router = useRouter()
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

      {/* ---------------------------------------------------- */}
      {/* HEADER / NAVBAR */}
      {/* Logo | Features  AI Coach  Pricing | Get Started   */}
      {/* ---------------------------------------------------- */}
      <header className="sticky top-0 z-50 border-b border-white/[0.08] bg-[#09090B]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between px-6 md:px-8">
          {/* Logo (Left) */}
          <Link href="/" className="flex items-center gap-3 outline-none group">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#22D3EE] to-[#34D399] flex items-center justify-center text-[#09090B] font-bold text-sm shadow-[0_0_20px_rgba(34,211,238,0.3)] group-hover:scale-105 transition-transform">
              ✦
            </div>
            <span className="font-bold text-lg tracking-tight text-[#FFFFFF]">
              Nourish<span className="text-[#22D3EE]"> AI</span>
            </span>
          </Link>

          {/* Centered Navigation Links */}
          <nav className="hidden items-center gap-8 md:flex">
            <a href="#features" className="text-[14px] font-medium text-[#A1A1AA] transition-colors hover:text-[#FFFFFF]">
              Features
            </a>
            <a href="#coach" className="text-[14px] font-medium text-[#A1A1AA] transition-colors hover:text-[#FFFFFF]">
              AI Coach
            </a>
            <a href="#pricing" className="text-[14px] font-medium text-[#A1A1AA] transition-colors hover:text-[#FFFFFF]">
              Pricing
            </a>
          </nav>

          {/* Primary CTA (Right) */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/dashboard')}
              className="inline-flex h-10 items-center justify-center rounded-full bg-[#FFFFFF] px-6 text-[14px] font-semibold text-[#09090B] hover:bg-[#22D3EE] transition-all duration-300 shadow-[0_0_20px_rgba(34,211,238,0.2)] active:scale-95"
            >
              Get Started →
            </button>
          </div>
        </div>
      </header>

      <main className="relative">
        {/* Subtle Ambient Radial Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1280px] h-[600px] os-glow pointer-events-none" />

        {/* ---------------------------------------------------- */}
        {/* HERO SECTION */}
        {/* Left: AI Badge, Massive Headline, Points, CTAs, Trust */}
        {/* Right: Floating AI Dashboard Preview Card            */}
        {/* ---------------------------------------------------- */}
        <section className="relative z-10 pt-16 pb-24 md:pt-24 md:pb-32 max-w-[1280px] mx-auto px-6 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* LEFT HERO COLUMN */}
            <div className="lg:col-span-6 space-y-8">
              {/* ✨ AI Nutrition Intelligence Badge */}
              <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-[#111113] px-4 py-1.5 text-[13px] font-medium text-[#22D3EE]">
                <span className="h-2 w-2 rounded-full bg-[#22D3EE] animate-pulse" />
                ✨ AI Nutrition Intelligence
              </div>

              {/* Headline: 72px Bold */}
              <h1 className="lp-hero-in text-5xl md:text-[72px] font-bold tracking-[-0.02em] leading-[1.05] text-[#FFFFFF]">
                The operating system<br />
                <span className="bg-gradient-to-r from-[#22D3EE] via-[#34D399] to-[#FACC15] bg-clip-text text-transparent">
                  for your nutrition.
                </span>
              </h1>

              {/* Supporting Bullet Points */}
              <div className="lp-hero-in space-y-3 text-[18px] text-[#A1A1AA] leading-[1.6] [animation-delay:0.2s]">
                <p className="flex items-center gap-3 text-[#FFFFFF]">
                  <span className="text-[#22D3EE] font-bold">✓</span> Track meals instantly with photo &amp; AI recognition.
                </p>
                <p className="flex items-center gap-3 text-[#FFFFFF]">
                  <span className="text-[#34D399] font-bold">✓</span> Get AI coaching in real time based on your target logs.
                </p>
                <p className="flex items-center gap-3 text-[#FFFFFF]">
                  <span className="text-[#FACC15] font-bold">✓</span> Reach your goals with adaptive nutrition &amp; macro targets.
                </p>
              </div>

              {/* CTA Row: [ Start Free ] [ Live Demo ] */}
              <div className="lp-hero-in flex flex-col sm:flex-row gap-4 items-stretch sm:items-center pt-2 [animation-delay:0.3s]">
                <button
                  onClick={() => router.push('/dashboard')}
                  className="h-12 rounded-full bg-[#22D3EE] hover:bg-[#34D399] text-[#09090B] font-bold px-8 text-sm transition-all duration-300 shadow-[0_0_25px_rgba(34,211,238,0.3)] active:scale-95 text-center"
                >
                  Start Free →
                </button>
                <button
                  onClick={() => router.push('/dashboard')}
                  className="h-12 rounded-full border border-white/[0.08] bg-[#111113] hover:bg-white/[0.08] text-[#FFFFFF] font-semibold px-8 text-sm transition-all duration-300 active:scale-95 text-center"
                >
                  Live Demo
                </button>
              </div>

              {/* Trust Badge */}
              <div className="pt-2 text-[13px] font-medium text-[#A1A1AA] flex items-center gap-2">
                <span className="text-[#34D399]">✦</span> Trusted by 10,000+ active users &amp; health builders
              </div>
            </div>

            {/* RIGHT HERO COLUMN: Floating AI Dashboard Preview Card */}
            <div className="lg:col-span-6 relative">
              <div className="bg-[#111113] border border-white/[0.08] rounded-[20px] p-6 sm:p-8 shadow-2xl shadow-black/90 relative hover:border-[#22D3EE]/30 transition-all duration-500 group">
                
                {/* Floating Preview Title */}
                <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/[0.08]">
                  <span className="text-[13px] font-medium uppercase tracking-wider text-[#22D3EE]">Floating AI Dashboard</span>
                  <span className="text-[11px] font-bold text-[#34D399] bg-[#34D399]/10 px-2.5 py-0.5 rounded-full border border-[#34D399]/20">
                    Live OS Preview
                  </span>
                </div>

                {/* Calories Display */}
                <div className="bg-[#09090B] border border-white/[0.08] p-5 rounded-[16px] mb-4">
                  <span className="text-[13px] font-medium uppercase tracking-wider text-[#A1A1AA]">Calories Today</span>
                  <p className="text-[40px] font-bold text-[#FFFFFF] leading-none mt-2">1,750 <span className="text-sm font-normal text-[#A1A1AA]">/ 2,100 kcal</span></p>
                  <div className="w-full bg-[#111113] h-2 rounded-full mt-3 overflow-hidden">
                    <div className="bg-[#22D3EE] h-full w-[83%]" />
                  </div>
                </div>

                {/* AI Coach Card */}
                <div className="bg-[#09090B] border border-[#22D3EE]/30 p-4 rounded-[16px] mb-4 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#22D3EE]/10 text-[#22D3EE] flex items-center justify-center font-bold text-sm">
                    ✦
                  </div>
                  <div className="flex-1">
                    <p className="text-[13px] font-bold text-[#22D3EE]">AI Coach Recommendation</p>
                    <p className="text-[14px] text-[#FFFFFF] font-medium">&ldquo;Eat 35g more protein for dinner to hit your daily recovery target!&rdquo;</p>
                  </div>
                </div>

                {/* Protein Indicator */}
                <div className="bg-[#09090B] border border-white/[0.08] p-4 rounded-[16px] flex justify-between items-center">
                  <div>
                    <span className="text-[13px] font-medium uppercase text-[#34D399]">Protein Intake</span>
                    <p className="text-[24px] font-bold text-[#FFFFFF] leading-tight">95g / 130g</p>
                  </div>
                  <span className="text-xs font-bold text-[#34D399] bg-[#34D399]/10 px-3 py-1 rounded-full border border-[#34D399]/30">
                    73% Complete
                  </span>
                </div>

              </div>
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------- */}
        {/* BENTO GRID SECTION */}
        {/* ┌───────────────────────┬───────────────┐           */}
        {/* │    Calories Today     │  AI Coach     │           */}
        {/* ├───────────────────────┼───────────────┤           */}
        {/* │ Weekly Progress       │ Water         │           */}
        {/* ├───────────────┬───────┴───────────────┤           */}
        {/* │ Protein Ring  │ Today's Meals         │           */}
        {/* └───────────────┴───────────────────────┘           */}
        {/* ---------------------------------------------------- */}
        <section id="features" className="py-24 border-t border-white/[0.08] bg-[#09090B]">
          <div className="max-w-[1280px] mx-auto px-6 md:px-8 space-y-12">
            
            <div className="max-w-2xl space-y-3">
              <span className="text-[13px] font-medium uppercase tracking-wider text-[#22D3EE]">BENTO DASHBOARD ENGINE</span>
              <h2 className="text-3xl md:text-[44px] font-semibold text-[#FFFFFF] tracking-tight leading-tight">
                Everything you need to master your health.
              </h2>
            </div>

            {/* Exact Bento Grid Architecture */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
              
              {/* TOP ROW: Calories Today (8 Cols) | AI Coach (4 Cols) */}
              <div className="col-span-12 md:col-span-8 bg-[#111113] border border-white/[0.08] rounded-[20px] p-8 shadow-2xl hover:border-[#22D3EE]/40 transition-all duration-300 flex flex-col justify-between">
                <div>
                  <span className="text-[13px] font-medium uppercase tracking-wider text-[#22D3EE]">Daily Intake Overview</span>
                  <h3 className="text-[18px] font-medium text-[#FFFFFF] mt-1 mb-6">Calories Today</h3>
                  
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 bg-[#09090B] border border-white/[0.08] p-6 rounded-[16px]">
                    <div>
                      <p className="text-[40px] font-bold text-[#FFFFFF] leading-none">1,750 <span className="text-sm font-normal text-[#A1A1AA]">kcal</span></p>
                      <p className="text-[13px] text-[#34D399] font-medium mt-2">350 kcal remaining for dinner</p>
                    </div>
                    <div className="w-20 h-20 rounded-full border-4 border-[#22D3EE] border-t-zinc-800 flex flex-col items-center justify-center font-bold text-sm text-[#FFFFFF]">
                      <span>83%</span>
                      <span className="text-[9px] text-[#A1A1AA] uppercase">Goal</span>
                    </div>
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-white/[0.08] flex justify-between items-center text-[13px] text-[#A1A1AA]">
                  <span>Target: 2,100 kcal</span>
                  <button onClick={() => router.push('/dashboard')} className="text-[#22D3EE] font-medium hover:underline">View Details →</button>
                </div>
              </div>

              <div className="col-span-12 md:col-span-4 bg-[#111113] border border-white/[0.08] rounded-[20px] p-8 shadow-2xl hover:border-[#22D3EE]/40 transition-all duration-300 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-[13px] font-medium uppercase tracking-wider text-[#22D3EE]">AI Coach</span>
                    <span className="h-2 w-2 rounded-full bg-[#34D399] animate-pulse" />
                  </div>
                  <h3 className="text-[18px] font-medium text-[#FFFFFF] mb-4">Real-Time Insight</h3>
                  <div className="bg-[#09090B] border border-[#22D3EE]/30 p-5 rounded-[16px] text-sm text-[#FFFFFF] leading-relaxed">
                    ✦ &ldquo;Eat more protein tonight! A grilled salmon bowl will hit your target while staying in your calorie budget.&rdquo;
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-white/[0.08] flex justify-between items-center text-[13px] text-[#A1A1AA]">
                  <span>Streaming Engine</span>
                  <button onClick={() => router.push('/coach')} className="text-[#22D3EE] font-medium hover:underline">Ask AI →</button>
                </div>
              </div>

              {/* MIDDLE ROW: Weekly Progress (8 Cols) | Water (4 Cols) */}
              <div className="col-span-12 md:col-span-8 bg-[#111113] border border-white/[0.08] rounded-[20px] p-8 shadow-2xl hover:border-[#22D3EE]/40 transition-all duration-300 flex flex-col justify-between">
                <div>
                  <span className="text-[13px] font-medium uppercase tracking-wider text-[#22D3EE]">7-Day Historical Trend</span>
                  <h3 className="text-[18px] font-medium text-[#FFFFFF] mt-1 mb-6">Weekly Progress</h3>
                  
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
                <div className="mt-6 pt-4 border-t border-white/[0.08] flex justify-between items-center text-[13px] text-[#A1A1AA]">
                  <span>Avg: 1,950 kcal / day</span>
                  <button onClick={() => router.push('/progress')} className="text-[#22D3EE] font-medium hover:underline">Analytics →</button>
                </div>
              </div>

              <div className="col-span-12 md:col-span-4 bg-[#111113] border border-white/[0.08] rounded-[20px] p-8 shadow-2xl hover:border-[#22D3EE]/40 transition-all duration-300 flex flex-col justify-between">
                <div>
                  <span className="text-[13px] font-medium uppercase tracking-wider text-blue-400">Smart Hydration</span>
                  <h3 className="text-[18px] font-medium text-[#FFFFFF] mt-1 mb-4">Water Tracker</h3>
                  
                  <div className="bg-[#09090B] border border-white/[0.08] p-4 rounded-[16px] text-center mb-4">
                    <p className="text-[30px] font-bold text-white mb-2">{waterGlasses * 250}ml <span className="text-xs font-normal text-[#A1A1AA]">/ 2,500ml</span></p>
                    <div className="grid grid-cols-5 gap-2">
                      {Array.from({ length: 10 }).map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setWaterGlasses(idx + 1)}
                          className={`h-9 rounded-[8px] flex items-center justify-center text-xs transition-all ${
                            idx < waterGlasses
                              ? 'bg-blue-500 text-[#09090B] font-bold'
                              : 'bg-[#111113] text-[#A1A1AA] hover:bg-white/[0.08]'
                          }`}
                        >
                          💧
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-white/[0.08] flex justify-between items-center text-[13px] text-[#A1A1AA]">
                  <span>10 Glasses Target</span>
                  <button onClick={() => router.push('/dashboard')} className="text-blue-400 font-medium hover:underline">Log Water →</button>
                </div>
              </div>

              {/* BOTTOM ROW: Protein Ring (5 Cols) | Today's Meals (7 Cols) */}
              <div className="col-span-12 md:col-span-5 bg-[#111113] border border-white/[0.08] rounded-[20px] p-8 shadow-2xl hover:border-[#22D3EE]/40 transition-all duration-300 flex flex-col justify-between">
                <div>
                  <span className="text-[13px] font-medium uppercase tracking-wider text-[#34D399]">Macronutrient Progress</span>
                  <h3 className="text-[18px] font-medium text-[#FFFFFF] mt-1 mb-4">Protein Ring</h3>
                  
                  <div className="bg-[#09090B] border border-white/[0.08] p-5 rounded-[16px] space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-[14px] text-white font-medium">Protein Target</span>
                      <span className="text-[18px] font-bold text-[#34D399]">95g / 130g</span>
                    </div>
                    <div className="w-full bg-[#111113] h-2.5 rounded-full overflow-hidden">
                      <div className="bg-[#34D399] h-full w-[73%]" />
                    </div>
                    <p className="text-xs text-[#A1A1AA]">35g remaining to reach daily recovery target</p>
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-white/[0.08] flex justify-between items-center text-[13px] text-[#A1A1AA]">
                  <span>Macro Goal</span>
                  <button onClick={() => router.push('/goals')} className="text-[#34D399] font-medium hover:underline">Edit Targets →</button>
                </div>
              </div>

              <div className="col-span-12 md:col-span-7 bg-[#111113] border border-white/[0.08] rounded-[20px] p-8 shadow-2xl hover:border-[#22D3EE]/40 transition-all duration-300 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <span className="text-[13px] font-medium uppercase tracking-wider text-[#22D3EE]">Food Journal</span>
                      <h3 className="text-[18px] font-medium text-[#FFFFFF] mt-1">Today&apos;s Meals</h3>
                    </div>
                    <span className="text-xs text-[#A1A1AA]">{loggedMeals.length} items logged</span>
                  </div>

                  <div className="space-y-2.5 max-h-44 overflow-y-auto">
                    {loggedMeals.map((meal, idx) => (
                      <div key={idx} className="flex items-center justify-between bg-[#09090B] border border-white/[0.08] p-3 rounded-[12px] text-xs">
                        <div className="flex items-center gap-3">
                          <span className="text-base">{meal.icon}</span>
                          <div>
                            <p className="font-semibold text-[#FFFFFF]">{meal.name}</p>
                            <p className="text-[10px] text-[#A1A1AA]">{meal.time} · {meal.protein}g protein</p>
                          </div>
                        </div>
                        <span className="font-bold text-[#34D399] text-sm">{meal.cals} kcal</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-white/[0.08] flex justify-between items-center text-[13px] text-[#A1A1AA]">
                  <span>Instant Logging Engine</span>
                  <button onClick={() => router.push('/diary')} className="text-[#22D3EE] font-medium hover:underline">Open Journal →</button>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ---------------------------------------------------- */}
        {/* SUBTITLE DIVIDER: Built for modern nutrition.       */}
        {/* ---------------------------------------------------- */}
        <section className="py-16 text-center border-t border-white/[0.08]">
          <div className="max-w-[1280px] mx-auto px-6 md:px-8">
            <h2 className="text-3xl md:text-[44px] font-semibold text-[#FFFFFF] tracking-tight">
              Built for modern nutrition.
            </h2>
          </div>
        </section>

        {/* ---------------------------------------------------- */}
        {/* 4-COLUMN FEATURE GRID */}
        {/* 🥗 Instant Food Recognition                         */}
        {/* 📈 Adaptive AI Coaching                              */}
        {/* 📊 Live Analytics                                    */}
        {/* 💧 Smart Hydration                                   */}
        {/* ---------------------------------------------------- */}
        <section className="pb-24 max-w-[1280px] mx-auto px-6 md:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="bg-[#111113] border border-white/[0.08] rounded-[20px] p-6 hover:border-[#22D3EE]/40 transition-all">
              <div className="text-3xl mb-3">🥗</div>
              <h3 className="text-[18px] font-medium text-[#FFFFFF] mb-2">Instant Food Recognition</h3>
              <p className="text-[14px] text-[#A1A1AA] leading-relaxed">
                Snap a photo or search ingredients to calculate exact calories and macros automatically.
              </p>
            </div>

            <div className="bg-[#111113] border border-white/[0.08] rounded-[20px] p-6 hover:border-[#34D399]/40 transition-all">
              <div className="text-3xl mb-3">📈</div>
              <h3 className="text-[18px] font-medium text-[#FFFFFF] mb-2">Adaptive AI Coaching</h3>
              <p className="text-[14px] text-[#A1A1AA] leading-relaxed">
                Real-time recommendations that evaluate your current intake and adjust to your targets.
              </p>
            </div>

            <div className="bg-[#111113] border border-white/[0.08] rounded-[20px] p-6 hover:border-[#FACC15]/40 transition-all">
              <div className="text-3xl mb-3">📊</div>
              <h3 className="text-[18px] font-medium text-[#FFFFFF] mb-2">Live Analytics</h3>
              <p className="text-[14px] text-[#A1A1AA] leading-relaxed">
                7-day intake trends, macro distribution, and deficit calculation with visual bar graphs.
              </p>
            </div>

            <div className="bg-[#111113] border border-white/[0.08] rounded-[20px] p-6 hover:border-blue-400/40 transition-all">
              <div className="text-3xl mb-3">💧</div>
              <h3 className="text-[18px] font-medium text-[#FFFFFF] mb-2">Smart Hydration</h3>
              <p className="text-[14px] text-[#A1A1AA] leading-relaxed">
                Glass-by-glass water tracking with smart alerts to keep your hydration right on goal.
              </p>
            </div>

          </div>
        </section>

      </main>

      {/* ---------------------------------------------------- */}
      {/* FOOTER SECTION */}
      {/* Brand: Nourish AI                                    */}
      {/* Columns: Product | Resources | Pricing | Docs | Github*/}
      {/* ©2026 Nourish AI                                     */}
      {/* ---------------------------------------------------- */}
      <footer className="border-t border-white/[0.08] bg-[#09090B] py-16">
        <div className="max-w-[1280px] mx-auto px-6 md:px-8 space-y-12">
          
          <div className="grid grid-cols-2 md:grid-cols-6 gap-8">
            {/* Brand Column */}
            <div className="col-span-2 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-xl bg-[#22D3EE] text-[#09090B] font-bold flex items-center justify-center text-xs">
                  ✦
                </div>
                <span className="font-bold text-lg text-[#FFFFFF]">Nourish AI</span>
              </div>
              <p className="text-[14px] text-[#A1A1AA] max-w-xs leading-relaxed">
                The operating system for your nutrition. Intelligence for your metabolism.
              </p>
            </div>

            {/* Links Columns */}
            <div>
              <p className="text-[13px] font-medium uppercase tracking-wider text-[#FFFFFF] mb-4">Product</p>
              <ul className="space-y-2 text-[14px] text-[#A1A1AA]">
                <li><Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link></li>
                <li><Link href="/diary" className="hover:text-white transition-colors">Food Journal</Link></li>
                <li><Link href="/coach" className="hover:text-white transition-colors">AI Coach</Link></li>
              </ul>
            </div>

            <div>
              <p className="text-[13px] font-medium uppercase tracking-wider text-[#FFFFFF] mb-4">Resources</p>
              <ul className="space-y-2 text-[14px] text-[#A1A1AA]">
                <li><Link href="/progress" className="hover:text-white transition-colors">Analytics</Link></li>
                <li><Link href="/goals" className="hover:text-white transition-colors">Goals</Link></li>
                <li><Link href="/settings" className="hover:text-white transition-colors">Settings</Link></li>
              </ul>
            </div>

            <div>
              <p className="text-[13px] font-medium uppercase tracking-wider text-[#FFFFFF] mb-4">Pricing</p>
              <ul className="space-y-2 text-[14px] text-[#A1A1AA]">
                <li><a href="#pricing" className="hover:text-white transition-colors">Free Plan</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Pro OS</a></li>
              </ul>
            </div>

            <div>
              <p className="text-[13px] font-medium uppercase tracking-wider text-[#FFFFFF] mb-4">Docs &amp; Code</p>
              <ul className="space-y-2 text-[14px] text-[#A1A1AA]">
                <li><a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Docs</a></li>
                <li><a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Github</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-white/[0.08] flex flex-col sm:flex-row justify-between items-center text-[13px] text-[#A1A1AA] gap-4">
            <p>©2026 Nourish AI. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Security</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
