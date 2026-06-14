export interface User {
  id: string
  name: string
  email: string
  age: number
  gender: string
  height: number
  current_weight: number
  goal_weight: number
  fitness_goal: string
  activity_level: string
  created_at: string
}

export interface WeightLog {
  id: string
  user_id: string
  weight: number
  date: string
  notes?: string
  created_at: string
}

export interface ExerciseSet {
  reps: number
  weight: number
}

export interface Exercise {
  name: string
  sets: ExerciseSet[]
  notes?: string
}

export interface Workout {
  id: string
  user_id: string
  name: string
  category: string
  date: string
  exercises: Exercise[]
  notes?: string
  duration_minutes?: number
  total_volume: number
  calories_burned?: number
  created_at: string
}

export interface PRRecord {
  id: string
  exercise_name: string
  weight: number
  reps: number
  estimated_1rm: number
  date: string
  created_at: string
}

export interface NutritionLog {
  id: string
  user_id: string
  food_name: string
  calories: number
  protein: number
  carbs: number
  fats: number
  serving_size?: string
  meal_type: string
  date: string
  created_at: string
}

export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  earned: boolean
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  created_at: string
}

export interface UserStats {
  bmi: number
  daily_calories: number
  daily_protein: number
  fitness_score: number
  weight_difference: number
  weekly_rate: number
  weeks_to_goal: number | null
}
