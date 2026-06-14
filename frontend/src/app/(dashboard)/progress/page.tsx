'use client'
import { useEffect, useRef, useState } from 'react'
import { progressApi } from '@/lib/api'
import toast from 'react-hot-toast'
import { Camera, Trash2, Upload, X, ZoomIn, ArrowLeftRight } from 'lucide-react'
import { format } from 'date-fns'

const LABELS = ['Front', 'Side', 'Back', 'Full Body', 'Progress']

interface Photo {
  id: string
  photo_data: string
  label: string
  date: string
  notes?: string
  created_at: string
}

async function compressImage(file: File): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        const maxDim = 900
        const ratio = Math.min(maxDim / img.width, maxDim / img.height, 1)
        const canvas = document.createElement('canvas')
        canvas.width = img.width * ratio
        canvas.height = img.height * ratio
        const ctx = canvas.getContext('2d')!
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        resolve(canvas.toDataURL('image/jpeg', 0.75))
      }
      img.src = e.target?.result as string
    }
    reader.readAsDataURL(file)
  })
}

export default function ProgressPage() {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const [lightbox, setLightbox] = useState<Photo | null>(null)
  const [form, setForm] = useState({ label: 'Front', date: new Date().toISOString().slice(0, 10), notes: '' })
  const [view, setView] = useState<'gallery' | 'compare'>('gallery')
  const [compareLeft, setCompareLeft] = useState('')
  const [compareRight, setCompareRight] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)
  const dropRef = useRef<HTMLDivElement>(null)

  const fetchPhotos = async () => {
    try {
      const res = await progressApi.getPhotos()
      setPhotos(res.data)
    } catch {
      toast.error('Failed to load photos')
    }
  }

  useEffect(() => { fetchPhotos().finally(() => setLoading(false)) }, [])

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) { toast.error('Please select an image file'); return }
    if (file.size > 15 * 1024 * 1024) { toast.error('Image too large (max 15MB)'); return }
    const compressed = await compressImage(file)
    setPreview(compressed)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  const handleUpload = async () => {
    if (!preview) return
    setUploading(true)
    try {
      await progressApi.uploadPhoto({ photo_data: preview, label: form.label, date: form.date, notes: form.notes })
      toast.success('Photo uploaded!')
      setPreview(null)
      setForm({ label: 'Front', date: new Date().toISOString().slice(0, 10), notes: '' })
      await fetchPhotos()
    } catch {
      toast.error('Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await progressApi.deletePhoto(id)
      setPhotos(p => p.filter(x => x.id !== id))
      toast.success('Photo deleted')
    } catch {
      toast.error('Delete failed')
    }
  }

  const inputClass = "w-full bg-[#0a0a0f] border border-[#1e1e2e] rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"

  const grouped = photos.reduce<Record<string, Photo[]>>((acc, p) => {
    const key = p.date
    if (!acc[key]) acc[key] = []
    acc[key].push(p)
    return acc
  }, {})

  return (
    <div>
      {/* Header with tab switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Progress Photos</h1>
          <p className="text-slate-400 mt-1">Visual transformation timeline</p>
        </div>
        <div className="flex gap-1 bg-[#111118] border border-[#1e1e2e] rounded-xl p-1 w-fit">
          <button onClick={() => setView('gallery')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${view === 'gallery' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}>
            Gallery
          </button>
          <button onClick={() => setView('compare')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition ${view === 'compare' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}>
            <ArrowLeftRight className="w-3.5 h-3.5" /> Compare
          </button>
        </div>
      </div>

      {/* Gallery view */}
      {view === 'gallery' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Upload panel */}
          <div className="bg-[#111118] border border-[#1e1e2e] rounded-2xl p-6 space-y-4">
            <h2 className="text-lg font-semibold text-white">Upload Photo</h2>

            <div
              ref={dropRef}
              onDragOver={e => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => !preview && fileRef.current?.click()}
              className={`relative border-2 border-dashed rounded-xl overflow-hidden transition cursor-pointer ${
                preview ? 'border-indigo-500' : 'border-[#1e1e2e] hover:border-indigo-500/50'
              }`}
              style={{ minHeight: 200 }}
            >
              {preview ? (
                <>
                  <img src={preview} alt="preview" className="w-full object-cover rounded-xl" style={{ maxHeight: 300 }} />
                  <button
                    type="button"
                    onClick={e => { e.stopPropagation(); setPreview(null) }}
                    className="absolute top-2 right-2 bg-black/60 hover:bg-red-500/80 rounded-full p-1 transition"
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-48 text-slate-500">
                  <Upload className="w-10 h-10 mb-3 opacity-40" />
                  <p className="text-sm">Drop photo here or click to browse</p>
                  <p className="text-xs mt-1 opacity-60">JPEG, PNG, WEBP • max 15MB</p>
                </div>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />

            <div>
              <label className="text-xs text-slate-400 block mb-1">Label</label>
              <select value={form.label} onChange={e => setForm(f => ({ ...f, label: e.target.value }))} className={inputClass}>
                {LABELS.map(l => <option key={l}>{l}</option>)}
              </select>
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Date</label>
              <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} className={inputClass} />
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Notes (optional)</label>
              <input type="text" placeholder="e.g. Week 4 cut, 78kg" value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} className={inputClass} />
            </div>

            <button
              onClick={handleUpload}
              disabled={!preview || uploading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition"
            >
              <Camera className="w-4 h-4" />
              {uploading ? 'Uploading...' : 'Save Photo'}
            </button>
          </div>

          {/* Gallery */}
          <div className="lg:col-span-2">
            {loading ? (
              <div className="flex justify-center py-16"><div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" /></div>
            ) : photos.length === 0 ? (
              <div className="bg-[#111118] border border-[#1e1e2e] rounded-2xl p-16 flex flex-col items-center text-center text-slate-500">
                <Camera className="w-16 h-16 mb-4 opacity-20" />
                <p className="font-medium">No photos yet</p>
                <p className="text-sm mt-1">Upload your first progress photo to start tracking your transformation</p>
              </div>
            ) : (
              <div className="space-y-6">
                {Object.entries(grouped).map(([date, dayPhotos]) => (
                  <div key={date} className="bg-[#111118] border border-[#1e1e2e] rounded-2xl p-5">
                    <p className="text-white font-semibold mb-4">
                      {format(new Date(date + 'T12:00:00'), 'MMMM d, yyyy')}
                      <span className="text-slate-500 font-normal text-sm ml-2">({dayPhotos.length} photo{dayPhotos.length > 1 ? 's' : ''})</span>
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {dayPhotos.map(photo => (
                        <div key={photo.id} className="relative group rounded-xl overflow-hidden bg-[#0a0a0f]">
                          <img
                            src={photo.photo_data}
                            alt={photo.label}
                            className="w-full object-cover cursor-pointer transition group-hover:brightness-75"
                            style={{ aspectRatio: '3/4' }}
                            onClick={() => setLightbox(photo)}
                          />
                          <div className="absolute inset-0 flex items-end p-2 opacity-0 group-hover:opacity-100 transition pointer-events-none">
                            <span className="text-white text-xs font-medium bg-black/60 px-2 py-1 rounded-lg">{photo.label}</span>
                          </div>
                          <button
                            onClick={() => handleDelete(photo.id)}
                            className="absolute top-2 right-2 bg-black/60 hover:bg-red-500/80 rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition"
                          >
                            <Trash2 className="w-3 h-3 text-white" />
                          </button>
                          <button
                            onClick={() => setLightbox(photo)}
                            className="absolute top-2 left-2 bg-black/60 hover:bg-indigo-500/80 rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition"
                          >
                            <ZoomIn className="w-3 h-3 text-white" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Compare view */}
      {view === 'compare' && (
        <div>
          {photos.length < 2 ? (
            <div className="bg-[#111118] border border-[#1e1e2e] rounded-2xl p-16 flex flex-col items-center text-center text-slate-500">
              <ArrowLeftRight className="w-12 h-12 mb-4 opacity-20" />
              <p className="font-medium">Need at least 2 photos to compare</p>
              <p className="text-sm mt-1">Switch to Gallery and upload more progress photos first</p>
            </div>
          ) : (
            <div>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="text-sm font-medium text-slate-300 block mb-2">Before</label>
                  <select value={compareLeft} onChange={e => setCompareLeft(e.target.value)}
                    className="w-full bg-[#0a0a0f] border border-[#1e1e2e] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-indigo-500 transition">
                    <option value="">Select photo...</option>
                    {photos.map(p => (
                      <option key={p.id} value={p.id}>
                        {format(new Date(p.date + 'T12:00:00'), 'MMM d, yyyy')} — {p.label}{p.notes ? ` (${p.notes})` : ''}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-300 block mb-2">After</label>
                  <select value={compareRight} onChange={e => setCompareRight(e.target.value)}
                    className="w-full bg-[#0a0a0f] border border-[#1e1e2e] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-indigo-500 transition">
                    <option value="">Select photo...</option>
                    {photos.map(p => (
                      <option key={p.id} value={p.id}>
                        {format(new Date(p.date + 'T12:00:00'), 'MMM d, yyyy')} — {p.label}{p.notes ? ` (${p.notes})` : ''}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[{ id: compareLeft, side: 'Before' }, { id: compareRight, side: 'After' }].map(({ id, side }) => {
                  const photo = photos.find(p => p.id === id)
                  return (
                    <div key={side} className="bg-[#111118] border border-[#1e1e2e] rounded-2xl overflow-hidden">
                      {photo ? (
                        <>
                          <div className="relative group">
                            <img src={photo.photo_data} alt={photo.label}
                              className="w-full object-cover cursor-pointer transition group-hover:brightness-75"
                              style={{ aspectRatio: '3/4' }}
                              onClick={() => setLightbox(photo)}
                            />
                            <button
                              onClick={() => setLightbox(photo)}
                              className="absolute top-2 right-2 bg-black/60 hover:bg-indigo-500/80 rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition"
                            >
                              <ZoomIn className="w-3.5 h-3.5 text-white" />
                            </button>
                          </div>
                          <div className="p-4">
                            <div className="flex items-center justify-between mb-1">
                              <p className="text-white font-semibold">{photo.label}</p>
                              <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${side === 'Before' ? 'bg-slate-500/20 text-slate-300' : 'bg-indigo-500/20 text-indigo-300'}`}>
                                {side}
                              </span>
                            </div>
                            <p className="text-slate-400 text-sm">
                              {format(new Date(photo.date + 'T12:00:00'), 'MMMM d, yyyy')}
                            </p>
                            {photo.notes && <p className="text-slate-500 text-xs mt-1">{photo.notes}</p>}
                          </div>
                        </>
                      ) : (
                        <div className="flex flex-col items-center justify-center text-slate-600" style={{ minHeight: 300 }}>
                          <Camera className="w-10 h-10 mb-2 opacity-30" />
                          <p className="text-sm font-medium">{side} photo</p>
                          <p className="text-xs mt-1">Select from dropdown above</p>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <div className="relative max-w-2xl w-full" onClick={e => e.stopPropagation()}>
            <button onClick={() => setLightbox(null)} className="absolute -top-10 right-0 text-white/60 hover:text-white transition">
              <X className="w-6 h-6" />
            </button>
            <img src={lightbox.photo_data} alt={lightbox.label} className="w-full rounded-2xl object-contain max-h-[80vh]" />
            <div className="mt-3 flex items-center justify-between">
              <div>
                <span className="text-white font-medium">{lightbox.label}</span>
                <span className="text-slate-400 text-sm ml-3">{format(new Date(lightbox.date + 'T12:00:00'), 'MMM d, yyyy')}</span>
                {lightbox.notes && <p className="text-slate-400 text-sm mt-1">{lightbox.notes}</p>}
              </div>
              <button onClick={() => { handleDelete(lightbox.id); setLightbox(null) }} className="text-slate-500 hover:text-red-400 transition">
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
