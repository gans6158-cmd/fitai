import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from 'react-hot-toast'

export const metadata: Metadata = {
  title: 'FitAI – AI Fitness Platform',
  description: 'Transform your body with AI-powered fitness coaching',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#0a0a0f] text-slate-100 min-h-screen">
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: { background: '#111118', color: '#e2e8f0', border: '1px solid #1e1e2e' },
          }}
        />
      </body>
    </html>
  )
}
