'use client'
import { useEffect, useRef, useState } from 'react'
import { nutritionApi } from '@/lib/api'
import { NutritionLog } from '@/types'
import toast from 'react-hot-toast'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import { Plus, Trash2, Apple } from 'lucide-react'
import { FoodItem, searchFoods } from '@/lib/foodDatabase'

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

const emptyForm = {
  food_name: '', calories: '', protein: '', carbs: '', fats: '',
  serving_size: '', meal_type: 'breakfast',
}

export default function NutritionPage() {
  const [summary, setSummary] = useState<TodaySummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState(emptyForm)
  const [adding, setAdding] = useState(false)
  const [suggestions, setSuggestions] = useState<FoodItem[]>([])
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null)
  const [quantity, setQuantity] = useState('')
  const suggestRef = useRef<HTMLDivElement>(null)

  const fetchSummary = async () => {
    const res = await nutritionApi.getTodaySummary()
    setSummary(res.data)
  }

  useEffect(() => { fetchSummary().finally(() => setLoading(false)) }, [])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (suggestRef.current && !suggestRef.current.contains(e.target as Node)) {
        setSuggestions([])
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleFoodSearch = (value: string) => {
    setForm(f => ({ ...f, food_name: value }))
    setSelectedFood(null)
    setQuantity('')
    setSuggestions(searchFoods(value))
  }

  const handleFoodSelect = (food: FoodItem) => {
    setSelectedFood(food)
    setForm(f => ({ ...f, food_name: food.name, calories: '', protein: '', carbs: '', fats: '' }))
    setQuantity('')
    setSuggestions([])
  }

  const handleQuantityChange = (q: string) => {
    setQuantity(q)
    if (selectedFood && q && parseFloat(q) > 0) {
      const m = parseFloat(q) / 100
      setForm(f => ({
        ...f,
        calories: (selectedFood.cal * m).toFixed(1),
        protein: (selectedFood.pro * m).toFixed(1),
        carbs: (selectedFood.carb * m).toFixed(1),
        fats: (selectedFood.fat * m).toFixed(1),
        serving_size: `${q}g`,
      }))
    } else if (selectedFood) {
      setForm(f => ({ ...f, calories: '', protein: '', carbs: '', fats: '' }))
    }
  }

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
      setForm(emptyForm)
      setSelectedFood(null)
      setQuantity('')
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

            {/* Food search with autocomplete */}
            <div className="relative" ref={suggestRef}>
              <input
                type="text"
                required
                placeholder="Search food (e.g. chicken, rice...)"
                value={form.food_name}
                onChange={e => handleFoodSearch(e.target.value)}
                onFocus={() => form.food_name && setSuggestions(searchFoods(form.food_name))}
                className={inputClass}
                autoComplete="off"
              />
              {suggestions.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-[#1a1a28] border border-[#1e1e2e] rounded-xl overflow-hidden shadow-xl">
                  {suggestions.map((food, i) => (
                    <button
                      key={i}
                      type="button"
                      onMouseDown={() => handleFoodSelect(food)}
                      className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-[#2a2a3e] transition text-left"
                    >
                      <span className="text-white text-sm">{food.name}</span>
                      <span className="text-slate-400 text-xs ml-2 shrink-0">{food.cal} kcal/100g</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Quantity input (shown when food selected from DB) */}
            {selectedFood && (
              <div>
                <label className="text-xs text-slate-400 block mb-1">
                  Quantity (g) — {selectedFood.cal} kcal per 100g
                </label>
                <input
                  type="number"
                  required
                  placeholder="Enter grams (e.g. 150)"
                  value={quantity}
                  onChange={e => handleQuantityChange(e.target.value)}
                  className={inputClass}
                  min="1"
                />
              </div>
            )}

            {/* Manual macro entry (shown when no DB food selected) */}
            {!selectedFood && (
              <div className="grid grid-cols-2 gap-3">
                <input type="number" step="0.1" required placeholder="Calories" value={form.calories} onChange={e => setForm({ ...form, calories: e.target.value })} className={inputClass} />
                <input type="number" step="0.1" required placeholder="Protein (g)" value={form.protein} onChange={e => setForm({ ...form, protein: e.target.value })} className={inputClass} />
                <input type="number" step="0.1" required placeholder="Carbs (g)" value={form.carbs} onChange={e => setForm({ ...form, carbs: e.target.value })} className={inputClass} />
                <input type="number" step="0.1" required placeholder="Fats (g)" value={form.fats} onChange={e => setForm({ ...form, fats: e.target.value })} className={inputClass} />
              </div>
            )}

            {/* Calculated macros preview (shown when food + quantity selected) */}
            {selectedFood && form.calories && (
              <div className="grid grid-cols-4 gap-2 p-3 bg-[#0a0a0f] rounded-xl">
                {[
                  { label: 'Cal', value: form.calories, color: 'text-orange-400' },
                  { label: 'Pro', value: form.protein + 'g', color: 'text-indigo-400' },
                  { label: 'Carbs', value: form.carbs + 'g', color: 'text-green-400' },
                  { label: 'Fat', value: form.fats + 'g', color: 'text-yellow-400' },
                ].map(m => (
                  <div key={m.label} className="text-center">
                    <p className={`text-sm font-semibold ${m.color}`}>{m.value}</p>
                    <p className="text-xs text-slate-500">{m.label}</p>
                  </div>
                ))}
              </div>
            )}

            <select value={form.meal_type} onChange={e => setForm({ ...form, meal_type: e.target.value })} className={inputClass}>
              {MEAL_TYPES.map(m => <option key={m} value={m}>{m.charAt(0).toUpperCase() + m.slice(1)}</option>)}
            </select>

            <button
              type="submit"
              disabled={adding || !form.food_name || !form.calories}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition"
            >
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
                    <p className="text-xs text-slate-400">{log.meal_type} • P:{log.protein}g C:{log.carbs}g F:{log.fats}g{log.serving_size ? ` • ${log.serving_size}` : ''}</p>
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
