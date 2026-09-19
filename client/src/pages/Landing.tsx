import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { useState } from "react";
import {
  Leaf,
  Camera,
  BarChart3,
  Bot,
  Target,
  Droplets,
  Shield,
  Zap,
  ArrowRight,
  CheckCircle,
  ChevronDown,
  Apple,
  TrendingUp,
  Star,
} from "lucide-react";

/* ────────────────────────────────────────────────────────────────
   ANIMATION HELPERS
   ──────────────────────────────────────────────────────────────── */

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
  }),
};

const stagger = {
  visible: { transition: { staggerChildren: 0.05 } },
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6 } },
};

/* ────────────────────────────────────────────────────────────────
   DATA
   ──────────────────────────────────────────────────────────────── */

const features = [
  {
    icon: Camera,
    title: "Food Diary",
    desc: "Log every meal in seconds. Breakfast, lunch, dinner, snacks — all organized, all tracked.",
  },
  {
    icon: Bot,
    title: "AI Coach",
    desc: "A personalized AI that learns your goals and gives real-time meal suggestions and accountability.",
  },
  {
    icon: BarChart3,
    title: "Visual Progress",
    desc: "Weight trends, macro balance, calorie history — interactive charts that make progress obvious.",
  },
  {
    icon: Target,
    title: "Custom Goals",
    desc: "Set your own calorie, protein, carbs, fat, and hydration targets. On your terms.",
  },
  {
    icon: Droplets,
    title: "Hydration Tracking",
    desc: "One-tap glass logging to hit your daily water intake target.",
  },
  {
    icon: Shield,
    title: "Private & Secure",
    desc: "Encrypted storage, no data selling, full control over your information.",
  },
];

const steps = [
  {
    num: "01",
    title: "Create your profile",
    desc: "Sign up and tell us your goals. We build your personalized dashboard in seconds.",
  },
  {
    num: "02",
    title: "Log your meals",
    desc: "Quick manual entry or AI food logger. Every calorie and macro tracked automatically.",
  },
  {
    num: "03",
    title: "Hit your goals",
    desc: "Your AI coach tells you exactly what to eat, when, and why — so you improve every week.",
  },
];

const stats = [
  { value: "10s", label: "Average log time" },
  { value: "6", label: "Nutrients tracked" },
  { value: "24/7", label: "AI coach availability" },
  { value: "100%", label: "Your data, private" },
];

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Registered Dietitian",
    text: "The cleanest nutrition tracker I've used. My clients love how fast they can log meals, and the AI coach gives genuinely useful advice — not generic tips.",
    initials: "SC",
  },
  {
    name: "Marcus Rodriguez",
    role: "Fitness Enthusiast",
    text: "I've tried every macro tracker out there. Nourish is the first one that doesn't feel like homework. I log meals in 10 seconds and the AI keeps me accountable.",
    initials: "MR",
  },
  {
    name: "Priya Patel",
    role: "Busy Professional",
    text: "Between work and kids, I never had time for meal planning. Nourish's AI coach does it all — and the suggestions are things my family actually enjoys eating.",
    initials: "PP",
  },
];

const faqs = [
  {
    q: "How does AI food recognition work?",
    a: "Take a photo of your meal and our vision AI identifies ingredients, estimates portions, and calculates calories, macros, vitamins, and minerals in under 3 seconds. It improves over time as you log.",
  },
  {
    q: "Is my health data private?",
    a: "Absolutely. All data is encrypted at rest and in transit. We follow HIPAA-aligned practices and never sell or share personal health information. You can export or delete your data at any time.",
  },
  {
    q: "Can I use Nourish for specific dietary goals?",
    a: "Yes. Whether you're losing weight, building muscle, managing a medical condition, or just eating cleaner, Nourish adapts its AI coach, insights, and recommendations to your unique profile.",
  },
  {
    q: "What's included in the free plan?",
    a: "Unlimited manual meal logging, basic AI food recognition, progress charts, and community access. No credit card required. Premium adds advanced AI coaching and detailed micronutrient tracking.",
  },
  {
    q: "Do I need any special hardware?",
    a: "No. Nourish works in any modern browser on your phone, tablet, or desktop. Just use your device's camera to snap photos of meals.",
  },
];

/* ────────────────────────────────────────────────────────────────
   COMPONENTS
   ──────────────────────────────────────────────────────────────── */

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center px-3 py-1 rounded-full border border-gray-200 text-[11px] font-medium tracking-widest uppercase text-gray-500">
      {children}
    </span>
  );
}

function FaqItem({
  item,
  index,
  isOpen,
  toggle,
}: {
  item: (typeof faqs)[0];
  index: number;
  isOpen: boolean;
  toggle: () => void;
}) {
  return (
    <motion.div variants={fadeUp} custom={index} className="border-b border-gray-100 last:border-0">
      <button
        onClick={toggle}
        className="flex w-full items-center justify-between py-5 text-left"
      >
        <span className="text-sm font-medium text-gray-900 pr-4">{item.q}</span>
        <ChevronDown
          className={`h-4 w-4 text-gray-400 shrink-0 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-sm text-gray-500 leading-relaxed">
              {item.a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ────────────────────────────────────────────────────────────────
   LANDING PAGE
   ──────────────────────────────────────────────────────────────── */

export default function Landing() {
  const [, setLocation] = useLocation();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-white text-gray-900 selection:bg-green-200">
      {/* ═══════════════════════════════════════════════════════════
          NAVBAR
          ═══════════════════════════════════════════════════════════ */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-white/70 backdrop-blur-xl border-b border-gray-100/80">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-gray-900 flex items-center justify-center">
              <Leaf className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="font-semibold text-sm tracking-tight">Nourish</span>
          </a>

          <div className="hidden md:flex items-center gap-8 text-[13px] font-medium text-gray-500">
            <a href="#features" className="hover:text-gray-900 transition-colors">
              Features
            </a>
            <a href="#how" className="hover:text-gray-900 transition-colors">
              How it works
            </a>
            <a href="#testimonials" className="hover:text-gray-900 transition-colors">
              Testimonials
            </a>
            <a href="#faq" className="hover:text-gray-900 transition-colors">
              FAQ
            </a>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="hidden sm:inline-flex text-[13px] font-medium h-8"
              onClick={() => setLocation("/login")}
            >
              Sign in
            </Button>
            <Button
              size="sm"
              className="h-8 px-4 text-[13px] font-medium bg-gray-900 hover:bg-gray-800 text-white rounded-lg"
              onClick={() => setLocation("/login")}
            >
              Get started
            </Button>
          </div>
        </div>
      </nav>

      {/* ═══════════════════════════════════════════════════════════
          HERO
          ═══════════════════════════════════════════════════════════ */}
      <section className="relative pt-32 pb-20 sm:pt-44 sm:pb-32">
        {/* Subtle gradient background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-green-50/80 via-emerald-50/40 to-transparent blur-3xl rounded-full" />
        </div>

        <div className="max-w-6xl mx-auto px-6 text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="max-w-3xl mx-auto space-y-6"
          >
            <motion.div variants={fadeUp}>
              <SectionLabel>AI-powered nutrition</SectionLabel>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="text-5xl sm:text-6xl lg:text-[72px] font-bold tracking-[-0.03em] leading-[1.05]"
            >
              Track every bite.
              <br />
              <span className="text-gray-400">Nail your nutrition.</span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="text-lg text-gray-500 max-w-xl mx-auto leading-relaxed"
            >
              The nutrition tracker that actually works. Log meals in seconds,
              get AI-powered insights, and hit your goals without the busywork.
            </motion.p>

            <motion.div
              variants={fadeUp}
              className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2"
            >
              <Button
                size="lg"
                className="h-11 px-6 text-[14px] font-medium bg-gray-900 hover:bg-gray-800 text-white rounded-xl shadow-sm"
                onClick={() => setLocation("/login")}
              >
                Start tracking free
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </Button>
              <a href="#how">
                <Button
                  variant="outline"
                  size="lg"
                  className="h-11 px-6 text-[14px] font-medium rounded-xl border-gray-200"
                >
                  See how it works
                </Button>
              </a>
            </motion.div>

            <motion.div
              variants={fadeUp}
              className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 pt-2 text-[13px] text-gray-400"
            >
              {["No credit card", "Free forever", "Cancel anytime"].map((t) => (
                <span key={t} className="flex items-center gap-1.5">
                  <CheckCircle className="h-3.5 w-3.5 text-green-500" />
                  {t}
                </span>
              ))}
            </motion.div>
          </motion.div>

          {/* ── Product Screenshot ──────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
            className="mt-16 sm:mt-20 max-w-4xl mx-auto"
          >
            <div className="relative">
              {/* Subtle glow */}
              <div className="absolute -inset-4 bg-gradient-to-b from-green-200/20 via-emerald-100/10 to-transparent blur-2xl rounded-3xl" />

              <div className="relative bg-white rounded-2xl border border-gray-200/80 shadow-2xl shadow-gray-900/[0.04] overflow-hidden">
                {/* Browser chrome */}
                <div className="flex items-center gap-2 px-4 py-3 bg-gray-50/80 border-b border-gray-100">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-gray-300" />
                    <div className="w-2.5 h-2.5 rounded-full bg-gray-300" />
                    <div className="w-2.5 h-2.5 rounded-full bg-gray-300" />
                  </div>
                  <div className="flex-1 flex justify-center">
                    <div className="px-4 py-1 rounded-md bg-white border border-gray-200 text-[11px] text-gray-400 font-mono">
                      nourish.app/dashboard
                    </div>
                  </div>
                </div>

                {/* Dashboard UI */}
                <div className="p-6 sm:p-8">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Left: Calorie overview */}
                    <div className="lg:col-span-5 space-y-5">
                      <div>
                        <p className="text-[13px] text-gray-400">Good morning</p>
                        <p className="text-lg font-semibold tracking-tight">Today's overview</p>
                      </div>

                      {/* Calorie ring */}
                      <div className="flex items-center gap-6">
                        <div className="relative w-28 h-28 shrink-0">
                          <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                            <circle
                              cx="18" cy="18" r="15.915"
                              fill="none" stroke="#f3f4f6" strokeWidth="3"
                            />
                            <circle
                              cx="18" cy="18" r="15.915"
                              fill="none" stroke="#22c55e" strokeWidth="3"
                              strokeDasharray="72 100"
                              strokeLinecap="round"
                            />
                          </svg>
                          <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-xl font-bold">1,420</span>
                            <span className="text-[10px] text-gray-400">/ 2,000 kcal</span>
                          </div>
                        </div>

                        <div className="flex-1 space-y-3">
                          {[
                            { label: "Protein", val: "85g / 150g", pct: 57, color: "bg-gray-900" },
                            { label: "Carbs", val: "165g / 200g", pct: 83, color: "bg-gray-500" },
                            { label: "Fat", val: "48g / 65g", pct: 74, color: "bg-gray-400" },
                          ].map((m) => (
                            <div key={m.label}>
                              <div className="flex justify-between text-[11px] mb-1">
                                <span className="text-gray-500">{m.label}</span>
                                <span className="font-medium text-gray-700">{m.val}</span>
                              </div>
                              <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full ${m.color}`}
                                  style={{ width: `${m.pct}%` }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Right: AI insight + stats */}
                    <div className="lg:col-span-7 space-y-5">
                      {/* AI insight card */}
                      <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex items-start gap-3">
                        <div className="h-7 w-7 rounded-lg bg-green-100 flex items-center justify-center shrink-0">
                          <Bot className="h-3.5 w-3.5 text-green-600" />
                        </div>
                        <div>
                          <p className="text-[11px] font-medium text-gray-900 mb-0.5">AI Coach</p>
                          <p className="text-[13px] text-gray-500 leading-relaxed">
                            You're 65g short on protein today. A grilled chicken breast or protein shake
                            before dinner would get you on track.
                          </p>
                        </div>
                      </div>

                      {/* Stats row */}
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          { icon: Droplets, label: "Water", value: "1.5L / 2L" },
                          { icon: Apple, label: "Meals", value: "3 logged" },
                          { icon: TrendingUp, label: "Streak", value: "7 days" },
                        ].map((s) => (
                          <div key={s.label} className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                            <s.icon className="h-3.5 w-3.5 text-gray-400 mb-2" />
                            <p className="text-[11px] text-gray-400 mb-0.5">{s.label}</p>
                            <p className="text-[13px] font-semibold">{s.value}</p>
                          </div>
                        ))}
                      </div>

                      {/* Today's meals */}
                      <div className="space-y-2">
                        {[
                          { time: "8:15 AM", name: "Oatmeal with berries", cal: "320 kcal" },
                          { time: "12:30 PM", name: "Grilled chicken salad", cal: "480 kcal" },
                          { time: "3:45 PM", name: "Greek yogurt + almonds", cal: "210 kcal" },
                        ].map((m) => (
                          <div
                            key={m.name}
                            className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-[11px] text-gray-400 w-16">{m.time}</span>
                              <span className="text-[13px] font-medium">{m.name}</span>
                            </div>
                            <span className="text-[12px] text-gray-500">{m.cal}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          LOGOS / TRUST BAR
          ═══════════════════════════════════════════════════════════ */}
      <section className="py-12 border-y border-gray-100">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-2 sm:grid-cols-4 gap-8"
          >
            {stats.map((s, i) => (
              <motion.div key={s.label} variants={fadeUp} custom={i} className="text-center">
                <p className="text-2xl sm:text-3xl font-bold tracking-tight">{s.value}</p>
                <p className="mt-1 text-[13px] text-gray-500">{s.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          FEATURES
          ═══════════════════════════════════════════════════════════ */}
      <section id="features" className="py-28 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
            className="text-center space-y-4 max-w-2xl mx-auto mb-16"
          >
            <motion.div variants={fadeUp}>
              <SectionLabel>Features</SectionLabel>
            </motion.div>
            <motion.h2
              variants={fadeUp}
              className="text-3xl sm:text-4xl font-bold tracking-[-0.02em]"
            >
              Everything you need to eat smarter
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="text-gray-500 text-[15px] leading-relaxed"
            >
              A complete nutrition toolkit — from meal logging to AI coaching.
              Nothing bloated. Nothing confusing.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-gray-100 rounded-2xl overflow-hidden"
          >
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                variants={fadeUp}
                custom={i}
                className="bg-white p-7 group hover:bg-gray-50/80 transition-colors duration-200"
              >
                <div className="h-9 w-9 rounded-lg bg-gray-100 flex items-center justify-center mb-4 group-hover:bg-gray-900 transition-colors duration-200">
                  <f.icon className="h-4 w-4 text-gray-600 group-hover:text-white transition-colors duration-200" />
                </div>
                <h3 className="text-[15px] font-semibold mb-1.5">{f.title}</h3>
                <p className="text-[13px] text-gray-500 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          HOW IT WORKS
          ═══════════════════════════════════════════════════════════ */}
      <section id="how" className="py-28 px-6 bg-gray-50/60 border-y border-gray-100">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
            className="text-center space-y-4 max-w-2xl mx-auto mb-16"
          >
            <motion.div variants={fadeUp}>
              <SectionLabel>How it works</SectionLabel>
            </motion.div>
            <motion.h2
              variants={fadeUp}
              className="text-3xl sm:text-4xl font-bold tracking-[-0.02em]"
            >
              Three steps. That's it.
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="text-gray-500 text-[15px] leading-relaxed"
            >
              No complex setup. No learning curve. Start seeing results
              immediately.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid lg:grid-cols-3 gap-12 lg:gap-16"
          >
            {steps.map((s, i) => (
              <motion.div
                key={s.num}
                variants={fadeUp}
                custom={i}
                className="relative"
              >
                {/* Connector line (desktop only) */}
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-6 left-[calc(50%+40px)] w-[calc(100%-40px)] h-px bg-gray-200" />
                )}

                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gray-900 text-white text-[13px] font-bold mb-5">
                    {s.num}
                  </div>
                  <h3 className="text-[15px] font-semibold mb-2">{s.title}</h3>
                  <p className="text-[13px] text-gray-500 leading-relaxed max-w-[280px] mx-auto">
                    {s.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          TESTIMONIALS
          ═══════════════════════════════════════════════════════════ */}
      <section id="testimonials" className="py-28 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
            className="text-center space-y-4 max-w-2xl mx-auto mb-16"
          >
            <motion.div variants={fadeUp}>
              <SectionLabel>Testimonials</SectionLabel>
            </motion.div>
            <motion.h2
              variants={fadeUp}
              className="text-3xl sm:text-4xl font-bold tracking-[-0.02em]"
            >
              Loved by people who care about food
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-gray-100 rounded-2xl overflow-hidden"
          >
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                variants={fadeUp}
                custom={i}
                className="bg-white p-7"
              >
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star
                      key={j}
                      className="h-3.5 w-3.5 fill-gray-900 text-gray-900"
                    />
                  ))}
                </div>
                <p className="text-[13px] text-gray-600 leading-relaxed mb-6">
                  "{t.text}"
                </p>
                <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                  <div className="h-8 w-8 rounded-full bg-gray-900 flex items-center justify-center text-white text-[11px] font-bold">
                    {t.initials}
                  </div>
                  <div>
                    <p className="text-[13px] font-medium">{t.name}</p>
                    <p className="text-[11px] text-gray-500">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          FAQ
          ═══════════════════════════════════════════════════════════ */}
      <section id="faq" className="py-28 px-6 bg-gray-50/60 border-y border-gray-100">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
            className="text-center space-y-4 mb-12"
          >
            <motion.div variants={fadeUp}>
              <SectionLabel>FAQ</SectionLabel>
            </motion.div>
            <motion.h2
              variants={fadeUp}
              className="text-3xl sm:text-4xl font-bold tracking-[-0.02em]"
            >
              Frequently asked questions
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <div className="border-t border-gray-200">
              {faqs.map((faq, i) => (
                <FaqItem
                  key={i}
                  item={faq}
                  index={i}
                  isOpen={openFaq === i}
                  toggle={() => setOpenFaq(openFaq === i ? null : i)}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          FINAL CTA
          ═══════════════════════════════════════════════════════════ */}
      <section className="py-28 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto relative overflow-hidden rounded-2xl bg-gray-900 px-8 py-20 sm:px-16 text-center"
        >
          {/* Subtle gradient accents */}
          <div className="absolute top-0 left-1/3 w-64 h-64 bg-green-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/3 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl" />

          <div className="relative z-10 space-y-5">
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-[-0.02em]">
              Start eating smarter today
            </h2>
            <p className="text-gray-400 text-[15px] max-w-md mx-auto leading-relaxed">
              Join people building healthier habits with AI-powered nutrition tracking.
            </p>
            <div className="pt-2">
              <Button
                size="lg"
                className="h-11 px-6 text-[14px] font-medium bg-white text-gray-900 hover:bg-gray-100 rounded-xl"
                onClick={() => setLocation("/login")}
              >
                Get started free
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </Button>
            </div>
            <p className="text-[13px] text-gray-500">No credit card required</p>
          </div>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          FOOTER
          ═══════════════════════════════════════════════════════════ */}
      <footer className="border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-md bg-gray-900 flex items-center justify-center">
                <Leaf className="h-3 w-3 text-white" />
              </div>
              <span className="text-[13px] font-semibold">Nourish</span>
            </div>

            <div className="flex items-center gap-6 text-[13px] text-gray-500">
              <a href="#features" className="hover:text-gray-900 transition-colors">
                Features
              </a>
              <a href="#how" className="hover:text-gray-900 transition-colors">
                How it works
              </a>
              <a href="#faq" className="hover:text-gray-900 transition-colors">
                FAQ
              </a>
              <a href="#" className="hover:text-gray-900 transition-colors">
                Privacy
              </a>
              <a href="#" className="hover:text-gray-900 transition-colors">
                Terms
              </a>
            </div>

            <p className="text-[13px] text-gray-400">
              © {new Date().getFullYear()} Nourish
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
