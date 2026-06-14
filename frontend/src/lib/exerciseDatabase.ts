export interface ExerciseInfo {
  name: string
  category: string
  equipment: string
  met: number  // metabolic equivalent for calorie calc
}

export const EXERCISE_DB: ExerciseInfo[] = [
  // ── CHEST ──
  { name: 'Bench Press (Barbell)', category: 'Push', equipment: 'Barbell', met: 5 },
  { name: 'Incline Bench Press (Barbell)', category: 'Push', equipment: 'Barbell', met: 5 },
  { name: 'Decline Bench Press (Barbell)', category: 'Push', equipment: 'Barbell', met: 5 },
  { name: 'Bench Press (Dumbbell)', category: 'Push', equipment: 'Dumbbell', met: 4.5 },
  { name: 'Incline Dumbbell Press', category: 'Push', equipment: 'Dumbbell', met: 4.5 },
  { name: 'Decline Dumbbell Press', category: 'Push', equipment: 'Dumbbell', met: 4.5 },
  { name: 'Dumbbell Flyes', category: 'Push', equipment: 'Dumbbell', met: 4 },
  { name: 'Incline Dumbbell Flyes', category: 'Push', equipment: 'Dumbbell', met: 4 },
  { name: 'Cable Crossover', category: 'Push', equipment: 'Cable Machine', met: 4 },
  { name: 'Cable Flyes (Low)', category: 'Push', equipment: 'Cable Machine', met: 4 },
  { name: 'Cable Flyes (High)', category: 'Push', equipment: 'Cable Machine', met: 4 },
  { name: 'Chest Dips', category: 'Push', equipment: 'Dip Station', met: 5 },
  { name: 'Chest Press Machine', category: 'Push', equipment: 'Machine', met: 4 },
  { name: 'Incline Chest Press Machine', category: 'Push', equipment: 'Machine', met: 4 },
  { name: 'Pec Deck Machine', category: 'Push', equipment: 'Machine', met: 3.5 },
  { name: 'Push-ups', category: 'Push', equipment: 'Bodyweight', met: 4 },
  { name: 'Wide Push-ups', category: 'Push', equipment: 'Bodyweight', met: 4 },
  { name: 'Diamond Push-ups', category: 'Push', equipment: 'Bodyweight', met: 4.5 },
  { name: 'Decline Push-ups', category: 'Push', equipment: 'Bodyweight', met: 4 },
  { name: 'Smith Machine Bench Press', category: 'Push', equipment: 'Smith Machine', met: 4.5 },

  // ── BACK ──
  { name: 'Deadlift (Barbell)', category: 'Pull', equipment: 'Barbell', met: 6 },
  { name: 'Romanian Deadlift', category: 'Pull', equipment: 'Barbell', met: 5.5 },
  { name: 'Barbell Row (Bent Over)', category: 'Pull', equipment: 'Barbell', met: 5 },
  { name: 'Pendlay Row', category: 'Pull', equipment: 'Barbell', met: 5 },
  { name: 'T-Bar Row', category: 'Pull', equipment: 'T-Bar Machine', met: 5 },
  { name: 'Dumbbell Row (Single Arm)', category: 'Pull', equipment: 'Dumbbell', met: 4.5 },
  { name: 'Pull-ups', category: 'Pull', equipment: 'Pull-up Bar', met: 5 },
  { name: 'Chin-ups', category: 'Pull', equipment: 'Pull-up Bar', met: 5 },
  { name: 'Wide Grip Pull-ups', category: 'Pull', equipment: 'Pull-up Bar', met: 5 },
  { name: 'Lat Pulldown (Wide Grip)', category: 'Pull', equipment: 'Cable Machine', met: 4.5 },
  { name: 'Lat Pulldown (Close Grip)', category: 'Pull', equipment: 'Cable Machine', met: 4.5 },
  { name: 'Lat Pulldown (Reverse Grip)', category: 'Pull', equipment: 'Cable Machine', met: 4.5 },
  { name: 'Seated Cable Row', category: 'Pull', equipment: 'Cable Machine', met: 4 },
  { name: 'Cable Row (Wide Grip)', category: 'Pull', equipment: 'Cable Machine', met: 4 },
  { name: 'Face Pulls', category: 'Pull', equipment: 'Cable Machine', met: 3.5 },
  { name: 'Straight Arm Pulldown', category: 'Pull', equipment: 'Cable Machine', met: 3.5 },
  { name: 'Pullover Machine', category: 'Pull', equipment: 'Machine', met: 3.5 },
  { name: 'Seated Row Machine', category: 'Pull', equipment: 'Machine', met: 4 },
  { name: 'Assisted Pull-up Machine', category: 'Pull', equipment: 'Machine', met: 4 },
  { name: 'Good Mornings', category: 'Pull', equipment: 'Barbell', met: 4 },
  { name: 'Rack Pulls', category: 'Pull', equipment: 'Barbell', met: 5.5 },
  { name: 'Dumbbell Pullover', category: 'Pull', equipment: 'Dumbbell', met: 3.5 },

  // ── SHOULDERS ──
  { name: 'Overhead Press (Barbell)', category: 'Push', equipment: 'Barbell', met: 5 },
  { name: 'Arnold Press', category: 'Push', equipment: 'Dumbbell', met: 4.5 },
  { name: 'Dumbbell Shoulder Press', category: 'Push', equipment: 'Dumbbell', met: 4.5 },
  { name: 'Seated Dumbbell Press', category: 'Push', equipment: 'Dumbbell', met: 4 },
  { name: 'Lateral Raises (Dumbbell)', category: 'Push', equipment: 'Dumbbell', met: 3.5 },
  { name: 'Lateral Raises (Cable)', category: 'Push', equipment: 'Cable Machine', met: 3.5 },
  { name: 'Front Raises (Dumbbell)', category: 'Push', equipment: 'Dumbbell', met: 3.5 },
  { name: 'Front Raises (Barbell)', category: 'Push', equipment: 'Barbell', met: 3.5 },
  { name: 'Rear Delt Flyes (Dumbbell)', category: 'Pull', equipment: 'Dumbbell', met: 3.5 },
  { name: 'Rear Delt Flyes (Machine)', category: 'Pull', equipment: 'Machine', met: 3.5 },
  { name: 'Reverse Pec Deck', category: 'Pull', equipment: 'Machine', met: 3.5 },
  { name: 'Upright Row', category: 'Pull', equipment: 'Barbell', met: 4 },
  { name: 'Barbell Shrugs', category: 'Pull', equipment: 'Barbell', met: 3.5 },
  { name: 'Dumbbell Shrugs', category: 'Pull', equipment: 'Dumbbell', met: 3.5 },
  { name: 'Smith Machine Shoulder Press', category: 'Push', equipment: 'Smith Machine', met: 4 },
  { name: 'Shoulder Press Machine', category: 'Push', equipment: 'Machine', met: 4 },

  // ── BICEPS ──
  { name: 'Barbell Curl', category: 'Arms', equipment: 'Barbell', met: 3.5 },
  { name: 'EZ Bar Curl', category: 'Arms', equipment: 'EZ Bar', met: 3.5 },
  { name: 'Dumbbell Curl (Alternate)', category: 'Arms', equipment: 'Dumbbell', met: 3.5 },
  { name: 'Dumbbell Curl (Both)', category: 'Arms', equipment: 'Dumbbell', met: 3.5 },
  { name: 'Hammer Curl', category: 'Arms', equipment: 'Dumbbell', met: 3.5 },
  { name: 'Preacher Curl (Barbell)', category: 'Arms', equipment: 'Preacher Bench', met: 3 },
  { name: 'Preacher Curl (Dumbbell)', category: 'Arms', equipment: 'Preacher Bench', met: 3 },
  { name: 'Concentration Curl', category: 'Arms', equipment: 'Dumbbell', met: 3 },
  { name: 'Incline Dumbbell Curl', category: 'Arms', equipment: 'Dumbbell', met: 3 },
  { name: 'Cable Curl', category: 'Arms', equipment: 'Cable Machine', met: 3 },
  { name: 'Cable Hammer Curl', category: 'Arms', equipment: 'Cable Machine', met: 3 },
  { name: 'Machine Bicep Curl', category: 'Arms', equipment: 'Machine', met: 3 },
  { name: 'Spider Curl', category: 'Arms', equipment: 'Dumbbell', met: 3 },

  // ── TRICEPS ──
  { name: 'Tricep Pushdown (Rope)', category: 'Arms', equipment: 'Cable Machine', met: 3.5 },
  { name: 'Tricep Pushdown (Bar)', category: 'Arms', equipment: 'Cable Machine', met: 3.5 },
  { name: 'Overhead Tricep Extension (Cable)', category: 'Arms', equipment: 'Cable Machine', met: 3.5 },
  { name: 'Overhead Tricep Extension (Dumbbell)', category: 'Arms', equipment: 'Dumbbell', met: 3.5 },
  { name: 'Skull Crushers (Barbell)', category: 'Arms', equipment: 'Barbell', met: 3.5 },
  { name: 'Skull Crushers (Dumbbell)', category: 'Arms', equipment: 'Dumbbell', met: 3.5 },
  { name: 'Tricep Dips', category: 'Arms', equipment: 'Dip Station', met: 4 },
  { name: 'Close Grip Bench Press', category: 'Push', equipment: 'Barbell', met: 5 },
  { name: 'Kickbacks', category: 'Arms', equipment: 'Dumbbell', met: 3 },
  { name: 'Tricep Machine', category: 'Arms', equipment: 'Machine', met: 3 },
  { name: 'JM Press', category: 'Arms', equipment: 'Barbell', met: 4 },

  // ── LEGS ──
  { name: 'Squat (Barbell)', category: 'Legs', equipment: 'Barbell', met: 6 },
  { name: 'Front Squat', category: 'Legs', equipment: 'Barbell', met: 6 },
  { name: 'Goblet Squat', category: 'Legs', equipment: 'Dumbbell', met: 5 },
  { name: 'Sumo Squat', category: 'Legs', equipment: 'Barbell', met: 5.5 },
  { name: 'Bulgarian Split Squat', category: 'Legs', equipment: 'Dumbbell', met: 5.5 },
  { name: 'Hack Squat Machine', category: 'Legs', equipment: 'Machine', met: 5.5 },
  { name: 'Leg Press Machine', category: 'Legs', equipment: 'Machine', met: 5 },
  { name: 'Lunges (Barbell)', category: 'Legs', equipment: 'Barbell', met: 5 },
  { name: 'Lunges (Dumbbell)', category: 'Legs', equipment: 'Dumbbell', met: 4.5 },
  { name: 'Walking Lunges', category: 'Legs', equipment: 'Dumbbell', met: 5 },
  { name: 'Reverse Lunges', category: 'Legs', equipment: 'Dumbbell', met: 4.5 },
  { name: 'Step-ups', category: 'Legs', equipment: 'Dumbbell', met: 5 },
  { name: 'Romanian Deadlift (Dumbbell)', category: 'Legs', equipment: 'Dumbbell', met: 5 },
  { name: 'Leg Curl (Lying)', category: 'Legs', equipment: 'Machine', met: 3.5 },
  { name: 'Leg Curl (Seated)', category: 'Legs', equipment: 'Machine', met: 3.5 },
  { name: 'Leg Extension Machine', category: 'Legs', equipment: 'Machine', met: 3.5 },
  { name: 'Calf Raises (Standing)', category: 'Legs', equipment: 'Machine', met: 3 },
  { name: 'Calf Raises (Seated)', category: 'Legs', equipment: 'Machine', met: 3 },
  { name: 'Calf Raises (Leg Press)', category: 'Legs', equipment: 'Machine', met: 3 },
  { name: 'Hip Thrust (Barbell)', category: 'Legs', equipment: 'Barbell', met: 4.5 },
  { name: 'Hip Thrust (Machine)', category: 'Legs', equipment: 'Machine', met: 4 },
  { name: 'Glute Bridge', category: 'Legs', equipment: 'Bodyweight', met: 3.5 },
  { name: 'Sumo Deadlift', category: 'Legs', equipment: 'Barbell', met: 6 },
  { name: 'Smith Machine Squat', category: 'Legs', equipment: 'Smith Machine', met: 5 },
  { name: 'Sissy Squat', category: 'Legs', equipment: 'Bodyweight', met: 4.5 },
  { name: 'Adductor Machine', category: 'Legs', equipment: 'Machine', met: 3 },
  { name: 'Abductor Machine', category: 'Legs', equipment: 'Machine', met: 3 },

  // ── CORE ──
  { name: 'Plank', category: 'Arms', equipment: 'Bodyweight', met: 3.5 },
  { name: 'Side Plank', category: 'Arms', equipment: 'Bodyweight', met: 3 },
  { name: 'Crunches', category: 'Arms', equipment: 'Bodyweight', met: 3 },
  { name: 'Bicycle Crunches', category: 'Arms', equipment: 'Bodyweight', met: 3.5 },
  { name: 'Russian Twists', category: 'Arms', equipment: 'Bodyweight', met: 3.5 },
  { name: 'Leg Raises', category: 'Arms', equipment: 'Bodyweight', met: 3.5 },
  { name: 'Hanging Leg Raises', category: 'Pull', equipment: 'Pull-up Bar', met: 4 },
  { name: 'Cable Crunches', category: 'Arms', equipment: 'Cable Machine', met: 3.5 },
  { name: 'Ab Wheel Rollout', category: 'Arms', equipment: 'Ab Wheel', met: 4 },
  { name: 'Mountain Climbers', category: 'Cardio', equipment: 'Bodyweight', met: 7 },
  { name: 'Toe Touches', category: 'Arms', equipment: 'Bodyweight', met: 3 },
  { name: 'V-Ups', category: 'Arms', equipment: 'Bodyweight', met: 3.5 },
  { name: 'Dragon Flags', category: 'Arms', equipment: 'Bodyweight', met: 4 },

  // ── CARDIO ──
  { name: 'Treadmill Running', category: 'Cardio', equipment: 'Treadmill', met: 9.8 },
  { name: 'Treadmill Walking (Incline)', category: 'Cardio', equipment: 'Treadmill', met: 5 },
  { name: 'Stationary Bike (Moderate)', category: 'Cardio', equipment: 'Stationary Bike', met: 7 },
  { name: 'Stationary Bike (Intense)', category: 'Cardio', equipment: 'Stationary Bike', met: 11 },
  { name: 'Rowing Machine', category: 'Cardio', equipment: 'Rowing Machine', met: 8.5 },
  { name: 'Elliptical Trainer', category: 'Cardio', equipment: 'Elliptical', met: 7 },
  { name: 'Stair Climber', category: 'Cardio', equipment: 'Stair Climber', met: 9 },
  { name: 'Jump Rope', category: 'Cardio', equipment: 'Jump Rope', met: 11 },
  { name: 'Burpees', category: 'Cardio', equipment: 'Bodyweight', met: 8 },
  { name: 'Box Jumps', category: 'Cardio', equipment: 'Box', met: 8 },
  { name: 'Jumping Jacks', category: 'Cardio', equipment: 'Bodyweight', met: 7 },
  { name: 'High Knees', category: 'Cardio', equipment: 'Bodyweight', met: 7 },
  { name: 'Battle Ropes', category: 'Cardio', equipment: 'Battle Ropes', met: 9 },
  { name: 'Swimming', category: 'Cardio', equipment: 'Pool', met: 8 },
  { name: 'HIIT Sprints', category: 'Cardio', equipment: 'Bodyweight', met: 10 },

  // ── OLYMPIC / FULL BODY ──
  { name: 'Power Clean', category: 'Legs', equipment: 'Barbell', met: 6 },
  { name: 'Hang Clean', category: 'Legs', equipment: 'Barbell', met: 6 },
  { name: 'Snatch', category: 'Legs', equipment: 'Barbell', met: 6.5 },
  { name: 'Clean and Jerk', category: 'Legs', equipment: 'Barbell', met: 6.5 },
  { name: 'Thruster', category: 'Push', equipment: 'Barbell', met: 6 },
  { name: 'Kettlebell Swing', category: 'Legs', equipment: 'Kettlebell', met: 7 },
  { name: 'Kettlebell Clean and Press', category: 'Push', equipment: 'Kettlebell', met: 6 },
  { name: 'Turkish Get-up', category: 'Arms', equipment: 'Kettlebell', met: 5 },
  { name: "Farmer's Walk", category: 'Arms', equipment: 'Dumbbell', met: 5 },
  { name: 'Sled Push', category: 'Legs', equipment: 'Sled', met: 8 },
  { name: 'Tire Flip', category: 'Legs', equipment: 'Tire', met: 8 },
]

export function searchExercises(query: string): ExerciseInfo[] {
  if (!query || query.length < 1) return []
  const lower = query.toLowerCase()
  return EXERCISE_DB.filter(e =>
    e.name.toLowerCase().includes(lower) ||
    e.equipment.toLowerCase().includes(lower)
  ).slice(0, 10)
}

export function getExerciseMET(name: string): number {
  const ex = EXERCISE_DB.find(e => e.name.toLowerCase() === name.toLowerCase())
  return ex?.met ?? 4
}
