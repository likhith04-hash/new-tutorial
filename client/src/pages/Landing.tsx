import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { useState } from "react";
import {
  Leaf,
  Zap,
  Activity,
  Heart,
  Bot,
  TrendingUp,
  ShieldCheck,
  Sparkles,
  Clock,
  CheckCircle,
  ChevronDown,
  Calendar,
  Mail,
  Twitter,
  Instagram,
  Linkedin,
} from "lucide-react";

/* ── Reusable sub-components ──────────────────────────────────── */

const FeatureCard = ({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl border border-gray-200/40 dark:border-gray-700/40 px-6 py-8 shadow-lg transition-all duration-300"
  >
    <div className="flex h-12 w-12 items-center justify-center bg-gradient-to-br from-green-500 to-emerald-400 rounded-xl mb-4">
      <Icon className="h-5 w-5 text-white" />
    </div>
    <h3 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">
      {title}
    </h3>
    <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
  </motion.div>
);

const StatCard = ({
  value,
  label,
}: {
  value: string;
  label: string;
}) => (
  <div className="text-center">
    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
      {value}
    </p>
    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{label}</p>
  </div>
);

const AVATAR_COLORS = [
  "bg-green-500",
  "bg-emerald-500",
  "bg-cyan-500",
  "bg-teal-500",
  "bg-lime-500",
];

const TestimonialCard = ({
  name,
  role,
  content,
  avatarIndex = 0,
}: {
  name: string;
  role: string;
  content: string;
  avatarIndex?: number;
}) => {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase();
  const color = AVATAR_COLORS[avatarIndex % AVATAR_COLORS.length];

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl border border-gray-200/40 dark:border-gray-700/40 px-6 py-8 shadow-lg transition-all duration-300"
    >
      <p className="mb-4 text-sm text-gray-600 dark:text-gray-400 italic">
        &ldquo;{content}&rdquo;
      </p>
      <div className="flex items-center space-x-3">
        <div
          className={`h-10 w-10 rounded-full flex items-center justify-center text-white text-sm font-semibold border-2 border-white/20 ${color}`}
        >
          {initials}
        </div>
        <div>
          <h4 className="font-medium text-gray-900 dark:text-gray-100">
            {name}
          </h4>
          <p className="text-sm text-gray-500 dark:text-gray-400">{role}</p>
        </div>
      </div>
    </motion.div>
  );
};

const PricingCard = ({
  name,
  price,
  features,
  isPopular,
  buttonText,
  onClick,
}: {
  name: string;
  price: number | string;
  features: string[];
  isPopular?: boolean;
  buttonText: string;
  onClick?: () => void;
}) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    className={`relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-3xl border px-6 py-10 shadow-xl transition-all duration-300 ${
      isPopular
        ? "border-green-500/50 ring-2 ring-green-500/20"
        : "border-gray-200/40 dark:border-gray-700/40"
    }`}
  >
    {isPopular && (
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-500 text-white text-xs font-semibold px-4 py-1 rounded-full">
        Most Popular
      </div>
    )}
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
        {name}
      </h3>
      <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
        ${price}
        <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
          /mo
        </span>
      </p>
      <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
        {features.map((feature, i) => (
          <li key={i} className="flex items-start space-x-2">
            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <Button
        variant={isPopular ? "default" : "outline"}
        className="w-full"
        onClick={onClick}
      >
        {buttonText}
      </Button>
    </div>
  </motion.div>
);

/* ── Landing Page ─────────────────────────────────────────────── */

export default function Landing() {
  const [, setLocation] = useLocation();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqItems = [
    {
      question: "How does Nourish AI analyze my food?",
      answer:
        "Simply take a photo of your meal, and our advanced AI models identify ingredients, estimate portion sizes, and calculate nutritional content in seconds.",
    },
    {
      question: "Is my data secure and private?",
      answer:
        "Absolutely. We use end-to-end encryption and follow strict data protection protocols. Your personal health information is never shared without explicit consent.",
    },
    {
      question: "Can I use Nourish AI for specific dietary goals?",
      answer:
        "Yes! Whether you're aiming for weight loss, muscle gain, managing diabetes, or just eating healthier, our AI adapts recommendations to your unique goals and preferences.",
    },
    {
      question: "What devices is Nourish AI available on?",
      answer:
        "Nourish AI is a responsive web app that works on any modern browser. We also offer iOS and Android apps for on-the-go tracking.",
    },
    {
      question: "Do you offer a free trial?",
      answer:
        "Yes, we provide a 7-day free trial of our premium plan so you can experience all features before committing.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-green-50/30 dark:from-gray-900 dark:to-gray-900">
      {/* ─── Navbar ─────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200/40 dark:border-gray-700/40">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Leaf className="h-6 w-6 text-green-600" />
            <span className="font-bold text-lg text-gray-900 dark:text-gray-100">
              Nourish
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-8 text-sm text-gray-600 dark:text-gray-400">
            <a
              href="#features"
              className="hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
            >
              How It Works
            </a>
            <a
              href="#pricing"
              className="hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
            >
              Pricing
            </a>
            <a
              href="#faq"
              className="hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
            >
              FAQ
            </a>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              className="hidden sm:inline-flex"
              onClick={() => setLocation("/login")}
            >
              Sign In
            </Button>
            <Button
              size="sm"
              className="bg-green-600 hover:bg-green-700 text-white"
              onClick={() => setLocation("/login")}
            >
              Get Started Free
            </Button>
          </div>
        </div>
      </nav>

      {/* ─── Hero ──────────────────────────────────────────── */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative py-20 px-6 sm:py-28 lg:py-32 overflow-hidden"
      >
        {/* Subtle background shapes */}
        <div className="absolute inset-0 -z-10 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-green-200/20 dark:bg-green-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-emerald-200/20 dark:bg-emerald-500/10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-4xl mx-auto text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-sm font-medium mb-6">
              <Sparkles className="h-4 w-4" />
              AI-Powered Nutrition Tracking
            </span>
          </motion.div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-gray-100 leading-tight">
            Eat smarter,{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-600 via-emerald-500 to-cyan-500">
              live healthier
            </span>
          </h1>

          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Transform your relationship with food through intelligent nutrition
            analysis, personalized meal planning, and science-backed insights
            &mdash; all powered by cutting-edge AI.
          </p>

          <div className="flex flex-col sm:flex-row sm:justify-center gap-4">
            <Button
              size="lg"
              className="px-8 py-3 text-base font-semibold shadow-lg hover:shadow-xl transition-shadow bg-green-600 hover:bg-green-700 text-white"
              onClick={() => setLocation("/login")}
            >
              Get Started Free
              <Zap className="ml-2 h-4 w-4" />
            </Button>
            <a href="#how-it-works">
              <Button
                variant="outline"
                size="lg"
                className="px-8 py-3 text-base font-semibold"
              >
                See How It Works
              </Button>
            </a>
          </div>

          <div className="flex flex-wrap justify-center gap-6 pt-4 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              Free forever plan
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              No credit card required
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              AI-powered insights
            </div>
          </div>
        </div>
      </motion.section>

      {/* ─── Dashboard Preview ─────────────────────────────── */}
      <section className="px-6 pb-20">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            {/* Device frame */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-3xl border border-gray-200/40 dark:border-gray-700/40 shadow-2xl overflow-hidden">
              <div className="p-6 space-y-5">
                {/* Header */}
                <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-700">
                  <h4 className="font-semibold text-gray-800 dark:text-gray-200 text-sm">
                    Today&apos;s Nutrition
                  </h4>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      8:30 AM
                    </span>
                  </div>
                </div>

                {/* Food image — branded SVG illustration */}
                <div className="rounded-xl overflow-hidden aspect-video bg-gray-50 dark:bg-gray-700">
                  <svg viewBox="0 0 400 225" className="w-full h-full" aria-hidden="true">
                    <defs>
                      <linearGradient id="bowlGrad" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#22c55e" />
                        <stop offset="100%" stopColor="#06b6d4" />
                      </linearGradient>
                      <linearGradient id="leafGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#4ade80" />
                        <stop offset="100%" stopColor="#16a34a" />
                      </linearGradient>
                    </defs>
                    {/* Background */}
                    <rect width="400" height="225" fill="#f0fdf4" rx="12" />
                    {/* Bowl */}
                    <ellipse cx="200" cy="145" rx="130" ry="60" fill="white" stroke="#e5e7eb" strokeWidth="2" />
                    <ellipse cx="200" cy="145" rx="120" ry="52" fill="#f0fdf4" />
                    {/* Food sections */}
                    <path d="M120 130 Q140 100 180 110 Q200 95 230 110 Q260 100 280 130" fill="#fb923c" opacity="0.8" />
                    <path d="M140 140 Q160 115 190 125 Q210 115 240 125 Q260 115 270 140" fill="#ef4444" opacity="0.6" />
                    <ellipse cx="175" cy="128" rx="18" ry="14" fill="#22c55e" opacity="0.7" />
                    <ellipse cx="220" cy="125" rx="15" ry="12" fill="#16a34a" opacity="0.6" />
                    <ellipse cx="200" cy="135" rx="12" ry="10" fill="#facc15" opacity="0.7" />
                    {/* Leaf accent */}
                    <path d="M310 60 Q330 40 340 50 Q330 70 310 60Z" fill="url(#leafGrad)" opacity="0.6" />
                    <path d="M320 55 Q325 45 330 50" fill="none" stroke="#15803d" strokeWidth="1" opacity="0.5" />
                    {/* Subtle sparkle dots */}
                    <circle cx="90" cy="50" r="2" fill="#22c55e" opacity="0.3" />
                    <circle cx="310" cy="80" r="2" fill="#06b6d4" opacity="0.3" />
                    <circle cx="150" cy="40" r="1.5" fill="#f59e0b" opacity="0.3" />
                    {/* Brand text */}
                    <text x="200" y="210" textAnchor="middle" fill="#9ca3af" fontSize="10" fontFamily="system-ui, sans-serif" fontWeight="500" letterSpacing="0.05em">NOURISH</text>
                  </svg>
                </div>

                {/* Stats grid */}
                <div className="grid grid-cols-2 gap-3 text-sm">
                  {[
                    { label: "Calories", value: "520 kcal" },
                    { label: "Protein", value: "28g" },
                    { label: "Carbs", value: "45g" },
                    { label: "Fat", value: "18g" },
                  ].map((s) => (
                    <div key={s.label}>
                      <p className="text-gray-500 dark:text-gray-400">
                        {s.label}
                      </p>
                      <p className="font-medium text-gray-900 dark:text-gray-100">
                        {s.value}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Micronutrient tags */}
                <div className="flex flex-wrap gap-2">
                  {["Vitamin C", "Iron", "Calcium", "Fiber"].map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Health score */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
                  <div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                      AI Health Score
                    </p>
                    <p className="text-xl font-bold text-green-600">87/100</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      +12% vs last week
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Shadow */}
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-[80%] h-8 bg-black/5 dark:bg-black/20 blur-xl rounded-full" />

            {/* Floating insight cards */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="hidden sm:block absolute -top-8 left-0 -rotate-2 w-52 bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg rounded-2xl border border-gray-200/40 dark:border-gray-700/40 p-4 shadow-lg"
            >
              <p className="text-xs text-gray-600 dark:text-gray-400 flex items-start gap-2">
                <Sparkles className="h-4 w-4 mt-0.5 text-green-400 shrink-0" />
                Your protein intake is optimal for muscle recovery
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="hidden sm:block absolute -top-10 right-0 rotate-2 w-56 bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg rounded-2xl border border-gray-200/40 dark:border-gray-700/40 p-4 shadow-lg"
            >
              <p className="text-xs text-gray-600 dark:text-gray-400 flex items-start gap-2">
                <Activity className="h-4 w-4 mt-0.5 text-emerald-400 shrink-0" />
                Try adding more leafy greens to your meals
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ─── Features ──────────────────────────────────────── */}
      <section
        id="features"
        className="py-20 px-6 bg-white/50 dark:bg-gray-800/30"
      >
        <div className="max-w-6xl mx-auto text-center space-y-12">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Everything you need to eat better
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Experience the future of nutrition tracking with seamless
              AI-powered analysis and personalized guidance.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={Zap}
              title="AI Food Recognition"
              description="Snap a photo of any meal and get instant nutritional breakdown with 95% accuracy."
            />
            <FeatureCard
              icon={Activity}
              title="Live Nutrition Analysis"
              description="Track calories, macros, vitamins, and minerals in real-time as you eat."
            />
            <FeatureCard
              icon={Bot}
              title="Personalized Meal Planning"
              description="Get AI-generated meal plans tailored to your goals, preferences, and nutritional needs."
            />
            <FeatureCard
              icon={ShieldCheck}
              title="Progress Tracking"
              description="Monitor your journey with intuitive charts, trends, and actionable insights."
            />
            <FeatureCard
              icon={Heart}
              title="AI Nutrition Coach"
              description="Chat with your personal AI nutritionist for advice, motivation, and support."
            />
            <FeatureCard
              icon={Sparkles}
              title="Smart Insights"
              description="Receive personalized recommendations based on your eating patterns and health data."
            />
          </div>
        </div>
      </section>

      {/* ─── How It Works ──────────────────────────────────── */}
      <section id="how-it-works" className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-12">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Simple as 1-2-3
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              No more guesswork. Just snap, analyze, and thrive.
            </p>
          </div>

          <div className="relative grid gap-12 sm:grid-cols-3">
            {[
              {
                icon: Bot,
                title: "Upload Food",
                desc: "Take a photo of your meal or upload an existing image.",
                color: "from-green-500 to-emerald-400",
                ring: "border-green-500/30",
              },
              {
                icon: Activity,
                title: "AI Analysis",
                desc: "Our AI analyzes ingredients, portions, and nutrients instantly.",
                color: "from-emerald-400 to-cyan-400",
                ring: "border-emerald-400/30",
              },
              {
                icon: TrendingUp,
                title: "Thrive",
                desc: "Get personalized recommendations and watch your health improve.",
                color: "from-cyan-400 to-green-500",
                ring: "border-cyan-400/30",
              },
            ].map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="flex flex-col items-center space-y-5 relative z-10"
              >
                <div className="relative w-16 h-16">
                  <div
                    className={`absolute inset-0 flex items-center justify-center bg-gradient-to-br ${step.color} rounded-full shadow-lg`}
                  >
                    <step.icon className="h-6 w-6 text-white" />
                  </div>
                  <div
                    className={`absolute inset-0 border-2 border-dashed ${step.ring} rounded-full`}
                  />
                </div>
                <span className="text-xs font-bold text-green-600 uppercase tracking-wider">
                  Step {i + 1}
                </span>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  {step.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 text-center max-w-xs">
                  {step.desc}
                </p>
              </motion.div>
            ))}

            {/* Connecting line (desktop only) */}
            <div className="hidden sm:block absolute top-8 left-[20%] right-[20%] h-px bg-gradient-to-r from-green-500/20 via-emerald-500/20 to-cyan-500/20 -z-0" />
          </div>
        </div>
      </section>

      {/* ─── Testimonials ──────────────────────────────────── */}
      <section className="py-20 px-6 bg-white/50 dark:bg-gray-800/30">
        <div className="max-w-6xl mx-auto text-center space-y-12">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Loved by health-conscious people
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Join thousands who have transformed their health with Nourish.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <TestimonialCard
              name="Sarah Chen"
              role="Registered Dietitian"
              avatarIndex={0}
              content="Nourish has revolutionized how I work with clients. The accuracy of food recognition and depth of insights saves me hours each week while providing better outcomes."
            />
            <TestimonialCard
              name="Marcus Rodriguez"
              role="Fitness Enthusiast"
              avatarIndex={1}
              content="As someone who tracks macros religiously, I was blown away by the precision. The AI suggestions have helped me break through plateaus I struggled with for months."
            />
            <TestimonialCard
              name="Priya Patel"
              role="Busy Professional"
              avatarIndex={2}
              content="Finally, a nutrition app that understands my lifestyle. The meal planning feature has made healthy eating effortless despite my hectic schedule."
            />
          </div>
        </div>
      </section>

      {/* ─── Pricing ───────────────────────────────────────── */}
      <section id="pricing" className="py-20 px-6">
        <div className="max-w-6xl mx-auto text-center space-y-12">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Choose Your Plan
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Flexible pricing for every journey. All plans include AI food
              recognition, meal planning, and progress tracking.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <PricingCard
              name="Free"
              price="0"
              features={[
                "Basic food recognition",
                "Manual meal logging",
                "Limited meal planning (3 days)",
                "Basic progress tracking",
                "Community support",
              ]}
              buttonText="Get Started Free"
              onClick={() => setLocation("/login")}
            />
            <PricingCard
              name="Premium"
              price="12"
              isPopular
              features={[
                "Advanced AI food recognition (95% accuracy)",
                "Unlimited meal logging",
                "Unlimited personalized meal planning",
                "Advanced progress analytics",
                "AI nutrition coach",
                "Exportable reports",
                "Priority support",
              ]}
              buttonText="Start Free Trial"
              onClick={() => setLocation("/login")}
            />
            <PricingCard
              name="Family"
              price="20"
              features={[
                "Everything in Premium",
                "Up to 6 family members",
                "Shared meal planning",
                "Family progress dashboard",
                "Parental controls",
                "Family challenges & rewards",
              ]}
              buttonText="Learn More"
              onClick={() => setLocation("/login")}
            />
          </div>
        </div>
      </section>

      {/* ─── FAQ ───────────────────────────────────────────── */}
      <section
        id="faq"
        className="py-20 px-6 bg-white/50 dark:bg-gray-800/30"
      >
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-2">
            {faqItems.map((item, i) => (
              <div
                key={i}
                className="border border-gray-200/60 dark:border-gray-700/40 rounded-xl overflow-hidden bg-white/60 dark:bg-gray-800/60"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="flex items-center justify-between w-full px-6 py-4 text-left"
                >
                  <span className="font-medium text-gray-900 dark:text-gray-100 pr-4">
                    {item.question}
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
                    exit={{ height: 0, opacity: 0 }}
                    className="px-6 pb-4 text-sm text-gray-600 dark:text-gray-400 leading-relaxed"
                  >
                    {item.answer}
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA Banner ────────────────────────────────────── */}
      <section className="py-20 px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center space-y-6 bg-gradient-to-br from-green-600 to-emerald-500 rounded-3xl px-8 py-16 shadow-xl"
        >
          <h2 className="text-3xl font-bold text-white">
            Ready to transform your nutrition?
          </h2>
          <p className="text-green-100 text-lg max-w-xl mx-auto">
            Join thousands of health-conscious people who are eating smarter
            with AI-powered insights.
          </p>
          <Button
            size="lg"
            className="px-8 py-3 text-base font-semibold bg-white text-green-700 hover:bg-green-50 shadow-lg"
            onClick={() => setLocation("/login")}
          >
            Get Started Free
            <Zap className="ml-2 h-4 w-4" />
          </Button>
        </motion.div>
      </section>

      {/* ─── Footer ────────────────────────────────────────── */}
      <footer className="border-t border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {/* Brand */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Leaf className="h-6 w-6 text-green-600" />
                <span className="font-bold text-lg text-gray-900 dark:text-gray-100">
                  Nourish
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Transforming nutrition through intelligent AI, one meal at a
                time.
              </p>
              <div className="flex gap-3">
                {[Twitter, Instagram, Linkedin, Mail].map((Icon, i) => (
                  <a
                    key={i}
                    href="#"
                    className="h-9 w-9 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>

            {/* Product */}
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Product
              </h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                {["Features", "Pricing", "Blog", "Docs"].map((link) => (
                  <li key={link}>
                    <a href="#" className="hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Company
              </h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                {["About", "Careers", "Press", "Partners"].map((link) => (
                  <li key={link}>
                    <a href="#" className="hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Legal
              </h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                {["Privacy Policy", "Terms of Service", "Contact Us"].map(
                  (link) => (
                    <li key={link}>
                      <a href="#" className="hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
                        {link}
                      </a>
                    </li>
                  ),
                )}
              </ul>
            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-gray-200 dark:border-gray-700">
            <p className="text-center text-sm text-gray-500 dark:text-gray-400">
              &copy; {new Date().getFullYear()} Nourish AI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
