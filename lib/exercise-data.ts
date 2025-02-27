import { Dumbbell, Flame, Heart } from "lucide-react"

export interface Exercise {
  id: string
  name: string
  type: "strength" | "cardio" | "flexibility"
  difficulty: 1 | 2 | 3 | 4 | 5
  description: string
  instructions: string[]
  targetMuscles: string[]
  icon: any
  color: string
  xpReward: number
  duration: number // in seconds
  calories: number
  detectableByAI: boolean
}

export const exercises: Exercise[] = [
  {
    id: "squat",
    name: "Squats",
    type: "strength",
    difficulty: 2,
    description: "A fundamental lower body exercise that targets multiple muscle groups",
    instructions: [
      "Stand with feet shoulder-width apart",
      "Keep your back straight and chest up",
      "Lower your body as if sitting back into a chair",
      "Keep your knees aligned with your toes",
      "Push through your heels to return to starting position",
    ],
    targetMuscles: ["Quadriceps", "Hamstrings", "Glutes", "Core"],
    icon: Dumbbell,
    color: "text-pixel-blue",
    xpReward: 100,
    duration: 60,
    calories: 8,
    detectableByAI: true,
  },
  {
    id: "pushup",
    name: "Push-ups",
    type: "strength",
    difficulty: 3,
    description: "Classic upper body exercise for chest, shoulders, and triceps",
    instructions: [
      "Start in plank position with hands shoulder-width apart",
      "Keep your body in a straight line",
      "Lower your chest to the ground",
      "Push back up to starting position",
      "Keep your core engaged throughout",
    ],
    targetMuscles: ["Chest", "Shoulders", "Triceps", "Core"],
    icon: Dumbbell,
    color: "text-pixel-blue",
    xpReward: 120,
    duration: 60,
    calories: 7,
    detectableByAI: true,
  },
  {
    id: "crunch",
    name: "Crunches",
    type: "strength",
    difficulty: 1,
    description: "Core strengthening exercise focusing on the abdominal muscles",
    instructions: [
      "Lie on your back with knees bent",
      "Place hands behind your head",
      "Lift your shoulders off the ground",
      "Engage your core throughout",
      "Lower back down with control",
    ],
    targetMuscles: ["Abs", "Core"],
    icon: Flame,
    color: "text-pixel-orange",
    xpReward: 80,
    duration: 45,
    calories: 5,
    detectableByAI: true,
  },
  {
    id: "jumping-jacks",
    name: "Jumping Jacks",
    type: "cardio",
    difficulty: 1,
    description: "Full-body cardio exercise that raises heart rate",
    instructions: [
      "Start with feet together and arms at sides",
      "Jump and spread legs while raising arms overhead",
      "Jump back to starting position",
      "Maintain a steady rhythm",
      "Keep movements controlled",
    ],
    targetMuscles: ["Full Body", "Shoulders", "Calves"],
    icon: Heart,
    color: "text-pixel-red",
    xpReward: 90,
    duration: 30,
    calories: 10,
    detectableByAI: true,
  },
]

export function getExerciseById(id: string): Exercise | undefined {
  return exercises.find((exercise) => exercise.id === id)
}

export function getExercisesByType(type: Exercise["type"]): Exercise[] {
  return exercises.filter((exercise) => exercise.type === type)
}

export function getDetectableExercises(): Exercise[] {
  return exercises.filter((exercise) => exercise.detectableByAI)
}

