import { Dumbbell, Heart, Flame } from "lucide-react"
import type { LucideIcon } from "lucide-react"

export type QuestType = "pushup" | "squat" | "jumping_jack"
export type QuestDifficulty = 1 | 2 | 3

export interface Quest {
  id: string
  name: string
  description: string
  type: QuestType
  difficulty: QuestDifficulty
  xp: number
  completed: number
  total: number
  icon: LucideIcon
  color: string
}

const questTemplates = {
  pushup: [
    "Complete {count} push-ups",
    "Warrior's Challenge: {count} push-ups",
    "Push-up Power: {count} reps",
  ],
  squat: [
    "Perform {count} squats",
    "Squat Challenge: {count} reps",
    "Lower Body Power: {count} squats",
  ],
  jumping_jack: [
    "Do {count} jumping jacks",
    "Cardio Burst: {count} jumping jacks",
    "High Energy: {count} jumping jacks",
  ],
}

const typeConfig = {
  pushup: {
    icon: Dumbbell,
    color: "text-pixel-blue",
    baseXP: 100,
    baseCount: 5,
  },
  squat: {
    icon: Flame,
    color: "text-pixel-orange",
    baseXP: 80,
    baseCount: 8,
  },
  jumping_jack: {
    icon: Heart,
    color: "text-pixel-red",
    baseXP: 60,
    baseCount: 10,
  },
}

export function generateQuest(userLevel: number, completedQuests: string[], preferredTypes?: QuestType[]): Quest {
  // Select quest type
  const availableTypes = preferredTypes || (Object.keys(questTemplates) as QuestType[])
  const type = availableTypes[Math.floor(Math.random() * availableTypes.length)]

  // Select template
  const templates = questTemplates[type]
  const template = templates[Math.floor(Math.random() * templates.length)]

  // Calculate difficulty based on user level (1-3)
  const difficulty = Math.min(Math.ceil(userLevel / 5), 3) as QuestDifficulty

  // Calculate required repetitions based on exercise type and difficulty
  const baseCount = typeConfig[type].baseCount
  const count = baseCount * difficulty

  // Calculate XP reward
  const baseXP = typeConfig[type].baseXP
  const xp = Math.floor(baseXP * difficulty * (1 + Math.random() * 0.2))

  // Generate unique ID
  const id = `quest-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

  return {
    id,
    name: template.replace("{count}", count.toString()),
    description: `Complete ${count} ${type.replace('_', ' ')}s to earn ${xp} XP!`,
    type,
    difficulty,
    xp,
    completed: 0,
    total: count,
    icon: typeConfig[type].icon,
    color: typeConfig[type].color,
  }
}

export function calculateQuestProgress(quest: Quest, activity: number): number {
  return Math.min(quest.total, quest.completed + activity)
}

export function isQuestComplete(quest: Quest): boolean {
  return quest.completed >= quest.total
}

