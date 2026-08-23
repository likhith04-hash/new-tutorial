import Link from 'next/link'

export default function PrivacyPage() {
  return <main className="legal-page"><Link href="/" className="landing-brand"><span>n</span>Nourish</Link><article><p className="landing-kicker">PRIVACY</p><h1>Your nutrition data is yours.</h1><p>Nourish stores local-first tracking data in your browser during this version of the product. AI requests are sent only when you choose to ask the coach or analyze a meal, and are processed by the configured server-side provider.</p><p>Do not enter emergency or highly sensitive medical information. Nourish provides general nutrition guidance, not medical advice.</p><p>When account-backed storage is introduced, this policy will be updated to describe retention, deletion, and export controls.</p></article></main>
}
