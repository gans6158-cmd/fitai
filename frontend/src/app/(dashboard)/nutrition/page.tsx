'use client'
import { useEffect, useState } from 'react'
import { nutritionApi } from '@/lib/api'
import { NutritionLog } from '@/types'
import toast from 'react-hot-toast'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import { Plus, Trash2, Apple } from 'lucide-react'

const MEAL_TYPES = ['breakfast', 'lunch', 'dinner', 'snack', 'other']
const COLORS = ['#6366f1', '#8b5cf6', '#ec4899']

interface TodaySummary {
  consumed_calories: number
  remaining_calories: number
  target_calories: number
  consumed_protein: number
  remaining_protein: number
  target_protein: number
  consumed_carbs: number
  consumed_fats: number
  logs: NutritionLog[]
}

export default function NutritionPage() {
  const [summary, setSummary] = useState<TodaySummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ food_name: '', calories: '', protein: '', carbs: '', fats: '', serving_size: '', meal_type: 'breakfast' })
  const [adding, setAdding] = useState(false)

  const fetchSummary = async () => {
    const res = await nutritionApi.getTodaySummary()
    setSummary(res.data)
  }

  useEffect(() => { fetchSummary().finally(() => setLoading(false)) }, [])

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    setAdding(true)
    try {
      await nutritionApi.addLog({
        food_name: form.food_name,
        calories: parseFloat(form.calories),
        protein: parseFloat(form.protein),
        carbs: parseFloat(form.carbs),
        fats: parseFloat(form.fats),
        serving_size: form.serving_size || undefined,
        meal_type: form.meal_type,
      })
      toast.success('Food logged!')
      setForm({ food_name: '', calories: '', protein: '', carbs: '', fats: '', serving_size: '', meal_type: 'breakfast' })
      await fetchSummary()
    } catch {
      toast.error('Failed to log food')
    } finally {
      setAdding(false)
    }
  }

  const inputClass = "w-full bg-[#0a0a0f] border border-[#1e1e2e] rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"

  const macroData = summary ? [
    { name: 'Protein', value: Math.round(summary.consumed_protein) },
    { name: 'Carbs', value: Math.round(summary.consumed_carbs) },
    { name: 'Fats', value: Math.round(summary.consumed_fats) },
  ] : []

  const calProgress = summary ? Math.min((summary.consumed_calories / summary.target_calories) * 100, 100) : 0
  const proteinProgress = summary ? Math.min((summary.consumed_protein / summary.target_protein) * 100, 100) : 0

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Nutrition</h1>
        <p className="text-slate-400 mt-1">Track your daily food intake</p>
      </div>

      {summary && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-[#111118] border border-[#1e1e2e] rounded-2xl p-6 space-y-4">
            <h2 className="text-lg font-semibold text-white">{"Today's Progress"}</h2>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-400">Calories</span>
                <span className="text-white">{summary.consumed_calories} / {summary.target_calories} kcal</span>
              </div>
              <div className="h-3 bg-[#1e1e2e] rounded-full overflow-hidden">
                <div className="h-full bg-orange-500 rounded-full transition-all" style={{ width: `${calProgress}%` }} />
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {summary.remaining_calories > 0 ? `${summary.remaining_calories} kcal remaining` : 'Goal reached!'}
              </p>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-400">Protein</span>
                <span className="text-white">{summary.consumed_protein}g / {summary.target_protein}g</span>
              </div>
              <div className="h-3 bg-[#1e1e2e] rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500 rounded-full transition-all" style={{ width: `${proteinProgress}%` }} />
              </div>
            </div>
          </div>

          <div className="bg-[#111118] border border-[#1e1e2e] rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-2">Macros Breakdown</h2>
            {macroData.every(d => d.value === 0) ? (
              <div className="flex items-center justify-center h-40 text-slate-500 text-sm">No food logged today</div>
            ) : (
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie data={macroData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value">
                    {macroData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                  </Pie>
                  <Legend />
                  <Tooltip contentStyle={{ background: '#111118', border: '1px solid #1e1e2e', borderRadius: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-[#111118] border border-[#1e1e2e] rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Log Food</h2>
          <form onSubmit={handleAdd} className="space-y-3">
            <input type="text" required placeholder="Food name" value={form.food_name} onChange={e => setForm({ ...form, food_name: e.target.value })} className={inputClass} />
            <div className="grid grid-cols-2 gap-3">
              <input type="number" step="0.1" required placeholder="Calories" value={form.calories} onChange={e => setForm({ ...form, calories: e.target.value })} className={inputClass} />
              <input type="number" step="0.1" required placeholder="Protein (g)" value={form.protein} onChange={e => setForm({ ...form, protein: e.target.value })} className={inputClass} />
              <input type="number" step="0.1" required placeholder="Carbs (g)" value={form.carbs} onChange={e => setForm({ ...form, carbs: e.target.value })} className={inputClass} />
              <input type="number" step="0.1" required placeholder="Fats (g)" value={form.fats} onChange={e => setForm({ ...form, fats: e.target.value })} className={inputClass} />
            </div>
            <input type="text" placeholder="Serving size (optional)" value={form.serving_size} onChange={e => setForm({ ...form, serving_size: e.target.value })} className={inputClass} />
            <select value={form.meal_type} onChange={e => setForm({ ...form, meal_type: e.target.value })} className={inputClass}>
              {MEAL_TYPES.map(m => <option key={m} value={m}>{m.charAt(0).toUpperCase() + m.slice(1)}</option>)}
            </select>
            <button type="submit" disabled={adding} className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition">
              <Plus className="w-4 h-4" />
              {adding ? 'Logging...' : 'Log Food'}
            </button>
          </form>
        </div>

        <div className="lg:col-span-2 bg-[#111118] border border-[#1e1e2e] rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">{"Today's Foods"}</h2>
          {loading ? (
            <div className="flex justify-center py-8"><div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" /></div>
          ) : !summary?.logs?.length ? (
            <div className="text-center py-12 text-slate-500">
              <Apple className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p>No food logged today</p>
            </div>
          ) : (
            <div className="space-y-2">
              {summary.logs.map((log: NutritionLog) => (
                <div key={log.id} className="flex items-center justify-between p-4 bg-[#0a0a0f] rounded-xl">
                  <div>
                    <p className="text-white font-medium">{log.food_name}</p>
                    <p className="text-xs text-slate-400">{log.meal_type} • P:{log.protein}g C:{log.carbs}g F:{log.fats}g</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-orange-400 font-semibold">{log.calories} kcal</span>
                    <button onClick={() => nutritionApi.deleteLog(log.id).then(fetchSummary)} className="text-slate-600 hover:text-red-400 transition">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
