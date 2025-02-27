"use client"

import { useState } from "react"
import { Trophy, Star, Users, Timer, ArrowRight } from "lucide-react"
import PixelPanel from "./pixel-panel"
import PixelButton from "./pixel-button"
import PixelProgress from "./pixel-progress"

interface Challenge {
  id: string
  name: string
  description: string
  type: string
  participants: number
  maxParticipants: number
  progress: number
  total: number
  reward: {
    xp: number
    bonus: string
  }
  timeLeft: string
}

export default function GuildChallenges() {
  const [challenges] = useState<Challenge[]>([
    {
      id: "1",
      name: "10,000 Team Squats",
      description: "Complete 10,000 squats as a guild within 7 days",
      type: "Strength",
      participants: 12,
      maxParticipants: 20,
      progress: 6500,
      total: 10000,
      reward: {
        xp: 5000,
        bonus: "Guild Banner",
      },
      timeLeft: "4d 12h",
    },
    {
      id: "2",
      name: "Marathon Madness",
      description: "Accumulate 100 miles of running as a team",
      type: "Cardio",
      participants: 8,
      maxParticipants: 15,
      progress: 45,
      total: 100,
      reward: {
        xp: 3000,
        bonus: "Team Emblem",
      },
      timeLeft: "2d 8h",
    },
    {
      id: "3",
      name: "Zen Masters",
      description: "Complete 100 hours of group meditation sessions",
      type: "Meditation",
      participants: 5,
      maxParticipants: 10,
      progress: 25,
      total: 100,
      reward: {
        xp: 2000,
        bonus: "Special Effect",
      },
      timeLeft: "5d",
    },
  ])

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-pixelFont text-pixel-light flex items-center">
          <Trophy className="mr-2 text-pixel-yellow" /> Active Challenges
        </h2>
        <PixelButton size="small" color="orange">
          Create Challenge
        </PixelButton>
      </div>

      {challenges.map((challenge) => (
        <PixelPanel key={challenge.id} className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-pixel-blue/10 rounded-full blur-2xl"></div>
          <div className="relative">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex-1">
                <h3 className="text-lg font-pixelFont text-pixel-light mb-1">{challenge.name}</h3>
                <p className="text-sm text-pixel-light opacity-80 mb-2">{challenge.description}</p>

                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="text-xs bg-pixel-blue px-2 py-1 rounded-md text-pixel-light">{challenge.type}</span>
                  <span className="text-xs bg-pixel-dark border border-pixel-light px-2 py-1 rounded-md text-pixel-light flex items-center">
                    <Users className="w-3 h-3 mr-1" />
                    {challenge.participants}/{challenge.maxParticipants}
                  </span>
                  <span className="text-xs bg-pixel-dark border border-pixel-light px-2 py-1 rounded-md text-pixel-light flex items-center">
                    <Timer className="w-3 h-3 mr-1" />
                    {challenge.timeLeft}
                  </span>
                </div>

                <div className="mb-3">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-pixel-light">Progress</span>
                    <span className="text-pixel-light">
                      {challenge.progress}/{challenge.total}
                    </span>
                  </div>
                  <PixelProgress
                    value={(challenge.progress / challenge.total) * 100}
                    color={challenge.progress >= challenge.total ? "pixel-green" : "pixel-blue"}
                  />
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-pixel-yellow mr-1" />
                    <span className="text-sm font-pixelFont text-pixel-light">+{challenge.reward.xp} XP</span>
                  </div>
                  <div className="text-sm text-pixel-purple">+{challenge.reward.bonus}</div>
                </div>
              </div>

              <div className="flex sm:flex-col gap-2">
                <PixelButton size="small" className="flex-1 sm:w-32">
                  Join <ArrowRight className="ml-1 w-4 h-4" />
                </PixelButton>
                <PixelButton size="small" variant="outline" className="flex-1 sm:w-32">
                  Details
                </PixelButton>
              </div>
            </div>
          </div>
        </PixelPanel>
      ))}
    </div>
  )
}

