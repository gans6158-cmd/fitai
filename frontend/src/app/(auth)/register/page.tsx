'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { authApi } from '@/lib/api'
import { useAuth } from '@/hooks/useAuth'
import { Zap } from 'lucide-react'

export default function RegisterPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({
    name: '', email: '', password: '', age: '', gender: 'male',
    height: '', current_weight: '', goal_weight: '',
    fitness_goal: 'lose_fat', activity_level: 'moderate',
  })

  const update = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const payload = {
        ...form,
        age: parseInt(form.age),
        height: parseFloat(form.height),
        current_weight: parseFloat(form.current_weight),
        goal_weight: parseFloat(form.goal_weight),
      }
      const res = await authApi.register(payload)
      login(res.data.access_token, res.data.user)
      toast.success('Account created! Welcome to FitAI!')
      router.push('/dashboard')
    } catch (err: unknown) {
      const error = err as { response?: { data?: { detail?: string } } }
      toast.error(error.response?.data?.detail || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  const inputClass = "w-full bg-[#0a0a0f] border border-[#1e1e2e] rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
  const selectClass = "w-full bg-[#0a0a0f] border border-[#1e1e2e] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition"
  const labelClass = "text-sm font-medium text-slate-300 block mb-2"

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
          <div className="flex gap-2 mb-6">
            {[1, 2].map(s => (
              <div key={s} className={`h-1 flex-1 rounded-full ${step >= s ? 'bg-indigo-500' : 'bg-[#1e1e2e]'}`} />
            ))}
          </div>

          <h1 className="text-2xl font-bold text-white mb-2">
            {step === 1 ? 'Create account' : 'Your fitness profile'}
          </h1>
          <p className="text-slate-400 mb-6">
            {step === 1 ? 'Start your transformation today' : 'Help us personalize your experience'}
          </p>

          <form
            onSubmit={step === 1 ? (e) => { e.preventDefault(); setStep(2) } : handleSubmit}
            className="space-y-4"
          >
            {step === 1 ? (
              <>
                <div>
                  <label className={labelClass}>Full Name</label>
                  <input type="text" required value={form.name} onChange={e => update('name', e.target.value)} className={inputClass} placeholder="John Doe" />
                </div>
                <div>
                  <label className={labelClass}>Email</label>
                  <input type="email" required value={form.email} onChange={e => update('email', e.target.value)} className={inputClass} placeholder="you@example.com" />
                </div>
                <div>
                  <label className={labelClass}>Password</label>
                  <input type="password" required minLength={6} value={form.password} onChange={e => update('password', e.target.value)} className={inputClass} placeholder="••••••••" />
                </div>
                <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition">
                  Continue
                </button>
              </>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Age</label>
                    <input type="number" required value={form.age} onChange={e => update('age', e.target.value)} className={inputClass} placeholder="25" />
                  </div>
                  <div>
                    <label className={labelClass}>Gender</label>
                    <select value={form.gender} onChange={e => update('gender', e.target.value)} className={selectClass}>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Height (cm)</label>
                  <input type="number" required value={form.height} onChange={e => update('height', e.target.value)} className={inputClass} placeholder="175" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Current Weight (kg)</label>
                    <input type="number" step="0.1" required value={form.current_weight} onChange={e => update('current_weight', e.target.value)} className={inputClass} placeholder="80" />
                  </div>
                  <div>
                    <label className={labelClass}>Goal Weight (kg)</label>
                    <input type="number" step="0.1" required value={form.goal_weight} onChange={e => update('goal_weight', e.target.value)} className={inputClass} placeholder="70" />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Fitness Goal</label>
                  <select value={form.fitness_goal} onChange={e => update('fitness_goal', e.target.value)} className={selectClass}>
                    <option value="lose_fat">Lose Fat</option>
                    <option value="gain_muscle">Gain Muscle</option>
                    <option value="maintain">Maintain</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Activity Level</label>
                  <select value={form.activity_level} onChange={e => update('activity_level', e.target.value)} className={selectClass}>
                    <option value="sedentary">Sedentary (little/no exercise)</option>
                    <option value="light">Light (1-3 days/week)</option>
                    <option value="moderate">Moderate (3-5 days/week)</option>
                    <option value="active">Active (6-7 days/week)</option>
                    <option value="very_active">Very Active (twice/day)</option>
                  </select>
                </div>
                <div className="flex gap-3">
                  <button type="button" onClick={() => setStep(1)} className="flex-1 bg-[#1e1e2e] hover:bg-[#2a2a3e] text-white font-semibold py-3 rounded-xl transition">
                    Back
                  </button>
                  <button type="submit" disabled={loading} className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition">
                    {loading ? 'Creating...' : 'Create Account'}
                  </button>
                </div>
              </>
            )}
          </form>

          <p className="text-center text-slate-400 mt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-indigo-400 hover:text-indigo-300 font-medium">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
