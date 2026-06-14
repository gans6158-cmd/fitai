'use client'
import { useEffect, useRef, useState } from 'react'
import { workoutApi } from '@/lib/api'
import { Workout } from '@/types'
import toast from 'react-hot-toast'
import { Plus, Trash2, ChevronDown, ChevronUp, Dumbbell, Flame, LayoutGrid, ClipboardList } from 'lucide-react'
import { format } from 'date-fns'
import { searchExercises, getExerciseMET, ExerciseInfo } from '@/lib/exerciseDatabase'
import { WORKOUT_PLANS, WorkoutPlan, PlanDay } from '@/lib/workoutPlans'

const CATEGORIES = ['Push', 'Pull', 'Legs', 'Arms', 'Cardio']

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
  let totalMET = 0
  let count = 0
  for (const ex of form.exercises) {
    if (ex.name) { totalMET += getExerciseMET(ex.name); count++ }
  }
  const avgMET = count > 0 ? totalMET / count : 4
  const cals = (avgMET * userWeightKg * 3.5 * duration) / 200
  return Math.round(cals)
}

function ExerciseInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
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
      {suggestions.length > 0 && (
        <div className="absolute z-20 w-full mt-1 bg-[#1a1a28] border border-[#1e1e2e] rounded-xl overflow-hidden shadow-xl">
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

function PlanCard({ plan, onSelect }: { plan: WorkoutPlan; onSelect: (plan: WorkoutPlan) => void }) {
  const [open, setOpen] = useState(false)
  const diffColor = { Beginner: 'text-green-400 bg-green-400/10', Intermediate: 'text-yellow-400 bg-yellow-400/10', Advanced: 'text-red-400 bg-red-400/10' }[plan.difficulty]

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
          <button onClick={() => setOpen(!open)} className="flex-1 bg-[#1e1e2e] hover:bg-[#2a2a3e] text-slate-300 py-2 rounded-xl text-sm font-medium transition flex items-center justify-center gap-1">
            {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            {open ? 'Hide' : 'Preview'}
          </button>
          <button onClick={() => onSelect(plan)} className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-xl text-sm font-medium transition">
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

export default function WorkoutsPage() {
  const [workouts, setWorkouts] = useState<Workout[]>([])
  const [analytics, setAnalytics] = useState<{ total_workouts: number; weekly_count: number; total_volume: number; total_calories_burned: number; category_breakdown: Record<string, number> } | null>(null)
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<'log' | 'history' | 'plans'>('history')
  const [expanded, setExpanded] = useState<string | null>(null)
  const [form, setForm] = useState<WorkoutForm>(defaultForm())
  const [selectedPlan, setSelectedPlan] = useState<WorkoutPlan | null>(null)
  const [selectedDay, setSelectedDay] = useState<PlanDay | null>(null)
  const [userWeight, setUserWeight] = useState(75)

  useEffect(() => {
    const u = localStorage.getItem('fitai_user')
    if (u) {
      const parsed = JSON.parse(u)
      if (parsed.current_weight) setUserWeight(parsed.current_weight)
    }
  }, [])

  const fetchData = async () => {
    const [w, a] = await Promise.all([workoutApi.getWorkouts(), workoutApi.getAnalytics()])
    setWorkouts(w.data)
    setAnalytics(a.data)
  }

  useEffect(() => { fetchData().finally(() => setLoading(false)) }, [])

  const loadPlanDay = (plan: WorkoutPlan, day: PlanDay) => {
    setSelectedPlan(plan)
    setSelectedDay(day)
    setForm({
      name: day.name,
      category: day.category,
      date: format(new Date(), 'yyyy-MM-dd'),
      duration_minutes: '60',
      notes: `From ${plan.name}`,
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
    if (plan.days.length === 1) {
      loadPlanDay(plan, plan.days[0])
    } else {
      setSelectedDay(null)
      setTab('log')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const addExercise = () => setForm(f => ({ ...f, exercises: [...f.exercises, { name: '', sets: [{ reps: '', weight: '' }] }] }))
  const removeExercise = (ei: number) => setForm(f => ({ ...f, exercises: f.exercises.length > 1 ? f.exercises.filter((_, i) => i !== ei) : f.exercises }))
  const addSet = (ei: number) => setForm(f => { const e = [...f.exercises]; e[ei] = { ...e[ei], sets: [...e[ei].sets, { reps: '', weight: '' }] }; return { ...f, exercises: e } })
  const removeSet = (ei: number, si: number) => setForm(f => { const e = [...f.exercises]; const s = e[ei].sets.filter((_, i) => i !== si); e[ei] = { ...e[ei], sets: s.length ? s : [{ reps: '', weight: '' }] }; return { ...f, exercises: e } })
  const updateName = (ei: number, v: string) => setForm(f => { const e = [...f.exercises]; e[ei] = { ...e[ei], name: v }; return { ...f, exercises: e } })
  const updateSet = (ei: number, si: number, k: 'reps' | 'weight', v: string) => setForm(f => { const e = [...f.exercises]; const s = [...e[ei].sets]; s[si] = { ...s[si], [k]: v }; e[ei] = { ...e[ei], sets: s }; return { ...f, exercises: e } })

  const estimatedCals = calcCaloriesBurned(form, userWeight)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await workoutApi.createWorkout({
        name: form.name, category: form.category, date: form.date,
        duration_minutes: form.duration_minutes ? parseInt(form.duration_minutes) : undefined,
        notes: form.notes || undefined,
        calories_burned: estimatedCals,
        exercises: form.exercises.map(ex => ({
          name: ex.name,
          sets: ex.sets.map(s => ({ reps: parseInt(s.reps) || 0, weight: parseFloat(s.weight) || 0 })),
        })),
      })
      toast.success(`Workout logged! ~${estimatedCals} kcal burned 🔥`)
      setForm(defaultForm())
      setSelectedPlan(null); setSelectedDay(null)
      await fetchData()
      setTab('history')
    } catch { toast.error('Failed to save workout') }
  }

  const inputClass = "bg-[#0a0a0f] border border-[#1e1e2e] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500 transition"

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Workouts</h1>
          <p className="text-slate-400 mt-1">Track training & burn calories</p>
        </div>
        <button onClick={() => { setForm(defaultForm()); setTab('log') }}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded-xl flex items-center gap-2 transition">
          <Plus className="w-4 h-4" /> Log Workout
        </button>
      </div>

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
      <div className="flex gap-1 bg-[#111118] border border-[#1e1e2e] rounded-xl p-1 mb-6 w-fit">
        {[{ id: 'history', label: 'History' }, { id: 'log', label: 'Log Workout' }, { id: 'plans', label: 'Workout Plans' }].map(t => (
          <button key={t.id} onClick={() => setTab(t.id as typeof tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${tab === t.id ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* LOG WORKOUT TAB */}
      {tab === 'log' && (
        <div className="bg-[#111118] border border-[#1e1e2e] rounded-2xl p-6 mb-6">
          {selectedPlan && (
            <div className="mb-4 p-3 bg-indigo-600/10 border border-indigo-500/30 rounded-xl flex items-center justify-between">
              <p className="text-indigo-400 text-sm font-medium">
                Plan: {selectedPlan.name}{selectedDay ? ` — ${selectedDay.name}` : ''}
              </p>
              {selectedPlan && !selectedDay && selectedPlan.days.length > 1 && (
                <div className="flex gap-2 flex-wrap">
                  {selectedPlan.days.map((d, i) => (
                    <button key={i} onClick={() => loadPlanDay(selectedPlan, d)}
                      className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded-lg transition">{d.name}</button>
                  ))}
                </div>
              )}
            </div>
          )}

          <h2 className="text-lg font-semibold text-white mb-4">
            {selectedDay ? `Log: ${selectedDay.name}` : 'Log New Workout'}
          </h2>
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

            {/* Calorie estimate */}
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
                <button type="button" onClick={addExercise} className="text-indigo-400 text-sm hover:text-indigo-300">+ Add Exercise</button>
              </div>
              {form.exercises.map((ex, ei) => (
                <div key={ei} className="bg-[#0a0a0f] rounded-xl p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <ExerciseInput value={ex.name} onChange={v => updateName(ei, v)} />
                    {form.exercises.length > 1 && (
                      <button type="button" onClick={() => removeExercise(ei)} className="text-slate-600 hover:text-red-400 transition text-sm shrink-0">✕</button>
                    )}
                  </div>
                  <div className="space-y-2">
                    <div className="grid grid-cols-3 gap-2 text-xs text-slate-500 px-1">
                      <span>Set</span><span>Reps</span><span>Weight (kg)</span>
                    </div>
                    {ex.sets.map((set, si) => (
                      <div key={si} className="flex gap-2 items-center">
                        <span className="text-slate-500 text-sm w-6 shrink-0">#{si + 1}</span>
                        <input type="number" required value={set.reps} onChange={e => updateSet(ei, si, 'reps', e.target.value)} className={inputClass + ' w-full'} placeholder="Reps" />
                        <input type="number" step="0.5" value={set.weight} onChange={e => updateSet(ei, si, 'weight', e.target.value)} className={inputClass + ' w-full'} placeholder="kg" />
                        {ex.sets.length > 1 && <button type="button" onClick={() => removeSet(ei, si)} className="text-slate-600 hover:text-red-400 transition text-sm shrink-0">✕</button>}
                      </div>
                    ))}
                  </div>
                  <button type="button" onClick={() => addSet(ei)} className="text-indigo-400 text-xs hover:text-indigo-300">+ Add Set</button>
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

      {/* HISTORY TAB */}
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
                    <p className="text-slate-400 text-sm">{w.category} • {format(new Date(w.date), 'MMM d, yyyy')} • {w.exercises.length} exercises</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {w.calories_burned ? (
                    <span className="text-orange-400 text-sm font-medium flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5" />{Math.round(w.calories_burned)}
                    </span>
                  ) : null}
                  <span className="text-slate-400 text-sm hidden sm:block">{w.total_volume?.toLocaleString()} kg</span>
                  <button onClick={e => { e.stopPropagation(); workoutApi.deleteWorkout(w.id).then(() => { setWorkouts(workouts.filter(x => x.id !== w.id)); toast.success('Deleted') }) }}
                    className="text-slate-600 hover:text-red-400 transition"><Trash2 className="w-4 h-4" /></button>
                  {expanded === w.id ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                </div>
              </div>
              {expanded === w.id && (
                <div className="border-t border-[#1e1e2e] p-5">
                  {w.exercises.map((ex, i) => (
                    <div key={i} className="mb-4">
                      <p className="text-white font-medium mb-2">{ex.name}</p>
                      <div className="grid grid-cols-3 gap-2">
                        {ex.sets.map((set, si) => (
                          <div key={si} className="bg-[#0a0a0f] rounded-lg px-3 py-2 text-center">
                            <p className="text-xs text-slate-500">Set {si + 1}</p>
                            <p className="text-sm text-white">{set.reps} × {set.weight}kg</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* PLANS TAB */}
      {tab === 'plans' && (
        <div className="space-y-4">
          <p className="text-slate-400 text-sm">Choose a plan and load it directly into the log form. All plans are fully customizable.</p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {WORKOUT_PLANS.map(plan => <PlanCard key={plan.id} plan={plan} onSelect={handlePlanSelect} />)}
          </div>
        </div>
      )}
    </div>
  )
}
