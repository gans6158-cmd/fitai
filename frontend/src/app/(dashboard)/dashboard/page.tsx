'use client'
import { useEffect, useState } from 'react'
import { userApi } from '@/lib/api'
import { User, UserStats } from '@/types'
import { getBMICategory } from '@/lib/utils'
import { Scale, Flame, Target, Activity, TrendingDown, TrendingUp, Award, Clock } from 'lucide-react'

function StatCard({ icon: Icon, label, value, sub, color }: {
  icon: React.ElementType; label: string; value: string | number | undefined; sub?: string; color: string
}) {
  return (
    <div className="bg-[#111118] border border-[#1e1e2e] rounded-2xl p-6 hover:border-indigo-500/30 transition">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${color}`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <p className="text-slate-400 text-sm mb-1">{label}</p>
      <p className="text-2xl font-bold text-white">{value}</p>
      {sub && <p className="text-xs text-slate-500 mt-1">{sub}</p>}
    </div>
  )
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [stats, setStats] = useState<UserStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('fitai_user')
    if (stored) setUser(JSON.parse(stored))

    Promise.all([userApi.getProfile(), userApi.getStats()])
      .then(([profileRes, statsRes]) => {
        setUser(profileRes.data)
        setStats(statsRes.data)
        localStorage.setItem('fitai_user', JSON.stringify(profileRes.data))
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const bmiCategory = stats ? getBMICategory(stats.bmi) : null
  const isLosingWeight = user && user.goal_weight < user.current_weight
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening'

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">
          Good {greeting}, {user?.name?.split(' ')[0]} 👋
        </h1>
        <p className="text-slate-400 mt-1">{"Here's your fitness overview for today"}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <StatCard icon={Scale} label="Current Weight" value={`${user?.current_weight} kg`} sub={`Goal: ${user?.goal_weight} kg`} color="bg-indigo-600" />
        <StatCard
          icon={isLosingWeight ? TrendingDown : TrendingUp}
          label="Weight to Goal"
          value={`${Math.abs(stats?.weight_difference || 0)} kg`}
          sub={isLosingWeight ? 'to lose' : 'to gain'}
          color="bg-purple-600"
        />
        <StatCard icon={Activity} label="BMI" value={stats?.bmi} sub={bmiCategory?.label} color="bg-blue-600" />
        <StatCard icon={Award} label="Fitness Score" value={`${stats?.fitness_score}/100`} sub="Overall health rating" color="bg-emerald-600" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={Flame} label="Daily Calories" value={stats?.daily_calories?.toLocaleString()} sub="TDEE target" color="bg-orange-600" />
        <StatCard icon={Target} label="Daily Protein" value={`${stats?.daily_protein}g`} sub="Protein target" color="bg-rose-600" />
        <StatCard
          icon={TrendingDown}
          label="Weekly Rate"
          value={`${Math.abs(stats?.weekly_rate || 0)} kg/wk`}
          sub="Weight change rate"
          color="bg-cyan-600"
        />
        <StatCard
          icon={Clock}
          label="Goal ETA"
          value={stats?.weeks_to_goal ? `${stats.weeks_to_goal} wks` : 'Log weight'}
          sub="Estimated time"
          color="bg-yellow-600"
        />
      </div>

      {stats?.weeks_to_goal && (
        <div className="bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border border-indigo-500/30 rounded-2xl p-6">
          <p className="text-white font-semibold text-lg">
            🎯 At your current progress, you will reach your goal weight in{' '}
            <span className="text-indigo-400">{stats.weeks_to_goal} weeks</span>
          </p>
          <p className="text-slate-400 mt-1 text-sm">Keep logging your weight daily for accurate predictions</p>
        </div>
      )}
    </div>
  )
}
