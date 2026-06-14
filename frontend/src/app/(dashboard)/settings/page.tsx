'use client'
import { useEffect, useState } from 'react'
import { userApi, authApi } from '@/lib/api'
import { User } from '@/types'
import toast from 'react-hot-toast'
import { KeyRound, User as UserIcon } from 'lucide-react'

const GOALS = [
  { value: 'lose_fat', label: 'Lose Fat' },
  { value: 'gain_muscle', label: 'Gain Muscle' },
  { value: 'maintain', label: 'Maintain' },
]
const ACTIVITIES = [
  { value: 'sedentary', label: 'Sedentary (desk job)' },
  { value: 'light', label: 'Light (1–3 days/wk)' },
  { value: 'moderate', label: 'Moderate (3–5 days/wk)' },
  { value: 'active', label: 'Active (6–7 days/wk)' },
  { value: 'very_active', label: 'Very active (athlete)' },
]

export default function SettingsPage() {
  const [profile, setProfile] = useState({
    name: '', age: '', height: '', gender: 'male',
    current_weight: '', goal_weight: '', fitness_goal: 'lose_fat', activity_level: 'moderate',
  })
  const [passwords, setPasswords] = useState({ current: '', next: '', confirm: '' })
  const [savingProfile, setSavingProfile] = useState(false)
  const [savingPw, setSavingPw] = useState(false)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    userApi.getProfile().then(res => {
      const u: User = res.data
      setProfile({
        name: u.name,
        age: String(u.age),
        height: String(u.height),
        gender: u.gender || 'male',
        current_weight: String(u.current_weight),
        goal_weight: String(u.goal_weight),
        fitness_goal: u.fitness_goal,
        activity_level: u.activity_level,
      })
      setLoaded(true)
    })
  }, [])

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSavingProfile(true)
    try {
      const res = await userApi.updateProfile({
        name: profile.name,
        age: parseInt(profile.age),
        height: parseFloat(profile.height),
        gender: profile.gender,
        current_weight: parseFloat(profile.current_weight),
        goal_weight: parseFloat(profile.goal_weight),
        fitness_goal: profile.fitness_goal,
        activity_level: profile.activity_level,
      })
      localStorage.setItem('fitai_user', JSON.stringify(res.data))
      toast.success('Profile updated!')
    } catch {
      toast.error('Failed to update profile')
    } finally {
      setSavingProfile(false)
    }
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    if (passwords.next !== passwords.confirm) { toast.error('Passwords do not match'); return }
    if (passwords.next.length < 6) { toast.error('Password must be at least 6 characters'); return }
    setSavingPw(true)
    try {
      await authApi.changePassword({ current_password: passwords.current, new_password: passwords.next })
      toast.success('Password changed!')
      setPasswords({ current: '', next: '', confirm: '' })
    } catch (err: unknown) {
      const error = err as { response?: { data?: { detail?: string } } }
      toast.error(error.response?.data?.detail || 'Failed to change password')
    } finally {
      setSavingPw(false)
    }
  }

  const inputClass = "w-full bg-[#0a0a0f] border border-[#1e1e2e] rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"

  if (!loaded) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-2xl space-y-6 pb-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Settings</h1>
        <p className="text-slate-400 mt-1">Manage your profile and account</p>
      </div>

      {/* Profile */}
      <div className="bg-[#111118] border border-[#1e1e2e] rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-5">
          <UserIcon className="w-5 h-5 text-indigo-400" />
          <h2 className="text-white font-semibold text-lg">Profile</h2>
        </div>
        <form onSubmit={handleProfileSave} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-slate-400 block mb-1.5">Full Name</label>
              <input type="text" required value={profile.name}
                onChange={e => setProfile(p => ({ ...p, name: e.target.value }))}
                className={inputClass} />
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1.5">Gender</label>
              <select value={profile.gender} onChange={e => setProfile(p => ({ ...p, gender: e.target.value }))} className={inputClass}>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1.5">Age</label>
              <input type="number" min={10} max={120} required value={profile.age}
                onChange={e => setProfile(p => ({ ...p, age: e.target.value }))}
                className={inputClass} />
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1.5">Height (cm)</label>
              <input type="number" step="0.1" min={100} max={250} required value={profile.height}
                onChange={e => setProfile(p => ({ ...p, height: e.target.value }))}
                className={inputClass} />
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1.5">Current Weight (kg)</label>
              <input type="number" step="0.1" min={20} max={300} required value={profile.current_weight}
                onChange={e => setProfile(p => ({ ...p, current_weight: e.target.value }))}
                className={inputClass} />
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1.5">Goal Weight (kg)</label>
              <input type="number" step="0.1" min={20} max={300} required value={profile.goal_weight}
                onChange={e => setProfile(p => ({ ...p, goal_weight: e.target.value }))}
                className={inputClass} />
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-400 block mb-1.5">Fitness Goal</label>
            <div className="grid grid-cols-3 gap-2">
              {GOALS.map(g => (
                <button key={g.value} type="button" onClick={() => setProfile(p => ({ ...p, fitness_goal: g.value }))}
                  className={`py-2.5 rounded-xl border text-sm font-medium transition ${
                    profile.fitness_goal === g.value
                      ? 'border-indigo-500 bg-indigo-600/15 text-white'
                      : 'border-[#1e1e2e] text-slate-400 hover:border-[#2e2e4e]'
                  }`}>
                  {g.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-400 block mb-1.5">Activity Level</label>
            <select value={profile.activity_level} onChange={e => setProfile(p => ({ ...p, activity_level: e.target.value }))} className={inputClass}>
              {ACTIVITIES.map(a => <option key={a.value} value={a.value}>{a.label}</option>)}
            </select>
          </div>

          <button type="submit" disabled={savingProfile}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition">
            {savingProfile ? 'Saving...' : 'Save Profile'}
          </button>
        </form>
      </div>

      {/* Change Password */}
      <div className="bg-[#111118] border border-[#1e1e2e] rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-5">
          <KeyRound className="w-5 h-5 text-indigo-400" />
          <h2 className="text-white font-semibold text-lg">Change Password</h2>
        </div>
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <label className="text-xs text-slate-400 block mb-1.5">Current Password</label>
            <input type="password" required value={passwords.current}
              onChange={e => setPasswords(p => ({ ...p, current: e.target.value }))}
              className={inputClass} placeholder="••••••••" />
          </div>
          <div>
            <label className="text-xs text-slate-400 block mb-1.5">New Password</label>
            <input type="password" required minLength={6} value={passwords.next}
              onChange={e => setPasswords(p => ({ ...p, next: e.target.value }))}
              className={inputClass} placeholder="At least 6 characters" />
          </div>
          <div>
            <label className="text-xs text-slate-400 block mb-1.5">Confirm New Password</label>
            <input type="password" required value={passwords.confirm}
              onChange={e => setPasswords(p => ({ ...p, confirm: e.target.value }))}
              className={inputClass} placeholder="••••••••" />
          </div>
          <button type="submit" disabled={savingPw}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition">
            {savingPw ? 'Changing...' : 'Change Password'}
          </button>
        </form>
      </div>
    </div>
  )
}
