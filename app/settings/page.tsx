'use client'

import { useState, useEffect } from 'react'
import Header from '@/app/components/Header'
import Icon from '@/app/components/Icon'
import { useNutrition } from '@/app/components/NutritionContext'

export default function SettingsPage() {
  const { profile, updateProfile, clearAllData, meals, waterLogs, weightEntries, goals } = useNutrition()
  const [local, setLocal] = useState(profile)
  const [newAllergy, setNewAllergy] = useState('')

  useEffect(() => { setLocal(profile) }, [profile])

  const save = () => updateProfile(local)

  const setText = (field: string, value: string) => {
    setLocal(prev => ({ ...prev, [field]: value }))
  }
  const setNum = (field: string, value: string) => {
    setLocal(prev => ({ ...prev, [field]: Number(value) || 0 }))
  }

  const addAllergy = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newAllergy.trim()) {
      e.preventDefault()
      setLocal(prev => ({ ...prev, allergies: [...prev.allergies, newAllergy.trim()] }))
      setNewAllergy('')
    }
  }

  const removeAllergy = (a: string) => {
    setLocal(prev => ({ ...prev, allergies: prev.allergies.filter(x => x !== a) }))
  }

  const toggleNotif = (key: keyof typeof local.notifications) => {
    const updated = { ...local, notifications: { ...local.notifications, [key]: !local.notifications[key] } }
    setLocal(updated)
    updateProfile(updated)
  }

  const handleExport = () => {
    const data = JSON.stringify({ profile, meals, waterLogs, weightEntries, goals }, null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'nourish-ai-data.json'; a.click()
    URL.revokeObjectURL(url)
  }

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset ALL your data? This cannot be undone.')) {
      clearAllData()
    }
  }

  return (
    <>
      <Header />
      <div className="settings-page">

        {/* Profile */}
        <div className="settings-section">
          <h3 className="section-title">Profile</h3>
          <div className="settings-profile-header">
            <div className="avatar">{local.initials}</div>
            <div>
              <b>{local.name}</b>
              <small>{local.email}</small>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="settings-name" className="form-label">Name</label>
              <input id="settings-name" className="form-input" value={local.name} onChange={e => setText('name', e.target.value)} onBlur={save} />
            </div>
            <div className="form-group">
              <label htmlFor="settings-email" className="form-label">Email</label>
              <input id="settings-email" className="form-input" type="email" value={local.email} onChange={e => setText('email', e.target.value)} onBlur={save} />
            </div>
          </div>
          <div className="form-row-3">
            <div className="form-group">
              <label htmlFor="settings-height" className="form-label">Height (cm)</label>
              <input id="settings-height" className="form-input" type="number" value={local.heightCm} onChange={e => setNum('heightCm', e.target.value)} onBlur={save} />
            </div>
            <div className="form-group">
              <label htmlFor="settings-weight" className="form-label">Weight (kg)</label>
              <input id="settings-weight" className="form-input" type="number" value={local.weightKg} onChange={e => setNum('weightKg', e.target.value)} onBlur={save} />
            </div>
            <div className="form-group">
              <label htmlFor="settings-target-weight" className="form-label">Target Weight (kg)</label>
              <input id="settings-target-weight" className="form-input" type="number" value={local.targetWeightKg} onChange={e => setNum('targetWeightKg', e.target.value)} onBlur={save} />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="settings-allergies" className="form-label">Allergies & Restrictions</label>
            <div className="tags">
              {local.allergies.map(a => (
                <span key={a} className="tag">{a}<button className="tag-remove" onClick={() => removeAllergy(a)}>×</button></span>
              ))}
            </div>
            <input id="settings-allergies" className="tag-input" placeholder="Type and press Enter…" value={newAllergy} onChange={e => setNewAllergy(e.target.value)} onKeyDown={addAllergy} onBlur={save} />
          </div>
        </div>

        {/* Subscription Plan & Upsell */}
        <div className="settings-section" style={{ background: local.plan.includes('Pro') ? 'linear-gradient(135deg, #e8f5e9, #c8e6c9)' : 'linear-gradient(135deg, #faf6f0, #f4ebe1)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div>
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: 'var(--clr-brand-hover)' }}>SUBSCRIPTION PLAN</span>
              <h3 style={{ margin: '2px 0 0', font: '700 20px var(--ff-heading)' }}>
                {local.plan} {local.plan.includes('Pro') ? '✦ Active' : ''}
              </h3>
            </div>
            {!local.plan.includes('Pro') && (
              <span style={{ background: 'var(--clr-hero-accent)', color: '#fff', fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 12 }}>
                PRO FEATURE
              </span>
            )}
          </div>

          {!local.plan.includes('Pro') ? (
            <div>
              <p style={{ fontSize: 13, color: 'var(--clr-text-soft)', marginBottom: 14, lineHeight: 1.5 }}>
                Upgrade to <b>Nourish Pro</b> ($9.99/mo) for unlimited AI Photo Food Scanning, proactive AI coaching, and deep micronutrient analytics.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: 12, marginBottom: 16 }}>
                <div>✨ Unlimited AI Photo Scanning</div>
                <div>🤖 24/7 Proactive AI Coach</div>
                <div>📊 Micronutrient Tracking</div>
                <div>⚡ Personalized Meal Plans</div>
              </div>
              <button
                className="add full"
                onClick={() => {
                  const updated = { ...local, plan: 'Pro Plan' }
                  setLocal(updated)
                  updateProfile(updated)
                }}
              >
                <Icon name="sparkle" size={16} /> Upgrade to Nourish Pro ($9.99/mo)
              </button>
            </div>
          ) : (
            <div>
              <p style={{ fontSize: 13, color: 'var(--clr-text-soft)', marginBottom: 12 }}>
                You have full access to all AI features, unlimited photo food scanning, and proactive coaching.
              </p>
              <button
                style={{ fontSize: 12, background: 'none', border: '1px solid var(--clr-border)', padding: '6px 12px', borderRadius: 6, cursor: 'pointer' }}
                onClick={() => {
                  const updated = { ...local, plan: 'Free plan' }
                  setLocal(updated)
                  updateProfile(updated)
                }}
              >
                Manage Subscription
              </button>
            </div>
          )}
        </div>

        {/* Preferences */}
        <div className="settings-section">
          <h3 className="section-title">Preferences</h3>
          <div className="form-group">
            <label className="form-label">Units</label>
            <div className="option-toggle">
              <button className={local.units === 'metric' ? 'active' : ''} onClick={() => { setText('units', 'metric'); save() }}>Metric</button>
              <button className={local.units === 'imperial' ? 'active' : ''} onClick={() => { setText('units', 'imperial'); save() }}>Imperial</button>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Theme</label>
            <div className="option-toggle">
              <button className={local.theme === 'light' ? 'active' : ''} onClick={() => { setText('theme', 'light'); save() }}>
                <Icon name="sun" size={14} /> Light
              </button>
              <button className={local.theme === 'dark' ? 'active' : ''} onClick={() => { setText('theme', 'dark'); save() }}>
                <Icon name="moon" size={14} /> Dark
              </button>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="settings-section">
          <h3 className="section-title">Notifications</h3>
          <div className="toggle-row">
            <span>Meal reminders</span>
            <label className="toggle-switch">
              <input type="checkbox" checked={local.notifications.mealReminders} onChange={() => toggleNotif('mealReminders')} />
              <span className="toggle-slider" />
            </label>
          </div>
          <div className="toggle-row">
            <span>Water reminders</span>
            <label className="toggle-switch">
              <input type="checkbox" checked={local.notifications.waterReminders} onChange={() => toggleNotif('waterReminders')} />
              <span className="toggle-slider" />
            </label>
          </div>
          <div className="toggle-row">
            <span>Weekly report</span>
            <label className="toggle-switch">
              <input type="checkbox" checked={local.notifications.weeklyReport} onChange={() => toggleNotif('weeklyReport')} />
              <span className="toggle-slider" />
            </label>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="danger-zone">
          <h3 className="section-title">Data Management</h3>
          <button className="danger-btn" onClick={handleExport}>
            <Icon name="download" size={16} /> Export data
          </button>
          <button className="danger-btn red" onClick={handleReset}>
            <Icon name="trash" size={16} /> Reset all data
          </button>
        </div>

        {/* About */}
        <div className="about-section">
          <b>Nourish AI</b>
          <p>Version 0.1.0</p>
          <p>Built with Next.js & love ✦</p>
        </div>
      </div>
    </>
  )
}
