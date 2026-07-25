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
    { day: 'S', heightPct: 65, cals: '1,820', color: 'bg-primary-fixed-dim' },
    { day: 'M', heightPct: 85, cals: '2,050', color: 'bg-primary-fixed-dim' },
    { day: 'T', heightPct: 100, cals: '2,100', color: 'bg-secondary-container' },
    { day: 'W', heightPct: 75, cals: '1,910', color: 'bg-primary-fixed-dim' },
    { day: 'T', heightPct: 90, cals: '2,080', color: 'bg-primary-fixed-dim' },
    { day: 'F', heightPct: 60, cals: '1,750', color: 'bg-primary-fixed-dim' },
    { day: 'S', heightPct: 45, cals: '1,500', color: 'bg-tertiary-fixed' },
  ]

  return (
    <div className="bg-background text-on-surface font-body-md antialiased min-h-screen">
      {/* Font & Icon Dependencies */}
      <link
        href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,400..800;1,6..72,400..800&family=Hanken+Grotesk:wght@100..900&display=swap"
        rel="stylesheet"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        rel="stylesheet"
      />

      <style jsx global>{`
        .protein-accent { color: #D97B54; }
        .carbs-accent { color: #E8C170; }
        .fat-accent { color: #436651; }
        .glass-card {
          background: rgba(255, 255, 255, 0.6);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(22, 56, 38, 0.1);
        }
        .material-symbols-outlined {
          font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
      `}</style>

      {/* TopNavBar */}
      <header className="docked full-width top-0 sticky backdrop-blur-md bg-surface/90 border-b border-outline-variant z-50">
        <nav className="flex justify-between items-center w-full px-container-margin py-4 max-w-7xl mx-auto">
          <Link href="/" className="text-headline-md font-headline-md font-bold text-primary">
            Nourish
          </Link>
          <div className="hidden md:flex gap-8 items-center">
            <a className="text-on-surface-variant hover:text-primary transition-all duration-200 text-label-caps font-label-caps uppercase" href="#how-it-works">
              How it works
            </a>
            <a className="text-on-surface-variant hover:text-primary transition-all duration-200 text-label-caps font-label-caps uppercase" href="#features">
              Features
            </a>
            <a className="text-on-surface-variant hover:text-primary transition-all duration-200 text-label-caps font-label-caps uppercase" href="#coach">
              AI Coach
            </a>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/dashboard')}
              className="hidden md:block text-label-caps font-label-caps uppercase text-primary hover:opacity-80 transition-all font-bold"
            >
              Sign In
            </button>
            <button
              onClick={() => router.push('/dashboard')}
              className="bg-primary text-on-primary px-6 py-2.5 rounded-xl text-label-caps font-label-caps uppercase hover:opacity-90 transition-all scale-100 active:scale-95 shadow-md font-bold"
            >
              Get started
            </button>
          </div>
        </nav>
      </header>

      <main>
        {/* 1. HERO SECTION WITH FIXED SPACING & NO OVERLAP */}
        <section className="max-w-7xl mx-auto px-container-margin pt-12 pb-24 md:pt-20 md:pb-32 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="space-y-8 animate-on-scroll transition-all duration-700 ease-out opacity-0 translate-y-8">
            <h1 className="text-display-lg font-display-lg text-primary">
              Track less.<br />Know more.
            </h1>
            <p className="text-body-lg text-on-surface-variant max-w-lg">
              Turn your meals, water intake, and daily activity into a clear picture of your health. No guesswork, just intelligent insights designed for your body.
            </p>
            <form onSubmit={handleStartTracking} className="flex flex-col sm:flex-row gap-3 max-w-md">
              <input
                className="flex-1 rounded-xl border border-outline-variant bg-surface-container-lowest px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                placeholder="Enter your email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
              <button
                type="submit"
                className="bg-secondary text-on-secondary px-6 py-3 rounded-xl font-label-caps text-label-caps uppercase hover:opacity-90 transition-all shadow-md font-bold"
              >
                Start tracking free
              </button>
            </form>
            <div className="flex items-center gap-4 text-on-surface-variant text-body-md italic">
              <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                verified
              </span>
              &ldquo;The only app that actually understands my metabolism.&rdquo;
            </div>
          </div>

          {/* Hero Mockup (Bento Style) */}
          <div className="relative mb-6 md:mb-0 animate-on-scroll transition-all duration-700 ease-out opacity-0 translate-y-8">
            <div className="bg-primary-container rounded-[2rem] p-8 text-on-primary shadow-xl border border-primary/10">
              <div className="flex justify-between items-start mb-12">
                <div>
                  <p className="text-label-caps font-label-caps uppercase opacity-70 mb-2">Daily Calorie Target</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-display-lg font-display-lg">1,187</span>
                    <span className="text-headline-md opacity-60">/ 2,100 kcal</span>
                  </div>
                </div>
                <div className="h-20 w-20 relative">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="rgba(255,255,255,0.1)"
                      strokeWidth="3"
                    />
                    <path
                      className="text-secondary-container"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="currentColor"
                      strokeDasharray="56, 100"
                      strokeWidth="3"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-label-caps text-[10px] uppercase">Goal</span>
                    <span className="font-bold">56%</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white/10 rounded-xl p-4 border border-white/5 backdrop-blur-sm">
                  <p className="text-[10px] font-label-caps uppercase mb-2">Protein</p>
                  <p className="text-data-lg font-data-lg protein-accent">85g</p>
                  <div className="w-full h-1 bg-white/10 rounded-full mt-3 overflow-hidden">
                    <div className="w-[65%] h-full bg-secondary-container"></div>
                  </div>
                </div>
                <div className="bg-white/10 rounded-xl p-4 border border-white/5 backdrop-blur-sm">
                  <p className="text-[10px] font-label-caps uppercase mb-2">Carbs</p>
                  <p className="text-data-lg font-data-lg carbs-accent">140g</p>
                  <div className="w-full h-1 bg-white/10 rounded-full mt-3 overflow-hidden">
                    <div className="w-[58%] h-full bg-tertiary-fixed"></div>
                  </div>
                </div>
                <div className="bg-white/10 rounded-xl p-4 border border-white/5 backdrop-blur-sm">
                  <p className="text-[10px] font-label-caps uppercase mb-2">Fat</p>
                  <p className="text-data-lg font-data-lg fat-accent">42g</p>
                  <div className="w-full h-1 bg-white/10 rounded-full mt-3 overflow-hidden">
                    <div className="w-[60%] h-full bg-primary-fixed-dim"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Hydration Widget */}
            <div className="absolute -bottom-5 left-4 md:-bottom-6 md:-left-6 bg-surface border border-outline-variant rounded-2xl p-4 flex items-center gap-3 shadow-lg z-10">
              <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
                <span className="material-symbols-outlined">water_drop</span>
              </div>
              <div>
                <p className="text-label-caps font-label-caps uppercase text-[10px]">Hydration</p>
                <p className="font-bold text-on-surface">1.8L <span className="text-on-surface-variant font-normal">/ 2.5L</span></p>
              </div>
            </div>
          </div>
        </section>

        {/* 2. HOW IT WORKS SECTION WITH STRUCTURED STEP CARDS */}
        <section id="how-it-works" className="bg-surface-container-low py-24 border-t border-outline-variant/60">
          <div className="max-w-7xl mx-auto px-container-margin animate-on-scroll transition-all duration-700 ease-out opacity-0 translate-y-8">
            <div className="text-center mb-16">
              <h2 className="text-headline-lg font-headline-lg text-primary mb-4">How it works</h2>
              <p className="text-on-surface-variant text-body-lg">Three simple steps to mastery.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Step 1 */}
              <div className="bg-white border border-outline-variant p-8 rounded-2xl shadow-sm hover:border-primary transition-all flex flex-col h-full group">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-14 h-14 bg-primary text-on-primary rounded-2xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                    <span className="material-symbols-outlined text-3xl">photo_camera</span>
                  </div>
                  <span className="text-display-lg font-display-lg text-primary/20 font-black">01</span>
                </div>
                <h3 className="text-headline-md font-headline-md mb-3 text-primary">Log in seconds</h3>
                <p className="text-on-surface-variant text-body-md leading-relaxed">
                  Simply snap a photo of your meal or search our database. AI handles the complex calorie and macro breakdown for you.
                </p>
              </div>

              {/* Step 2 */}
              <div className="bg-white border border-outline-variant p-8 rounded-2xl shadow-sm hover:border-primary transition-all flex flex-col h-full group">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-14 h-14 bg-primary text-on-primary rounded-2xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                    <span className="material-symbols-outlined text-3xl">psychology</span>
                  </div>
                  <span className="text-display-lg font-display-lg text-primary/20 font-black">02</span>
                </div>
                <h3 className="text-headline-md font-headline-md mb-3 text-primary">Get AI insights</h3>
                <p className="text-on-surface-variant text-body-md leading-relaxed">
                  Your personal coach analyzes your logging patterns, identifies deficiencies, and suggests real-time improvements.
                </p>
              </div>

              {/* Step 3 */}
              <div className="bg-white border border-outline-variant p-8 rounded-2xl shadow-sm hover:border-primary transition-all flex flex-col h-full group">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-14 h-14 bg-primary text-on-primary rounded-2xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                    <span className="material-symbols-outlined text-3xl">trending_up</span>
                  </div>
                  <span className="text-display-lg font-display-lg text-primary/20 font-black">03</span>
                </div>
                <h3 className="text-headline-md font-headline-md mb-3 text-primary">Build the habit</h3>
                <p className="text-on-surface-variant text-body-md leading-relaxed">
                  Stay motivated with weekly streaks, trend reports, and hydration goals that adapt as your fitness level evolves.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="py-24 max-w-7xl mx-auto px-container-margin">
          <div className="animate-on-scroll transition-all duration-700 ease-out opacity-0 translate-y-8">
            <h2 className="text-headline-lg font-headline-lg text-primary mb-12 text-center">Everything you need</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Card 1 */}
              <div className="bg-white border border-outline-variant p-8 rounded-2xl hover:border-primary transition-colors group shadow-sm hover:shadow-md">
                <span className="material-symbols-outlined text-secondary mb-4 block text-3xl group-hover:scale-110 transition-transform">restaurant</span>
                <h4 className="text-headline-md font-headline-md mb-3 text-primary">Smart food logging</h4>
                <p className="text-on-surface-variant text-body-md">Advanced AI recognition makes adding ingredients or complex meals as easy as clicking a button.</p>
              </div>
              {/* Card 2 */}
              <div className="bg-white border border-outline-variant p-8 rounded-2xl hover:border-primary transition-colors group shadow-sm hover:shadow-md">
                <span className="material-symbols-outlined text-secondary mb-4 block text-3xl group-hover:scale-110 transition-transform">analytics</span>
                <h4 className="text-headline-md font-headline-md mb-3 text-primary">Calorie &amp; macro tracking</h4>
                <p className="text-on-surface-variant text-body-md">Precision tracking of proteins, fats, and carbs with automated daily summaries and target adjustments.</p>
              </div>
              {/* Card 3 */}
              <div className="bg-white border border-outline-variant p-8 rounded-2xl hover:border-primary transition-colors group shadow-sm hover:shadow-md">
                <span className="material-symbols-outlined text-secondary mb-4 block text-3xl group-hover:scale-110 transition-transform">water_drop</span>
                <h4 className="text-headline-md font-headline-md mb-3 text-primary">Hydration tracking</h4>
                <p className="text-on-surface-variant text-body-md">Customizable water goals with smart reminders to ensure you&apos;re performing at your absolute peak.</p>
              </div>
              {/* Card 4 */}
              <div className="bg-white border border-outline-variant p-8 rounded-2xl hover:border-primary transition-colors group shadow-sm hover:shadow-md">
                <span className="material-symbols-outlined text-secondary mb-4 block text-3xl group-hover:scale-110 transition-transform">chat</span>
                <h4 className="text-headline-md font-headline-md mb-3 text-primary">AI nutrition coach</h4>
                <p className="text-on-surface-variant text-body-md">A conversational partner that answers &ldquo;What should I eat?&rdquo; based on your specific daily progress.</p>
              </div>
              {/* Card 5 */}
              <div className="bg-white border border-outline-variant p-8 rounded-2xl hover:border-primary transition-colors group shadow-sm hover:shadow-md">
                <span className="material-symbols-outlined text-secondary mb-4 block text-3xl group-hover:scale-110 transition-transform">auto_graph</span>
                <h4 className="text-headline-md font-headline-md mb-3 text-primary">Trends &amp; streaks</h4>
                <p className="text-on-surface-variant text-body-md">Visualize your journey with detailed weekly overviews and celebration of your consistency milestones.</p>
              </div>
              {/* Card 6 */}
              <div className="bg-white border border-outline-variant p-8 rounded-2xl hover:border-primary transition-colors group shadow-sm hover:shadow-md">
                <span className="material-symbols-outlined text-secondary mb-4 block text-3xl group-hover:scale-110 transition-transform">track_changes</span>
                <h4 className="text-headline-md font-headline-md mb-3 text-primary">Goals that adapt</h4>
                <p className="text-on-surface-variant text-body-md">Whether you want to lose weight, gain muscle, or maintain, our engine recalibrates as you change.</p>
              </div>
            </div>
          </div>
        </section>

        {/* 4. WEEKLY PROGRESS CHART FIXED AND VISIBLE */}
        <section id="coach" className="py-24 bg-surface">
          <div className="max-w-7xl mx-auto px-container-margin animate-on-scroll transition-all duration-700 ease-out opacity-0 translate-y-8">
            <div className="text-center mb-16">
              <h2 className="text-headline-lg font-headline-lg text-primary mb-4">Weekly Trends &amp; Achievements</h2>
              <p className="text-on-surface-variant">Celebrate your progress and stay on track.</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
              {/* Left Column: Weekly Progress */}
              <div className="bg-surface-container-low p-8 rounded-[2rem] border border-outline-variant shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-headline-md font-headline-md text-primary">Weekly Progress</h3>
                  <span className="text-xs font-bold uppercase tracking-wider text-primary/70 bg-primary/10 px-3 py-1 rounded-full">Calorie Intake</span>
                </div>

                {/* Fixed Weekly Progress Chart Container */}
                <div className="h-56 flex items-end justify-between gap-3 pt-6 pb-2 px-2 border-b border-outline-variant/60">
                  {weeklyChartBars.map((bar, idx) => (
                    <div key={idx} className="flex-1 h-full flex flex-col justify-end items-center gap-2 group">
                      <span className="text-[10px] font-bold text-on-surface-variant opacity-0 group-hover:opacity-100 transition-opacity">
                        {bar.cals}
                      </span>
                      <div className="w-full bg-surface-container-high/60 rounded-t-lg h-full flex items-end p-0.5">
                        <div
                          className={`w-full ${bar.color} rounded-t-md transition-all duration-500 group-hover:opacity-90`}
                          style={{ height: `${bar.heightPct}%` }}
                        ></div>
                      </div>
                      <span className="text-label-caps font-label-caps text-[11px] font-bold text-primary">
                        {bar.day}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-4 flex justify-between items-center">
                  <p className="text-body-md text-on-surface-variant">
                    Average daily intake: <span className="font-bold text-primary">1,950 kcal</span>
                  </p>
                  <span className="text-secondary font-bold text-sm bg-secondary-container/20 px-3 py-1 rounded-full">
                    +12% vs last week
                  </span>
                </div>
              </div>

              {/* Right Column: Milestones & Badges */}
              <div className="space-y-6">
                <h3 className="text-headline-md font-headline-md text-primary mb-8">Milestones &amp; Badges</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-white p-6 rounded-2xl border border-outline-variant flex items-start gap-4 shadow-sm">
                    <div className="w-12 h-12 bg-secondary-container/20 text-secondary rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="material-symbols-outlined">local_fire_department</span>
                    </div>
                    <div>
                      <p className="font-bold text-primary">7-Day Streak</p>
                      <p className="text-sm text-on-surface-variant">Consistent logging for a full week.</p>
                    </div>
                  </div>
                  <div className="bg-white p-6 rounded-2xl border border-outline-variant flex items-start gap-4 shadow-sm">
                    <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="material-symbols-outlined">water_drop</span>
                    </div>
                    <div>
                      <p className="font-bold text-primary">Hydration Hero</p>
                      <p className="text-sm text-on-surface-variant">Met water goals 5 days in a row.</p>
                    </div>
                  </div>
                  <div className="bg-white p-6 rounded-2xl border border-outline-variant flex items-start gap-4 shadow-sm">
                    <div className="w-12 h-12 bg-primary-fixed text-primary rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="material-symbols-outlined">fitness_center</span>
                    </div>
                    <div>
                      <p className="font-bold text-primary">Protein Power</p>
                      <p className="text-sm text-on-surface-variant">Hit protein targets consistently.</p>
                    </div>
                  </div>
                  <div className="bg-white p-6 rounded-2xl border border-outline-variant flex items-start gap-4 opacity-40 shadow-sm">
                    <div className="w-12 h-12 bg-surface-container-high text-on-surface-variant rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="material-symbols-outlined">lock</span>
                    </div>
                    <div>
                      <p className="font-bold text-primary">Monthly Master</p>
                      <p className="text-sm text-on-surface-variant">Keep going to unlock this badge!</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* AI Coach Chat Banner */}
        <section className="py-24 bg-surface-container-highest/30">
          <div className="max-w-4xl mx-auto px-container-margin animate-on-scroll transition-all duration-700 ease-out opacity-0 translate-y-8">
            <div className="bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-outline-variant">
              <div className="bg-primary p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-primary-fixed-dim rounded-full flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined">smart_toy</span>
                  </div>
                  <div>
                    <p className="text-on-primary font-bold">Nourish Coach</p>
                    <p className="text-on-primary/60 text-[10px] font-label-caps uppercase">Online &amp; ready</p>
                  </div>
                </div>
                <span className="material-symbols-outlined text-on-primary opacity-40">more_horiz</span>
              </div>
              <div className="p-8 space-y-8 bg-surface-container-lowest">
                {/* User Message */}
                <div className="flex justify-end">
                  <div className="bg-surface-container-high px-6 py-4 rounded-2xl rounded-tr-none max-w-sm">
                    <p className="text-on-surface">What should I eat for dinner?</p>
                  </div>
                </div>
                {/* AI Message */}
                <div className="flex justify-start gap-4">
                  <div className="w-8 h-8 bg-primary-fixed rounded-full flex-shrink-0 flex items-center justify-center text-primary text-sm font-bold">N</div>
                  <div className="bg-primary text-on-primary px-6 py-4 rounded-2xl rounded-tl-none max-w-md">
                    <p>Since you have 600 calories and 40g of protein left for today, I recommend a grilled salmon salad with quinoa. It hits your macro goals and keeps your streak alive!</p>
                  </div>
                </div>
                {/* Interactive Input */}
                <form onSubmit={handleAskCoach} className="border-t border-outline-variant pt-6 flex items-center gap-4">
                  <input
                    value={coachQuery}
                    onChange={e => setCoachQuery(e.target.value)}
                    placeholder="Ask your coach anything..."
                    className="flex-1 bg-surface-container-low px-4 py-3 rounded-xl text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                  <button type="submit" className="w-10 h-10 bg-primary text-on-primary rounded-xl flex items-center justify-center hover:opacity-90 transition-all">
                    <span className="material-symbols-outlined">send</span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* 3. FINAL CTA BAND WITH NON-OVERLAPPING BUTTONS */}
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-container-margin animate-on-scroll transition-all duration-700 ease-out opacity-0 translate-y-8">
            <div className="bg-primary rounded-[2.5rem] p-10 sm:p-16 md:p-24 text-center relative overflow-hidden shadow-2xl">
              <div className="absolute inset-0 opacity-10 pointer-events-none">
                <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
              </div>
              <div className="relative z-10 max-w-3xl mx-auto space-y-8">
                <h2 className="text-display-lg font-display-lg text-on-primary leading-tight">
                  Start your journey to clarity today.
                </h2>
                <p className="text-on-primary/80 text-body-lg max-w-xl mx-auto">
                  Everything you need to reach your goals, powered by your data and our intelligence.
                </p>
                {/* Clean, Non-Overlapping CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center max-w-lg mx-auto pt-2">
                  <button
                    onClick={() => router.push('/dashboard')}
                    className="w-full sm:w-auto inline-flex items-center justify-center bg-secondary-container text-on-secondary-container px-8 py-4 rounded-xl font-label-caps text-label-caps uppercase hover:opacity-90 transition-all shadow-lg font-bold text-center"
                  >
                    Start tracking free
                  </button>
                  <button
                    onClick={() => router.push('/dashboard')}
                    className="w-full sm:w-auto inline-flex items-center justify-center text-on-primary border border-white/30 px-8 py-4 rounded-xl font-label-caps text-label-caps uppercase hover:bg-white/10 transition-all font-bold text-center"
                  >
                    View your dashboard
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-surface-container-low border-t border-outline-variant">
        <div className="w-full px-container-margin py-stack-lg max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-stack-md">
          <div>
            <div className="text-headline-md font-headline-md text-primary mb-4">Nourish</div>
            <p className="text-on-surface-variant text-body-md max-w-xs mb-8">© {new Date().getFullYear()} Nourish AI. Empowering clarity in nutrition.</p>
            <div className="flex gap-6">
              <span className="material-symbols-outlined text-on-surface-variant hover:text-primary cursor-pointer transition-colors">public</span>
              <span className="material-symbols-outlined text-on-surface-variant hover:text-primary cursor-pointer transition-colors">favorite</span>
              <span className="material-symbols-outlined text-on-surface-variant hover:text-primary cursor-pointer transition-colors">share</span>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
            <div className="space-y-4">
              <p className="text-label-caps font-label-caps uppercase text-primary">Product</p>
              <ul className="space-y-2">
                <li><Link className="text-on-surface-variant hover:text-primary hover:underline transition-all text-body-md" href="/dashboard">Dashboard</Link></li>
                <li><Link className="text-on-surface-variant hover:text-primary hover:underline transition-all text-body-md" href="/diary">Food Journal</Link></li>
                <li><a className="text-on-surface-variant hover:text-primary hover:underline transition-all text-body-md" href="#features">Features</a></li>
              </ul>
            </div>
            <div className="space-y-4">
              <p className="text-label-caps font-label-caps uppercase text-primary">App</p>
              <ul className="space-y-2">
                <li><Link className="text-on-surface-variant hover:text-primary hover:underline transition-all text-body-md" href="/coach">AI Coach</Link></li>
                <li><Link className="text-on-surface-variant hover:text-primary hover:underline transition-all text-body-md" href="/goals">Goals</Link></li>
                <li><Link className="text-on-surface-variant hover:text-primary hover:underline transition-all text-body-md" href="/progress">Progress</Link></li>
              </ul>
            </div>
            <div className="space-y-4">
              <p className="text-label-caps font-label-caps uppercase text-primary">Account</p>
              <ul className="space-y-2">
                <li><Link className="text-on-surface-variant hover:text-primary hover:underline transition-all text-body-md" href="/settings">Settings</Link></li>
                <li><Link className="text-on-surface-variant hover:text-primary hover:underline transition-all text-body-md" href="/dashboard">Sign In</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
