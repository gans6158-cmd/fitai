'use client'
import { useEffect, useRef, useState, useMemo } from 'react'
import { workoutApi, prApi } from '@/lib/api'
import { Workout, PRRecord } from '@/types'
import toast from 'react-hot-toast'
import {
  Plus, Trash2, ChevronDown, ChevronUp, Dumbbell, Flame,
  LayoutGrid, ClipboardList, Timer, X, Trophy, Zap, RotateCcw, TrendingUp, RefreshCw
} from 'lucide-react'
import { format } from 'date-fns'
import { searchExercises, getExerciseMET, ExerciseInfo } from '@/lib/exerciseDatabase'
import { WORKOUT_PLANS, WorkoutPlan, PlanDay } from '@/lib/workoutPlans'

const CATEGORIES = ['Push', 'Pull', 'Legs', 'Arms', 'Cardio', 'Full Body', 'Core', 'HIIT']
const REST_PRESETS = [60, 90, 120, 180, 300]

interface SetForm { reps: string; weight: string }
interface ExerciseForm { name: string; sets: SetForm[] }
interface WorkoutForm {
  name: string; category: string; date: string
  duration_minutes: string; notes: string; exercises: ExerciseForm[]
}

const defaultForm = (): WorkoutForm => ({
  name: '', category: 'Push', date: format(new Date(), 'yyyy-MM-dd'),
  duration_minutes: '', notes: '',
  exercises: [{ name: '', sets: [{ reps: '', weight: '' }] }],
})

function calcCaloriesBurned(form: WorkoutForm, userWeightKg: number): number {
  const duration = parseInt(form.duration_minutes) || 45
  let totalMET = 0; let count = 0
  for (const ex of form.exercises) {
    if (ex.name) { totalMET += getExerciseMET(ex.name); count++ }
  }
  const avgMET = count > 0 ? totalMET / count : 4
  return Math.round((avgMET * userWeightKg * 3.5 * duration) / 200)
}

// ─── Rest Timer ──────────────────────────────────────────────────────────────
function RestTimer({ onClose }: { onClose: () => void }) {
  const [duration, setDuration] = useState(90)
  const [remaining, setRemaining] = useState(90)
  const [state, setState] = useState<'idle' | 'running' | 'paused' | 'done'>('idle')
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const playBeep = () => {
    try {
      // @ts-ignore
      const ctx = new (window.AudioContext || window.webkitAudioContext)()
      ;[0, 0.2, 0.4].forEach(delay => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.connect(gain); gain.connect(ctx.destination)
        osc.frequency.value = 880
        gain.gain.setValueAtTime(0.35, ctx.currentTime + delay)
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + delay + 0.18)
        osc.start(ctx.currentTime + delay)
        osc.stop(ctx.currentTime + delay + 0.18)
      })
    } catch {}
  }

  const clearTimer = () => { if (intervalRef.current) clearInterval(intervalRef.current) }

  const startCountdown = (from: number) => {
    clearTimer()
    setState('running')
    intervalRef.current = setInterval(() => {
      setRemaining(r => {
        if (r <= 1) {
          clearTimer()
          setState('done')
          playBeep()
          return 0
        }
        return r - 1
      })
    }, 1000)
    setRemaining(from)
  }

  const start = (secs?: number) => {
    const d = secs ?? duration
    setDuration(d)
    startCountdown(d)
  }

  const pause = () => { clearTimer(); setState('paused') }
  const resume = () => startCountdown(remaining)
  const reset = () => { clearTimer(); setRemaining(duration); setState('idle') }

  useEffect(() => () => clearTimer(), [])

  const pct = state === 'done' ? 0 : remaining / duration
  const r = 40
  const circ = 2 * Math.PI * r
  const mins = Math.floor(remaining / 60)
  const secs = remaining % 60
  const ringColor = state === 'done' ? '#10b981' : state === 'running' ? '#6366f1' : '#4b5563'

  return (
    <div className="fixed bottom-6 right-6 z-50 bg-[#16162a] border border-[#2e2e50] rounded-2xl p-5 shadow-2xl w-64 select-none">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Timer className="w-4 h-4 text-indigo-400" />
          <span className="text-white font-semibold text-sm">Rest Timer</span>
        </div>
        <button onClick={() => { clearTimer(); onClose() }} className="text-slate-500 hover:text-white transition">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex justify-center mb-4">
        <div className="relative w-28 h-28">
          <svg className="w-28 h-28 -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r={r} fill="none" stroke="#1e1e2e" strokeWidth="8" />
            <circle
              cx="50" cy="50" r={r} fill="none"
              stroke={ringColor} strokeWidth="8"
              strokeDasharray={`${pct * circ} ${circ}`}
              strokeLinecap="round"
              style={{ transition: 'stroke-dasharray 0.6s linear, stroke 0.3s' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            {state === 'done' ? (
              <span className="text-3xl">✓</span>
            ) : (
              <span className="text-2xl font-bold text-white tabular-nums">
                {mins}:{secs.toString().padStart(2, '0')}
              </span>
            )}
            {state === 'done' && <span className="text-emerald-400 text-xs font-semibold mt-1">Rest done!</span>}
          </div>
        </div>
      </div>

      {/* Presets — only show when idle or done */}
      {(state === 'idle' || state === 'done') && (
        <div className="flex gap-1.5 mb-3 flex-wrap justify-center">
          {REST_PRESETS.map(s => (
            <button key={s} onClick={() => start(s)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                duration === s ? 'bg-indigo-600 text-white' : 'bg-[#0d0d14] text-slate-400 hover:text-white'
              }`}>
              {s < 60 ? `${s}s` : `${s / 60}m`}
            </button>
          ))}
        </div>
      )}

      <div className="flex gap-2">
        {state === 'idle' && (
          <button onClick={() => start()} className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-xl text-sm font-medium transition">
            Start
          </button>
        )}
        {state === 'running' && (
          <button onClick={pause} className="flex-1 bg-[#1e1e2e] hover:bg-[#2a2a3e] text-white py-2 rounded-xl text-sm transition">
            Pause
          </button>
        )}
        {state === 'paused' && (
          <button onClick={resume} className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-xl text-sm font-medium transition">
            Resume
          </button>
        )}
        {state === 'done' && (
          <button onClick={() => start()} className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-xl text-sm font-medium transition">
            Repeat
          </button>
        )}
        <button onClick={reset} title="Reset" className="bg-[#1e1e2e] hover:bg-[#2a2a3e] text-slate-400 hover:text-white py-2 px-3 rounded-xl text-sm transition">
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

// ─── PR Celebration Modal ────────────────────────────────────────────────────
function PRCelebration({ prs, onClose }: { prs: string[]; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-[#16162a] border border-yellow-500/40 rounded-2xl p-8 max-w-sm w-full mx-4 text-center animate-in zoom-in duration-200">
        <div className="text-6xl mb-3">🏆</div>
        <h2 className="text-2xl font-bold text-white mb-1">
          New Personal Record{prs.length > 1 ? 's' : ''}!
        </h2>
        <p className="text-slate-400 text-sm mb-5">You smashed your {prs.length > 1 ? 'records' : 'record'} on:</p>
        <div className="space-y-2 mb-6">
          {prs.map(name => (
            <div key={name} className="flex items-center justify-center gap-2 bg-yellow-500/10 border border-yellow-500/20 rounded-xl py-2.5 px-4">
              <Trophy className="w-4 h-4 text-yellow-400" />
              <span className="text-yellow-300 font-semibold">{name}</span>
            </div>
          ))}
        </div>
        <button onClick={onClose}
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-3 rounded-xl font-semibold transition">
          Keep Crushing It! 💪
        </button>
      </div>
    </div>
  )
}

// ─── Exercise Input with PR badge ────────────────────────────────────────────
function ExerciseInput({ value, onChange, prRecord }: {
  value: string
  onChange: (v: string) => void
  prRecord?: PRRecord | null
}) {
  const [suggestions, setSuggestions] = useState<ExerciseInfo[]>([])
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setSuggestions([]) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  return (
    <div className="relative flex-1" ref={ref}>
      <input
        type="text" required value={value} autoComplete="off"
        onChange={e => { onChange(e.target.value); setSuggestions(searchExercises(e.target.value)) }}
        onFocus={() => value && setSuggestions(searchExercises(value))}
        placeholder="Search exercise or machine..."
        className="w-full bg-[#0a0a0f] border border-[#1e1e2e] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500 transition"
      />
      {prRecord && value === prRecord.exercise_name && (
        <div className="flex items-center gap-1 mt-1.5 text-xs text-yellow-400">
          <Trophy className="w-3 h-3" />
          PR: {prRecord.weight}kg × {prRecord.reps} • est. 1RM: {Math.round(prRecord.estimated_1rm)}kg
        </div>
      )}
      {suggestions.length > 0 && (
        <div className="absolute z-20 w-full mt-1 bg-[#1a1a28] border border-[#1e1e2e] rounded-xl overflow-hidden shadow-xl max-h-48 overflow-y-auto">
          {suggestions.map((ex, i) => (
            <button key={i} type="button" onMouseDown={() => { onChange(ex.name); setSuggestions([]) }}
              className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-[#2a2a3e] transition text-left gap-3">
              <span className="text-white text-sm">{ex.name}</span>
              <span className="text-slate-500 text-xs shrink-0">{ex.equipment}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Plan Card ───────────────────────────────────────────────────────────────
function PlanCard({ plan, onSelect }: { plan: WorkoutPlan; onSelect: (plan: WorkoutPlan) => void }) {
  const [open, setOpen] = useState(false)
  const diffColor = {
    Beginner: 'text-green-400 bg-green-400/10',
    Intermediate: 'text-yellow-400 bg-yellow-400/10',
    Advanced: 'text-red-400 bg-red-400/10',
  }[plan.difficulty]

  return (
    <div className="bg-[#111118] border border-[#1e1e2e] rounded-2xl overflow-hidden">
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <h3 className="text-white font-semibold text-lg">{plan.name}</h3>
            <p className="text-slate-400 text-sm mt-1">{plan.description}</p>
          </div>
          <span className={`shrink-0 text-xs font-medium px-2.5 py-1 rounded-lg ${diffColor}`}>{plan.difficulty}</span>
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="text-xs bg-[#1e1e2e] text-slate-300 px-2 py-1 rounded-lg">{plan.frequency}</span>
          <span className="text-xs bg-[#1e1e2e] text-slate-300 px-2 py-1 rounded-lg">{plan.goal}</span>
          <span className="text-xs bg-[#1e1e2e] text-slate-300 px-2 py-1 rounded-lg">{plan.days.length} workouts</span>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setOpen(!open)}
            className="flex-1 bg-[#1e1e2e] hover:bg-[#2a2a3e] text-slate-300 py-2 rounded-xl text-sm font-medium transition flex items-center justify-center gap-1">
            {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            {open ? 'Hide' : 'Preview'}
          </button>
          <button onClick={() => onSelect(plan)}
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-xl text-sm font-medium transition">
            Use This Plan
          </button>
        </div>
      </div>
      {open && (
        <div className="border-t border-[#1e1e2e] p-4 space-y-3">
          {plan.days.map((day, i) => (
            <div key={i} className="bg-[#0a0a0f] rounded-xl p-3">
              <p className="text-white font-medium text-sm mb-2">{day.name}</p>
              <div className="space-y-1">
                {day.exercises.map((ex, j) => (
                  <div key={j} className="flex items-center justify-between text-xs">
                    <span className="text-slate-300">{ex.name}</span>
                    <span className="text-slate-500">{ex.sets}×{ex.reps}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Main Page ───────────────────────────────────────────────────────────────
export default function WorkoutsPage() {
  const [workouts, setWorkouts] = useState<Workout[]>([])
  const [prs, setPRs] = useState<PRRecord[]>([])
  const [analytics, setAnalytics] = useState<{
    total_workouts: number; weekly_count: number; total_volume: number
    total_calories_burned: number; category_breakdown: Record<string, number>
  } | null>(null)
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<'history' | 'log' | 'plans' | 'prs'>('history')
  const [expanded, setExpanded] = useState<string | null>(null)
  const [form, setForm] = useState<WorkoutForm>(defaultForm())
  const [selectedPlan, setSelectedPlan] = useState<WorkoutPlan | null>(null)
  const [selectedDay, setSelectedDay] = useState<PlanDay | null>(null)
  const [userWeight, setUserWeight] = useState(75)
  const [showTimer, setShowTimer] = useState(false)
  const [celebrationPRs, setCelebrationPRs] = useState<string[]>([])

  const prMap = useMemo(() =>
    Object.fromEntries(prs.map(p => [p.exercise_name, p])),
    [prs]
  )

  useEffect(() => {
    const u = localStorage.getItem('fitai_user')
    if (u) {
      const parsed = JSON.parse(u)
      if (parsed.current_weight) setUserWeight(parsed.current_weight)
    }
  }, [])

  const fetchData = async () => {
    const [w, a, p] = await Promise.all([
      workoutApi.getWorkouts(),
      workoutApi.getAnalytics(),
      prApi.getPRs(),
    ])
    setWorkouts(w.data)
    setAnalytics(a.data)
    setPRs(p.data)
  }

  useEffect(() => { fetchData().finally(() => setLoading(false)) }, [])

  const loadPlanDay = (plan: WorkoutPlan, day: PlanDay) => {
    setSelectedPlan(plan); setSelectedDay(day)
    setForm({
      name: day.name, category: day.category,
      date: format(new Date(), 'yyyy-MM-dd'),
      duration_minutes: '60', notes: `From ${plan.name}`,
      exercises: day.exercises.map(ex => ({
        name: ex.name,
        sets: Array(ex.sets).fill(null).map(() => ({ reps: ex.reps.split('-')[0], weight: '0' })),
      })),
    })
    setTab('log')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handlePlanSelect = (plan: WorkoutPlan) => {
    setSelectedPlan(plan)
    if (plan.days.length === 1) { loadPlanDay(plan, plan.days[0]) }
    else { setSelectedDay(null); setTab('log'); window.scrollTo({ top: 0, behavior: 'smooth' }) }
  }

  const addExercise = () => setForm(f => ({ ...f, exercises: [...f.exercises, { name: '', sets: [{ reps: '', weight: '' }] }] }))
  const removeExercise = (ei: number) => setForm(f => ({ ...f, exercises: f.exercises.length > 1 ? f.exercises.filter((_, i) => i !== ei) : f.exercises }))
  const addSet = (ei: number) => setForm(f => { const e = [...f.exercises]; e[ei] = { ...e[ei], sets: [...e[ei].sets, { reps: '', weight: '' }] }; return { ...f, exercises: e } })
  const removeSet = (ei: number, si: number) => setForm(f => { const e = [...f.exercises]; const s = e[ei].sets.filter((_, i) => i !== si); e[ei] = { ...e[ei], sets: s.length ? s : [{ reps: '', weight: '' }] }; return { ...f, exercises: e } })
  const updateName = (ei: number, v: string) => setForm(f => { const e = [...f.exercises]; e[ei] = { ...e[ei], name: v }; return { ...f, exercises: e } })
  const updateSet = (ei: number, si: number, k: 'reps' | 'weight', v: string) => setForm(f => { const e = [...f.exercises]; const s = [...e[ei].sets]; s[si] = { ...s[si], [k]: v }; e[ei] = { ...e[ei], sets: s }; return { ...f, exercises: e } })

  const estimatedCals = calcCaloriesBurned(form, userWeight)

  const repeatWorkout = (w: Workout) => {
    setForm({
      name: w.name,
      category: w.category,
      date: format(new Date(), 'yyyy-MM-dd'),
      duration_minutes: w.duration_minutes?.toString() || '',
      notes: w.notes || '',
      exercises: w.exercises.map(ex => ({
        name: ex.name,
        sets: ex.sets.map(s => ({ reps: s.reps.toString(), weight: s.weight.toString() })),
      })),
    })
    setSelectedPlan(null)
    setSelectedDay(null)
    setTab('log')
    window.scrollTo({ top: 0, behavior: 'smooth' })
    toast.success('Last workout loaded — ready to repeat!')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await workoutApi.createWorkout({
        name: form.name, category: form.category, date: form.date,
        duration_minutes: form.duration_minutes ? parseInt(form.duration_minutes) : undefined,
        notes: form.notes || undefined,
        calories_burned: estimatedCals,
        exercises: form.exercises.map(ex => ({
          name: ex.name,
          sets: ex.sets.map(s => ({ reps: parseInt(s.reps) || 0, weight: parseFloat(s.weight) || 0 })),
        })),
      })
      const { new_prs } = res.data
      toast.success(`Workout logged! ~${estimatedCals} kcal burned 🔥`)
      if (new_prs?.length > 0) setCelebrationPRs(new_prs)
      setForm(defaultForm()); setSelectedPlan(null); setSelectedDay(null)
      await fetchData()
      setTab('history')
    } catch { toast.error('Failed to save workout') }
  }

  const inputClass = "bg-[#0a0a0f] border border-[#1e1e2e] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500 transition"

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Workouts</h1>
          <p className="text-slate-400 mt-1">Track training, earn PRs, burn calories</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowTimer(t => !t)}
            className="bg-[#111118] border border-[#1e1e2e] hover:border-indigo-500/40 text-slate-300 font-medium px-3 py-2 rounded-xl flex items-center gap-2 transition">
            <Timer className="w-4 h-4 text-indigo-400" /> Timer
          </button>
          <button onClick={() => { setForm(defaultForm()); setTab('log') }}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded-xl flex items-center gap-2 transition">
            <Plus className="w-4 h-4" /> Log Workout
          </button>
        </div>
      </div>

      {/* Analytics */}
      {analytics && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total Workouts', value: analytics.total_workouts, icon: Dumbbell, color: 'text-indigo-400' },
            { label: 'This Week', value: analytics.weekly_count, icon: ClipboardList, color: 'text-purple-400' },
            { label: 'Total Volume', value: `${(analytics.total_volume || 0).toLocaleString()} kg`, icon: LayoutGrid, color: 'text-blue-400' },
            { label: 'Calories Burned', value: `${(analytics.total_calories_burned || 0).toLocaleString()} kcal`, icon: Flame, color: 'text-orange-400' },
          ].map(s => (
            <div key={s.label} className="bg-[#111118] border border-[#1e1e2e] rounded-2xl p-4">
              <s.icon className={`w-5 h-5 ${s.color} mb-2`} />
              <p className="text-slate-400 text-sm">{s.label}</p>
              <p className="text-xl font-bold text-white mt-1">{s.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 bg-[#111118] border border-[#1e1e2e] rounded-xl p-1 mb-6 w-fit flex-wrap">
        {[
          { id: 'history', label: 'History' },
          { id: 'log', label: 'Log Workout' },
          { id: 'plans', label: 'Workout Plans' },
          { id: 'prs', label: `PRs ${prs.length > 0 ? `(${prs.length})` : ''}` },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id as typeof tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${tab === t.id ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── LOG TAB ── */}
      {tab === 'log' && (
        <div className="bg-[#111118] border border-[#1e1e2e] rounded-2xl p-6 mb-6">
          {selectedPlan && (
            <div className="mb-4 p-3 bg-indigo-600/10 border border-indigo-500/30 rounded-xl flex items-center justify-between flex-wrap gap-2">
              <p className="text-indigo-400 text-sm font-medium">
                Plan: {selectedPlan.name}{selectedDay ? ` — ${selectedDay.name}` : ''}
              </p>
              {!selectedDay && selectedPlan.days.length > 1 && (
                <div className="flex gap-2 flex-wrap">
                  {selectedPlan.days.map((d, i) => (
                    <button key={i} onClick={() => loadPlanDay(selectedPlan, d)}
                      className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded-lg transition">{d.name}</button>
                  ))}
                </div>
              )}
            </div>
          )}
          <h2 className="text-lg font-semibold text-white mb-4">{selectedDay ? `Log: ${selectedDay.name}` : 'Log New Workout'}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-slate-400 block mb-2">Workout Name</label>
                <input type="text" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className={inputClass + ' w-full'} placeholder="Push Day A" />
              </div>
              <div>
                <label className="text-sm text-slate-400 block mb-2">Category</label>
                <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className={inputClass + ' w-full'}>
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm text-slate-400 block mb-2">Date</label>
                <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className={inputClass + ' w-full'} />
              </div>
              <div>
                <label className="text-sm text-slate-400 block mb-2">Duration (min)</label>
                <input type="number" value={form.duration_minutes} onChange={e => setForm({ ...form, duration_minutes: e.target.value })} className={inputClass + ' w-full'} placeholder="60" />
              </div>
            </div>

            {form.duration_minutes && (
              <div className="flex items-center gap-3 p-3 bg-orange-500/10 border border-orange-500/20 rounded-xl">
                <Flame className="w-5 h-5 text-orange-400 shrink-0" />
                <div>
                  <p className="text-orange-400 font-semibold">~{estimatedCals} kcal estimated</p>
                  <p className="text-slate-500 text-xs">Based on {form.duration_minutes} min at your weight ({userWeight}kg)</p>
                </div>
              </div>
            )}

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-white font-medium">Exercises</h3>
                <button type="button" onClick={addExercise} className="text-indigo-400 text-sm hover:text-indigo-300 transition">+ Add Exercise</button>
              </div>
              {form.exercises.map((ex, ei) => (
                <div key={ei} className="bg-[#0a0a0f] rounded-xl p-4 space-y-3">
                  <div className="flex items-start gap-2">
                    <ExerciseInput
                      value={ex.name}
                      onChange={v => updateName(ei, v)}
                      prRecord={prMap[ex.name] || null}
                    />
                    {form.exercises.length > 1 && (
                      <button type="button" onClick={() => removeExercise(ei)}
                        className="text-slate-600 hover:text-red-400 transition text-sm shrink-0 mt-2">✕</button>
                    )}
                  </div>
                  <div className="space-y-2">
                    <div className="grid grid-cols-3 gap-2 text-xs text-slate-500 px-1">
                      <span>Set</span><span>Reps</span><span>Weight (kg)</span>
                    </div>
                    {ex.sets.map((set, si) => (
                      <div key={si} className="flex gap-2 items-center">
                        <span className="text-slate-500 text-sm w-6 shrink-0">#{si + 1}</span>
                        <input type="number" required value={set.reps} onChange={e => updateSet(ei, si, 'reps', e.target.value)} className={inputClass + ' w-full'} placeholder="Reps" min="1" />
                        <input type="number" step="0.5" value={set.weight} onChange={e => updateSet(ei, si, 'weight', e.target.value)} className={inputClass + ' w-full'} placeholder="kg" min="0" />
                        {ex.sets.length > 1 && (
                          <button type="button" onClick={() => removeSet(ei, si)}
                            className="text-slate-600 hover:text-red-400 transition text-sm shrink-0">✕</button>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <button type="button" onClick={() => addSet(ei)} className="text-indigo-400 text-xs hover:text-indigo-300 transition">+ Add Set</button>
                    <button type="button" onClick={() => setShowTimer(true)}
                      className="flex items-center gap-1 text-xs text-slate-500 hover:text-indigo-400 transition">
                      <Timer className="w-3 h-3" /> Rest Timer
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <button type="button" onClick={() => { setTab('history'); setForm(defaultForm()); setSelectedPlan(null); setSelectedDay(null) }}
                className="flex-1 bg-[#1e1e2e] hover:bg-[#2a2a3e] text-white py-3 rounded-xl font-semibold transition">Cancel</button>
              <button type="submit" className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold transition flex items-center justify-center gap-2">
                <Flame className="w-4 h-4" /> Save Workout
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── HISTORY TAB ── */}
      {tab === 'history' && (
        <div className="space-y-3">
          {loading ? (
            <div className="flex justify-center py-12"><div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" /></div>
          ) : workouts.length === 0 ? (
            <div className="text-center py-16 text-slate-500 bg-[#111118] border border-[#1e1e2e] rounded-2xl">
              <Dumbbell className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p>No workouts yet — log your first session or pick a plan!</p>
            </div>
          ) : workouts.map(w => (
            <div key={w.id} className="bg-[#111118] border border-[#1e1e2e] rounded-2xl overflow-hidden">
              <div className="flex items-center justify-between p-5 cursor-pointer" onClick={() => setExpanded(expanded === w.id ? null : w.id)}>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-indigo-600/20 rounded-xl flex items-center justify-center shrink-0">
                    <Dumbbell className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div>
                    <p className="text-white font-semibold">{w.name}</p>
                    <p className="text-slate-400 text-sm">{w.category} • {format(new Date(w.date), 'MMM d, yyyy')} • {w.exercises?.length} exercises</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {w.calories_burned ? (
                    <span className="text-orange-400 text-sm font-medium flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5" />{Math.round(w.calories_burned)}
                    </span>
                  ) : null}
                  <span className="text-slate-400 text-sm hidden sm:block">{w.total_volume?.toLocaleString()} kg</span>
                  <button
                    onClick={e => { e.stopPropagation(); repeatWorkout(w) }}
                    title="Repeat this workout"
                    className="text-slate-500 hover:text-indigo-400 transition"
                  ><RefreshCw className="w-4 h-4" /></button>
                  <button onClick={e => {
                    e.stopPropagation()
                    workoutApi.deleteWorkout(w.id).then(() => { setWorkouts(workouts.filter(x => x.id !== w.id)); toast.success('Deleted') })
                  }} className="text-slate-600 hover:text-red-400 transition"><Trash2 className="w-4 h-4" /></button>
                  {expanded === w.id ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                </div>
              </div>
              {expanded === w.id && (
                <div className="border-t border-[#1e1e2e] p-5">
                  {w.exercises.map((ex, i) => {
                    const isPR = prMap[ex.name]?.date === w.date
                    return (
                      <div key={i} className="mb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <p className="text-white font-medium">{ex.name}</p>
                          {isPR && (
                            <span className="flex items-center gap-1 text-xs text-yellow-400 bg-yellow-400/10 px-2 py-0.5 rounded-full">
                              <Trophy className="w-3 h-3" /> PR
                            </span>
                          )}
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          {ex.sets.map((set, si) => (
                            <div key={si} className="bg-[#0a0a0f] rounded-lg px-3 py-2 text-center">
                              <p className="text-xs text-slate-500">Set {si + 1}</p>
                              <p className="text-sm text-white">{set.reps} × {set.weight}kg</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ── PLANS TAB ── */}
      {tab === 'plans' && (
        <div className="space-y-4">
          <p className="text-slate-400 text-sm">Choose a plan and load it directly into the log form. All plans are fully customizable.</p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {WORKOUT_PLANS.map(plan => <PlanCard key={plan.id} plan={plan} onSelect={handlePlanSelect} />)}
          </div>
        </div>
      )}

      {/* ── PRs TAB ── */}
      {tab === 'prs' && (
        <div>
          {prs.length === 0 ? (
            <div className="text-center py-16 text-slate-500 bg-[#111118] border border-[#1e1e2e] rounded-2xl">
              <Trophy className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p className="font-medium">No personal records yet</p>
              <p className="text-sm mt-1">Log a workout with weighted exercises to set your first PR</p>
            </div>
          ) : (
            <div className="bg-[#111118] border border-[#1e1e2e] rounded-2xl overflow-hidden">
              <div className="p-5 border-b border-[#1e1e2e]">
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-400" />
                  <h2 className="text-white font-semibold">Personal Records</h2>
                  <span className="text-xs text-slate-500 ml-1">sorted by estimated 1RM</span>
                </div>
              </div>
              <div className="divide-y divide-[#1e1e2e]">
                {prs.map((pr, i) => (
                  <div key={pr.id} className="flex items-center gap-4 px-5 py-4 hover:bg-[#0d0d14] transition">
                    <div className="w-8 text-center">
                      {i === 0 && <span className="text-lg">🥇</span>}
                      {i === 1 && <span className="text-lg">🥈</span>}
                      {i === 2 && <span className="text-lg">🥉</span>}
                      {i > 2 && <span className="text-slate-500 text-sm font-medium">#{i + 1}</span>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium truncate">{pr.exercise_name}</p>
                      <p className="text-slate-500 text-xs mt-0.5">{format(new Date(pr.date), 'MMM d, yyyy')}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-white font-semibold">{pr.weight}kg × {pr.reps}</p>
                      <div className="flex items-center gap-1 justify-end mt-0.5">
                        <Zap className="w-3 h-3 text-indigo-400" />
                        <span className="text-indigo-400 text-xs font-medium">est. 1RM: {Math.round(pr.estimated_1rm)}kg</span>
                      </div>
                      {pr.initial_estimated_1rm && pr.estimated_1rm > pr.initial_estimated_1rm && (
                        <div className="flex items-center gap-1 justify-end mt-0.5">
                          <TrendingUp className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400 text-xs">
                            +{Math.round(((pr.estimated_1rm - pr.initial_estimated_1rm) / pr.initial_estimated_1rm) * 100)}% since {pr.initial_date ? format(new Date(pr.initial_date + 'T12:00:00'), 'MMM d') : 'start'}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Floating Rest Timer */}
      {showTimer && <RestTimer onClose={() => setShowTimer(false)} />}

      {/* PR Celebration Modal */}
      {celebrationPRs.length > 0 && (
        <PRCelebration prs={celebrationPRs} onClose={() => setCelebrationPRs([])} />
      )}
    </div>
  )
}
