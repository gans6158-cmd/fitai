'use client'
import { Camera } from 'lucide-react'

export default function ProgressPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Progress Photos</h1>
        <p className="text-slate-400 mt-1">Visual transformation timeline</p>
      </div>
      <div className="bg-[#111118] border border-[#1e1e2e] rounded-2xl p-12 flex flex-col items-center justify-center text-center">
        <Camera className="w-16 h-16 text-indigo-400 mb-4 opacity-60" />
        <h2 className="text-xl font-semibold text-white mb-2">Progress Photos Coming Soon</h2>
        <p className="text-slate-400 max-w-md">
          Upload front, side, and back photos to track your visual transformation over time.
          This feature requires cloud storage configuration.
        </p>
        <div className="mt-6 px-4 py-2 bg-indigo-600/20 border border-indigo-500/30 rounded-xl text-indigo-400 text-sm">
          Configure Cloudinary in your backend to enable photo uploads
        </div>
      </div>
    </div>
  )
}
