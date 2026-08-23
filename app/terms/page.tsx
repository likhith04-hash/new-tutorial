import Link from 'next/link'

export default function TermsPage() {
  return <main className="legal-page"><Link href="/" className="landing-brand"><span>n</span>Nourish</Link><article><p className="landing-kicker">TERMS</p><h1>Use Nourish as a guide, not a diagnosis.</h1><p>Nourish estimates nutrition from user-provided information and, when enabled, AI-generated suggestions. Estimates can be wrong and should be reviewed before relying on them.</p><p>The product is not medical advice and is not a substitute for a qualified health professional, particularly for medical conditions, allergies, pregnancy, or eating disorders.</p><p>By using Nourish, you agree to provide accurate information and use its guidance responsibly.</p></article></main>
}
