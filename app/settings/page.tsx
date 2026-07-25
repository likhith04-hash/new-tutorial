'use client'

import { useState, useEffect } from 'react'
import Header from '@/app/components/Header'
import Icon from '@/app/components/Icon'
import { useNutrition } from '@/app/components/NutritionContext'
import { Button, Card, Badge, PageHeader, Input } from '@/app/components/ui/DesignSystem'

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
    <div className="dark min-h-screen bg-[#09090B] text-[#FFFFFF] font-sans px-6 md:px-8 py-8 max-w-[1280px] mx-auto space-y-8">
      <Header />

      <PageHeader
        badge="SYSTEM CONFIGURATION"
        title="Settings &amp; Preferences"
        subtitle="Manage your profile, subscription tier, notifications, and exported data."
        action={
          <Button variant="secondary" onClick={save}>
            Save Settings →
          </Button>
        }
      />

      {/* User Profile Card */}
      <Card variant="default" radius="md" className="space-y-6">
        <div className="flex items-center gap-4 pb-4 border-b border-white/[0.08]">
          <div className="w-12 h-12 rounded-full bg-[#22D3EE] text-[#09090B] font-bold flex items-center justify-center text-lg">
            {local.initials}
          </div>
          <div>
            <h2 className="text-[20px] font-medium text-white">{local.name}</h2>
            <p className="text-[14px] text-[#A1A1AA]">{local.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-[13px] font-medium uppercase text-[#A1A1AA]">Full Name</label>
            <Input value={local.name} onChange={e => setText('name', e.target.value)} onBlur={save} />
          </div>
          <div className="space-y-1.5">
            <label className="text-[13px] font-medium uppercase text-[#A1A1AA]">Email Address</label>
            <Input type="email" value={local.email} onChange={e => setText('email', e.target.value)} onBlur={save} />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-[13px] font-medium uppercase text-[#A1A1AA]">Height (cm)</label>
            <Input type="number" value={local.heightCm} onChange={e => setNum('heightCm', e.target.value)} onBlur={save} />
          </div>
          <div className="space-y-1.5">
            <label className="text-[13px] font-medium uppercase text-[#A1A1AA]">Current Weight (kg)</label>
            <Input type="number" value={local.weightKg} onChange={e => setNum('weightKg', e.target.value)} onBlur={save} />
          </div>
          <div className="space-y-1.5">
            <label className="text-[13px] font-medium uppercase text-[#A1A1AA]">Target Weight (kg)</label>
            <Input type="number" value={local.targetWeightKg} onChange={e => setNum('targetWeightKg', e.target.value)} onBlur={save} />
          </div>
        </div>

        {/* Dietary Restrictions */}
        <div className="space-y-2">
          <label className="text-[13px] font-medium uppercase text-[#A1A1AA]">Allergies &amp; Restrictions</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {local.allergies.map(a => (
              <span key={a} className="bg-[#18181B] border border-white/[0.08] text-white text-xs px-3 py-1 rounded-full flex items-center gap-2">
                {a}
                <button onClick={() => removeAllergy(a)} className="text-[#A1A1AA] hover:text-white">×</button>
              </span>
            ))}
          </div>
          <Input
            placeholder="Type restriction and press Enter…"
            value={newAllergy}
            onChange={e => setNewAllergy(e.target.value)}
            onKeyDown={addAllergy}
            onBlur={save}
          />
        </div>
      </Card>

      {/* Subscription Tier */}
      <Card variant="highlight" radius="md" className="space-y-6">
        <div className="flex justify-between items-center pb-4 border-b border-white/[0.08]">
          <div>
            <span className="text-[13px] font-medium uppercase tracking-wider text-[#22D3EE]">SUBSCRIPTION OS</span>
            <h2 className="text-[20px] font-semibold text-white">{local.plan}</h2>
          </div>
          <Badge variant="cyan">Pro Active</Badge>
        </div>

        <p className="text-[14px] text-[#A1A1AA]">
          You have active access to AI vision recognition, real-time edge streaming coach, and automated bento analytics.
        </p>
      </Card>

      {/* Notifications & Data Management */}
      <Card variant="default" radius="md" className="space-y-6">
        <div className="pb-4 border-b border-white/[0.08]">
          <h2 className="text-[20px] font-medium text-white">System Notifications &amp; Data Management</h2>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center p-4 bg-[#09090B] border border-white/[0.08] rounded-[14px]">
            <span className="text-sm font-medium text-white">Meal Logging Reminders</span>
            <input type="checkbox" checked={local.notifications.mealReminders} onChange={() => toggleNotif('mealReminders')} className="accent-[#22D3EE] w-4 h-4 cursor-pointer" />
          </div>

          <div className="flex justify-between items-center p-4 bg-[#09090B] border border-white/[0.08] rounded-[14px]">
            <span className="text-sm font-medium text-white">Hydration Reminders</span>
            <input type="checkbox" checked={local.notifications.waterReminders} onChange={() => toggleNotif('waterReminders')} className="accent-[#22D3EE] w-4 h-4 cursor-pointer" />
          </div>

          <div className="flex justify-between items-center p-4 bg-[#09090B] border border-white/[0.08] rounded-[14px]">
            <span className="text-sm font-medium text-white">Weekly Performance Report</span>
            <input type="checkbox" checked={local.notifications.weeklyReport} onChange={() => toggleNotif('weeklyReport')} className="accent-[#22D3EE] w-4 h-4 cursor-pointer" />
          </div>
        </div>

        <div className="pt-6 border-t border-white/[0.08] flex flex-wrap gap-4">
          <Button variant="outline" onClick={handleExport}>
            📥 Export JSON Data
          </Button>
          <Button variant="danger" onClick={handleReset}>
            🗑️ Reset All Data
          </Button>
        </div>
      </Card>
    </div>
  )
}
