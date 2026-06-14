export interface PlanExercise {
  name: string
  sets: number
  reps: string
  notes?: string
}

export interface PlanDay {
  name: string
  category: string
  exercises: PlanExercise[]
}

export interface WorkoutPlan {
  id: string
  name: string
  description: string
  frequency: string
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  goal: string
  days: PlanDay[]
}

export const WORKOUT_PLANS: WorkoutPlan[] = [
  {
    id: 'ppl',
    name: 'Push Pull Legs (PPL)',
    description: 'Classic 6-day split hitting each muscle group twice per week. Ideal for intermediate lifters.',
    frequency: '6 days/week',
    difficulty: 'Intermediate',
    goal: 'Muscle Building',
    days: [
      {
        name: 'Push Day A',
        category: 'Push',
        exercises: [
          { name: 'Bench Press (Barbell)', sets: 4, reps: '6-8' },
          { name: 'Overhead Press (Barbell)', sets: 3, reps: '8-10' },
          { name: 'Incline Dumbbell Press', sets: 3, reps: '10-12' },
          { name: 'Lateral Raises (Dumbbell)', sets: 4, reps: '12-15' },
          { name: 'Tricep Pushdown (Rope)', sets: 3, reps: '12-15' },
          { name: 'Overhead Tricep Extension (Cable)', sets: 3, reps: '12-15' },
        ],
      },
      {
        name: 'Pull Day A',
        category: 'Pull',
        exercises: [
          { name: 'Deadlift (Barbell)', sets: 4, reps: '5-6' },
          { name: 'Pull-ups', sets: 3, reps: '8-10' },
          { name: 'Barbell Row (Bent Over)', sets: 3, reps: '8-10' },
          { name: 'Face Pulls', sets: 4, reps: '15-20' },
          { name: 'Barbell Curl', sets: 3, reps: '10-12' },
          { name: 'Hammer Curl', sets: 3, reps: '12-15' },
        ],
      },
      {
        name: 'Legs Day A',
        category: 'Legs',
        exercises: [
          { name: 'Squat (Barbell)', sets: 4, reps: '6-8' },
          { name: 'Romanian Deadlift', sets: 3, reps: '10-12' },
          { name: 'Leg Press Machine', sets: 3, reps: '10-12' },
          { name: 'Leg Curl (Lying)', sets: 3, reps: '12-15' },
          { name: 'Calf Raises (Standing)', sets: 4, reps: '15-20' },
        ],
      },
      {
        name: 'Push Day B',
        category: 'Push',
        exercises: [
          { name: 'Overhead Press (Barbell)', sets: 4, reps: '6-8' },
          { name: 'Incline Bench Press (Barbell)', sets: 3, reps: '8-10' },
          { name: 'Dumbbell Flyes', sets: 3, reps: '12-15' },
          { name: 'Lateral Raises (Cable)', sets: 4, reps: '12-15' },
          { name: 'Skull Crushers (Barbell)', sets: 3, reps: '10-12' },
          { name: 'Close Grip Bench Press', sets: 3, reps: '10-12' },
        ],
      },
      {
        name: 'Pull Day B',
        category: 'Pull',
        exercises: [
          { name: 'Pull-ups', sets: 4, reps: '6-8' },
          { name: 'Seated Cable Row', sets: 3, reps: '10-12' },
          { name: 'Lat Pulldown (Wide Grip)', sets: 3, reps: '10-12' },
          { name: 'Rear Delt Flyes (Dumbbell)', sets: 4, reps: '15-20' },
          { name: 'EZ Bar Curl', sets: 3, reps: '10-12' },
          { name: 'Preacher Curl (Dumbbell)', sets: 3, reps: '12-15' },
        ],
      },
      {
        name: 'Legs Day B',
        category: 'Legs',
        exercises: [
          { name: 'Hack Squat Machine', sets: 4, reps: '8-10' },
          { name: 'Bulgarian Split Squat', sets: 3, reps: '10-12' },
          { name: 'Leg Extension Machine', sets: 3, reps: '12-15' },
          { name: 'Hip Thrust (Barbell)', sets: 3, reps: '10-12' },
          { name: 'Calf Raises (Seated)', sets: 4, reps: '15-20' },
        ],
      },
    ],
  },
  {
    id: 'brosplit',
    name: 'Classic Bro Split',
    description: '5-day split with each muscle group trained once per week. Great for bodybuilding style training.',
    frequency: '5 days/week',
    difficulty: 'Intermediate',
    goal: 'Muscle Building',
    days: [
      {
        name: 'Chest Day',
        category: 'Push',
        exercises: [
          { name: 'Bench Press (Barbell)', sets: 4, reps: '8-10' },
          { name: 'Incline Bench Press (Barbell)', sets: 3, reps: '10-12' },
          { name: 'Decline Bench Press (Barbell)', sets: 3, reps: '10-12' },
          { name: 'Dumbbell Flyes', sets: 3, reps: '12-15' },
          { name: 'Cable Crossover', sets: 3, reps: '15-20' },
          { name: 'Chest Dips', sets: 3, reps: '10-15' },
        ],
      },
      {
        name: 'Back Day',
        category: 'Pull',
        exercises: [
          { name: 'Deadlift (Barbell)', sets: 4, reps: '6-8' },
          { name: 'Pull-ups', sets: 3, reps: '8-10' },
          { name: 'Barbell Row (Bent Over)', sets: 3, reps: '8-10' },
          { name: 'Lat Pulldown (Wide Grip)', sets: 3, reps: '10-12' },
          { name: 'Seated Cable Row', sets: 3, reps: '12-15' },
          { name: 'Face Pulls', sets: 3, reps: '15-20' },
        ],
      },
      {
        name: 'Shoulders Day',
        category: 'Push',
        exercises: [
          { name: 'Overhead Press (Barbell)', sets: 4, reps: '8-10' },
          { name: 'Dumbbell Shoulder Press', sets: 3, reps: '10-12' },
          { name: 'Lateral Raises (Dumbbell)', sets: 4, reps: '12-15' },
          { name: 'Front Raises (Dumbbell)', sets: 3, reps: '12-15' },
          { name: 'Rear Delt Flyes (Dumbbell)', sets: 3, reps: '15-20' },
          { name: 'Barbell Shrugs', sets: 4, reps: '12-15' },
        ],
      },
      {
        name: 'Arms Day',
        category: 'Arms',
        exercises: [
          { name: 'Barbell Curl', sets: 4, reps: '10-12' },
          { name: 'Incline Dumbbell Curl', sets: 3, reps: '10-12' },
          { name: 'Hammer Curl', sets: 3, reps: '12-15' },
          { name: 'Skull Crushers (Barbell)', sets: 4, reps: '10-12' },
          { name: 'Tricep Pushdown (Rope)', sets: 3, reps: '12-15' },
          { name: 'Overhead Tricep Extension (Dumbbell)', sets: 3, reps: '12-15' },
        ],
      },
      {
        name: 'Legs Day',
        category: 'Legs',
        exercises: [
          { name: 'Squat (Barbell)', sets: 4, reps: '8-10' },
          { name: 'Leg Press Machine', sets: 3, reps: '10-12' },
          { name: 'Romanian Deadlift', sets: 3, reps: '10-12' },
          { name: 'Leg Curl (Lying)', sets: 3, reps: '12-15' },
          { name: 'Leg Extension Machine', sets: 3, reps: '12-15' },
          { name: 'Calf Raises (Standing)', sets: 4, reps: '15-20' },
          { name: 'Hip Thrust (Barbell)', sets: 3, reps: '10-12' },
        ],
      },
    ],
  },
  {
    id: 'upperlower',
    name: 'Upper Lower Split',
    description: '4-day split alternating upper and lower body. Excellent balance of frequency and volume.',
    frequency: '4 days/week',
    difficulty: 'Intermediate',
    goal: 'Strength & Muscle',
    days: [
      {
        name: 'Upper A (Strength)',
        category: 'Push',
        exercises: [
          { name: 'Bench Press (Barbell)', sets: 4, reps: '4-6' },
          { name: 'Barbell Row (Bent Over)', sets: 4, reps: '4-6' },
          { name: 'Overhead Press (Barbell)', sets: 3, reps: '6-8' },
          { name: 'Pull-ups', sets: 3, reps: '6-8' },
          { name: 'Barbell Curl', sets: 3, reps: '8-10' },
          { name: 'Skull Crushers (Barbell)', sets: 3, reps: '8-10' },
        ],
      },
      {
        name: 'Lower A (Strength)',
        category: 'Legs',
        exercises: [
          { name: 'Squat (Barbell)', sets: 4, reps: '4-6' },
          { name: 'Romanian Deadlift', sets: 3, reps: '6-8' },
          { name: 'Leg Press Machine', sets: 3, reps: '8-10' },
          { name: 'Leg Curl (Lying)', sets: 3, reps: '10-12' },
          { name: 'Calf Raises (Standing)', sets: 4, reps: '12-15' },
        ],
      },
      {
        name: 'Upper B (Hypertrophy)',
        category: 'Push',
        exercises: [
          { name: 'Incline Dumbbell Press', sets: 4, reps: '8-12' },
          { name: 'Seated Cable Row', sets: 4, reps: '8-12' },
          { name: 'Dumbbell Shoulder Press', sets: 3, reps: '10-12' },
          { name: 'Lat Pulldown (Wide Grip)', sets: 3, reps: '10-12' },
          { name: 'Lateral Raises (Dumbbell)', sets: 3, reps: '12-15' },
          { name: 'Hammer Curl', sets: 3, reps: '12-15' },
          { name: 'Tricep Pushdown (Rope)', sets: 3, reps: '12-15' },
        ],
      },
      {
        name: 'Lower B (Hypertrophy)',
        category: 'Legs',
        exercises: [
          { name: 'Deadlift (Barbell)', sets: 4, reps: '6-8' },
          { name: 'Hack Squat Machine', sets: 3, reps: '10-12' },
          { name: 'Bulgarian Split Squat', sets: 3, reps: '10-12', notes: 'per leg' },
          { name: 'Leg Extension Machine', sets: 3, reps: '12-15' },
          { name: 'Hip Thrust (Barbell)', sets: 3, reps: '10-12' },
          { name: 'Calf Raises (Seated)', sets: 4, reps: '15-20' },
        ],
      },
    ],
  },
  {
    id: 'fullbody',
    name: 'Full Body 3x',
    description: '3-day full body workout. Best for beginners and those with limited time. Each session hits everything.',
    frequency: '3 days/week',
    difficulty: 'Beginner',
    goal: 'General Fitness',
    days: [
      {
        name: 'Full Body A',
        category: 'Push',
        exercises: [
          { name: 'Squat (Barbell)', sets: 3, reps: '5' },
          { name: 'Bench Press (Barbell)', sets: 3, reps: '5' },
          { name: 'Barbell Row (Bent Over)', sets: 3, reps: '5' },
          { name: 'Overhead Press (Barbell)', sets: 2, reps: '8-10' },
          { name: 'Romanian Deadlift', sets: 2, reps: '10' },
          { name: 'Plank', sets: 3, reps: '30-60s' },
        ],
      },
      {
        name: 'Full Body B',
        category: 'Pull',
        exercises: [
          { name: 'Deadlift (Barbell)', sets: 3, reps: '5' },
          { name: 'Overhead Press (Barbell)', sets: 3, reps: '5' },
          { name: 'Pull-ups', sets: 3, reps: '5-8' },
          { name: 'Goblet Squat', sets: 3, reps: '10-12' },
          { name: 'Dumbbell Row (Single Arm)', sets: 2, reps: '10-12' },
          { name: 'Crunches', sets: 3, reps: '15-20' },
        ],
      },
      {
        name: 'Full Body C',
        category: 'Legs',
        exercises: [
          { name: 'Front Squat', sets: 3, reps: '5-8' },
          { name: 'Bench Press (Dumbbell)', sets: 3, reps: '8-10' },
          { name: 'Lat Pulldown (Wide Grip)', sets: 3, reps: '8-10' },
          { name: 'Hip Thrust (Barbell)', sets: 3, reps: '10-12' },
          { name: 'Lateral Raises (Dumbbell)', sets: 3, reps: '12-15' },
          { name: 'Hanging Leg Raises', sets: 3, reps: '10-15' },
        ],
      },
    ],
  },
  {
    id: 'starting-strength',
    name: 'Starting Strength',
    description: 'Mark Rippetoe\'s classic 3-day linear progression program. Best for absolute beginners to build strength fast.',
    frequency: '3 days/week',
    difficulty: 'Beginner',
    goal: 'Strength',
    days: [
      {
        name: 'Workout A',
        category: 'Push',
        exercises: [
          { name: 'Squat (Barbell)', sets: 3, reps: '5', notes: 'Add 2.5kg each session' },
          { name: 'Bench Press (Barbell)', sets: 3, reps: '5', notes: 'Add 2.5kg each session' },
          { name: 'Deadlift (Barbell)', sets: 1, reps: '5', notes: 'Add 5kg each session' },
        ],
      },
      {
        name: 'Workout B',
        category: 'Pull',
        exercises: [
          { name: 'Squat (Barbell)', sets: 3, reps: '5', notes: 'Add 2.5kg each session' },
          { name: 'Overhead Press (Barbell)', sets: 3, reps: '5', notes: 'Add 2.5kg each session' },
          { name: 'Deadlift (Barbell)', sets: 1, reps: '5', notes: 'Add 5kg each session' },
        ],
      },
    ],
  },
  {
    id: 'hiit',
    name: 'HIIT & Cardio Burn',
    description: 'High intensity interval training for maximum fat burn. Minimal equipment needed.',
    frequency: '3-4 days/week',
    difficulty: 'Intermediate',
    goal: 'Fat Loss',
    days: [
      {
        name: 'HIIT Circuit A',
        category: 'Cardio',
        exercises: [
          { name: 'Burpees', sets: 4, reps: '15', notes: '30s rest between sets' },
          { name: 'Jump Rope', sets: 4, reps: '60s', notes: '30s rest between sets' },
          { name: 'High Knees', sets: 4, reps: '45s', notes: '30s rest between sets' },
          { name: 'Mountain Climbers', sets: 4, reps: '45s', notes: '30s rest between sets' },
          { name: 'Box Jumps', sets: 3, reps: '15', notes: '45s rest between sets' },
          { name: 'Battle Ropes', sets: 4, reps: '30s', notes: '30s rest between sets' },
        ],
      },
      {
        name: 'Strength Cardio B',
        category: 'Cardio',
        exercises: [
          { name: 'Kettlebell Swing', sets: 4, reps: '20' },
          { name: 'Goblet Squat', sets: 4, reps: '15' },
          { name: 'Push-ups', sets: 4, reps: '15-20' },
          { name: 'Jumping Jacks', sets: 4, reps: '50' },
          { name: 'Burpees', sets: 3, reps: '10' },
          { name: 'Plank', sets: 3, reps: '60s' },
        ],
      },
      {
        name: 'Cardio Machine Day',
        category: 'Cardio',
        exercises: [
          { name: 'Treadmill Running', sets: 1, reps: '20 min', notes: 'Moderate pace' },
          { name: 'Rowing Machine', sets: 1, reps: '10 min', notes: 'High intensity' },
          { name: 'Stationary Bike (Intense)', sets: 1, reps: '10 min', notes: 'Sprint intervals' },
          { name: 'Stair Climber', sets: 1, reps: '10 min', notes: 'Moderate pace' },
        ],
      },
    ],
  },
  {
    id: 'arnold',
    name: 'Arnold Split',
    description: 'Arnold Schwarzenegger\'s famous 6-day split. Chest+back, shoulders+arms, legs for maximum volume.',
    frequency: '6 days/week',
    difficulty: 'Advanced',
    goal: 'Bodybuilding',
    days: [
      {
        name: 'Chest & Back',
        category: 'Push',
        exercises: [
          { name: 'Bench Press (Barbell)', sets: 4, reps: '8-10' },
          { name: 'Barbell Row (Bent Over)', sets: 4, reps: '8-10' },
          { name: 'Incline Bench Press (Barbell)', sets: 3, reps: '10-12' },
          { name: 'Pull-ups', sets: 3, reps: '8-10' },
          { name: 'Cable Crossover', sets: 3, reps: '12-15' },
          { name: 'Seated Cable Row', sets: 3, reps: '12-15' },
          { name: 'Dumbbell Pullover', sets: 3, reps: '12-15' },
        ],
      },
      {
        name: 'Shoulders & Arms',
        category: 'Arms',
        exercises: [
          { name: 'Overhead Press (Barbell)', sets: 4, reps: '8-10' },
          { name: 'Barbell Curl', sets: 4, reps: '10-12' },
          { name: 'Lateral Raises (Dumbbell)', sets: 4, reps: '12-15' },
          { name: 'Skull Crushers (Barbell)', sets: 4, reps: '10-12' },
          { name: 'Arnold Press', sets: 3, reps: '10-12' },
          { name: 'Hammer Curl', sets: 3, reps: '12-15' },
          { name: 'Tricep Dips', sets: 3, reps: '12-15' },
        ],
      },
      {
        name: 'Legs',
        category: 'Legs',
        exercises: [
          { name: 'Squat (Barbell)', sets: 4, reps: '8-10' },
          { name: 'Leg Press Machine', sets: 4, reps: '10-12' },
          { name: 'Romanian Deadlift', sets: 3, reps: '10-12' },
          { name: 'Leg Curl (Lying)', sets: 4, reps: '12-15' },
          { name: 'Leg Extension Machine', sets: 4, reps: '12-15' },
          { name: 'Calf Raises (Standing)', sets: 5, reps: '15-20' },
        ],
      },
    ],
  },
  {
    id: 'calisthenics',
    name: 'Calisthenics & Bodyweight',
    description: 'No equipment needed. Build strength and muscle using only your bodyweight.',
    frequency: '4 days/week',
    difficulty: 'Beginner',
    goal: 'Strength & Fitness',
    days: [
      {
        name: 'Push Day',
        category: 'Push',
        exercises: [
          { name: 'Push-ups', sets: 4, reps: '15-20' },
          { name: 'Wide Push-ups', sets: 3, reps: '12-15' },
          { name: 'Diamond Push-ups', sets: 3, reps: '10-12' },
          { name: 'Decline Push-ups', sets: 3, reps: '10-12' },
          { name: 'Chest Dips', sets: 3, reps: '10-15' },
          { name: 'Plank', sets: 3, reps: '60s' },
        ],
      },
      {
        name: 'Pull Day',
        category: 'Pull',
        exercises: [
          { name: 'Pull-ups', sets: 4, reps: '8-12' },
          { name: 'Chin-ups', sets: 3, reps: '8-12' },
          { name: 'Wide Grip Pull-ups', sets: 3, reps: '6-10' },
          { name: 'Hanging Leg Raises', sets: 3, reps: '12-15' },
          { name: 'Face Pulls', sets: 3, reps: '15-20' },
        ],
      },
      {
        name: 'Legs & Core',
        category: 'Legs',
        exercises: [
          { name: 'Goblet Squat', sets: 4, reps: '15-20' },
          { name: 'Bulgarian Split Squat', sets: 3, reps: '12', notes: 'per leg' },
          { name: 'Glute Bridge', sets: 4, reps: '15-20' },
          { name: 'Walking Lunges', sets: 3, reps: '20' },
          { name: 'Calf Raises (Standing)', sets: 4, reps: '20-25' },
          { name: 'Mountain Climbers', sets: 3, reps: '30s' },
          { name: 'Russian Twists', sets: 3, reps: '20' },
        ],
      },
    ],
  },
]
