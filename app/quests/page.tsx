"use client"

import { useState, useEffect } from "react"
import { Scroll, Star, Search, Trophy, AlertCircle } from "lucide-react"
import PixelPanel from "@/components/pixel-panel"
import PixelButton from "@/components/pixel-button"
import PixelProgress from "@/components/pixel-progress"
import { useQuests } from "@/lib/quest-context"
import { motion, AnimatePresence } from "framer-motion"

export default function QuestLog() {
  const [activeTab, setActiveTab] = useState("active")
  const [searchQuery, setSearchQuery] = useState("")
  const [showReward, setShowReward] = useState<{
    questId: string
    xp: number
    name: string
  } | null>(null)

  const { state, updateQuestProgress } = useQuests()
  const { activeQuests, completedQuests, userLevel, totalXP } = state

  const filteredQuests = (activeTab === "active" ? activeQuests : completedQuests).filter(
    (quest) =>
      quest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      quest.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Simulate quest progress updates (replace with actual workout tracking)
  useEffect(() => {
    const interval = setInterval(() => {
      activeQuests.forEach((quest) => {
        if (Math.random() > 0.7) {
          const progress = quest.completed + 1
          updateQuestProgress(quest.id, progress)

          if (progress >= quest.total) {
            setShowReward({
              questId: quest.id,
              xp: quest.xp,
              name: quest.name,
            })
          }
        }
      })
    }, 5000)

    return () => clearInterval(interval)
  }, [activeQuests, updateQuestProgress])

  const generateNewQuest = () => {
    alert("New quest generation logic to be implemented.")
  }

  return (
    <div className="container mx-auto max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-pixelFont text-pixel-light flex items-center">
          <Scroll className="mr-2" /> Quest Log
        </h1>
        <div className="flex items-center gap-4">
          <div className="bg-pixel-dark border-2 border-pixel-light rounded-md px-4 py-2">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-pixel-yellow" />
              <span className="font-pixelFont text-pixel-light">Level {userLevel}</span>
            </div>
            <div className="text-sm text-pixel-light opacity-80">{totalXP} XP</div>
          </div>
        </div>
      </div>

      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-pixel-light" />
          </div>
          <input
            type="text"
            placeholder="Search quests..."
            className="w-full pl-10 pr-4 py-2 bg-pixel-dark border-2 border-pixel-light rounded-md font-pixelFont text-pixel-light focus:outline-none focus:border-pixel-blue"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex">
          <button
            className={`px-4 py-2 font-pixelFont border-t-2 border-l-2 border-b-2 border-pixel-light rounded-l-md ${
              activeTab === "active" ? "bg-pixel-blue text-pixel-light" : "bg-pixel-dark text-pixel-light"
            }`}
            onClick={() => setActiveTab("active")}
          >
            Active
          </button>
          <button
            className={`px-4 py-2 font-pixelFont border-2 border-pixel-light rounded-r-md ${
              activeTab === "completed" ? "bg-pixel-green text-pixel-light" : "bg-pixel-dark text-pixel-light"
            }`}
            onClick={() => setActiveTab("completed")}
          >
            Completed
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showReward && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 flex items-center justify-center z-50 bg-black/50"
            onClick={() => setShowReward(null)}
          >
            <PixelPanel className="transform p-8 text-center">
              <Trophy className="w-16 h-16 text-pixel-yellow mx-auto mb-4 animate-bounce" />
              <h2 className="text-2xl font-pixelFont text-pixel-light mb-2">Quest Complete!</h2>
              <p className="text-pixel-light mb-4">{showReward.name}</p>
              <div className="flex items-center justify-center gap-2 text-xl font-pixelFont text-pixel-yellow">
                <Trophy className="w-6 h-6" />+{showReward.xp} XP
              </div>
            </PixelPanel>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-4">
        {filteredQuests.length > 0 ? (
          <AnimatePresence>
            {filteredQuests.map((quest) => (
              <motion.div
                key={quest.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                layout
              >
                <PixelPanel>
                  <div className="flex flex-col sm:flex-row sm:items-center">
                    <div className="flex-1">
                      <div className="flex items-center">
                        <div
                          className={`w-10 h-10 rounded-md bg-pixel-dark border-2 border-pixel-light flex items-center justify-center mr-3`}
                        >
                          <quest.icon className={quest.color} />
                        </div>
                        <div>
                          <h3 className="font-pixelFont text-pixel-light text-lg">{quest.name}</h3>
                          <p className="text-pixel-light opacity-80">{quest.description}</p>
                        </div>
                      </div>

                      <div className="mt-3 flex flex-wrap gap-2">
                        <span className="text-xs bg-pixel-blue px-2 py-1 rounded-md text-pixel-light capitalize">
                          {quest.type}
                        </span>
                        <span className="text-xs bg-pixel-dark border border-pixel-light px-2 py-1 rounded-md text-pixel-light flex items-center">
                          <div className="flex mr-1">
                            {[...Array(quest.difficulty)].map((_, i) => (
                              <Star key={i} className="w-3 h-3 text-pixel-yellow" />
                            ))}
                          </div>
                          Difficulty
                        </span>
                        <span className="text-xs bg-pixel-dark border border-pixel-light px-2 py-1 rounded-md text-pixel-green flex items-center">
                          +{quest.xp} XP
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 sm:mt-0 sm:ml-4 sm:w-48">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-pixel-light">Progress</span>
                        <span className="text-pixel-light">
                          {quest.completed}/{quest.total}
                        </span>
                      </div>
                      <PixelProgress
                        value={(quest.completed / quest.total) * 100}
                        color={quest.completed === quest.total ? "pixel-green" : "pixel-blue"}
                      />

                      {activeTab === "active" && quest.deadline && (
                        <div className="mt-2 flex items-center gap-1 text-xs text-pixel-light opacity-80">
                          <AlertCircle className="w-4 h-4" />
                          Expires in {Math.ceil((quest.deadline.getTime() - Date.now()) / (1000 * 60 * 60))}h
                        </div>
                      )}
                    </div>
                  </div>
                </PixelPanel>
              </motion.div>
            ))}
          </AnimatePresence>
        ) : (
          <PixelPanel>
            <div className="text-center py-8">
              <p className="font-pixelFont text-pixel-light text-lg mb-2">No quests found!</p>
              <p className="text-pixel-light opacity-80">Try a different search or filter.</p>
            </div>
          </PixelPanel>
        )}
      </div>

      {activeTab === "active" && (
        <div className="mt-6 flex justify-center">
          <PixelButton color="orange" onClick={() => generateNewQuest()}>
            Discover New Quests
          </PixelButton>
        </div>
      )}
    </div>
  )
}

