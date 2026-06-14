'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { authApi } from '@/lib/api'
import { useAuth } from '@/hooks/useAuth'
import { Zap, TrendingDown, Dumbbell, Scale } from 'lucide-react'

const GOALS = [
  { value: 'lose_fat', label: 'Lose Fat', icon: TrendingDown, desc: 'Burn fat, get lean' },
  { value: 'gain_muscle', label: 'Gain Muscle', icon: Dumbbell, desc: 'Build size & strength' },
  { value: 'maintain', label: 'Maintain', icon: Scale, desc: 'Stay at current weight' },
]

export default function RegisterPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({
    name: '', email: '', password: '',
    current_weight: '', goal_weight: '', fitness_goal: 'lose_fat',
  })

  const update = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (parseFloat(form.current_weight) <= 0 || parseFloat(form.goal_weight) <= 0) {
      toast.error('Please enter valid weights'); return
    }
    setLoading(true)
    try {
      const payload = {
        name: form.name,
        email: form.email,
        password: form.password,
        current_weight: parseFloat(form.current_weight),
        goal_weight: parseFloat(form.goal_weight),
        fitness_goal: form.fitness_goal,
        // defaults filled server-side
      }
      const res = await authApi.register(payload)
      login(res.data.access_token, res.data.user)
      toast.success('Welcome to FitAI! 🎉')
      router.push('/dashboard')
    } catch (err: unknown) {
      const error = err as { response?: { data?: { detail?: string } } }
      toast.error(error.response?.data?.detail || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  const inputClass = "w-full bg-[#0a0a0f] border border-[#1e1e2e] rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f] px-4 py-8">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-white">FitAI</span>
        </div>

        <div className="bg-[#111118] border border-[#1e1e2e] rounded-2xl p-8">
          {/* Progress */}
          <div className="flex gap-2 mb-6">
            {[1, 2].map(s => (
              <div key={s} className={`h-1 flex-1 rounded-full transition-all ${step >= s ? 'bg-indigo-500' : 'bg-[#1e1e2e]'}`} />
            ))}
          </div>

          <h1 className="text-2xl font-bold text-white mb-1">
            {step === 1 ? 'Create your account' : 'Set your goal'}
          </h1>
          <p className="text-slate-400 text-sm mb-6">
            {step === 1 ? 'Takes less than 60 seconds' : 'We\'ll personalise your plan'}
          </p>

          <form onSubmit={step === 1 ? (e) => { e.preventDefault(); setStep(2) } : handleSubmit} className="space-y-4">
            {step === 1 ? (
              <>
                <div>
                  <label className="text-sm font-medium text-slate-300 block mb-2">Full Name</label>
                  <input type="text" required value={form.name} onChange={e => update('name', e.target.value)}
                    className={inputClass} placeholder="John Doe" />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-300 block mb-2">Email</label>
                  <input type="email" required value={form.email} onChange={e => update('email', e.target.value)}
                    className={inputClass} placeholder="you@example.com" />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-300 block mb-2">Password</label>
                  <input type="password" required minLength={6} value={form.password} onChange={e => update('password', e.target.value)}
                    className={inputClass} placeholder="At least 6 characters" />
                </div>
                <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition">
                  Continue →
                </button>
              </>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-slate-300 block mb-2">Current Weight (kg)</label>
                    <input type="number" required step="0.1" min="20" max="300"
                      value={form.current_weight} onChange={e => update('current_weight', e.target.value)}
                      className={inputClass} placeholder="80" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-300 block mb-2">Goal Weight (kg)</label>
                    <input type="number" required step="0.1" min="20" max="300"
                      value={form.goal_weight} onChange={e => update('goal_weight', e.target.value)}
                      className={inputClass} placeholder="72" />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-300 block mb-3">Primary Goal</label>
                  <div className="grid grid-cols-3 gap-2">
                    {GOALS.map(({ value, label, icon: Icon, desc }) => (
                      <button key={value} type="button" onClick={() => update('fitness_goal', value)}
                        className={`flex flex-col items-center gap-1 p-3 rounded-xl border transition text-center ${
                          form.fitness_goal === value
                            ? 'border-indigo-500 bg-indigo-600/15 text-white'
                            : 'border-[#1e1e2e] text-slate-400 hover:border-[#2e2e4e]'
                        }`}>
                        <Icon className="w-5 h-5" />
                        <span className="text-xs font-semibold">{label}</span>
                        <span className="text-xs text-slate-500 leading-tight">{desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <p className="text-xs text-slate-500 text-center">
                  You can update age, height, and activity level in your profile after signup
                </p>

                <div className="flex gap-3">
                  <button type="button" onClick={() => setStep(1)}
                    className="flex-1 bg-[#1e1e2e] hover:bg-[#2a2a3e] text-white font-semibold py-3 rounded-xl transition">
                    Back
                  </button>
                  <button type="submit" disabled={loading}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition">
                    {loading ? 'Creating...' : 'Start Training 🚀'}
                  </button>
                </div>
              </>
            )}
          </form>

          <p className="text-center text-slate-400 text-sm mt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-indigo-400 hover:text-indigo-300 font-medium">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
