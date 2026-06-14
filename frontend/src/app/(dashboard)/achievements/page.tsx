'use client'
import { useEffect, useState } from 'react'
import { achievementApi } from '@/lib/api'
import { Achievement } from '@/types'

export default function AchievementsPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    achievementApi.getAchievements()
      .then(res => setAchievements(res.data))
      .finally(() => setLoading(false))
  }, [])

  const earned = achievements.filter(a => a.earned)
  const notEarned = achievements.filter(a => !a.earned)

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Achievements</h1>
        <p className="text-slate-400 mt-1">Your fitness milestones and badges</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <>
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <h2 className="text-lg font-semibold text-white">Earned</h2>
              <span className="bg-indigo-600/20 text-indigo-400 text-sm px-3 py-1 rounded-full border border-indigo-500/30">
                {earned.length}/{achievements.length}
              </span>
            </div>
            {earned.length === 0 ? (
              <p className="text-slate-500">No achievements earned yet. Keep working!</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {earned.map(a => (
                  <div key={a.id} className="bg-gradient-to-br from-indigo-600/20 to-purple-600/20 border border-indigo-500/30 rounded-2xl p-6">
                    <div className="text-4xl mb-3">{a.icon}</div>
                    <h3 className="text-white font-semibold">{a.name}</h3>
                    <p className="text-slate-400 text-sm mt-1">{a.description}</p>
                    <span className="inline-block mt-3 text-xs text-indigo-400 bg-indigo-600/20 px-3 py-1 rounded-full">Earned ✓</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <h2 className="text-lg font-semibold text-white mb-4">Locked</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {notEarned.map(a => (
                <div key={a.id} className="bg-[#111118] border border-[#1e1e2e] rounded-2xl p-6 opacity-60">
                  <div className="text-4xl mb-3 grayscale">{a.icon}</div>
                  <h3 className="text-slate-300 font-semibold">{a.name}</h3>
                  <p className="text-slate-500 text-sm mt-1">{a.description}</p>
                  <span className="inline-block mt-3 text-xs text-slate-500 bg-[#1e1e2e] px-3 py-1 rounded-full">Locked 🔒</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
