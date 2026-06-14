'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Zap, Dumbbell, Apple, TrendingUp, Timer, Trophy, Brain,
  ArrowRight, CheckCircle, Scale, Flame, Target
} from 'lucide-react'

const FEATURES = [
  { icon: Dumbbell, title: 'Smart Workout Logging', desc: '180+ exercises with autocomplete. Log sets, reps, and weight in seconds. Repeat last workout with one tap.', color: 'text-indigo-400 bg-indigo-400/10' },
  { icon: Trophy, title: 'PR Tracking', desc: 'Auto-detects personal records using the Epley 1RM formula every time you save a workout. Celebrate every milestone.', color: 'text-yellow-400 bg-yellow-400/10' },
  { icon: Apple, title: 'Nutrition Tracking', desc: '100+ foods with full macros. Track calories, protein, carbs, and fats against your daily targets in real time.', color: 'text-emerald-400 bg-emerald-400/10' },
  { icon: TrendingUp, title: 'Progress Visualization', desc: 'Weight trend charts, macro rings, workout streak, strength progression. See exactly how far you\'ve come.', color: 'text-purple-400 bg-purple-400/10' },
  { icon: Timer, title: 'Rest Timer', desc: 'Built-in rest timer with audio alert. Presets for 1m, 90s, 2m, 3m, 5m. Never lose track between sets again.', color: 'text-blue-400 bg-blue-400/10' },
  { icon: Brain, title: 'AI Fitness Coach', desc: 'Chat with an AI coach that understands fitness. Get answers about training, nutrition, form, and recovery.', color: 'text-rose-400 bg-rose-400/10' },
]

const STEPS = [
  { n: '1', title: 'Create your account', desc: 'Sign up in under 60 seconds. Enter your weight and goal — nothing else required to start.' },
  { n: '2', title: 'Log workouts & meals', desc: 'Use our exercise autocomplete, pre-built plans, or design your own. Track food with one search.' },
  { n: '3', title: 'Watch yourself improve', desc: 'PRs get detected automatically. Your dashboard shows exactly where you stand against your goals.' },
]

export default function LandingPage() {
  const router = useRouter()
  useEffect(() => {
    const token = localStorage.getItem('fitai_token')
    if (token) router.push('/dashboard')
  }, [router])

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0f]/80 backdrop-blur-md border-b border-[#1e1e2e]">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold">FitAI</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-slate-400 hover:text-white text-sm transition">Sign in</Link>
            <Link href="/register" className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition">
              Get Started Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/10 via-transparent to-purple-600/10 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-indigo-600/10 border border-indigo-500/20 rounded-full px-4 py-1.5 text-indigo-400 text-sm font-medium mb-6">
            <Zap className="w-3.5 h-3.5" /> AI-Powered Fitness Tracking
          </div>
          <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
            Train Smarter.{' '}
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Hit PRs.
            </span>{' '}
            Transform Faster.
          </h1>
          <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            The fitness app that automatically tracks your personal records, calculates calories burned, and keeps you on track with your goals — all in one place.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register"
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-4 rounded-2xl text-lg transition">
              Start for Free <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/login" className="text-slate-400 hover:text-white px-8 py-4 rounded-2xl text-lg transition border border-[#1e1e2e] hover:border-[#2e2e4e]">
              Sign in
            </Link>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-y border-[#1e1e2e] bg-[#111118] py-6">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: Dumbbell, value: '180+', label: 'Exercises' },
            { icon: Trophy, value: 'Auto', label: 'PR Detection' },
            { icon: Flame, value: 'MET', label: 'Calorie Burn' },
            { icon: Brain, value: 'AI', label: 'Fitness Coach' },
          ].map(({ icon: Icon, value, label }) => (
            <div key={label} className="flex items-center gap-3">
              <Icon className="w-5 h-5 text-indigo-400 shrink-0" />
              <div>
                <p className="text-white font-bold text-lg leading-none">{value}</p>
                <p className="text-slate-400 text-sm">{label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything you need to reach your goals</h2>
            <p className="text-slate-400 text-lg max-w-xl mx-auto">Built for serious athletes and beginners alike. No fluff — just the features that actually matter.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map(({ icon: Icon, title, desc, color }) => (
              <div key={title} className="bg-[#111118] border border-[#1e1e2e] rounded-2xl p-6 hover:border-indigo-500/30 transition-all duration-300">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">{title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dashboard preview — stat cards mockup */}
      <section className="py-16 px-6 bg-[#111118] border-y border-[#1e1e2e]">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Your entire fitness life, in one dashboard</h2>
          <p className="text-slate-400">See your progress at a glance — every single day.</p>
        </div>
        <div className="max-w-3xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Scale, label: 'Current Weight', value: '80.0 kg', sub: 'Goal: 75 kg', color: 'bg-indigo-600' },
            { icon: Flame, label: 'Calories Today', value: '1,840', sub: '560 remaining', color: 'bg-orange-600' },
            { icon: Target, label: 'Protein', value: '142g', sub: 'of 160g target', color: 'bg-rose-600' },
            { icon: Trophy, label: 'Workout Streak', value: '12 days', sub: 'Keep it going!', color: 'bg-yellow-600' },
          ].map(({ icon: Icon, label, value, sub, color }) => (
            <div key={label} className="bg-[#0a0a0f] border border-[#1e1e2e] rounded-2xl p-4">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-3 ${color}`}>
                <Icon className="w-4 h-4 text-white" />
              </div>
              <p className="text-slate-400 text-xs mb-1">{label}</p>
              <p className="text-white font-bold text-lg">{value}</p>
              <p className="text-slate-500 text-xs mt-0.5">{sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Up and running in 60 seconds</h2>
            <p className="text-slate-400">No complicated setup. Start tracking in under a minute.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {STEPS.map(({ n, title, desc }) => (
              <div key={n} className="text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
                  {n}
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">{title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What's included */}
      <section className="py-16 px-6 bg-[#111118] border-y border-[#1e1e2e]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-10">Everything included. Always free.</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
            {[
              'Unlimited workout logging',
              'Personal record auto-detection',
              'Nutrition & macro tracking',
              'Weight progress charts',
              'Rest timer with audio',
              'Pre-built workout plans',
              '180+ exercise database',
              'Progress photo gallery',
              'AI fitness coach chat',
              'Calorie burn calculator',
            ].map(item => (
              <div key={item} className="flex items-center gap-3">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-slate-300 text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to{' '}
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              transform?
            </span>
          </h2>
          <p className="text-slate-400 text-lg mb-10">Join thousands of people already tracking their fitness journey with FitAI.</p>
          <Link href="/register"
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-10 py-4 rounded-2xl text-lg transition">
            Get Started Free <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#1e1e2e] py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-indigo-600 rounded-md flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-white font-bold">FitAI</span>
          </div>
          <p className="text-slate-500 text-sm">© 2026 FitAI. Built to help you hit your goals.</p>
          <div className="flex gap-6 text-sm text-slate-500">
            <span className="hover:text-white cursor-pointer transition">Privacy</span>
            <span className="hover:text-white cursor-pointer transition">Terms</span>
            <Link href="/login" className="hover:text-white transition">Sign in</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
