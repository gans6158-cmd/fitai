'use client'
import { useEffect, useState } from 'react'
import { userApi, nutritionApi, workoutApi, weightApi } from '@/lib/api'
import { User, UserStats, NutritionLog, Workout, WeightLog } from '@/types'
import { getBMICategory } from '@/lib/utils'
import {
  Scale, Flame, Target, Activity, TrendingDown, TrendingUp, Award,
  Clock, Dumbbell, Zap, ChevronRight, DropletIcon, Apple, Trophy, Calendar
} from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import Link from 'next/link'

const MOTIVATIONAL_QUOTES = [
  "The only bad workout is the one that didn't happen.",
  "Push yourself, because no one else is going to do it for you.",
  "Success is the sum of small efforts repeated day in and day out.",
  "Your body can stand almost anything. It's your mind you have to convince.",
  "Don't stop when you're tired. Stop when you're done.",
  "Strength does not come from the body. It comes from the will.",
  "The pain you feel today will be the strength you feel tomorrow.",
  "Fall in love with taking care of your body.",
]

function MacroRing({ value, max, color, label }: { value: number; max: number; color: string; label: string }) {
  const pct = Math.min(value / (max || 1), 1)
  const r = 30
  const circ = 2 * Math.PI * r
  const dash = pct * circ
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative w-20 h-20">
        <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
          <circle cx="40" cy="40" r={r} fill="none" stroke="#1e1e2e" strokeWidth="8" />
          <circle
            cx="40" cy="40" r={r} fill="none"
            stroke={color} strokeWidth="8"
            strokeDasharray={`${dash} ${circ}`}
            strokeLinecap="round"
            style={{ transition: 'stroke-dasharray 0.8s ease' }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-bold text-white">{Math.round(pct * 100)}%</span>
        </div>
      </div>
      <p className="text-xs text-slate-400">{label}</p>
      <p className="text-xs font-semibold text-white">{Math.round(value)}<span className="text-slate-500">/{Math.round(max)}</span></p>
    </div>
  )
}

function StatCard({ icon: Icon, label, value, sub, color, gradient }: {
  icon: React.ElementType; label: string; value: string | number | undefined; sub?: string; color: string; gradient?: string
}) {
  return (
    <div className={`relative overflow-hidden bg-[#111118] border border-[#1e1e2e] rounded-2xl p-5 hover:border-indigo-500/40 transition-all duration-300 group`}>
      {gradient && <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 ${gradient}`} />}
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${color}`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <p className="text-slate-400 text-xs mb-1 uppercase tracking-wide">{label}</p>
      <p className="text-2xl font-bold text-white">{value ?? '—'}</p>
      {sub && <p className="text-xs text-slate-500 mt-1">{sub}</p>}
    </div>
  )
}

function WorkoutRow({ workout }: { workout: Workout }) {
  const categoryColors: Record<string, string> = {
    strength: 'text-indigo-400 bg-indigo-500/10',
    cardio: 'text-emerald-400 bg-emerald-500/10',
    hiit: 'text-orange-400 bg-orange-500/10',
    flexibility: 'text-purple-400 bg-purple-500/10',
    sports: 'text-cyan-400 bg-cyan-500/10',
  }
  const cls = categoryColors[workout.category?.toLowerCase()] || 'text-slate-400 bg-slate-500/10'
  return (
    <div className="flex items-center gap-3 py-3 border-b border-[#1e1e2e] last:border-0">
      <div className="w-9 h-9 rounded-xl bg-[#1a1a2e] flex items-center justify-center flex-shrink-0">
        <Dumbbell className="w-4 h-4 text-indigo-400" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white truncate">{workout.name}</p>
        <p className="text-xs text-slate-500">{workout.exercises?.length} exercises • {new Date(workout.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
      </div>
      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${cls}`}>{workout.category}</span>
    </div>
  )
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [stats, setStats] = useState<UserStats | null>(null)
  const [todayNutrition, setTodayNutrition] = useState<{ calories: number; protein: number; carbs: number; fats: number } | null>(null)
  const [workoutAnalytics, setWorkoutAnalytics] = useState<{ total_workouts: number; total_volume: number; weekly_count: number; total_calories_burned?: number; streak?: number } | null>(null)
  const [recentWorkouts, setRecentWorkouts] = useState<Workout[]>([])
  const [weightLogs, setWeightLogs] = useState<WeightLog[]>([])
  const [loading, setLoading] = useState(true)
  const [quote] = useState(() => MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)])

  useEffect(() => {
    const stored = localStorage.getItem('fitai_user')
    if (stored) setUser(JSON.parse(stored))

    Promise.all([
      userApi.getProfile(),
      userApi.getStats(),
      nutritionApi.getTodaySummary().catch(() => ({ data: null })),
      workoutApi.getAnalytics().catch(() => ({ data: null })),
      workoutApi.getWorkouts().catch(() => ({ data: [] })),
      weightApi.getLogs().catch(() => ({ data: [] })),
    ]).then(([profileRes, statsRes, nutritionRes, analyticsRes, workoutsRes, weightRes]) => {
      setUser(profileRes.data)
      setStats(statsRes.data)
      localStorage.setItem('fitai_user', JSON.stringify(profileRes.data))
      if (nutritionRes.data) setTodayNutrition(nutritionRes.data)
      if (analyticsRes.data) setWorkoutAnalytics(analyticsRes.data)
      if (workoutsRes.data) setRecentWorkouts((workoutsRes.data as Workout[]).slice(0, 4))
      if (weightRes.data) setWeightLogs((weightRes.data as WeightLog[]).slice(-14).reverse())
    }).finally(() => setLoading(false))
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
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
  const firstName = user?.name?.split(' ')[0] || 'Athlete'

  const calorieGoal = stats?.daily_calories || 2000
  const proteinGoal = stats?.daily_protein || 150
  const carbGoal = Math.round((calorieGoal * 0.45) / 4)
  const fatGoal = Math.round((calorieGoal * 0.25) / 9)

  const todayCals = todayNutrition?.calories || 0
  const todayProtein = todayNutrition?.protein || 0
  const todayCarbs = todayNutrition?.carbs || 0
  const todayFats = todayNutrition?.fats || 0
  const calRemaining = Math.max(calorieGoal - todayCals, 0)

  const weightChartData = weightLogs.map(w => ({
    date: new Date(w.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    weight: w.weight,
  }))

  const weeklyWorkouts = workoutAnalytics?.weekly_count || 0
  const weeklyGoal = 5

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-white">{greeting}, {firstName} 👋</h1>
          <p className="text-slate-400 mt-1 text-sm">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <div className="bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border border-indigo-500/30 rounded-xl px-4 py-2.5 max-w-sm">
          <p className="text-xs text-indigo-300 italic">&ldquo;{quote}&rdquo;</p>
        </div>
      </div>

      {/* Today's Calorie + Macro Progress */}
      <div className="bg-[#111118] border border-[#1e1e2e] rounded-2xl p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Apple className="w-5 h-5 text-emerald-400" />
            <h2 className="text-white font-semibold">{"Today's Nutrition"}</h2>
          </div>
          <Link href="/nutrition" className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 transition">
            Log food <ChevronRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="flex flex-col md:flex-row gap-6 items-center">
          {/* Calorie bar */}
          <div className="flex-1 w-full">
            <div className="flex justify-between items-end mb-2">
              <div>
                <p className="text-3xl font-bold text-white">{todayCals.toLocaleString()}</p>
                <p className="text-slate-500 text-xs">of {calorieGoal.toLocaleString()} kcal</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold text-emerald-400">{calRemaining.toLocaleString()}</p>
                <p className="text-slate-500 text-xs">remaining</p>
              </div>
            </div>
            <div className="h-3 bg-[#1e1e2e] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-green-400 rounded-full transition-all duration-700"
                style={{ width: `${Math.min((todayCals / calorieGoal) * 100, 100)}%` }}
              />
            </div>
            <div className="grid grid-cols-3 gap-3 mt-4">
              {[
                { label: 'Burned', value: `~${Math.round((user?.current_weight || 70) * 0.0175 * 24 * 0.9)} kcal`, color: 'text-orange-400', icon: Flame },
                { label: 'Consumed', value: `${todayCals} kcal`, color: 'text-blue-400', icon: Apple },
                { label: 'Net', value: `${(todayCals - Math.round((user?.current_weight || 70) * 0.0175 * 24 * 0.9)).toLocaleString()} kcal`, color: 'text-purple-400', icon: Zap },
              ].map(({ label, value, color, icon: Icon }) => (
                <div key={label} className="bg-[#0d0d14] rounded-xl p-3 text-center">
                  <Icon className={`w-4 h-4 ${color} mx-auto mb-1`} />
                  <p className={`text-sm font-semibold ${color}`}>{value}</p>
                  <p className="text-xs text-slate-500">{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Macro rings */}
          <div className="flex gap-5">
            <MacroRing value={todayProtein} max={proteinGoal} color="#6366f1" label="Protein" />
            <MacroRing value={todayCarbs} max={carbGoal} color="#10b981" label="Carbs" />
            <MacroRing value={todayFats} max={fatGoal} color="#f59e0b" label="Fats" />
          </div>
        </div>
      </div>

      {/* Key Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={Scale} label="Current Weight" value={`${user?.current_weight} kg`} sub={`Goal: ${user?.goal_weight} kg`} color="bg-indigo-600" gradient="bg-indigo-600" />
        <StatCard
          icon={isLosingWeight ? TrendingDown : TrendingUp}
          label="To Goal"
          value={`${Math.abs(stats?.weight_difference || 0)} kg`}
          sub={isLosingWeight ? 'left to lose' : 'left to gain'}
          color="bg-purple-600"
          gradient="bg-purple-600"
        />
        <StatCard icon={Activity} label="BMI" value={stats?.bmi} sub={bmiCategory?.label} color="bg-blue-600" gradient="bg-blue-600" />
        <StatCard icon={Award} label="Fitness Score" value={`${stats?.fitness_score}/100`} sub="Overall rating" color="bg-emerald-600" gradient="bg-emerald-600" />
      </div>

      {/* Workout + Weight row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly workout progress */}
        <div className="bg-[#111118] border border-[#1e1e2e] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Dumbbell className="w-5 h-5 text-indigo-400" />
              <h2 className="text-white font-semibold">This Week</h2>
            </div>
            <Link href="/workouts" className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 transition">
              Log workout <ChevronRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="flex items-end gap-4 mb-4">
            <div>
              <p className="text-4xl font-bold text-white">{weeklyWorkouts}</p>
              <p className="text-slate-500 text-sm">of {weeklyGoal} workouts</p>
            </div>
            <div className="flex gap-1.5 pb-1">
              {Array.from({ length: weeklyGoal }).map((_, i) => (
                <div
                  key={i}
                  className={`w-6 h-8 rounded-md transition-all ${i < weeklyWorkouts ? 'bg-indigo-500' : 'bg-[#1e1e2e]'}`}
                />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-[#0d0d14] rounded-xl p-3 text-center">
              <Trophy className="w-4 h-4 text-yellow-400 mx-auto mb-1" />
              <p className="text-sm font-bold text-white">{workoutAnalytics?.total_workouts || 0}</p>
              <p className="text-xs text-slate-500">Total sessions</p>
            </div>
            <div className="bg-[#0d0d14] rounded-xl p-3 text-center">
              <Zap className="w-4 h-4 text-orange-400 mx-auto mb-1" />
              <p className="text-sm font-bold text-white">
                {workoutAnalytics?.total_volume ? `${(workoutAnalytics.total_volume / 1000).toFixed(1)}t` : '0'}
              </p>
              <p className="text-xs text-slate-500">Total volume</p>
            </div>
            <div className="bg-[#0d0d14] rounded-xl p-3 text-center">
              <Flame className="w-4 h-4 text-red-400 mx-auto mb-1" />
              <p className="text-sm font-bold text-white">
                {workoutAnalytics?.total_calories_burned ? Math.round(workoutAnalytics.total_calories_burned).toLocaleString() : '0'}
              </p>
              <p className="text-xs text-slate-500">kcal burned</p>
            </div>
            <div className="bg-[#0d0d14] rounded-xl p-3 text-center">
              <Calendar className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
              <p className="text-sm font-bold text-white">
                {workoutAnalytics?.streak || 0} {(workoutAnalytics?.streak || 0) === 1 ? 'day' : 'days'}
              </p>
              <p className="text-xs text-slate-500">Streak 🔥</p>
            </div>
          </div>
        </div>

        {/* Weight trend */}
        <div className="bg-[#111118] border border-[#1e1e2e] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Scale className="w-5 h-5 text-purple-400" />
              <h2 className="text-white font-semibold">Weight Trend</h2>
            </div>
            <Link href="/weight" className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 transition">
              Log weight <ChevronRight className="w-3 h-3" />
            </Link>
          </div>

          {weightChartData.length > 1 ? (
            <ResponsiveContainer width="100%" height={130}>
              <LineChart data={weightChartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 10 }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
                <YAxis tick={{ fill: '#64748b', fontSize: 10 }} tickLine={false} axisLine={false} domain={['auto', 'auto']} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0d0d14', border: '1px solid #1e1e2e', borderRadius: '8px', fontSize: '12px' }}
                  labelStyle={{ color: '#94a3b8' }}
                  itemStyle={{ color: '#a78bfa' }}
                />
                <Line type="monotone" dataKey="weight" stroke="#a78bfa" strokeWidth={2} dot={{ fill: '#a78bfa', r: 3 }} activeDot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[130px] flex flex-col items-center justify-center text-center">
              <Scale className="w-8 h-8 text-slate-600 mb-2" />
              <p className="text-slate-500 text-sm">No weight logs yet</p>
              <p className="text-slate-600 text-xs">Start logging to see your trend</p>
            </div>
          )}

          <div className="flex justify-between mt-3 text-xs">
            <div>
              <p className="text-slate-500">Current</p>
              <p className="text-white font-semibold">{user?.current_weight} kg</p>
            </div>
            <div className="text-center">
              <p className="text-slate-500">Change</p>
              <p className={`font-semibold ${isLosingWeight ? 'text-emerald-400' : 'text-blue-400'}`}>
                {stats?.weight_difference !== undefined
                  ? `${isLosingWeight ? '-' : '+'}${Math.abs(stats.weight_difference)} kg`
                  : '—'}
              </p>
            </div>
            <div className="text-right">
              <p className="text-slate-500">Goal</p>
              <p className="text-white font-semibold">{user?.goal_weight} kg</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Workouts + Daily targets row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent workouts */}
        <div className="bg-[#111118] border border-[#1e1e2e] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-cyan-400" />
              <h2 className="text-white font-semibold">Recent Workouts</h2>
            </div>
            <Link href="/workouts" className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 transition">
              View all <ChevronRight className="w-3 h-3" />
            </Link>
          </div>

          {recentWorkouts.length > 0 ? (
            <div>
              {recentWorkouts.map(w => <WorkoutRow key={w.id} workout={w} />)}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Dumbbell className="w-10 h-10 text-slate-600 mb-3" />
              <p className="text-slate-400 text-sm font-medium">No workouts yet</p>
              <p className="text-slate-600 text-xs mt-1">Log your first workout to get started</p>
              <Link href="/workouts" className="mt-3 px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs rounded-lg transition">
                Log Workout
              </Link>
            </div>
          )}
        </div>

        {/* Daily targets */}
        <div className="bg-[#111118] border border-[#1e1e2e] rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-5 h-5 text-rose-400" />
            <h2 className="text-white font-semibold">Daily Targets</h2>
          </div>

          <div className="space-y-4">
            {[
              { label: 'Calories', value: todayCals, max: calorieGoal, unit: 'kcal', color: 'from-orange-500 to-amber-400', icon: Flame },
              { label: 'Protein', value: todayProtein, max: proteinGoal, unit: 'g', color: 'from-indigo-500 to-violet-400', icon: Zap },
              { label: 'Carbs', value: todayCarbs, max: carbGoal, unit: 'g', color: 'from-emerald-500 to-green-400', icon: Apple },
              { label: 'Fats', value: todayFats, max: fatGoal, unit: 'g', color: 'from-yellow-500 to-orange-400', icon: DropletIcon },
            ].map(({ label, value, max, unit, color, icon: Icon }) => (
              <div key={label}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5">
                    <Icon className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-xs text-slate-400">{label}</span>
                  </div>
                  <span className="text-xs text-slate-300">
                    <span className="text-white font-medium">{Math.round(value)}</span>
                    <span className="text-slate-500">/{Math.round(max)}{unit}</span>
                  </span>
                </div>
                <div className="h-2 bg-[#1e1e2e] rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${color} rounded-full transition-all duration-700`}
                    style={{ width: `${Math.min((value / (max || 1)) * 100, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {stats?.weeks_to_goal && (
            <div className="mt-5 p-3 bg-gradient-to-r from-indigo-600/15 to-purple-600/15 border border-indigo-500/20 rounded-xl">
              <p className="text-sm text-white font-medium">
                🎯 Goal in <span className="text-indigo-400">{stats.weeks_to_goal} weeks</span>
              </p>
              <p className="text-xs text-slate-500 mt-0.5">Keep logging daily for accurate predictions</p>
            </div>
          )}
        </div>
      </div>

      {/* Bottom quick nav cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { href: '/workouts', icon: Dumbbell, label: 'Log Workout', sub: 'Track your session', color: 'text-indigo-400', bg: 'bg-indigo-500/10 border-indigo-500/20 hover:border-indigo-500/50' },
          { href: '/nutrition', icon: Apple, label: 'Log Food', sub: 'Track nutrition', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20 hover:border-emerald-500/50' },
          { href: '/weight', icon: Scale, label: 'Log Weight', sub: 'Track progress', color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20 hover:border-purple-500/50' },
          { href: '/progress', icon: TrendingUp, label: 'Progress Photos', sub: 'Visual journey', color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/20 hover:border-orange-500/50' },
        ].map(({ href, icon: Icon, label, sub, color, bg }) => (
          <Link key={href} href={href} className={`flex items-center gap-3 p-4 rounded-2xl border transition-all duration-200 group ${bg}`}>
            <div className={`w-9 h-9 rounded-xl bg-[#111118] flex items-center justify-center flex-shrink-0`}>
              <Icon className={`w-4 h-4 ${color}`} />
            </div>
            <div>
              <p className="text-sm font-medium text-white group-hover:text-white">{label}</p>
              <p className="text-xs text-slate-500">{sub}</p>
            </div>
            <ChevronRight className={`w-4 h-4 ${color} ml-auto opacity-0 group-hover:opacity-100 transition-opacity`} />
          </Link>
        ))}
      </div>
    </div>
  )
}
