import { Dumbbell, Heart, Flame, Brain, Shield, Star, Coins } from "lucide-react"
import type { LucideIcon } from "lucide-react"

export type QuestType = "strength" | "cardio" | "flexibility" | "meditation" | "endurance"
export type QuestDifficulty = 1 | 2 | 3 | 4 | 5

export interface Quest {
  id: string
  name: string
  description: string
  type: QuestType
  difficulty: QuestDifficulty
  xp: number
  completed: number
  total: number
  rewards: Reward[]
  deadline?: Date
  icon: LucideIcon
  color: string
}

export interface Reward {
  type: "xp" | "item" | "badge" | "currency"
  amount: number
  name: string
  icon: LucideIcon
}

const questTemplates = {
  strength: [
    "Power Training: {count} push-ups",
    "Strength Challenge: {count} squats",
    "Muscle Quest: {count} pull-ups",
    "Warriors Training: {count} lunges",
  ],
  cardio: [
    "Cardio Rush: {count} minutes of running",
    "Heart Racer: {count} jumping jacks",
    "Stamina Builder: {count} minutes of HIIT",
    "Endurance Test: {count} burpees",
  ],
  flexibility: [
    "Flexibility Focus: Hold {count} stretches",
    "Balance Master: {count} yoga poses",
    "Mobility Quest: {count} dynamic stretches",
    "Zen Warrior: {count} minutes of yoga",
  ],
  meditation: [
    "Mind Temple: {count} minutes of meditation",
    "Focus Quest: Complete {count} breathing exercises",
    "Inner Peace: {count} minutes of mindfulness",
    "Mental Mastery: {count} concentration exercises",
  ],
  endurance: [
    "Endurance Challenge: {count} minutes of planks",
    "Stamina Quest: {count} mountain climbers",
    "Warriors Trial: {count} minutes of circuit training",
    "Power Endurance: {count} kettlebell swings",
  ],
}

const typeConfig = {
  strength: {
    icon: Dumbbell,
    color: "text-pixel-blue",
    baseXP: 100,
  },
  cardio: {
    icon: Heart,
    color: "text-pixel-red",
    baseXP: 80,
  },
  flexibility: {
    icon: Flame,
    color: "text-pixel-orange",
    baseXP: 60,
  },
  meditation: {
    icon: Brain,
    color: "text-pixel-purple",
    baseXP: 50,
  },
  endurance: {
    icon: Shield,
    color: "text-pixel-green",
    baseXP: 90,
  },
}

export function generateQuest(userLevel: number, completedQuests: string[], preferredTypes?: QuestType[]): Quest {
  // Select quest type
  const availableTypes = preferredTypes || (Object.keys(questTemplates) as QuestType[])
  const type = availableTypes[Math.floor(Math.random() * availableTypes.length)]

  // Select template
  const templates = questTemplates[type]
  const template = templates[Math.floor(Math.random() * templates.length)]

  // Calculate difficulty and requirements based on user level
  const difficulty = Math.min(Math.ceil(userLevel / 5), 5) as QuestDifficulty
  const baseCount = Math.floor(10 * (1 + (difficulty - 1) * 0.5))
  const count = baseCount + Math.floor(Math.random() * baseCount * 0.5)

  // Calculate XP reward based on difficulty and type
  const baseXP = typeConfig[type].baseXP
  const xp = Math.floor(baseXP * difficulty * (1 + Math.random() * 0.2))

  // Generate rewards
  const rewards: Reward[] = [
    {
      type: "xp",
      amount: xp,
      name: "Experience Points",
      icon: Star,
    },
  ]

  // Add bonus rewards for higher difficulty quests
  if (difficulty >= 3) {
    rewards.push({
      type: "currency",
      amount: Math.floor(difficulty * 50 * (1 + Math.random() * 0.5)),
      name: "Pixel Coins",
      icon: Coins,
    })
  }

  // Generate unique ID
  const id = `quest-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

  return {
    id,
    name: template.replace("{count}", count.toString()),
    description: `Complete this ${type} quest to earn rewards and improve your ${type} skills!`,
    type,
    difficulty,
    xp,
    completed: 0,
    total: count,
    rewards,
    icon: typeConfig[type].icon,
    color: typeConfig[type].color,
    deadline: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
  }
}

export function calculateQuestProgress(quest: Quest, activity: number): number {
  return Math.min(quest.total, quest.completed + activity)
}

export function isQuestComplete(quest: Quest): boolean {
  return quest.completed >= quest.total
}

export function calculateRewards(quest: Quest): Reward[] {
  const progress = quest.completed / quest.total
  return quest.rewards.map((reward) => ({
    ...reward,
    amount: Math.floor(reward.amount * progress),
  }))
}

