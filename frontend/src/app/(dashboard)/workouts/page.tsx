'use client'
import { useEffect, useState } from 'react'
import { workoutApi } from '@/lib/api'
import { Workout } from '@/types'
import toast from 'react-hot-toast'
import { Plus, Trash2, ChevronDown, ChevronUp, Dumbbell } from 'lucide-react'
import { format } from 'date-fns'

const CATEGORIES = ['Push', 'Pull', 'Legs', 'Arms', 'Cardio']

interface SetForm { reps: string; weight: string }
interface ExerciseForm { name: string; sets: SetForm[] }
interface WorkoutForm {
  name: string; category: string; date: string;
  duration_minutes: string; notes: string; exercises: ExerciseForm[]
}

export default function WorkoutsPage() {
  const [workouts, setWorkouts] = useState<Workout[]>([])
  const [analytics, setAnalytics] = useState<{ total_workouts: number; weekly_count: number; total_volume: number; category_breakdown: Record<string, number> } | null>(null)
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [expanded, setExpanded] = useState<string | null>(null)
  const [form, setForm] = useState<WorkoutForm>({
    name: '', category: 'Push', date: format(new Date(), 'yyyy-MM-dd'),
    duration_minutes: '', notes: '',
    exercises: [{ name: '', sets: [{ reps: '', weight: '' }] }],
  })

  const fetchData = async () => {
    const [w, a] = await Promise.all([workoutApi.getWorkouts(), workoutApi.getAnalytics()])
    setWorkouts(w.data)
    setAnalytics(a.data)
  }

  useEffect(() => { fetchData().finally(() => setLoading(false)) }, [])

  const addExercise = () => setForm(f => ({ ...f, exercises: [...f.exercises, { name: '', sets: [{ reps: '', weight: '' }] }] }))

  const addSet = (ei: number) => setForm(f => {
    const exs = [...f.exercises]
    exs[ei] = { ...exs[ei], sets: [...exs[ei].sets, { reps: '', weight: '' }] }
    return { ...f, exercises: exs }
  })

  const updateExerciseName = (ei: number, v: string) => setForm(f => {
    const exs = [...f.exercises]; exs[ei] = { ...exs[ei], name: v }; return { ...f, exercises: exs }
  })

  const updateSet = (ei: number, si: number, k: 'reps' | 'weight', v: string) => setForm(f => {
    const exs = [...f.exercises]
    const sets = [...exs[ei].sets]
    sets[si] = { ...sets[si], [k]: v }
    exs[ei] = { ...exs[ei], sets }
    return { ...f, exercises: exs }
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const payload = {
        name: form.name,
        category: form.category,
        date: form.date,
        duration_minutes: form.duration_minutes ? parseInt(form.duration_minutes) : undefined,
        notes: form.notes || undefined,
        exercises: form.exercises.map(ex => ({
          name: ex.name,
          sets: ex.sets.map(s => ({ reps: parseInt(s.reps), weight: parseFloat(s.weight) })),
        })),
      }
      await workoutApi.createWorkout(payload)
      toast.success('Workout logged!')
      setShowForm(false)
      setForm({ name: '', category: 'Push', date: format(new Date(), 'yyyy-MM-dd'), duration_minutes: '', notes: '', exercises: [{ name: '', sets: [{ reps: '', weight: '' }] }] })
      await fetchData()
    } catch {
      toast.error('Failed to save workout')
    }
  }

  const inputClass = "bg-[#0a0a0f] border border-[#1e1e2e] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-indigo-500 transition"

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Workouts</h1>
          <p className="text-slate-400 mt-1">Track your training sessions</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded-xl flex items-center gap-2 transition">
          <Plus className="w-4 h-4" />
          Log Workout
        </button>
      </div>

      {analytics && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Workouts', value: analytics.total_workouts },
            { label: 'This Week', value: analytics.weekly_count },
            { label: 'Total Volume', value: `${analytics.total_volume?.toLocaleString()} kg` },
            { label: 'Top Category', value: Object.entries(analytics.category_breakdown || {}).sort((a, b) => b[1] - a[1])[0]?.[0] || '-' },
          ].map(s => (
            <div key={s.label} className="bg-[#111118] border border-[#1e1e2e] rounded-2xl p-4">
              <p className="text-slate-400 text-sm">{s.label}</p>
              <p className="text-2xl font-bold text-white mt-1">{s.value}</p>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="bg-[#111118] border border-[#1e1e2e] rounded-2xl p-6 mb-8">
          <h2 className="text-lg font-semibold text-white mb-4">Log New Workout</h2>
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

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-white font-medium">Exercises</h3>
                <button type="button" onClick={addExercise} className="text-indigo-400 text-sm hover:text-indigo-300">+ Add Exercise</button>
              </div>
              {form.exercises.map((ex, ei) => (
                <div key={ei} className="bg-[#0a0a0f] rounded-xl p-4 space-y-3">
                  <input type="text" required value={ex.name} onChange={e => updateExerciseName(ei, e.target.value)} className={inputClass + ' w-full'} placeholder="Exercise name (e.g. Bench Press)" />
                  {ex.sets.map((set, si) => (
                    <div key={si} className="flex gap-3 items-center">
                      <span className="text-slate-500 text-sm w-12">Set {si + 1}</span>
                      <input type="number" required value={set.reps} onChange={e => updateSet(ei, si, 'reps', e.target.value)} className={inputClass + ' w-24'} placeholder="Reps" />
                      <input type="number" step="0.5" required value={set.weight} onChange={e => updateSet(ei, si, 'weight', e.target.value)} className={inputClass + ' w-24'} placeholder="kg" />
                    </div>
                  ))}
                  <button type="button" onClick={() => addSet(ei)} className="text-slate-500 text-sm hover:text-slate-400">+ Add Set</button>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <button type="button" onClick={() => setShowForm(false)} className="flex-1 bg-[#1e1e2e] hover:bg-[#2a2a3e] text-white py-3 rounded-xl font-semibold transition">Cancel</button>
              <button type="submit" className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold transition">Save Workout</button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-3">
        {loading ? (
          <div className="flex justify-center py-12"><div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" /></div>
        ) : workouts.length === 0 ? (
          <div className="text-center py-16 text-slate-500">
            <Dumbbell className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p>No workouts logged yet. Start your first session!</p>
          </div>
        ) : workouts.map(w => (
          <div key={w.id} className="bg-[#111118] border border-[#1e1e2e] rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between p-5 cursor-pointer" onClick={() => setExpanded(expanded === w.id ? null : w.id)}>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-indigo-600/20 rounded-xl flex items-center justify-center">
                  <Dumbbell className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                  <p className="text-white font-semibold">{w.name}</p>
                  <p className="text-slate-400 text-sm">{w.category} • {format(new Date(w.date), 'MMM d, yyyy')} • {w.exercises.length} exercises</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-slate-400 text-sm">{w.total_volume.toLocaleString()} kg</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    workoutApi.deleteWorkout(w.id).then(() => {
                      setWorkouts(workouts.filter(x => x.id !== w.id))
                      toast.success('Deleted')
                    })
                  }}
                  className="text-slate-600 hover:text-red-400 transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
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
    </div>
  )
}
