'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LandingPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [coachQuery, setCoachQuery] = useState('')

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
    { day: 'S', heightPct: 65, cals: '1,820 kcal', color: 'bg-emerald-500' },
    { day: 'M', heightPct: 85, cals: '2,050 kcal', color: 'bg-emerald-500' },
    { day: 'T', heightPct: 100, cals: '2,100 kcal', color: 'bg-amber-400' },
    { day: 'W', heightPct: 75, cals: '1,910 kcal', color: 'bg-emerald-500' },
    { day: 'T', heightPct: 90, cals: '2,080 kcal', color: 'bg-emerald-500' },
    { day: 'F', heightPct: 60, cals: '1,750 kcal', color: 'bg-emerald-500' },
    { day: 'S', heightPct: 45, cals: '1,500 kcal', color: 'bg-rose-400' },
  ]

  return (
    <div className="bg-[#0b1712] text-slate-100 antialiased min-h-screen selection:bg-emerald-500 selection:text-white">
      {/* Google Fonts */}
      <link
        href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@600;700&display=swap"
        rel="stylesheet"
      />

      <style jsx global>{`
        body {
          font-family: 'DM Sans', sans-serif;
          background-color: #0b1712;
        }
        .font-serif-title {
          font-family: 'Playfair Display', serif;
        }
        .emerald-glow {
          background: radial-gradient(circle at 50% 0%, rgba(52, 211, 153, 0.15), transparent 70%);
        }
      `}</style>

      {/* Top Navbar */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#0b1712]/80 border-b border-emerald-900/40">
        <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white font-serif-title font-bold text-xl shadow-lg shadow-emerald-900/30 group-hover:scale-105 transition-transform">
              n
            </div>
            <span className="font-serif-title font-bold text-2xl tracking-tight text-white">
              Nourish<span className="text-emerald-400">.ai</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#how-it-works" className="hover:text-emerald-400 transition-colors">How it works</a>
            <a href="#features" className="hover:text-emerald-400 transition-colors">Features</a>
            <a href="#coach" className="hover:text-emerald-400 transition-colors">AI Coach</a>
            <a href="#trends" className="hover:text-emerald-400 transition-colors">Trends</a>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/dashboard')}
              className="hidden sm:block text-sm font-semibold text-slate-300 hover:text-white transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={() => router.push('/dashboard')}
              className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:from-emerald-400 hover:to-teal-500 transition-all shadow-lg shadow-emerald-950/50 active:scale-95"
            >
              Launch App
            </button>
          </div>
        </nav>
      </header>

      <main className="relative overflow-hidden">
        {/* Ambient Glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] emerald-glow pointer-events-none" />

        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-6 pt-16 pb-24 md:pt-24 md:pb-36 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          <div className="lg:col-span-6 space-y-8 animate-on-scroll transition-all duration-700 ease-out opacity-0 translate-y-8">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 text-xs font-semibold tracking-wide">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              PROACTIVE AI NUTRITION COACHING
            </div>

            <h1 className="text-4xl sm:text-6xl font-bold font-serif-title text-white leading-[1.1] tracking-tight">
              Track less.<br />
              Eat better.<br />
              <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300 bg-clip-text text-transparent">
                Know more.
              </span>
            </h1>

            <p className="text-lg text-slate-300 max-w-xl leading-relaxed">
              Nourish turns every meal, glass of water, and habit into clear, intelligent insights tailored to your body — no spreadsheets, no guesswork, no guilt.
            </p>

            <form onSubmit={handleStartTracking} className="flex flex-col sm:flex-row gap-3 max-w-md">
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="flex-1 bg-[#13261e] border border-emerald-800/60 rounded-xl px-4 py-3.5 text-sm text-white placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
              />
              <button
                type="submit"
                className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white font-bold px-6 py-3.5 rounded-xl text-sm transition-all shadow-lg shadow-orange-950/50 active:scale-95 whitespace-nowrap"
              >
                Start Free Trial
              </button>
            </form>

            <div className="flex items-center gap-6 pt-2 text-xs font-medium text-slate-400">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
                No credit card required
              </span>
              <span className="flex items-center gap-1.5 text-emerald-400">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
                Instant setup
              </span>
            </div>
          </div>

          {/* Hero App Mockup Card */}
          <div className="lg:col-span-6 relative animate-on-scroll transition-all duration-700 ease-out opacity-0 translate-y-8">
            <div className="bg-[#142920] border border-emerald-700/40 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-emerald-950/80 relative">
              {/* Header */}
              <div className="flex justify-between items-start mb-8 border-b border-emerald-900/50 pb-6">
                <div>
                  <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Today&apos;s Calorie Target</span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-4xl font-bold font-serif-title text-white">1,187</span>
                    <span className="text-slate-400 text-sm">/ 2,100 kcal</span>
                  </div>
                </div>
                <div className="w-16 h-16 rounded-full bg-emerald-950 border border-emerald-500/30 flex flex-col items-center justify-center text-center">
                  <span className="text-[10px] text-emerald-400 uppercase font-semibold">Goal</span>
                  <span className="text-sm font-bold text-white">56%</span>
                </div>
              </div>

              {/* Macros Breakdown */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="bg-[#1a3429] border border-emerald-800/40 rounded-2xl p-3.5">
                  <span className="text-[10px] uppercase font-bold text-orange-400 tracking-wider">Protein</span>
                  <p className="text-xl font-bold text-white mt-1">85g</p>
                  <div className="w-full bg-emerald-950 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div className="bg-orange-500 h-full w-[65%]" />
                  </div>
                </div>
                <div className="bg-[#1a3429] border border-emerald-800/40 rounded-2xl p-3.5">
                  <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">Carbs</span>
                  <p className="text-xl font-bold text-white mt-1">140g</p>
                  <div className="w-full bg-emerald-950 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div className="bg-amber-400 h-full w-[58%]" />
                  </div>
                </div>
                <div className="bg-[#1a3429] border border-emerald-800/40 rounded-2xl p-3.5">
                  <span className="text-[10px] uppercase font-bold text-teal-400 tracking-wider">Fat</span>
                  <p className="text-xl font-bold text-white mt-1">42g</p>
                  <div className="w-full bg-emerald-950 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div className="bg-teal-400 h-full w-[60%]" />
                  </div>
                </div>
              </div>

              {/* Proactive AI Nudge Banner */}
              <div className="bg-gradient-to-r from-emerald-950 via-[#18362b] to-emerald-950 border border-emerald-500/30 rounded-2xl p-4 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0 font-bold text-lg">
                  ✦
                </div>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-emerald-300">Proactive AI Nudge</p>
                  <p className="text-xs text-slate-300 mt-0.5">&ldquo;You&apos;re 900 kcal under target with dinner ahead — want a high-protein suggestion?&rdquo;</p>
                </div>
                <button
                  onClick={() => router.push('/coach?prompt=Suggest%20a%20high-protein%20dinner')}
                  className="bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-emerald-400 transition-colors whitespace-nowrap"
                >
                  Ask Coach
                </button>
              </div>
            </div>

            {/* Floating Hydration Widget */}
            <div className="absolute -bottom-6 -left-4 sm:-left-6 bg-[#162f25] border border-emerald-600/40 rounded-2xl p-4 flex items-center gap-3 shadow-xl z-20">
              <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center text-xl font-bold">
                💧
              </div>
              <div>
                <p className="text-[10px] font-bold text-sky-400 uppercase tracking-wider">Hydration Goal</p>
                <p className="text-sm font-bold text-white">1.8L <span className="text-slate-400 font-normal">/ 2.5L</span></p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-24 bg-[#0d1d17] border-t border-emerald-900/40 relative">
          <div className="max-w-7xl mx-auto px-6 animate-on-scroll transition-all duration-700 ease-out opacity-0 translate-y-8">
            <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest bg-emerald-950/80 px-3.5 py-1.5 rounded-full border border-emerald-800/40">
                Simple &amp; Frictionless
              </span>
              <h2 className="text-3xl sm:text-5xl font-bold font-serif-title text-white">
                Three steps. Every single day.
              </h2>
              <p className="text-slate-300 text-base">
                Building healthy nutrition habits doesn&apos;t require hours of manual input.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Step 1 */}
              <div className="bg-[#142920] border border-emerald-800/50 rounded-3xl p-8 hover:border-emerald-500/50 transition-all group flex flex-col justify-between h-full">
                <div>
                  <div className="flex items-center justify-between mb-8">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-950 border border-emerald-500/30 text-emerald-400 flex items-center justify-center text-2xl shadow-lg group-hover:scale-110 transition-transform">
                      📸
                    </div>
                    <span className="text-4xl font-bold font-serif-title text-emerald-800/60">01</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">Snap or Search</h3>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    Take a photo of your meal or tap a single preset. Nourish AI analyzes the food, estimates calories and macros, and lets you confirm with one tap.
                  </p>
                </div>
                <div className="mt-8 pt-4 border-t border-emerald-900/60 text-xs font-semibold text-emerald-400 flex items-center gap-1">
                  <span>Photo &amp; Barcode Logging</span>
                  <span>→</span>
                </div>
              </div>

              {/* Step 2 */}
              <div className="bg-[#142920] border border-emerald-800/50 rounded-3xl p-8 hover:border-emerald-500/50 transition-all group flex flex-col justify-between h-full">
                <div>
                  <div className="flex items-center justify-between mb-8">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-950 border border-emerald-500/30 text-emerald-400 flex items-center justify-center text-2xl shadow-lg group-hover:scale-110 transition-transform">
                      🤖
                    </div>
                    <span className="text-4xl font-bold font-serif-title text-emerald-800/60">02</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">Proactive AI Insights</h3>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    Your AI coach evaluates your real-time intake patterns and goal objective (Lose, Maintain, or Gain) to deliver timely, actionable suggestions.
                  </p>
                </div>
                <div className="mt-8 pt-4 border-t border-emerald-900/60 text-xs font-semibold text-emerald-400 flex items-center gap-1">
                  <span>Goal-Aware Guidance</span>
                  <span>→</span>
                </div>
              </div>

              {/* Step 3 */}
              <div className="bg-[#142920] border border-emerald-800/50 rounded-3xl p-8 hover:border-emerald-500/50 transition-all group flex flex-col justify-between h-full">
                <div>
                  <div className="flex items-center justify-between mb-8">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-950 border border-emerald-500/30 text-emerald-400 flex items-center justify-center text-2xl shadow-lg group-hover:scale-110 transition-transform">
                      🔥
                    </div>
                    <span className="text-4xl font-bold font-serif-title text-emerald-800/60">03</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">Build Lasting Habits</h3>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    Dynamic logging streaks, hydration reminders, and weekly macro trend graphs keep you accountable without the guilt or judgment.
                  </p>
                </div>
                <div className="mt-8 pt-4 border-t border-emerald-900/60 text-xs font-semibold text-emerald-400 flex items-center gap-1">
                  <span>Dynamic Badges &amp; Streaks</span>
                  <span>→</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Showcase Grid */}
        <section id="features" className="py-24 max-w-7xl mx-auto px-6">
          <div className="animate-on-scroll transition-all duration-700 ease-out opacity-0 translate-y-8">
            <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
              <h2 className="text-3xl sm:text-5xl font-bold font-serif-title text-white">
                Everything you need to succeed
              </h2>
              <p className="text-slate-300 text-base">
                Engineered for maximum speed, visual clarity, and real data privacy.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-[#12261e] border border-emerald-800/40 p-7 rounded-2xl hover:border-emerald-500/60 transition-all group">
                <div className="text-3xl mb-4 group-hover:scale-110 transition-transform">🥗</div>
                <h4 className="text-lg font-bold text-white mb-2">Smart Food Logging</h4>
                <p className="text-slate-300 text-sm leading-relaxed">Instant meal search with single-tap preset chips, barcode estimates, and photo analysis.</p>
              </div>

              <div className="bg-[#12261e] border border-emerald-800/40 p-7 rounded-2xl hover:border-emerald-500/60 transition-all group">
                <div className="text-3xl mb-4 group-hover:scale-110 transition-transform">📊</div>
                <h4 className="text-lg font-bold text-white mb-2">Calorie &amp; Macro Ring Breakdown</h4>
                <p className="text-slate-300 text-sm leading-relaxed">Track Protein, Carbs, and Fats against personalized targets calculated for your body.</p>
              </div>

              <div className="bg-[#12261e] border border-emerald-800/40 p-7 rounded-2xl hover:border-emerald-500/60 transition-all group">
                <div className="text-3xl mb-4 group-hover:scale-110 transition-transform">💧</div>
                <h4 className="text-lg font-bold text-white mb-2">Hydration Glass Counter</h4>
                <p className="text-slate-300 text-sm leading-relaxed">Log water intake glass-by-glass with automatic alerts when you fall behind your daily glass target.</p>
              </div>

              <div className="bg-[#12261e] border border-emerald-800/40 p-7 rounded-2xl hover:border-emerald-500/60 transition-all group">
                <div className="text-3xl mb-4 group-hover:scale-110 transition-transform">💬</div>
                <h4 className="text-lg font-bold text-white mb-2">Real-Time AI Streaming Coach</h4>
                <p className="text-slate-300 text-sm leading-relaxed">Ask any nutrition question and receive instant streaming advice that understands your exact daily log.</p>
              </div>

              <div className="bg-[#12261e] border border-emerald-800/40 p-7 rounded-2xl hover:border-emerald-500/60 transition-all group">
                <div className="text-3xl mb-4 group-hover:scale-110 transition-transform">📈</div>
                <h4 className="text-lg font-bold text-white mb-2">Weekly Intake Analytics</h4>
                <p className="text-slate-300 text-sm leading-relaxed">Interactive SVG charts showing 7-day intake averages and deficit/surplus trends over time.</p>
              </div>

              <div className="bg-[#12261e] border border-emerald-800/40 p-7 rounded-2xl hover:border-emerald-500/60 transition-all group">
                <div className="text-3xl mb-4 group-hover:scale-110 transition-transform">🌙</div>
                <h4 className="text-lg font-bold text-white mb-2">Dark Mode &amp; Local Persistence</h4>
                <p className="text-slate-300 text-sm leading-relaxed">Full Dark Mode CSS theme support with local browser persistence so your data is always safe.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Weekly Trends & Milestones Section */}
        <section id="trends" className="py-24 bg-[#0d1d17] border-t border-emerald-900/40">
          <div className="max-w-7xl mx-auto px-6 animate-on-scroll transition-all duration-700 ease-out opacity-0 translate-y-8">
            <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
              <h2 className="text-3xl sm:text-5xl font-bold font-serif-title text-white">
                Weekly Trends &amp; Milestones
              </h2>
              <p className="text-slate-300 text-base">
                Track your consistency and celebrate every achievement along the way.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              {/* Left: Interactive Weekly Progress Chart */}
              <div className="bg-[#142920] p-8 rounded-3xl border border-emerald-800/50 shadow-xl">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-white">7-Day Calorie Intake</h3>
                  <span className="text-xs font-semibold text-emerald-400 bg-emerald-950 px-3 py-1 rounded-full border border-emerald-500/30">
                    Avg: 1,950 kcal
                  </span>
                </div>

                {/* Fixed Visible Bar Chart Container */}
                <div className="h-56 flex items-end justify-between gap-3 pt-6 pb-2 px-2 border-b border-emerald-900/60">
                  {weeklyChartBars.map((bar, idx) => (
                    <div key={idx} className="flex-1 h-full flex flex-col justify-end items-center gap-2 group">
                      <span className="text-[10px] font-bold text-emerald-300 opacity-0 group-hover:opacity-100 transition-opacity">
                        {bar.cals}
                      </span>
                      <div className="w-full bg-emerald-950/80 rounded-t-lg h-full flex items-end p-0.5 border border-emerald-900/40">
                        <div
                          className={`w-full ${bar.color} rounded-t-md transition-all duration-500 group-hover:brightness-110`}
                          style={{ height: `${bar.heightPct}%` }}
                        />
                      </div>
                      <span className="text-xs font-bold text-slate-300">
                        {bar.day}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-4 flex justify-between items-center text-xs">
                  <p className="text-slate-300">Target intake: <span className="font-bold text-white">2,100 kcal / day</span></p>
                  <span className="text-emerald-400 font-bold bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-500/20">
                    +12% Consistency
                  </span>
                </div>
              </div>

              {/* Right: Badges Grid */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-white mb-6">Active Badges &amp; Achievements</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-[#142920] p-5 rounded-2xl border border-emerald-800/50 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center text-2xl">
                      🔥
                    </div>
                    <div>
                      <p className="font-bold text-white text-sm">7-Day Streak</p>
                      <p className="text-xs text-slate-400 mt-0.5">Logged meals 7 days in a row</p>
                    </div>
                  </div>

                  <div className="bg-[#142920] p-5 rounded-2xl border border-emerald-800/50 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center text-2xl">
                      💧
                    </div>
                    <div>
                      <p className="font-bold text-white text-sm">Hydration Hero</p>
                      <p className="text-xs text-slate-400 mt-0.5">Hit water goals 5 days straight</p>
                    </div>
                  </div>

                  <div className="bg-[#142920] p-5 rounded-2xl border border-emerald-800/50 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-2xl">
                      💪
                    </div>
                    <div>
                      <p className="font-bold text-white text-sm">Protein Master</p>
                      <p className="text-xs text-slate-400 mt-0.5">Reached protein target today</p>
                    </div>
                  </div>

                  <div className="bg-[#142920] p-5 rounded-2xl border border-emerald-800/50 flex items-center gap-4 opacity-50">
                    <div className="w-12 h-12 rounded-xl bg-slate-800 text-slate-400 flex items-center justify-center text-2xl">
                      🔒
                    </div>
                    <div>
                      <p className="font-bold text-white text-sm">30-Day Legend</p>
                      <p className="text-xs text-slate-400 mt-0.5">Unlock by logging 30 days</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* AI Coach Live Interactive Demo */}
        <section id="coach" className="py-24 bg-[#0b1712] relative">
          <div className="max-w-4xl mx-auto px-6 animate-on-scroll transition-all duration-700 ease-out opacity-0 translate-y-8">
            <div className="bg-[#142920] border border-emerald-700/50 rounded-3xl overflow-hidden shadow-2xl">
              <div className="bg-[#19362a] p-5 border-b border-emerald-800/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500 text-white font-bold flex items-center justify-center text-sm shadow-md">
                    ✦
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">Nourish AI Coach</p>
                    <p className="text-[10px] text-emerald-400 uppercase font-semibold">Online &amp; Data-Aware</p>
                  </div>
                </div>
                <span className="text-xs font-semibold text-emerald-400 bg-emerald-950 px-3 py-1 rounded-full border border-emerald-500/20">
                  Live Demo
                </span>
              </div>

              <div className="p-6 sm:p-8 space-y-6 bg-[#11231a]">
                {/* User Message */}
                <div className="flex justify-end">
                  <div className="bg-emerald-900/60 border border-emerald-700/40 text-emerald-100 px-5 py-3.5 rounded-2xl rounded-tr-none text-sm max-w-sm">
                    What should I eat for dinner to reach my protein goal?
                  </div>
                </div>

                {/* AI Message */}
                <div className="flex justify-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white flex-shrink-0 flex items-center justify-center font-bold text-xs">
                    ✦
                  </div>
                  <div className="bg-[#1a382c] border border-emerald-700/40 text-slate-100 px-5 py-3.5 rounded-2xl rounded-tl-none text-sm max-w-md leading-relaxed">
                    You have 600 calories and 40g of protein remaining today. I recommend a grilled salmon bowl with quinoa and asparagus — it delivers 38g of protein while staying right in range! 🍽️
                  </div>
                </div>

                {/* Interactive Input Form */}
                <form onSubmit={handleAskCoach} className="pt-4 border-t border-emerald-900/60 flex gap-3">
                  <input
                    type="text"
                    placeholder="Ask your coach anything (e.g., 'Suggest a low-carb snack')..."
                    value={coachQuery}
                    onChange={e => setCoachQuery(e.target.value)}
                    className="flex-1 bg-[#152c21] border border-emerald-800/60 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 transition-all"
                  />
                  <button
                    type="submit"
                    className="bg-emerald-500 hover:bg-emerald-400 text-white font-bold px-5 py-3 rounded-xl text-sm transition-all flex items-center justify-center shadow-md active:scale-95"
                  >
                    Send
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA Banner */}
        <section className="py-24 max-w-7xl mx-auto px-6">
          <div className="bg-gradient-to-br from-[#163826] via-[#1a422d] to-[#0e271a] border border-emerald-500/40 rounded-3xl p-10 sm:p-16 md:p-20 text-center relative overflow-hidden shadow-2xl animate-on-scroll transition-all duration-700 ease-out opacity-0 translate-y-8">
            <div className="max-w-2xl mx-auto space-y-8 relative z-10">
              <h2 className="text-3xl sm:text-5xl font-bold font-serif-title text-white leading-tight">
                Start your journey to clarity today.
              </h2>
              <p className="text-slate-300 text-base leading-relaxed">
                Everything you need to reach your goals — powered by your real data and intelligent AI coaching.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-2">
                <button
                  onClick={() => router.push('/dashboard')}
                  className="w-full sm:w-auto bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white font-bold px-8 py-4 rounded-xl text-sm transition-all shadow-xl shadow-orange-950/60 active:scale-95"
                >
                  Start Tracking Free
                </button>
                <button
                  onClick={() => router.push('/dashboard')}
                  className="w-full sm:w-auto bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/40 text-white font-bold px-8 py-4 rounded-xl text-sm transition-all active:scale-95"
                >
                  Explore Dashboard
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#08120e] border-t border-emerald-950 py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-400">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-emerald-500 text-white font-serif-title font-bold flex items-center justify-center text-sm">
              n
            </div>
            <span className="font-serif-title font-bold text-base text-white">Nourish.ai</span>
          </div>

          <div className="flex gap-8">
            <Link href="/dashboard" className="hover:text-emerald-400 transition-colors">Dashboard</Link>
            <Link href="/diary" className="hover:text-emerald-400 transition-colors">Food Diary</Link>
            <Link href="/coach" className="hover:text-emerald-400 transition-colors">AI Coach</Link>
            <Link href="/goals" className="hover:text-emerald-400 transition-colors">Goals</Link>
            <Link href="/progress" className="hover:text-emerald-400 transition-colors">Progress</Link>
            <Link href="/settings" className="hover:text-emerald-400 transition-colors">Settings</Link>
          </div>

          <p>© {new Date().getFullYear()} Nourish AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
