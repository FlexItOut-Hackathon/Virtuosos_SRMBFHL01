"use client"

import { useState } from "react"
import { Dumbbell, Flame, Heart, Trophy, Calendar, Zap, ArrowRight, Star, Sparkles } from "lucide-react"
import PixelAvatar from "@/components/pixel-avatar"
import PixelButton from "@/components/pixel-button"
import PixelPanel from "@/components/pixel-panel"
import PixelProgress from "@/components/pixel-progress"
import PixelOracle from "@/components/pixel-oracle"
import Link from "next/link"
import { useQuests } from "@/lib/quest-context"

export default function Dashboard() {
  const [health, setHealth] = useState(75)
  const [strength, setStrength] = useState(60)
  const [endurance, setEndurance] = useState(45)

  const achievements = [
    { id: 1, name: "Early Bird", icon: Calendar, color: "text-pixel-yellow" },
    { id: 2, name: "Flame Keeper", icon: Flame, color: "text-pixel-orange" },
    { id: 3, name: "Power Lifter", icon: Dumbbell, color: "text-pixel-blue" },
  ]

  const { state } = useQuests()
  const { activeQuests } = state

  return (
    <div className="container mx-auto max-w-7xl p-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <PixelPanel>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-pixelFont text-pixel-light">Your Avatar</h2>
            <Link href="/avatar">
              <PixelButton color="blue" size="small">
                Customize
              </PixelButton>
            </Link>
          </div>

          <div className="flex flex-col items-center">
            <PixelAvatar size="large" />
            <div className="mt-4 w-full space-y-2">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-pixel-light">Health</span>
                  <span className="text-pixel-light">{health}%</span>
                </div>
                <PixelProgress value={health} color="pixel-red" />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-pixel-light">Strength</span>
                  <span className="text-pixel-light">{strength}%</span>
                </div>
                <PixelProgress value={strength} color="pixel-blue" />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-pixel-light">Endurance</span>
                  <span className="text-pixel-light">{endurance}%</span>
                </div>
                <PixelProgress value={endurance} color="pixel-green" />
              </div>
            </div>
          </div>
        </PixelPanel>

        <PixelPanel>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-pixelFont text-pixel-light">Daily Streak</h2>
            <div className="bg-pixel-dark border border-pixel-light rounded-md px-2 py-1">
              <span className="text-pixel-yellow font-pixelFont">7 days</span>
            </div>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-32 h-32 bg-pixel-dark border-4 border-pixel-yellow rounded-full flex items-center justify-center mb-4">
              <Flame className="w-16 h-16 text-pixel-orange animate-pulse" />
            </div>

            <div className="text-center">
              <p className="text-pixel-light mb-2">Keep up the momentum!</p>
              <p className="text-pixel-light opacity-80">Complete your daily workout to maintain your streak.</p>
            </div>
          </div>
        </PixelPanel>

        <PixelPanel>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-pixelFont text-pixel-light">Achievements</h2>
            <Link href="/achievements">
              <PixelButton color="orange" size="small">
                View All
              </PixelButton>
            </Link>
          </div>

          <div className="space-y-3">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className="flex items-center p-2 bg-pixel-dark border border-pixel-light rounded-md"
              >
                <div className="w-8 h-8 rounded-md bg-black/20 flex items-center justify-center mr-3">
                  <achievement.icon className={achievement.color} />
                </div>
                <span className="text-pixel-light font-pixelFont">{achievement.name}</span>
                <Sparkles className="w-4 h-4 text-pixel-yellow ml-auto" />
              </div>
            ))}
          </div>
        </PixelPanel>

        <PixelPanel className="md:col-span-2">
          <div>
            <h2 className="text-xl font-pixelFont mb-4 text-pixel-light">Active Quests</h2>

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
                </div>
              ))}
            </div>
          </div>
        </PixelPanel>

        <PixelPanel>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-pixelFont text-pixel-light">Workout Oracle</h2>
            <div className="bg-pixel-dark border border-pixel-light rounded-md px-2 py-1">
              <span className="text-pixel-purple font-pixelFont">AI Guide</span>
            </div>
          </div>

          <PixelOracle />

          <div className="mt-4">
            <Link href="/workout">
              <PixelButton color="purple" className="w-full">
                <span>Start Workout</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </PixelButton>
            </Link>
          </div>
        </PixelPanel>
      </div>
    </div>
  )
}

