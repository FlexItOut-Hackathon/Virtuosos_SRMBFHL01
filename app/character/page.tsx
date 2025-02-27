"use client"

import { useState } from "react"
import { User, Award, Dumbbell, Heart, Flame, Zap, Brain, Shield, TrendingUp } from "lucide-react"
import PixelPanel from "@/components/pixel-panel"
import PixelButton from "@/components/pixel-button"
import PixelProgress from "@/components/pixel-progress"
import PixelAvatar from "@/components/pixel-avatar"

export default function Character() {
  const [activeTab, setActiveTab] = useState("stats")

  const stats = {
    level: 8,
    xp: 750,
    nextLevel: 1000,
    health: 75,
    strength: 60,
    endurance: 45,
    agility: 55,
    wisdom: 40,
    defense: 50,
  }

  const achievements = [
    { id: 1, name: "First Steps", description: "Complete your first workout", completed: true, date: "2023-05-15" },
    { id: 2, name: "Streak Master", description: "Maintain a 7-day streak", completed: true, date: "2023-05-22" },
    {
      id: 3,
      name: "Strength Seeker",
      description: "Complete 10 strength workouts",
      completed: true,
      date: "2023-06-10",
    },
    {
      id: 4,
      name: "Cardio King",
      description: "Complete 10 cardio workouts",
      completed: false,
      progress: 7,
      total: 10,
    },
    {
      id: 5,
      name: "Flexibility Guru",
      description: "Complete 5 flexibility workouts",
      completed: false,
      progress: 2,
      total: 5,
    },
    {
      id: 6,
      name: "Workout Warrior",
      description: "Complete 50 total workouts",
      completed: false,
      progress: 32,
      total: 50,
    },
  ]

  const history = [
    { id: 1, name: "Morning Cardio", type: "Cardio", date: "2023-07-01", xp: 100 },
    { id: 2, name: "Strength Training", type: "Strength", date: "2023-06-30", xp: 150 },
    { id: 3, name: "Yoga Session", type: "Flexibility", date: "2023-06-29", xp: 80 },
    { id: 4, name: "HIIT Workout", type: "Cardio", date: "2023-06-28", xp: 120 },
    { id: 5, name: "Weight Lifting", type: "Strength", date: "2023-06-27", xp: 140 },
  ]

  const getStatIcon = (statName: string) => {
    switch (statName) {
      case "health":
        return <Heart className="w-5 h-5 text-pixel-red" />
      case "strength":
        return <Dumbbell className="w-5 h-5 text-pixel-blue" />
      case "endurance":
        return <Flame className="w-5 h-5 text-pixel-orange" />
      case "agility":
        return <Zap className="w-5 h-5 text-pixel-yellow" />
      case "wisdom":
        return <Brain className="w-5 h-5 text-pixel-purple" />
      case "defense":
        return <Shield className="w-5 h-5 text-pixel-green" />
      default:
        return <TrendingUp className="w-5 h-5 text-pixel-light" />
    }
  }

  const getStatColor = (statName: string) => {
    switch (statName) {
      case "health":
        return "pixel-red"
      case "strength":
        return "pixel-blue"
      case "endurance":
        return "pixel-orange"
      case "agility":
        return "pixel-yellow"
      case "wisdom":
        return "pixel-purple"
      case "defense":
        return "pixel-green"
      default:
        return "pixel-blue"
    }
  }

  return (
    <div className="container mx-auto max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-pixelFont text-pixel-light flex items-center">
          <User className="mr-2" /> Character
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Character Profile */}
        <PixelPanel className="md:col-span-1">
          <div className="flex flex-col items-center">
            <PixelAvatar size="large" />
            <h2 className="text-xl font-pixelFont mt-4 text-pixel-light">PixelWarrior</h2>
            <p className="text-sm text-pixel-green mb-2">Level {stats.level} Fitness Adventurer</p>

            <div className="w-full mt-4">
              <div className="flex justify-between mb-1 text-sm">
                <span className="font-pixelFont text-pixel-light">XP</span>
                <span className="font-pixelFont text-pixel-light">
                  {stats.xp}/{stats.nextLevel}
                </span>
              </div>
              <PixelProgress value={(stats.xp / stats.nextLevel) * 100} color="pixel-blue" />
            </div>

            <div className="mt-6 w-full">
              <div className="grid grid-cols-2 gap-2">
                <PixelButton size="small" className="w-full">
                  Edit Profile
                </PixelButton>
                <PixelButton size="small" color="green" className="w-full">
                  Share Stats
                </PixelButton>
              </div>
            </div>

            <div className="mt-6 w-full">
              <h3 className="text-lg font-pixelFont mb-2 text-pixel-light">Class Specialization</h3>
              <div className="bg-pixel-dark border-2 border-pixel-light rounded-md p-3">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-pixel-blue rounded-md overflow-hidden border-2 border-pixel-light flex items-center justify-center">
                    <Dumbbell className="text-pixel-light" />
                  </div>
                  <div className="ml-3">
                    <h4 className="font-pixelFont text-pixel-light">Strength Warrior</h4>
                    <p className="text-xs text-pixel-light opacity-80">Focused on building muscle and power</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </PixelPanel>

        {/* Character Details */}
        <PixelPanel className="md:col-span-2">
          <div>
            <div className="flex border-b-2 border-pixel-light mb-4">
              <button
                className={`px-4 py-2 font-pixelFont ${
                  activeTab === "stats" ? "border-b-2 border-pixel-blue text-pixel-blue" : "text-pixel-light"
                }`}
                onClick={() => setActiveTab("stats")}
              >
                Stats
              </button>
              <button
                className={`px-4 py-2 font-pixelFont ${
                  activeTab === "achievements" ? "border-b-2 border-pixel-blue text-pixel-blue" : "text-pixel-light"
                }`}
                onClick={() => setActiveTab("achievements")}
              >
                Achievements
              </button>
              <button
                className={`px-4 py-2 font-pixelFont ${
                  activeTab === "history" ? "border-b-2 border-pixel-blue text-pixel-blue" : "text-pixel-light"
                }`}
                onClick={() => setActiveTab("history")}
              >
                History
              </button>
            </div>

            {activeTab === "stats" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Object.entries(stats).map(([key, value]) => {
                  if (key === "level" || key === "xp" || key === "nextLevel") return null

                  return (
                    <div key={key} className="bg-pixel-dark border border-pixel-light rounded-md p-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          {getStatIcon(key)}
                          <span className="ml-2 font-pixelFont text-pixel-light capitalize">{key}</span>
                        </div>
                        <span className="font-pixelFont text-pixel-light">{value}/100</span>
                      </div>
                      <PixelProgress value={value} color={getStatColor(key)} />
                    </div>
                  )
                })}
              </div>
            )}

            {activeTab === "achievements" && (
              <div className="space-y-4">
                {achievements.map((achievement) => (
                  <div key={achievement.id} className="bg-pixel-dark border border-pixel-light rounded-md p-3">
                    <div className="flex items-center">
                      <div
                        className={`w-10 h-10 rounded-md overflow-hidden border-2 border-pixel-light flex items-center justify-center ${
                          achievement.completed ? "bg-pixel-yellow" : "bg-pixel-dark"
                        }`}
                      >
                        <Award className={achievement.completed ? "text-pixel-dark" : "text-pixel-light"} />
                      </div>
                      <div className="ml-3 flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-pixelFont text-pixel-light">{achievement.name}</h4>
                          {achievement.completed && (
                            <span className="text-xs bg-pixel-green px-2 py-1 rounded-md text-pixel-light">
                              Completed
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-pixel-light opacity-80">{achievement.description}</p>

                        {!achievement.completed && (
                          <div className="mt-2">
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-pixel-light">Progress</span>
                              <span className="text-pixel-light">
                                {achievement.progress}/{achievement.total}
                              </span>
                            </div>
                            <PixelProgress
                              value={(achievement.progress / achievement.total) * 100}
                              color="pixel-blue"
                              height="h-2"
                            />
                          </div>
                        )}

                        {achievement.completed && (
                          <p className="text-xs text-pixel-light mt-1">Completed on {achievement.date}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "history" && (
              <div className="space-y-4">
                {history.map((item) => (
                  <div key={item.id} className="bg-pixel-dark border border-pixel-light rounded-md p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-pixel-blue rounded-md overflow-hidden border-2 border-pixel-light flex items-center justify-center">
                          {item.type === "Cardio" && <Heart className="text-pixel-red" />}
                          {item.type === "Strength" && <Dumbbell className="text-pixel-blue" />}
                          {item.type === "Flexibility" && <Flame className="text-pixel-orange" />}
                        </div>
                        <div className="ml-3">
                          <h4 className="font-pixelFont text-pixel-light">{item.name}</h4>
                          <div className="flex items-center">
                            <span className="text-xs bg-pixel-blue px-2 py-1 rounded-md text-pixel-light mr-2">
                              {item.type}
                            </span>
                            <span className="text-xs text-pixel-light opacity-80">{item.date}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Zap className="w-4 h-4 text-pixel-yellow mr-1" />
                        <span className="font-pixelFont text-pixel-light">+{item.xp} XP</span>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="mt-4 flex justify-center">
                  <PixelButton>View Full History</PixelButton>
                </div>
              </div>
            )}
          </div>
        </PixelPanel>
      </div>
    </div>
  )
}

