"use client"

import type React from "react"

import { createContext, useContext, useReducer, useEffect, type ReactNode, useCallback } from "react"
import { generateQuest, type Quest, type QuestType } from "./quest-generator"

interface QuestState {
  activeQuests: Quest[]
  completedQuests: Quest[]
  userLevel: number
  totalXP: number
  questsCompleted: number
}

type QuestAction =
  | { type: "ADD_QUEST"; quest: Quest }
  | { type: "UPDATE_QUEST_PROGRESS"; questId: string; progress: number }
  | { type: "COMPLETE_QUEST"; questId: string }
  | { type: "GAIN_XP"; amount: number }
  | { type: "LEVEL_UP" }

const QuestContext = createContext<
  | {
      state: QuestState
      dispatch: React.Dispatch<QuestAction>
      generateNewQuest: (preferredTypes?: QuestType[]) => void
      updateQuestProgress: (questId: string, progress: number) => void
    }
  | undefined
>(undefined)

const initialState: QuestState = {
  activeQuests: [],
  completedQuests: [],
  userLevel: 1,
  totalXP: 0,
  questsCompleted: 0,
}

function questReducer(state: QuestState, action: QuestAction): QuestState {
  switch (action.type) {
    case "ADD_QUEST":
      return {
        ...state,
        activeQuests: [...state.activeQuests, action.quest],
      }
    case "UPDATE_QUEST_PROGRESS":
      return {
        ...state,
        activeQuests: state.activeQuests.map((quest) =>
          quest.id === action.questId
            ? {
                ...quest,
                completed: action.progress,
              }
            : quest,
        ),
      }
    case "COMPLETE_QUEST":
      const completedQuest = state.activeQuests.find((q) => q.id === action.questId)
      if (!completedQuest) return state

      return {
        ...state,
        activeQuests: state.activeQuests.filter((q) => q.id !== action.questId),
        completedQuests: [...state.completedQuests, completedQuest],
        questsCompleted: state.questsCompleted + 1,
      }
    case "GAIN_XP":
      return {
        ...state,
        totalXP: state.totalXP + action.amount,
      }
    case "LEVEL_UP":
      return {
        ...state,
        userLevel: state.userLevel + 1,
      }
    default:
      return state
  }
}

export function QuestProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(questReducer, initialState)

  const generateNewQuest = useCallback(
    (preferredTypes?: QuestType[]) => {
      const quest = generateQuest(
        state.userLevel,
        state.completedQuests.map((q) => q.id),
        preferredTypes,
      )
      dispatch({ type: "ADD_QUEST", quest })
    },
    [state.completedQuests, state.userLevel],
  )

  const updateQuestProgress = (questId: string, progress: number) => {
    dispatch({ type: "UPDATE_QUEST_PROGRESS", questId, progress })

    const quest = state.activeQuests.find((q) => q.id === questId)
    if (quest && progress >= quest.total) {
      dispatch({ type: "COMPLETE_QUEST", questId })
      dispatch({ type: "GAIN_XP", amount: quest.xp })

      // Check for level up
      const xpForNextLevel = state.userLevel * 1000
      if (state.totalXP + quest.xp >= xpForNextLevel) {
        dispatch({ type: "LEVEL_UP" })
      }

      // Generate a new quest to replace the completed one
      generateNewQuest([quest.type])
    }
  }

  // Initialize with some quests
  useEffect(() => {
    if (state.activeQuests.length === 0) {
      for (let i = 0; i < 3; i++) {
        generateNewQuest()
      }
    }
  }, [state.activeQuests.length, generateNewQuest])

  return (
    <QuestContext.Provider
      value={{
        state,
        dispatch,
        generateNewQuest,
        updateQuestProgress,
      }}
    >
      {children}
    </QuestContext.Provider>
  )
}

export function useQuests() {
  const context = useContext(QuestContext)
  if (context === undefined) {
    throw new Error("useQuests must be used within a QuestProvider")
  }
  return context
}

