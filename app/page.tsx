"use client"

import { useState, useEffect } from "react"
import { Dumbbell, Flame, Heart, Trophy, Calendar, Zap, ArrowRight, Star, Sparkles } from "lucide-react"
import PixelAvatar from "@/components/pixel-avatar"
import PixelButton from "@/components/pixel-button"
import PixelPanel from "@/components/pixel-panel"
import PixelProgress from "@/components/pixel-progress"
import PixelOracle from "@/components/pixel-oracle"
import Link from "next/link"
import { useQuests } from "@/lib/quest-context"
import { useAvatarProfile } from "@/hooks/useAvatarProfile"

export default function Dashboard() {
  const [health, setHealth] = useState(75)
  const [strength, setStrength] = useState(60)
  const [endurance, setEndurance] = useState(45)
  const { profile, isReady } = useAvatarProfile()

  // Simulate stats changing over time
  useEffect(() => {
    const interval = setInterval(() => {
      setHealth((prev) => Math.min(100, Math.max(0, prev + Math.floor(Math.random() * 5) - 2)))
      setStrength((prev) => Math.min(100, Math.max(0, prev + Math.floor(Math.random() * 5) - 2)))
      setEndurance((prev) => Math.min(100, Math.max(0, prev + Math.floor(Math.random() * 5) - 2)))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const achievements = [
    { id: 1, name: "Early Bird", icon: Calendar, color: "text-pixel-yellow" },
    { id: 2, name: "Flame Keeper", icon: Flame, color: "text-pixel-orange" },
    { id: 3, name: "Power Lifter", icon: Dumbbell, color: "text-pixel-blue" },
  ]

  const { state, updateQuestProgress } = useQuests()
  const { activeQuests } = state

  if (!isReady) {
    return (
      <div className="container mx-auto max-w-6xl">
        <div className="animate-pulse">
          <div className="h-8 bg-pixel-dark rounded w-48 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="h-96 bg-pixel-dark rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-6xl">
      <h1 className="text-3xl font-pixelFont mb-6 text-pixel-light">Adventure Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Character Stats */}
        <PixelPanel className="md:col-span-1">
          <div className="flex flex-col items-center">
            <h2 className="text-xl font-pixelFont mb-4 text-pixel-light">Your Hero</h2>
            <PixelAvatar 
              size="large"
              color={profile.avatarColor}
              avatarImage={profile.selectedAvatar}
            />
            <h3 className="text-lg font-pixelFont mt-2 text-pixel-light">{profile.username}</h3>
            <p className="text-sm text-pixel-green mb-4">Level 8 {profile.specialization}</p>

            <div className="w-full space-y-4 mt-2">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="font-pixelFont text-pixel-light flex items-center">
                    <Heart className="w-4 h-4 mr-1 text-pixel-red" /> Health
                  </span>
                  <span className="font-pixelFont text-pixel-light">{health}%</span>
                </div>
                <PixelProgress value={health} color="pixel-red" />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="font-pixelFont text-pixel-light flex items-center">
                    <Dumbbell className="w-4 h-4 mr-1 text-pixel-blue" /> Strength
                  </span>
                  <span className="font-pixelFont text-pixel-light">{strength}%</span>
                </div>
                <PixelProgress value={strength} color="pixel-blue" />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="font-pixelFont text-pixel-light flex items-center">
                    <Flame className="w-4 h-4 mr-1 text-pixel-orange" /> Endurance
                  </span>
                  <span className="font-pixelFont text-pixel-light">{endurance}%</span>
                </div>
                <PixelProgress value={endurance} color="pixel-orange" />
              </div>
            </div>

            <div className="mt-6 w-full">
              <h3 className="text-lg font-pixelFont mb-2 text-pixel-light">Achievements</h3>
              <div className="flex justify-between">
                {achievements.map((achievement) => (
                  <div key={achievement.id} className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-md bg-pixel-dark border-2 border-pixel-light flex items-center justify-center">
                      <achievement.icon className={`w-6 h-6 ${achievement.color}`} />
                    </div>
                    <span className="text-xs mt-1 text-pixel-light">{achievement.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </PixelPanel>

        {/* Active Quests */}
        <PixelPanel className="md:col-span-2">
          <div className="flex items-center mb-4">
            <h2 className="text-xl font-pixelFont text-pixel-light">Quest Log</h2>
            <div className="ml-auto flex items-center space-x-2">
              <PixelAvatar 
                size="small"
                color={profile.avatarColor}
                avatarImage={profile.selectedAvatar}
              />
              <span className="text-sm font-pixelFont text-pixel-light">{profile.username}</span>
            </div>
          </div>
          <div>
            <div className="space-y-4">
              {activeQuests.map((quest) => (
                <div
                  key={quest.id}
                  className="border-2 border-pixel-light rounded-md p-3 hover:border-pixel-blue transition-colors"
                >
                  <div className="flex justify-between items-center">
                    <h3 className="font-pixelFont text-pixel-light">{quest.name}</h3>
                    <span className="text-xs bg-pixel-blue px-2 py-1 rounded-md text-pixel-light">{quest.type}</span>
                  </div>

                  <div className="flex items-center mt-2">
                    <div className="flex">
                      {[...Array(quest.difficulty)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-pixel-yellow" />
                      ))}
                    </div>
                    <span className="ml-auto text-pixel-green text-sm">+{quest.xp} XP</span>
                  </div>

                  <div className="mt-2">
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
                  </div>

                  <div className="mt-3 flex justify-end">
                    <PixelButton
                      size="small"
                      onClick={() => {
                        if (quest.completed < quest.total) {
                          updateQuestProgress(quest.id, quest.completed + 1)
                        }
                      }}
                      disabled={quest.completed >= quest.total}
                      color={quest.completed >= quest.total ? "green" : "blue"}
                    >
                      {quest.completed >= quest.total ? (
                        "Completed!"
                      ) : (
                        <>
                          Start <ArrowRight className="ml-1 w-4 h-4" />
                        </>
                      )}
                    </PixelButton>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-center">
              <Link href="/quests">
                <PixelButton>View All Quests</PixelButton>
              </Link>
            </div>
          </div>
        </PixelPanel>
      </div>

      {/* AI Workout Section */}
      <div className="mt-6">
        <PixelPanel className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-pixel-blue/20 rounded-full blur-3xl"></div>
          <div className="relative z-10">
            <div className="flex flex-col items-center text-center p-6">
              <h2 className="text-2xl font-pixelFont text-pixel-light mb-4">AI-Powered Workout</h2>
              <p className="text-pixel-light opacity-80 mb-6 max-w-md">
                Start an interactive workout session with real-time form tracking and AI guidance
              </p>
              <Link href="/workout">
                <PixelButton color="blue" size="large" className="animate-pixel-pulse">
                  <Sparkles className="mr-2" />
                  Start AI Workout
                </PixelButton>
              </Link>
            </div>
          </div>
        </PixelPanel>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {/* Leaderboard Preview */}
        <PixelPanel>
          <h2 className="text-xl font-pixelFont mb-4 text-pixel-light flex items-center">
            <Trophy className="mr-2 text-pixel-yellow" /> Top Adventurers
          </h2>

          <div className="space-y-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center p-2 border-b border-pixel-light last:border-0">
                <span className="font-pixelFont text-pixel-light w-6">{i + 1}.</span>
                <div className="w-8 h-8 bg-pixel-blue rounded-md overflow-hidden border-2 border-pixel-light ml-2">
                  <img
                    src={"./pixel.png"}
                    alt={`Player ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="font-pixelFont text-pixel-light ml-3">Player{i + 1}</span>
                <div className="ml-auto flex items-center">
                  <Zap className="w-4 h-4 text-pixel-yellow mr-1" />
                  <span className="font-pixelFont text-pixel-light">{1000 - i * 150}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 flex justify-center">
            <Link href="/leaderboard">
              <PixelButton>View Leaderboard</PixelButton>
            </Link>
          </div>
        </PixelPanel>

        {/* Oracle */}
        <PixelPanel>
          <PixelOracle />
        </PixelPanel>
      </div>
    </div>
  )
}

