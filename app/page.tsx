"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

/**
 * Nourish — Landing Page
 */

const INK = "#1E241B";
const CANVAS = "#F5F7F1";
const CLAY = "#C2472E"; // protein
const GOLD = "#D9A441"; // carbs
const OLIVE = "#55704F"; // fat
const WATER = "#3E6E8E"; // hydration
const LINE = "#DAD5C4";

function NourishFactsPanel() {
  const rows = [
    { label: "Protein", detail: "Tracked to the gram", dot: CLAY },
    { label: "Carbs", detail: "Balanced automatically", dot: GOLD },
    { label: "Fat", detail: "Never eyeballed again", dot: OLIVE },
    { label: "Hydration", detail: "8 glasses, gently reminded", dot: WATER },
  ];

  return (
    <div
      className="w-full max-w-sm border-[3px] bg-white px-6 py-5 sm:px-7 sm:py-6"
      style={{ borderColor: INK, color: INK }}
    >
      <p className="font-condensed text-3xl font-black uppercase tracking-tight">
        Nourish Facts
      </p>
      <div className="mt-2 border-b-8" style={{ borderColor: INK }} />

      <div className="flex items-baseline justify-between border-b py-2 text-sm" style={{ borderColor: LINE }}>
        <span>Serving Size</span>
        <span className="font-mono">1 day</span>
      </div>

      <div className="flex items-baseline justify-between border-b-4 py-2" style={{ borderColor: INK }}>
        <span className="font-condensed text-2xl font-black">Calories Tracked</span>
        <span className="font-mono text-lg">Automatically</span>
      </div>

      <div className="flex items-baseline justify-between border-b py-2 text-sm" style={{ borderColor: LINE }}>
        <span>Meals Logged</span>
        <span className="font-mono">In seconds</span>
      </div>
      <div className="flex items-baseline justify-between border-b-4 py-2" style={{ borderColor: INK }}>
        <span>AI Coaching</span>
        <span className="font-mono">On demand</span>
      </div>

      <p className="pt-3 text-xs font-bold uppercase tracking-wide" style={{ color: INK }}>
        Macros Balanced
      </p>
      <div className="mt-1 space-y-2">
        {rows.map((r) => (
          <div
            key={r.label}
            className="flex items-center justify-between border-b py-1.5 pl-3 text-sm"
            style={{ borderColor: LINE }}
          >
            <span className="flex items-center gap-2">
              <span
                className="inline-block h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: r.dot }}
              />
              {r.label}
            </span>
            <span className="font-mono text-xs text-neutral-500">{r.detail}</span>
          </div>
        ))}
      </div>

      <p className="mt-4 text-[11px] italic leading-snug text-neutral-500">
        *Percent goals are based on your personal targets, not a one-size-fits-all
        daily value.
      </p>
    </div>
  );
}

function Logo({ dark = false }) {
  return (
    <div className="flex items-center gap-2">
      <div
        className="flex h-8 w-8 items-center justify-center rounded-md font-condensed text-lg font-black"
        style={{ backgroundColor: INK, color: CANVAS }}
      >
        n
      </div>
      <span
        className="font-condensed text-lg font-black tracking-tight"
        style={{ color: dark ? CANVAS : INK }}
      >
        Nourish
      </span>
    </div>
  );
}

function Step({ number, title, children }: { number: string; title: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-5">
      <span
        className="font-condensed shrink-0 text-5xl font-black leading-none"
        style={{ color: LINE }}
      >
        {number}
      </span>
      <div>
        <h3 className="font-condensed text-xl font-bold" style={{ color: INK }}>
          {title}
        </h3>
        <p className="mt-1.5 max-w-sm text-[15px] leading-relaxed text-neutral-600">
          {children}
        </p>
      </div>
    </div>
  );
}

function FeatureCard({ accent, eyebrow, title, children }: { accent: string; eyebrow: string; title: string; children: React.ReactNode }) {
  return (
    <div
      className="border bg-white p-6 transition-shadow hover:shadow-[4px_4px_0_0_var(--tw-shadow-color)]"
      style={{ borderColor: LINE, "--tw-shadow-color": accent } as React.CSSProperties}
    >
      <div className="mb-4 h-1.5 w-10" style={{ backgroundColor: accent }} />
      <p
        className="text-xs font-bold uppercase tracking-wide"
        style={{ color: accent }}
      >
        {eyebrow}
      </p>
      <h3 className="font-condensed mt-1 text-xl font-bold" style={{ color: INK }}>
        {title}
      </h3>
      <p className="mt-2 text-[15px] leading-relaxed text-neutral-600">{children}</p>
    </div>
  );
}

export default function NourishLandingPage() {
  const [email, setEmail] = useState("");
  const router = useRouter();

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/dashboard");
  };

  return (
    <div style={{ backgroundColor: CANVAS, color: INK }} className="min-h-screen">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700;800;900&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');
        .font-condensed { font-family: 'Barlow Condensed', system-ui, sans-serif; }
        body, .font-body { font-family: 'IBM Plex Sans', system-ui, sans-serif; }
        .font-mono { font-family: 'IBM Plex Mono', ui-monospace, monospace; }
        @media (prefers-reduced-motion: reduce) {
          * { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
        }
      `}</style>

      <div className="font-body">
        {/* Nav */}
        <header className="sticky top-0 z-20 border-b backdrop-blur" style={{ borderColor: LINE, backgroundColor: `${CANVAS}E6` }}>
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
            <Logo />
            <nav className="hidden items-center gap-8 text-sm font-medium sm:flex">
              <a href="#how-it-works" className="hover:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4" style={{ outlineColor: INK }}>
                How it works
              </a>
              <a href="#features" className="hover:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4" style={{ outlineColor: INK }}>
                Features
              </a>
              <a href="#coach" className="hover:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4" style={{ outlineColor: INK }}>
                AI coach
              </a>
            </nav>
            <div className="flex items-center gap-3">
              <Link
                href="/dashboard"
                className="rounded-md px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                style={{ backgroundColor: INK, outlineColor: INK }}
              >
                Open App
              </Link>
            </div>
          </div>
        </header>

        {/* Hero */}
        <section className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-14 px-6 py-16 sm:py-24 lg:grid-cols-2">
          <div>
            <p
              className="text-xs font-bold uppercase tracking-[0.15em]"
              style={{ color: CLAY }}
            >
              AI nutrition coaching
            </p>
            <h1 className="font-condensed mt-3 text-5xl font-black leading-[0.95] tracking-tight sm:text-6xl">
              Track less.
              <br />
              Know more.
            </h1>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-neutral-600">
              Nourish turns every meal, glass of water, and walk into a clear
              picture of how you&apos;re actually doing — no spreadsheets, no
              guesswork, no judgment.
            </p>
            <form onSubmit={handleStart} className="mt-8 flex flex-col gap-3 sm:flex-row" id="get-started">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                aria-label="Email address"
                className="rounded-md border bg-white px-4 py-3 text-sm outline-none focus:ring-2"
                style={{ borderColor: LINE }}
              />
              <button
                type="submit"
                className="rounded-md px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                style={{ backgroundColor: INK, outlineColor: INK }}
              >
                Start tracking free
              </button>
            </form>
            <p className="mt-3 text-xs text-neutral-500">
              Free plan available. No credit card required.
            </p>
          </div>

          <div className="flex justify-center lg:justify-end">
            <NourishFactsPanel />
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="border-t px-6 py-20" style={{ borderColor: LINE }}>
          <div className="mx-auto max-w-6xl">
            <h2 className="font-condensed text-3xl font-black sm:text-4xl">
              Three steps. Every day.
            </h2>
            <div className="mt-12 grid grid-cols-1 gap-10 sm:grid-cols-3">
              <Step number="01" title="Log in seconds">
                Snap a photo or search a meal. Nourish estimates calories and
                macros instantly — you just confirm.
              </Step>
              <Step number="02" title="Get AI insights">
                Your coach reads the patterns in what you eat and tells you
                what actually matters, in plain language.
              </Step>
              <Step number="03" title="Build the habit">
                Streaks, hydration, and weekly trends keep you honest —
                without the guilt.
              </Step>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="border-t px-6 py-20" style={{ borderColor: LINE, backgroundColor: "#FBFAF6" }}>
          <div className="mx-auto max-w-6xl">
            <h2 className="font-condensed text-3xl font-black sm:text-4xl">
              Everything on your plate, accounted for.
            </h2>
            <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <FeatureCard accent={CLAY} eyebrow="Logging" title="Smart food logging">
                Search, scan, or snap a photo. Meals you eat often log again
                in one tap.
              </FeatureCard>
              <FeatureCard accent={GOLD} eyebrow="Macros" title="Calorie & macro tracking">
                Protein, carbs, and fat, tracked against targets that adjust
                to your goal.
              </FeatureCard>
              <FeatureCard accent={WATER} eyebrow="Hydration" title="Hydration tracking">
                A simple daily glass counter that nudges you before you fall
                behind.
              </FeatureCard>
              <FeatureCard accent={OLIVE} eyebrow="Coaching" title="AI nutrition coach">
                Ask what to eat for dinner or whether you&apos;re getting enough
                protein — get a real answer, not a generic tip.
              </FeatureCard>
              <FeatureCard accent={CLAY} eyebrow="Progress" title="Trends & streaks">
                Weekly calorie and weight trends, plus badges for the habits
                you&apos;re building.
              </FeatureCard>
              <FeatureCard accent={GOLD} eyebrow="Goals" title="Goals that adapt">
                Set out to lose, maintain, or gain — your targets and coaching
                shift with you.
              </FeatureCard>
            </div>
          </div>
        </section>

        {/* AI coach preview */}
        <section id="coach" className="border-t px-6 py-20" style={{ borderColor: LINE }}>
          <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-14 lg:grid-cols-2">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.15em]" style={{ color: OLIVE }}>
                AI coach
              </p>
              <h2 className="font-condensed mt-3 text-3xl font-black sm:text-4xl">
                Ask it anything.
                <br />
                It already knows your day.
              </h2>
              <p className="mt-5 max-w-md text-[15px] leading-relaxed text-neutral-600">
                Your coach sees what you&apos;ve logged, what&apos;s left in your
                targets, and what your week has looked like — so its answers
                are about your day, not a generic diet plan.
              </p>
            </div>

            <div
              className="w-full max-w-md space-y-3 border bg-white p-5"
              style={{ borderColor: LINE }}
            >
              <div className="flex justify-end">
                <div
                  className="max-w-[80%] rounded-2xl rounded-tr-sm px-4 py-2.5 text-sm text-white"
                  style={{ backgroundColor: INK }}
                >
                  What should I eat for dinner?
                </div>
              </div>
              <div className="flex justify-start">
                <div
                  className="max-w-[85%] rounded-2xl rounded-tl-sm border px-4 py-2.5 text-sm leading-relaxed"
                  style={{ borderColor: LINE }}
                >
                  You&apos;ve got 913 kcal and 55g protein left today. A
                  tandoori-style bowl with rice and a side of dal would land
                  right in range.
                </div>
              </div>
              <div className="flex justify-end">
                <div
                  className="max-w-[80%] rounded-2xl rounded-tr-sm px-4 py-2.5 text-sm text-white"
                  style={{ backgroundColor: INK }}
                >
                  Am I getting enough protein this week?
                </div>
              </div>
              <div className="flex justify-start">
                <div
                  className="max-w-[85%] rounded-2xl rounded-tl-sm border px-4 py-2.5 text-sm leading-relaxed"
                  style={{ borderColor: LINE }}
                >
                  Yes — up 15% from last week. Wednesday was your strongest
                  day.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="px-6 py-24 text-center" style={{ backgroundColor: INK, color: CANVAS }}>
          <h2 className="font-condensed mx-auto max-w-2xl text-4xl font-black leading-tight sm:text-5xl">
            Your next meal is a data point.
            <br />
            Make it count.
          </h2>
          <Link
            href="/dashboard"
            className="mt-8 inline-block rounded-md px-8 py-3.5 text-sm font-semibold transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4"
            style={{ backgroundColor: CANVAS, color: INK, outlineColor: CANVAS }}
          >
            Start tracking free
          </Link>
        </section>

        {/* Footer */}
        <footer className="border-t px-6 py-10" style={{ borderColor: LINE }}>
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-sm text-neutral-500 sm:flex-row">
            <Logo />
            <p>© {new Date().getFullYear()} Nourish. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
