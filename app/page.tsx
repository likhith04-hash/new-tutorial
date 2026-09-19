import Link from 'next/link'

const features = [
  { icon: '🍽️', title: 'Diet-aware meal plans', desc: 'Vegetarian, non-vegetarian, or vegan — get a personalized daily plan with meals that fit your preferences and calorie targets.' },
  { icon: '📊', title: 'Real-time macro tracking', desc: 'See protein, carbs, and fat update instantly as you log meals. Weekly charts show your trends at a glance.' },
  { icon: '🤖', title: 'AI nutrition coach', desc: 'Ask questions in plain language. Get answers grounded in your actual data — not generic advice.' },
  { icon: '🎯', title: 'Goal-driven targets', desc: 'Lose weight, maintain, or gain muscle. Your calorie and macro targets are calculated from your body stats and activity level.' },
  { icon: '💧', title: 'Hydration tracking', desc: 'Track water intake with a single tap. Visual progress toward your daily goal.' },
  { icon: '📈', title: 'Progress analytics', desc: 'Weight trends, weekly averages, achievement badges, and streak tracking keep you motivated.' },
]

const steps = [
  { num: '01', title: 'Sign in with GitHub or Google', desc: 'One click — no forms, no passwords to remember. Your data syncs across devices.' },
  { num: '02', title: 'Tell us about yourself', desc: 'Age, weight, height, activity level, and diet type. Takes 30 seconds.' },
  { num: '03', title: 'Get your personalized plan', desc: 'AI generates a daily meal plan matching your calorie and macro targets.' },
  { num: '04', title: 'Log meals, track progress', desc: 'Quick logging, repeat meals, and real-time dashboard keep you on track.' },
]

const stats = [
  { value: '38+', label: ' foods in database' },
  { value: '3', label: ' diet types' },
  { value: '4', label: ' macro nutrients' },
  { value: '100%', label: ' free' },
]

export default function LandingPage() {
  return (
    <main className="landing">
      <nav className="landing-nav">
        <Link href="/" className="landing-brand"><span>n</span>Nourish</Link>
        <div className="landing-links">
          <a href="#features">Features</a>
          <a href="#how-it-works">How it works</a>
          <a href="#stats">About</a>
          <Link href="/sign-in">Sign in</Link>
          <Link href="/sign-in" className="landing-button small">Get started</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="landing-hero">
        <div className="hero-copy-public">
          <p className="landing-kicker">PERSONALIZED NUTRITION, MADE SIMPLE</p>
          <h1>Your personal <em>AI nutritionist.</em></h1>
          <p>Understand what you eat, track your nutrition, and get personalized food guidance that fits your life — not a generic meal plan.</p>
          <div className="landing-ctas">
            <Link href="/sign-in" className="landing-button">Start your nutrition journey <span>→</span></Link>
            <a href="#how-it-works" className="text-cta">See how it works ↓</a>
          </div>
          <div className="trust-line">
            <b>Built for everyday eating</b>
            <span>·</span>
            <span>Indian cuisine included</span>
            <span>·</span>
            <span>Veg &amp; non-veg plans</span>
            <span>·</span>
            <span>Private by design</span>
          </div>
        </div>
        <div className="product-preview">
          <div className="preview-top">
            <span>Today&apos;s meal plan</span>
            <i>Live</i>
          </div>
          <div className="preview-score">
            <b>1,187</b>
            <span>of 2,100 kcal</span>
            <div><i /></div>
            <small>913 kcal remaining</small>
          </div>
          <div className="preview-macros">
            <span><b>75g</b> Protein</span>
            <span><b>168g</b> Carbs</span>
            <span><b>54g</b> Fat</span>
          </div>
          <div className="preview-coach">
            <strong>✦ Nourish AI</strong>
            <p>You&apos;re 55g short of protein. Want a high-protein Indian dinner?</p>
            <button>Plan dinner →</button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section id="stats" className="landing-problem" style={{ background: 'var(--clr-hero)', color: '#fff', padding: '50px 30px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24, maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
          {stats.map(s => (
            <div key={s.label}>
              <div style={{ fontSize: 36, fontWeight: 700, fontFamily: 'var(--ff-heading)' }}>{s.value}</div>
              <div style={{ fontSize: 13, opacity: 0.7, marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Problem */}
      <section className="landing-problem">
        <p className="landing-kicker">NUTRITION SHOULDN&apos;T BE A SPREADSHEET</p>
        <h2>Less guessing. More confidence at every meal.</h2>
        <p>Manual calorie tracking is exhausting, labels are confusing, and generic advice ignores the way you actually eat. Nourish turns your real habits into useful, practical next steps.</p>
      </section>

      {/* Features */}
      <section id="features" className="landing-section">
        <div>
          <p className="landing-kicker">DESIGNED AROUND YOU</p>
          <h2>Everything you need to eat smarter.</h2>
        </div>
        <div className="feature-grid">
          {features.map(f => (
            <article key={f.title}>
              <span>{f.icon}</span>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </article>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="how-it-works">
        <p className="landing-kicker">HOW IT WORKS</p>
        <h2>Four small steps. A healthier routine.</h2>
        <div>
          {steps.map(s => (
            <article key={s.num}>
              <b>{s.num}</b>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Diet types */}
      <section className="landing-section" style={{ textAlign: 'center', maxWidth: 800, margin: '0 auto' }}>
        <p className="landing-kicker">CHOOSE YOUR DIET</p>
        <h2 style={{ marginBottom: 12 }}>Plans for every way of eating.</h2>
        <p style={{ color: 'var(--clr-text-muted)', fontSize: 15, marginBottom: 32 }}>
          Whether you eat everything, avoid meat, or are fully plant-based — we generate meals that fit your lifestyle.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {[
            { emoji: '🥬', title: 'Vegetarian', items: ['Paneer & dal meals', 'Egg-based options', 'Dairy & grain focused'] },
            { emoji: '🍗', title: 'Non-Vegetarian', items: ['Chicken & fish meals', 'Egg & meat options', 'Balanced protein sources'] },
            { emoji: '🌱', title: 'Vegan', items: ['Tofu & legume meals', 'Whole grain focused', '100% plant-based'] },
          ].map(d => (
            <div key={d.title} style={{ background: '#fff', border: '1px solid var(--clr-border)', borderRadius: 14, padding: 24, textAlign: 'center' }}>
              <div style={{ fontSize: 36, marginBottom: 8 }}>{d.emoji}</div>
              <h3 style={{ fontSize: 18, marginBottom: 8 }}>{d.title}</h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {d.items.map(item => (
                  <li key={item} style={{ fontSize: 13, color: 'var(--clr-text-muted)', padding: '3px 0' }}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="landing-final">
        <p className="landing-kicker">MAKE YOUR NEXT MEAL COUNT</p>
        <h2>Food guidance that feels personal.</h2>
        <p>Sign in, tell us about yourself, and get a personalized meal plan in 30 seconds.</p>
        <Link href="/sign-in" className="landing-button">Start with Nourish <span>→</span></Link>
      </section>

      <footer className="landing-footer">
        <span>© 2026 Nourish AI</span>
        <div>
          <a href="#features">Product</a>
          <a href="/privacy">Privacy</a>
          <a href="/terms">Terms</a>
          <a href="https://github.com/likhith04-hash/new-tutorial">GitHub</a>
        </div>
      </footer>
    </main>
  )
}
