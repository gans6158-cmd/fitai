'use client'
import { useEffect, useState } from 'react'
import { weightApi } from '@/lib/api'
import { WeightLog } from '@/types'
import toast from 'react-hot-toast'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Plus, Trash2 } from 'lucide-react'
import { format } from 'date-fns'

export default function WeightPage() {
  const [logs, setLogs] = useState<WeightLog[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ weight: '', date: format(new Date(), 'yyyy-MM-dd'), notes: '' })
  const [adding, setAdding] = useState(false)

  const fetchLogs = async () => {
    const res = await weightApi.getLogs()
    setLogs(
      (res.data as WeightLog[]).sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      )
    )
  }

  useEffect(() => { fetchLogs().finally(() => setLoading(false)) }, [])

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    setAdding(true)
    try {
      await weightApi.addLog({ weight: parseFloat(form.weight), date: form.date, notes: form.notes || undefined })
      toast.success('Weight logged!')
      setForm({ weight: '', date: format(new Date(), 'yyyy-MM-dd'), notes: '' })
      await fetchLogs()
    } catch {
      toast.error('Failed to log weight')
    } finally {
      setAdding(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await weightApi.deleteLog(id)
      toast.success('Entry deleted')
      setLogs(logs.filter(l => l.id !== id))
    } catch {
      toast.error('Failed to delete')
    }
  }

  const chartData = logs.map(l => ({ date: format(new Date(l.date), 'MMM d'), weight: l.weight }))

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Weight Tracking</h1>
        <p className="text-slate-400 mt-1">Monitor your weight progress over time</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-[#111118] border border-[#1e1e2e] rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Log Weight</h2>
          <form onSubmit={handleAdd} className="space-y-4">
            <div>
              <label className="text-sm text-slate-400 block mb-2">Weight (kg)</label>
              <input
                type="number" step="0.1" required value={form.weight}
                onChange={e => setForm({ ...form, weight: e.target.value })}
                className="w-full bg-[#0a0a0f] border border-[#1e1e2e] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
                placeholder="75.5"
              />
            </div>
            <div>
              <label className="text-sm text-slate-400 block mb-2">Date</label>
              <input
                type="date" value={form.date}
                onChange={e => setForm({ ...form, date: e.target.value })}
                className="w-full bg-[#0a0a0f] border border-[#1e1e2e] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="text-sm text-slate-400 block mb-2">Notes (optional)</label>
              <input
                type="text" value={form.notes}
                onChange={e => setForm({ ...form, notes: e.target.value })}
                className="w-full bg-[#0a0a0f] border border-[#1e1e2e] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
                placeholder="After morning workout..."
              />
            </div>
            <button type="submit" disabled={adding} className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition">
              <Plus className="w-4 h-4" />
              {adding ? 'Logging...' : 'Log Weight'}
            </button>
          </form>
        </div>

        <div className="lg:col-span-2 bg-[#111118] border border-[#1e1e2e] rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Weight Trend</h2>
          {chartData.length > 1 ? (
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e1e2e" />
                <XAxis dataKey="date" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <YAxis stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 12 }} domain={['auto', 'auto']} />
                <Tooltip contentStyle={{ background: '#111118', border: '1px solid #1e1e2e', borderRadius: '12px', color: '#fff' }} />
                <Line type="monotone" dataKey="weight" stroke="#6366f1" strokeWidth={2} dot={{ fill: '#6366f1', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex items-center justify-center text-slate-500">
              Log at least 2 entries to see your trend
            </div>
          )}
        </div>
      </div>

      <div className="bg-[#111118] border border-[#1e1e2e] rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4">History</h2>
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : logs.length === 0 ? (
          <p className="text-slate-500 text-center py-8">No weight logs yet. Add your first entry!</p>
        ) : (
          <div className="space-y-2">
            {[...logs].reverse().map(log => (
              <div key={log.id} className="flex items-center justify-between p-4 bg-[#0a0a0f] rounded-xl">
                <div>
                  <span className="text-white font-semibold">{log.weight} kg</span>
                  {log.notes && <span className="text-slate-400 text-sm ml-3">{log.notes}</span>}
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-slate-400 text-sm">{format(new Date(log.date), 'MMM d, yyyy')}</span>
                  <button onClick={() => handleDelete(log.id)} className="text-slate-600 hover:text-red-400 transition">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
