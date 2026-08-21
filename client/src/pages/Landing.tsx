import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { useState, useRef } from "react";
import {
  Leaf,
  Zap,
  Camera,
  Activity,
  Bot,
  TrendingUp,
  ShieldCheck,
  Sparkles,
  Clock,
  CheckCircle,
  ChevronDown,
  ArrowRight,
  BarChart3,
  Target,
  MessageCircle,
  Apple,
  Timer,
  Trophy,
  Star,
  Quote,
} from "lucide-react";

/* ────────────────────────────────────────────────────────────────
   ANIMATION VARIANTS
   ──────────────────────────────────────────────────────────────── */

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" },
  }),
};

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
};

/* ────────────────────────────────────────────────────────────────
   REUSABLE COMPONENTS
   ──────────────────────────────────────────────────────────────── */

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs font-semibold tracking-wide uppercase">
      {children}
    </span>
  );
}

function SectionHeading({
  badge,
  title,
  subtitle,
}: {
  badge?: string;
  title: string;
  subtitle: string;
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={stagger}
      className="text-center space-y-4 max-w-3xl mx-auto"
    >
      {badge && (
        <motion.div variants={fadeUp}>
          <Badge>{badge}</Badge>
        </motion.div>
      )}
      <motion.h2
        variants={fadeUp}
        className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-50 tracking-tight"
      >
        {title}
      </motion.h2>
      <motion.p
        variants={fadeUp}
        className="text-lg text-gray-500 dark:text-gray-400 leading-relaxed"
      >
        {subtitle}
      </motion.p>
    </motion.div>
  );
}

/* ────────────────────────────────────────────────────────────────
   LANDING PAGE
   ──────────────────────────────────────────────────────────────── */

export default function Landing() {
  const [, setLocation] = useLocation();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const faqItems = [
    {
      q: "How does the AI food recognition work?",
      a: "Take a photo of your meal and our vision AI identifies every ingredient, estimates portion sizes, and calculates calories, macros, vitamins, and minerals in under 3 seconds. It learns from your logging habits to improve accuracy over time.",
    },
    {
      q: "Is my health data private and secure?",
      a: "Absolutely. All data is encrypted at rest and in transit. We follow HIPAA-aligned practices and never sell or share personal health information. You can export or delete your data at any time.",
    },
    {
      q: "Can I use Nourish for specific dietary goals?",
      a: "Yes. Whether you're losing weight, building muscle, managing a medical condition, or just eating cleaner, Nourish adapts its AI coach, meal plans, and insights to your unique profile and goals.",
    },
    {
      q: "What's included in the free plan?",
      a: "The free plan gives you unlimited manual meal logging, basic AI food recognition, a 3-day meal planner, progress charts, and community access. No credit card required.",
    },
    {
      q: "Do I need any special hardware?",
      a: "No. Nourish works in any modern browser on your phone, tablet, or desktop. Just use your device's camera to snap photos of meals — no special scanners or wearables needed.",
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 selection:bg-green-200 dark:selection:bg-green-800">
      {/* ═══════════════════════════════════════════════════════════
          NAVBAR
          ═══════════════════════════════════════════════════════════ */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-white/70 dark:bg-gray-950/70 backdrop-blur-xl border-b border-gray-100 dark:border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2.5 group">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-400 flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
              <Leaf className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-lg text-gray-900 dark:text-gray-50 tracking-tight">
              Nourish
            </span>
          </a>

          <div className="hidden md:flex items-center gap-1 text-sm font-medium text-gray-600 dark:text-gray-400">
            {[
              ["Features", "#features"],
              ["How It Works", "#how"],
              ["Pricing", "#pricing"],
              ["FAQ", "#faq"],
            ].map(([label, href]) => (
              <a
                key={href}
                href={href}
                className="px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-gray-50 transition-colors"
              >
                {label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="hidden sm:inline-flex font-medium"
              onClick={() => setLocation("/login")}
            >
              Sign in
            </Button>
            <Button
              size="sm"
              className="bg-green-600 hover:bg-green-700 text-white font-medium shadow-sm"
              onClick={() => setLocation("/login")}
            >
              Get Started
              <ArrowRight className="ml-1 h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </nav>

      {/* ═══════════════════════════════════════════════════════════
          HERO
          ═══════════════════════════════════════════════════════════ */}
      <section ref={heroRef} className="relative pt-32 pb-20 sm:pt-40 sm:pb-28 overflow-hidden">
        {/* Background mesh gradient */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-green-100/60 dark:bg-green-900/20 blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-100/40 dark:bg-emerald-900/15 blur-[100px]" />
          <div className="absolute top-[20%] right-[20%] w-[30%] h-[30%] rounded-full bg-cyan-100/30 dark:bg-cyan-900/10 blur-[80px]" />
          {/* Grid overlay */}
          <div
            className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(0,0,0,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,.1) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />
        </div>

        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="max-w-7xl mx-auto px-6"
        >
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Badge>
                <Sparkles className="h-3 w-3" />
                Powered by AI
              </Badge>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-gray-50 tracking-tight leading-[1.1]"
            >
              Your AI-powered
              <br />
              <span className="bg-gradient-to-r from-green-600 via-emerald-500 to-teal-500 bg-clip-text text-transparent">
                nutrition coach
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-lg sm:text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed"
            >
              Snap a photo of any meal. Get instant calorie, macro, and micronutrient
              breakdowns. Chat with an AI coach that knows your goals inside out.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-3"
            >
              <Button
                size="lg"
                className="h-12 px-8 text-base font-semibold bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-600/25 hover:shadow-green-600/40 transition-all"
                onClick={() => setLocation("/login")}
              >
                Start for Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <a href="#how">
                <Button variant="outline" size="lg" className="h-12 px-8 text-base font-semibold">
                  See How It Works
                </Button>
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-gray-400 dark:text-gray-500"
            >
              {["No credit card required", "Free forever plan", "Cancel anytime"].map(
                (t) => (
                  <span key={t} className="flex items-center gap-1.5">
                    <CheckCircle className="h-3.5 w-3.5 text-green-500" />
                    {t}
                  </span>
                ),
              )}
            </motion.div>
          </div>

          {/* ── Hero Visual: Phone Mockup ──────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
            className="relative mt-16 max-w-lg mx-auto"
          >
            {/* Glow behind phone */}
            <div className="absolute inset-0 bg-gradient-to-b from-green-400/20 to-emerald-400/10 blur-3xl rounded-full scale-150" />

            {/* Phone frame */}
            <div className="relative mx-auto w-[280px] sm:w-[300px]">
              <div className="relative bg-gray-900 rounded-[2.5rem] p-2 shadow-2xl">
                {/* Notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-7 bg-gray-900 rounded-b-2xl z-10" />
                {/* Screen */}
                <div className="relative bg-white dark:bg-gray-800 rounded-[2rem] overflow-hidden aspect-[9/19.5]">
                  {/* Status bar */}
                  <div className="flex items-center justify-between px-6 pt-8 pb-2">
                    <span className="text-[10px] font-semibold text-gray-900">9:41</span>
                    <div className="flex gap-1">
                      <div className="w-3 h-2 bg-gray-900 rounded-sm" />
                      <div className="w-1 h-2 bg-gray-900 rounded-sm" />
                    </div>
                  </div>

                  {/* App header */}
                  <div className="px-5 pt-2 pb-3">
                    <p className="text-[10px] text-gray-400">Good morning</p>
                    <p className="text-sm font-bold text-gray-900 dark:text-gray-100">
                      Today&apos;s Nutrition
                    </p>
                  </div>

                  {/* Calorie ring */}
                  <div className="flex justify-center py-3">
                    <div className="relative w-24 h-24">
                      <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                        <circle
                          cx="18" cy="18" r="15.915"
                          fill="none" stroke="#f0fdf4" strokeWidth="2.5"
                        />
                        <circle
                          cx="18" cy="18" r="15.915"
                          fill="none" stroke="#22c55e" strokeWidth="2.5"
                          strokeDasharray="75 100"
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-lg font-bold text-gray-900 dark:text-gray-100">1,420</span>
                        <span className="text-[8px] text-gray-400">/ 2,000 kcal</span>
                      </div>
                    </div>
                  </div>

                  {/* Macro bars */}
                  <div className="px-5 space-y-2.5">
                    {[
                      { label: "Protein", val: "85g", pct: 72, color: "bg-green-500" },
                      { label: "Carbs", val: "165g", pct: 65, color: "bg-emerald-400" },
                      { label: "Fat", val: "48g", pct: 55, color: "bg-teal-400" },
                    ].map((m) => (
                      <div key={m.label}>
                        <div className="flex justify-between text-[9px] mb-0.5">
                          <span className="text-gray-500">{m.label}</span>
                          <span className="font-medium text-gray-700 dark:text-gray-300">{m.val}</span>
                        </div>
                        <div className="h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${m.color}`}
                            style={{ width: `${m.pct}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* AI insight pill */}
                  <div className="mx-5 mt-4 p-2.5 bg-green-50 dark:bg-green-900/20 rounded-xl flex items-start gap-2">
                    <Bot className="h-3.5 w-3.5 text-green-600 mt-0.5 shrink-0" />
                    <p className="text-[9px] text-green-700 dark:text-green-300 leading-snug">
                      You&apos;re 15g short on protein today. A Greek yogurt snack would hit your target.
                    </p>
                  </div>

                  {/* Bottom nav */}
                  <div className="absolute bottom-0 inset-x-0 flex items-center justify-around py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur border-t border-gray-100 dark:border-gray-700">
                    {[
                      { icon: BarChart3, active: true },
                      { icon: Camera, active: false },
                      { icon: MessageCircle, active: false },
                      { icon: Target, active: false },
                    ].map(({ icon: I, active }, i) => (
                      <div
                        key={i}
                        className={`p-1.5 rounded-lg ${active ? "text-green-600" : "text-gray-300"}`}
                      >
                        <I className="h-4 w-4" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Floating cards */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.0, duration: 0.5 }}
              className="hidden sm:block absolute top-16 -left-16 lg:-left-24"
            >
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl shadow-black/5 dark:shadow-black/20 border border-gray-100 dark:border-white/5 p-3 w-44">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-6 w-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                    <TrendingUp className="h-3 w-3 text-green-600" />
                  </div>
                  <span className="text-[10px] font-semibold text-gray-900 dark:text-gray-100">Weekly Trend</span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  You&apos;ve hit your protein goal <span className="font-semibold text-green-600">5 days in a row</span>. Keep it up!
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.2, duration: 0.5 }}
              className="hidden sm:block absolute top-32 -right-12 lg:-right-20"
            >
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl shadow-black/5 dark:shadow-black/20 border border-gray-100 dark:border-white/5 p-3 w-44">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-6 w-6 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                    <Trophy className="h-3 w-3 text-amber-600" />
                  </div>
                  <span className="text-[10px] font-semibold text-gray-900 dark:text-gray-100">Achievement</span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  🎉 <span className="font-semibold text-amber-600">Hydration Hero</span> unlocked! 7-day streak.
                </p>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          METRICS BAR
          ═══════════════════════════════════════════════════════════ */}
      <section className="border-y border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-2 sm:grid-cols-4 gap-8"
          >
            {[
              { value: "50K+", label: "Meals logged" },
              { value: "95%", label: "Recognition accuracy" },
              { value: "4.9", label: "App Store rating", icon: Star },
              { value: "12 min", label: "Avg. daily time saved", icon: Timer },
            ].map((s, i) => (
              <motion.div key={s.label} variants={fadeUp} custom={i} className="text-center">
                <div className="flex items-center justify-center gap-1">
                  {"icon" in s && s.icon && <s.icon className="h-4 w-4 text-amber-400" />}
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-50">
                    {s.value}
                  </p>
                </div>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{s.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          FEATURES — BENTO GRID
          ═══════════════════════════════════════════════════════════ */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-7xl mx-auto space-y-16">
          <SectionHeading
            badge="Features"
            title="Everything you need, nothing you don't"
            subtitle="A complete nutrition platform powered by AI — from photo recognition to personalized coaching."
          />

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {/* Large card — spans 2 cols */}
            <motion.div
              variants={fadeUp}
              custom={0}
              className="sm:col-span-2 lg:col-span-2 relative overflow-hidden rounded-3xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/40 dark:to-emerald-950/30 border border-green-100 dark:border-green-900/30 p-8 lg:p-10"
            >
              <div className="relative z-10 max-w-md">
                <div className="h-10 w-10 rounded-xl bg-green-600 flex items-center justify-center mb-5 shadow-lg shadow-green-600/25">
                  <Camera className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-50 mb-2">
                  Snap & Identify
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  Point your camera at any meal — home-cooked, restaurant, or packaged.
                  Our vision AI identifies every ingredient, estimates portions, and delivers
                  a full nutritional breakdown in seconds.
                </p>
              </div>
              {/* Decorative illustration */}
              <div className="absolute right-0 bottom-0 w-48 h-48 opacity-20 dark:opacity-10">
                <svg viewBox="0 0 200 200" fill="none">
                  <circle cx="100" cy="100" r="80" stroke="#22c55e" strokeWidth="2" strokeDasharray="8 4" />
                  <circle cx="100" cy="100" r="50" stroke="#10b981" strokeWidth="1.5" strokeDasharray="6 3" />
                  <circle cx="100" cy="100" r="20" fill="#22c55e" opacity="0.3" />
                  <path d="M100 30 L100 20 M100 170 L100 180 M30 100 L20 100 M170 100 L180 100" stroke="#22c55e" strokeWidth="1.5" />
                </svg>
              </div>
            </motion.div>

            {/* Normal cards */}
            {[
              {
                icon: Bot,
                title: "AI Nutrition Coach",
                desc: "Chat 1-on-1 with an AI that knows your goals, allergies, and preferences. Get meal suggestions, motivation, and real-time adjustments.",
                delay: 1,
              },
              {
                icon: BarChart3,
                title: "Visual Progress",
                desc: "Interactive charts show your calorie trends, macro balance, weight trajectory, and hydration streaks — all in one glance.",
                delay: 2,
              },
              {
                icon: Apple,
                title: "Smart Food Database",
                desc: "25,000+ foods with verified nutrition data. Search by name, barcode, or photo. Your custom foods sync across devices.",
                delay: 3,
              },
              {
                icon: ShieldCheck,
                title: "Privacy First",
                desc: "End-to-end encryption, HIPAA-aligned storage, and full data export. Your health data stays yours — always.",
                delay: 4,
              },
              {
                icon: Zap,
                title: "Instant Logging",
                desc: "Log meals in under 5 seconds with quick-repeat, voice input, or photo scan. No more tedious manual entry.",
                delay: 5,
              },
            ].map((f) => (
              <motion.div
                key={f.title}
                variants={fadeUp}
                custom={f.delay}
                className="group relative rounded-3xl bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-white/5 p-7 hover:bg-white dark:hover:bg-gray-800/50 hover:shadow-xl hover:shadow-black/5 dark:hover:shadow-black/20 transition-all duration-300"
              >
                <div className="h-10 w-10 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4 group-hover:bg-green-600 group-hover:shadow-lg group-hover:shadow-green-600/25 transition-all duration-300">
                  <f.icon className="h-5 w-5 text-green-600 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-base font-bold text-gray-900 dark:text-gray-50 mb-2">
                  {f.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                  {f.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          HOW IT WORKS
          ═══════════════════════════════════════════════════════════ */}
      <section id="how" className="py-24 px-6 bg-gray-50/50 dark:bg-gray-900/30">
        <div className="max-w-5xl mx-auto space-y-16">
          <SectionHeading
            badge="How It Works"
            title="Three steps to smarter eating"
            subtitle="No complex setup. No learning curve. Just results."
          />

          <div className="relative">
            {/* Connecting line */}
            <div className="hidden lg:block absolute top-16 left-[calc(16.67%+2rem)] right-[calc(16.67%+2rem)] h-px bg-gradient-to-r from-green-200 via-green-400 to-green-200 dark:from-green-800 dark:via-green-600 dark:to-green-800" />

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={stagger}
              className="grid lg:grid-cols-3 gap-12 lg:gap-8"
            >
              {[
                {
                  step: "01",
                  icon: Camera,
                  title: "Snap a Photo",
                  desc: "Open the app and take a picture of your meal. It works with any food — homemade, restaurant, or packaged.",
                },
                {
                  step: "02",
                  icon: Zap,
                  title: "Get Instant Analysis",
                  desc: "Our AI identifies every ingredient, calculates calories, macros, and micros, and scores your meal's nutrition quality.",
                },
                {
                  step: "03",
                  icon: TrendingUp,
                  title: "Track & Improve",
                  desc: "Watch your trends over time. Your AI coach suggests adjustments, celebrates wins, and keeps you on track.",
                },
              ].map((s, i) => (
                <motion.div
                  key={s.step}
                  variants={fadeUp}
                  custom={i}
                  className="relative text-center"
                >
                  <div className="relative mx-auto w-16 h-16 mb-6">
                    <div className="absolute inset-0 bg-green-600 rounded-2xl rotate-3 group-hover:rotate-6 transition-transform" />
                    <div className="relative h-full bg-gradient-to-br from-green-500 to-emerald-400 rounded-2xl flex items-center justify-center shadow-xl shadow-green-600/20">
                      <s.icon className="h-7 w-7 text-white" />
                    </div>
                  </div>
                  <span className="inline-block text-xs font-bold text-green-600 dark:text-green-400 tracking-widest mb-2">
                    STEP {s.step}
                  </span>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-gray-50 mb-2">
                    {s.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed max-w-xs mx-auto">
                    {s.desc}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          TESTIMONIALS
          ═══════════════════════════════════════════════════════════ */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto space-y-16">
          <SectionHeading
            badge="Testimonials"
            title="Loved by health-conscious people"
            subtitle="Real results from real users who transformed their relationship with food."
          />

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4"
          >
            {[
              {
                name: "Sarah Chen",
                role: "Registered Dietitian",
                text: "Nourish has completely changed how I work with clients. The photo recognition is shockingly accurate, and the AI insights help me give better, faster recommendations.",
                rating: 5,
                color: "bg-green-500",
                featured: true,
              },
              {
                name: "Marcus Rodriguez",
                role: "Fitness Enthusiast",
                text: "I've tried every macro tracker out there. Nourish is the first one that actually works without me spending 10 minutes per meal logging. The AI coach is like having a nutritionist in my pocket.",
                rating: 5,
                color: "bg-emerald-500",
                featured: false,
              },
              {
                name: "Priya Patel",
                role: "Busy Professional",
                text: "Between work and kids, I never had time to plan meals. Nourish's AI meal planner does it all — and the suggestions are actually things my family enjoys eating.",
                rating: 5,
                color: "bg-cyan-500",
                featured: false,
              },
              {
                name: "James Okonkwo",
                role: "Marathon Runner",
                text: "The hydration tracking and electrolyte breakdowns are game-changers for endurance training. I've shaved 8 minutes off my half-marathon since using Nourish.",
                rating: 5,
                color: "bg-teal-500",
                featured: false,
              },
              {
                name: "Emily Nakamura",
                role: "Yoga Instructor",
                text: "I recommend Nourish to all my students. It's the most intuitive nutrition app I've used — and the progress charts are gorgeous. Finally an app that doesn't feel like homework.",
                rating: 5,
                color: "bg-lime-500",
                featured: false,
              },
              {
                name: "David Kim",
                role: "Software Engineer",
                text: "As a developer, I appreciate the clean UX and fast performance. But what really sold me was the AI coach — it actually understands context and gives actionable advice, not generic tips.",
                rating: 5,
                color: "bg-green-600",
                featured: false,
              },
            ].map((t, i) => {
              const initials = t.name
                .split(" ")
                .map((w) => w[0])
                .join("");
              return (
                <motion.div
                  key={t.name}
                  variants={fadeUp}
                  custom={i}
                  className={`break-inside-avoid rounded-2xl border p-6 transition-all duration-300 hover:shadow-lg ${
                    t.featured
                      ? "bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/20 border-green-200 dark:border-green-800/30"
                      : "bg-white dark:bg-gray-900/50 border-gray-100 dark:border-white/5"
                  }`}
                >
                  {/* Stars */}
                  <div className="flex gap-0.5 mb-3">
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <Star
                        key={j}
                        className="h-3.5 w-3.5 fill-amber-400 text-amber-400"
                      />
                    ))}
                  </div>

                  <Quote className="h-4 w-4 text-gray-300 dark:text-gray-600 mb-2" />

                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                    {t.text}
                  </p>

                  <div className="flex items-center gap-3 pt-3 border-t border-gray-100 dark:border-white/5">
                    <div
                      className={`h-9 w-9 rounded-full ${t.color} flex items-center justify-center text-white text-xs font-bold`}
                    >
                      {initials}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                        {t.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {t.role}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          PRICING
          ═══════════════════════════════════════════════════════════ */}
      <section id="pricing" className="py-24 px-6 bg-gray-50/50 dark:bg-gray-900/30">
        <div className="max-w-6xl mx-auto space-y-16">
          <SectionHeading
            badge="Pricing"
            title="Simple, transparent pricing"
            subtitle="Start free. Upgrade when you're ready. No surprises."
          />

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto"
          >
            {[
              {
                name: "Free",
                price: "0",
                desc: "Perfect for getting started",
                features: [
                  "Unlimited manual meal logging",
                  "Basic AI food recognition",
                  "3-day meal planner",
                  "Progress charts & trends",
                  "Community access",
                ],
                cta: "Get Started Free",
                popular: false,
              },
              {
                name: "Pro",
                price: "9",
                desc: "For serious health optimizers",
                features: [
                  "Everything in Free",
                  "Unlimited AI food recognition",
                  "Full meal planner & recipes",
                  "AI nutrition coach (unlimited)",
                  "Advanced analytics & reports",
                  "Priority support",
                  "Export data (CSV, PDF)",
                ],
                cta: "Start 14-Day Trial",
                popular: true,
              },
              {
                name: "Family",
                price: "15",
                desc: "Healthy eating for the whole household",
                features: [
                  "Everything in Pro",
                  "Up to 6 family members",
                  "Shared meal plans & grocery lists",
                  "Family progress dashboard",
                  "Kid-friendly meal suggestions",
                  "Admin controls",
                ],
                cta: "Start 14-Day Trial",
                popular: false,
              },
            ].map((plan, i) => (
              <motion.div
                key={plan.name}
                variants={fadeUp}
                custom={i}
                className={`relative rounded-3xl p-8 transition-all duration-300 hover:shadow-xl ${
                  plan.popular
                    ? "bg-white dark:bg-gray-800 border-2 border-green-500 shadow-xl shadow-green-600/10 dark:shadow-green-600/5"
                    : "bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-white/5"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-green-600 text-white text-[11px] font-bold px-4 py-1 rounded-full shadow-lg shadow-green-600/30">
                    Most Popular
                  </div>
                )}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-gray-50">
                      {plan.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {plan.desc}
                    </p>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-gray-900 dark:text-gray-50">
                      ${plan.price}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      /month
                    </span>
                  </div>
                  <ul className="space-y-2.5">
                    {plan.features.map((f) => (
                      <li
                        key={f}
                        className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400"
                      >
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Button
                    variant={plan.popular ? "default" : "outline"}
                    className={`w-full h-11 font-semibold ${
                      plan.popular
                        ? "bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-600/25"
                        : ""
                    }`}
                    onClick={() => setLocation("/login")}
                  >
                    {plan.cta}
                  </Button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          FAQ
          ═══════════════════════════════════════════════════════════ */}
      <section id="faq" className="py-24 px-6">
        <div className="max-w-3xl mx-auto space-y-12">
          <SectionHeading
            badge="FAQ"
            title="Frequently asked questions"
            subtitle="Can't find what you're looking for? Email us at support@nourish.ai"
          />

          <div className="space-y-3">
            {faqItems.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className={`rounded-2xl border transition-colors ${
                  openFaq === i
                    ? "bg-green-50/50 dark:bg-green-950/20 border-green-200 dark:border-green-800/30"
                    : "bg-gray-50 dark:bg-gray-900/50 border-gray-100 dark:border-white/5"
                }`}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="flex items-center justify-between w-full px-6 py-5 text-left"
                >
                  <span className="font-semibold text-gray-900 dark:text-gray-50 pr-4 text-sm sm:text-base">
                    {item.q}
                  </span>
                  <ChevronDown
                    className={`h-5 w-5 text-gray-400 shrink-0 transition-transform duration-200 ${
                      openFaq === i ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openFaq === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    className="px-6 pb-5 text-sm text-gray-600 dark:text-gray-400 leading-relaxed"
                  >
                    {item.a}
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          FINAL CTA
          ═══════════════════════════════════════════════════════════ */}
      <section className="py-24 px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-8 py-20 sm:px-16 text-center"
        >
          {/* Background accents */}
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-green-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl" />

          <div className="relative z-10 space-y-6">
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Start eating smarter today
            </h2>
            <p className="text-gray-400 text-lg max-w-xl mx-auto leading-relaxed">
              Join 50,000+ people who are building healthier habits with
              AI-powered nutrition insights.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Button
                size="lg"
                className="h-12 px-8 text-base font-semibold bg-green-600 hover:bg-green-500 text-white shadow-lg shadow-green-600/30"
                onClick={() => setLocation("/login")}
              >
                Get Started Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <p className="text-sm text-gray-500">No credit card required</p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          FOOTER
          ═══════════════════════════════════════════════════════════ */}
      <footer className="border-t border-gray-100 dark:border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-10">
            {/* Brand */}
            <div className="col-span-2 sm:col-span-4 lg:col-span-1 space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-400 flex items-center justify-center">
                  <Leaf className="h-4 w-4 text-white" />
                </div>
                <span className="font-bold text-lg text-gray-900 dark:text-gray-50">
                  Nourish
                </span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed max-w-xs">
                Your AI-powered nutrition coach. Eat smarter, live healthier.
              </p>
            </div>

            {/* Links */}
            {[
              {
                title: "Product",
                links: ["Features", "Pricing", "Changelog", "API"],
              },
              {
                title: "Company",
                links: ["About", "Blog", "Careers", "Press"],
              },
              {
                title: "Resources",
                links: ["Documentation", "Help Center", "Community", "Status"],
              },
              {
                title: "Legal",
                links: ["Privacy", "Terms", "Cookies", "Contact"],
              },
            ].map((col) => (
              <div key={col.title}>
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-sm mb-4">
                  {col.title}
                </h4>
                <ul className="space-y-2.5">
                  {col.links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-12 pt-8 border-t border-gray-100 dark:border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-400 dark:text-gray-500">
              &copy; {new Date().getFullYear()} Nourish AI. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              {["Twitter", "GitHub", "LinkedIn"].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  {social}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
