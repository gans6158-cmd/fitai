import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('fitai_token')
    if (token) config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('fitai_token')
      localStorage.removeItem('fitai_user')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export const authApi = {
  register: (data: unknown) => api.post('/api/auth/register', data),
  login: (data: unknown) => api.post('/api/auth/login', data),
}

export const userApi = {
  getProfile: () => api.get('/api/users/me'),
  updateProfile: (data: unknown) => api.put('/api/users/me', data),
  getStats: () => api.get('/api/users/me/stats'),
}

export const weightApi = {
  getLogs: () => api.get('/api/weight'),
  addLog: (data: unknown) => api.post('/api/weight', data),
  deleteLog: (id: string) => api.delete(`/api/weight/${id}`),
}

export const workoutApi = {
  getWorkouts: () => api.get('/api/workouts'),
  createWorkout: (data: unknown) => api.post('/api/workouts', data),
  deleteWorkout: (id: string) => api.delete(`/api/workouts/${id}`),
  getAnalytics: () => api.get('/api/workouts/analytics'),
}

export const nutritionApi = {
  getLogs: (date?: string) => api.get('/api/nutrition', { params: date ? { log_date: date } : {} }),
  addLog: (data: unknown) => api.post('/api/nutrition', data),
  deleteLog: (id: string) => api.delete(`/api/nutrition/${id}`),
  getTodaySummary: () => api.get('/api/nutrition/today'),
}

export const achievementApi = {
  getAchievements: () => api.get('/api/achievements'),
}

export const chatApi = {
  sendMessage: (message: string) => api.post('/api/chat', { message }),
  getHistory: () => api.get('/api/chat/history'),
}
