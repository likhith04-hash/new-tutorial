'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FormEvent, useState } from 'react'

export default function SignInPage() {
  const router = useRouter(); const [name, setName] = useState(''); const [email, setEmail] = useState(''); const [error, setError] = useState('')
  function submit(event: FormEvent) { event.preventDefault(); if (!name.trim() || !/^\S+@\S+\.\S+$/.test(email)) { setError('Enter your name and a valid email address.'); return }; localStorage.setItem('nourish-session', JSON.stringify({ name: name.trim(), email })); router.push('/onboarding') }
  return <main className="access-page"><Link href="/" className="landing-brand"><span>n</span>Nourish</Link><form className="access-card" onSubmit={submit}><p className="landing-kicker">WELCOME TO NOURISH</p><h1>Start your nutrition journey.</h1><p>Set up your profile in under two minutes. Your data stays on this device until you connect a secure account.</p><label>Name<input value={name} onChange={e => setName(e.target.value)} autoComplete="name" placeholder="Your name" /></label><label>Email<input value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" type="email" placeholder="you@example.com" /></label>{error && <p className="form-error" role="alert">{error}</p>}<button className="landing-button" type="submit">Continue →</button><small>By continuing, you agree to our <Link href="/terms">Terms</Link> and <Link href="/privacy">Privacy Policy</Link>.</small></form></main>
}
