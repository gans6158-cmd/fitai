'use client'
import { useState } from 'react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { authApi } from '@/lib/api'
import { Zap, ArrowLeft, KeyRound } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<'email' | 'reset' | 'done'>('email')
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [devCode, setDevCode] = useState<string | null>(null)

  const inputClass = "w-full bg-[#0a0a0f] border border-[#1e1e2e] rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"

  const handleRequestCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await authApi.forgotPassword(email)
      // In dev, the code is returned directly; in prod it would be emailed
      if (res.data.reset_code) setDevCode(res.data.reset_code)
      setStep('reset')
      toast.success('Reset code generated!')
    } catch {
      toast.error('Something went wrong. Try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) { toast.error('Passwords do not match'); return }
    if (newPassword.length < 6) { toast.error('Password must be at least 6 characters'); return }
    setLoading(true)
    try {
      await authApi.resetPassword({ email, code, new_password: newPassword })
      setStep('done')
      toast.success('Password reset successfully!')
    } catch (err: unknown) {
      const error = err as { response?: { data?: { detail?: string } } }
      toast.error(error.response?.data?.detail || 'Invalid or expired code')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f] px-4">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-white">FitAI</span>
        </div>

        <div className="bg-[#111118] border border-[#1e1e2e] rounded-2xl p-8">
          {step === 'email' && (
            <>
              <div className="w-12 h-12 bg-indigo-600/20 rounded-2xl flex items-center justify-center mb-4">
                <KeyRound className="w-6 h-6 text-indigo-400" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">Forgot password?</h1>
              <p className="text-slate-400 text-sm mb-6">Enter your email and we'll send you a reset code.</p>
              <form onSubmit={handleRequestCode} className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-300 block mb-2">Email address</label>
                  <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                    className={inputClass} placeholder="you@example.com" />
                </div>
                <button type="submit" disabled={loading}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition">
                  {loading ? 'Sending...' : 'Send Reset Code'}
                </button>
              </form>
            </>
          )}

          {step === 'reset' && (
            <>
              <h1 className="text-2xl font-bold text-white mb-2">Enter reset code</h1>
              <p className="text-slate-400 text-sm mb-2">Enter the 6-character code and your new password.</p>
              {devCode && (
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-3 mb-4">
                  <p className="text-yellow-400 text-xs font-medium">Dev mode — your reset code:</p>
                  <p className="text-yellow-300 font-mono text-lg font-bold mt-1">{devCode}</p>
                  <p className="text-yellow-500 text-xs mt-1">In production this would be emailed to you.</p>
                </div>
              )}
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-300 block mb-2">Reset Code</label>
                  <input type="text" required value={code} onChange={e => setCode(e.target.value.toUpperCase())}
                    className={inputClass} placeholder="A3F9B2" maxLength={6} />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-300 block mb-2">New Password</label>
                  <input type="password" required minLength={6} value={newPassword} onChange={e => setNewPassword(e.target.value)}
                    className={inputClass} placeholder="At least 6 characters" />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-300 block mb-2">Confirm Password</label>
                  <input type="password" required value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                    className={inputClass} placeholder="••••••••" />
                </div>
                <button type="submit" disabled={loading}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition">
                  {loading ? 'Resetting...' : 'Reset Password'}
                </button>
              </form>
            </>
          )}

          {step === 'done' && (
            <div className="text-center py-4">
              <div className="text-5xl mb-4">✅</div>
              <h1 className="text-2xl font-bold text-white mb-2">Password reset!</h1>
              <p className="text-slate-400 text-sm mb-6">You can now sign in with your new password.</p>
              <Link href="/login" className="block w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition text-center">
                Go to Sign In
              </Link>
            </div>
          )}

          {step !== 'done' && (
            <Link href="/login" className="flex items-center justify-center gap-2 text-slate-400 hover:text-white text-sm mt-6 transition">
              <ArrowLeft className="w-4 h-4" /> Back to sign in
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
