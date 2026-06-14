'use client'
import { useState, useEffect } from 'react'
import { User } from '@/types'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('fitai_user')
    if (stored) setUser(JSON.parse(stored))
    setLoading(false)
  }, [])

  const login = (token: string, userData: User) => {
    localStorage.setItem('fitai_token', token)
    localStorage.setItem('fitai_user', JSON.stringify(userData))
    setUser(userData)
  }

  const logout = () => {
    localStorage.removeItem('fitai_token')
    localStorage.removeItem('fitai_user')
    setUser(null)
  }

  return { user, loading, login, logout }
}
