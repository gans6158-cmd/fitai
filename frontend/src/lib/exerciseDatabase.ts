export const EXERCISES: string[] = [
  // Chest
  'Bench Press',
  'Incline Bench Press',
  'Decline Bench Press',
  'Dumbbell Bench Press',
  'Incline Dumbbell Press',
  'Dumbbell Flyes',
  'Cable Crossover',
  'Chest Dips',
  'Push-ups',
  'Incline Push-ups',
  'Decline Push-ups',
  'Diamond Push-ups',

  // Back
  'Pull-ups',
  'Chin-ups',
  'Lat Pulldown',
  'Barbell Row',
  'Dumbbell Row',
  'Cable Row',
  'T-Bar Row',
  'Face Pulls',
  'Straight Arm Pulldown',
  'Deadlift',
  'Romanian Deadlift',
  'Good Mornings',

  // Shoulders
  'Overhead Press',
  'Dumbbell Shoulder Press',
  'Arnold Press',
  'Lateral Raises',
  'Front Raises',
  'Rear Delt Flyes',
  'Upright Row',
  'Shrugs',
  'Cable Lateral Raises',

  // Biceps
  'Barbell Curl',
  'Dumbbell Curl',
  'Hammer Curl',
  'Preacher Curl',
  'Incline Dumbbell Curl',
  'Cable Curl',
  'Concentration Curl',
  'EZ Bar Curl',

  // Triceps
  'Tricep Pushdown',
  'Skull Crushers',
  'Overhead Tricep Extension',
  'Tricep Dips',
  'Close Grip Bench Press',
  'Kickbacks',
  'Cable Overhead Extension',

  // Legs
  'Squat',
  'Front Squat',
  'Goblet Squat',
  'Bulgarian Split Squat',
  'Hack Squat',
  'Leg Press',
  'Lunges',
  'Walking Lunges',
  'Step-ups',
  'Leg Curl',
  'Leg Extension',
  'Calf Raises',
  'Seated Calf Raises',
  'Hip Thrust',
  'Glute Bridge',
  'Sumo Deadlift',

  // Core
  'Plank',
  'Side Plank',
  'Crunches',
  'Bicycle Crunches',
  'Russian Twists',
  'Leg Raises',
  'Hanging Leg Raises',
  'Cable Crunches',
  'Ab Wheel Rollout',
  'Mountain Climbers',
  'Toe Touches',
  'V-Ups',

  // Cardio
  'Running',
  'Treadmill',
  'Cycling',
  'Stationary Bike',
  'Rowing Machine',
  'Elliptical',
  'Jump Rope',
  'Stair Climber',
  'Swimming',
  'HIIT',
  'Battle Ropes',
  'Box Jumps',
  'Burpees',
  'Jumping Jacks',
  'High Knees',

  // Olympic / Full Body
  'Power Clean',
  'Hang Clean',
  'Snatch',
  'Thruster',
  'Kettlebell Swing',
  'Kettlebell Clean and Press',
  'Turkish Get-up',
  'Farmer's Walk',
]

export function searchExercises(query: string): string[] {
  if (!query || query.length < 1) return []
  const lower = query.toLowerCase()
  return EXERCISES.filter(e => e.toLowerCase().includes(lower)).slice(0, 8)
}
