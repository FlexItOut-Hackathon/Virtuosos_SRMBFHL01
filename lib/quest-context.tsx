"use client"

import type React from "react"

import { createContext, useContext, useReducer, useEffect, type ReactNode, useCallback } from "react"
import { generateQuest, type Quest, type QuestType } from "./quest-generator"

interface ExerciseData {
  timestamp: number
  exerciseType: string
  repetitions: number
  confidence: number
}

interface QuestState {
  activeQuests: Quest[]
  completedQuests: Quest[]
  userLevel: number
  totalXP: number
  questsCompleted: number
  lastProcessedTimestamp: number
}

type QuestAction =
  | { type: "ADD_QUEST"; quest: Quest }
  | { type: "UPDATE_QUEST_PROGRESS"; questId: string; progress: number }
  | { type: "COMPLETE_QUEST"; questId: string }
  | { type: "GAIN_XP"; amount: number }
  | { type: "LEVEL_UP" }
  | { type: "UPDATE_LAST_PROCESSED"; timestamp: number }

interface QuestContextType {
  state: QuestState;
  dispatch: React.Dispatch<QuestAction>;
  generateNewQuest: (preferredTypes?: QuestType[]) => void;
  updateQuestProgress: (questId: string, progress: number) => void;
  checkExerciseProgress: () => Promise<void>;
}

const QuestContext = createContext<QuestContextType | undefined>(undefined)

const initialState: QuestState = {
  activeQuests: [],
  completedQuests: [],
  userLevel: 1,
  totalXP: 0,
  questsCompleted: 0,
  lastProcessedTimestamp: Date.now()
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
    case "UPDATE_LAST_PROCESSED":
      return {
        ...state,
        lastProcessedTimestamp: action.timestamp,
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

  // Add function to check exercise log
  const checkExerciseProgress = useCallback(async () => {
    try {
      const response = await fetch('/api/exercises');
      if (!response.ok) {
        throw new Error('Failed to fetch exercise log');
      }

      const data = await response.json();
      const exercises: ExerciseData[] = data.exercises;

      // Process each active quest
      state.activeQuests.forEach(quest => {
        // Get only new relevant exercises since last check
        const relevantExercises = exercises.filter(exercise => {
          return exercise.exerciseType.toLowerCase() === quest.type.toLowerCase() &&
                 exercise.confidence > 0.5 &&
                 exercise.timestamp > state.lastProcessedTimestamp;
        });

        if (relevantExercises.length > 0) {
          // Calculate new repetitions only from new exercises
          const newReps = relevantExercises.reduce((sum, exercise) => sum + exercise.repetitions, 0);
          
          // Update quest progress by adding new reps to existing progress
          if (newReps > 0) {
            const newProgress = quest.completed + newReps;
            updateQuestProgress(quest.id, newProgress);
          }
        }
      });

      // Update the last processed timestamp
      dispatch({ type: "UPDATE_LAST_PROCESSED", timestamp: Date.now() });
    } catch (error) {
      console.error('Failed to check exercise progress:', error);
    }
  }, [state.activeQuests, state.lastProcessedTimestamp]);

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
        checkExerciseProgress,
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

