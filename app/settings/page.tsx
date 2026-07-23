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
            <div><b>{local.name}</b><small>{local.email}</small></div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Name</label>
              <input className="form-input" value={local.name} onChange={e => setText('name', e.target.value)} onBlur={save} />
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input className="form-input" type="email" value={local.email} onChange={e => setText('email', e.target.value)} onBlur={save} />
            </div>
          </div>
          <div className="form-row-3">
            <div className="form-group">
              <label className="form-label">Height (cm)</label>
              <input className="form-input" type="number" value={local.heightCm} onChange={e => setNum('heightCm', e.target.value)} onBlur={save} />
            </div>
            <div className="form-group">
              <label className="form-label">Weight (kg)</label>
              <input className="form-input" type="number" value={local.weightKg} onChange={e => setNum('weightKg', e.target.value)} onBlur={save} />
            </div>
            <div className="form-group">
              <label className="form-label">Target Weight (kg)</label>
              <input className="form-input" type="number" value={local.targetWeightKg} onChange={e => setNum('targetWeightKg', e.target.value)} onBlur={save} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Allergies & Restrictions</label>
            <div className="tags">
              {local.allergies.map(a => (
                <span key={a} className="tag">{a}<button className="tag-remove" onClick={() => removeAllergy(a)}>×</button></span>
              ))}
            </div>
            <input className="tag-input" placeholder="Type and press Enter…" value={newAllergy} onChange={e => setNewAllergy(e.target.value)} onKeyDown={addAllergy} onBlur={save} />
          </div>
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
