"use client"

import { useState } from "react"
import { Trophy, Users, User, Zap, Medal } from "lucide-react"
import PixelPanel from "@/components/pixel-panel"
import PixelButton from "@/components/pixel-button"
import PixelAvatar from "@/components/pixel-avatar"

export default function Leaderboard() {
  const [activeTab, setActiveTab] = useState("individual")
  const [timeFrame, setTimeFrame] = useState("weekly")

  const individualLeaders = [
    { id: 1, name: "PixelWarrior", score: 1250, level: 12, streak: 14 },
    { id: 2, name: "FitQuester", score: 1120, level: 10, streak: 7 },
    { id: 3, name: "GymHero", score: 980, level: 9, streak: 21 },
    { id: 4, name: "LevelUpper", score: 870, level: 8, streak: 5 },
    { id: 5, name: "FitnessKnight", score: 760, level: 7, streak: 3 },
    { id: 6, name: "QuestMaster", score: 650, level: 6, streak: 10 },
    { id: 7, name: "PixelRunner", score: 540, level: 5, streak: 4 },
    { id: 8, name: "WorkoutWizard", score: 430, level: 4, streak: 2 },
    { id: 9, name: "FitnessBoss", score: 320, level: 3, streak: 1 },
    { id: 10, name: "GymQuester", score: 210, level: 2, streak: 8 },
  ]

  const teamLeaders = [
    { id: 1, name: "Pixel Punishers", members: 8, score: 5250, quests: 42 },
    { id: 2, name: "Fitness Fighters", members: 6, score: 4120, quests: 36 },
    { id: 3, name: "Quest Crushers", members: 10, score: 3980, quests: 31 },
    { id: 4, name: "Level Up Crew", members: 5, score: 2870, quests: 25 },
    { id: 5, name: "Workout Warriors", members: 7, score: 2760, quests: 22 },
  ]

  const getMedalColor = (position: number) => {
    switch (position) {
      case 1:
        return "text-pixel-yellow"
      case 2:
        return "text-gray-300"
      case 3:
        return "text-amber-600"
      default:
        return "text-pixel-light"
    }
  }

  return (
    <div className="container mx-auto max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-pixelFont text-pixel-light flex items-center">
          <Trophy className="mr-2 text-pixel-yellow" /> Leaderboard
        </h1>
      </div>

      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex">
          <button
            className={`px-4 py-2 font-pixelFont border-t-2 border-l-2 border-b-2 border-pixel-light rounded-l-md ${
              activeTab === "individual" ? "bg-pixel-blue text-pixel-light" : "bg-pixel-dark text-pixel-light"
            }`}
            onClick={() => setActiveTab("individual")}
          >
            <User className="inline-block mr-1 h-4 w-4" /> Individual
          </button>
          <button
            className={`px-4 py-2 font-pixelFont border-2 border-pixel-light rounded-r-md ${
              activeTab === "team" ? "bg-pixel-orange text-pixel-light" : "bg-pixel-dark text-pixel-light"
            }`}
            onClick={() => setActiveTab("team")}
          >
            <Users className="inline-block mr-1 h-4 w-4" /> Teams
          </button>
        </div>

        <div className="flex ml-auto">
          <button
            className={`px-3 py-1 text-sm font-pixelFont border-t-2 border-l-2 border-b-2 border-pixel-light rounded-l-md ${
              timeFrame === "daily" ? "bg-pixel-green text-pixel-light" : "bg-pixel-dark text-pixel-light"
            }`}
            onClick={() => setTimeFrame("daily")}
          >
            Daily
          </button>
          <button
            className={`px-3 py-1 text-sm font-pixelFont border-t-2 border-b-2 border-pixel-light ${
              timeFrame === "weekly" ? "bg-pixel-green text-pixel-light" : "bg-pixel-dark text-pixel-light"
            }`}
            onClick={() => setTimeFrame("weekly")}
          >
            Weekly
          </button>
          <button
            className={`px-3 py-1 text-sm font-pixelFont border-2 border-pixel-light rounded-r-md ${
              timeFrame === "alltime" ? "bg-pixel-green text-pixel-light" : "bg-pixel-dark text-pixel-light"
            }`}
            onClick={() => setTimeFrame("alltime")}
          >
            All Time
          </button>
        </div>
      </div>

      <PixelPanel>
        {activeTab === "individual" ? (
          <div>
            <div className="grid grid-cols-12 gap-2 mb-4 px-2 text-pixel-light font-pixelFont text-sm">
              <div className="col-span-1">#</div>
              <div className="col-span-5">Adventurer</div>
              <div className="col-span-2 text-center">Level</div>
              <div className="col-span-2 text-center">Streak</div>
              <div className="col-span-2 text-right">Score</div>
            </div>

            <div className="space-y-2">
              {individualLeaders.map((leader, index) => (
                <div
                  key={leader.id}
                  className={`grid grid-cols-12 gap-2 items-center p-2 rounded-md ${
                    index < 3 ? "bg-pixel-dark border border-pixel-light" : ""
                  }`}
                >
                  <div className="col-span-1 font-pixelFont text-pixel-light flex items-center">
                    {index < 3 ? <Medal className={`h-5 w-5 ${getMedalColor(index + 1)}`} /> : <span>{index + 1}</span>}
                  </div>

                  <div className="col-span-5 flex items-center">
                    <PixelAvatar size="small" />
                    <span className="ml-2 font-pixelFont text-pixel-light">{leader.name}</span>
                  </div>

                  <div className="col-span-2 text-center">
                    <span className="inline-block px-2 py-1 bg-pixel-blue rounded-md text-xs font-pixelFont text-pixel-light">
                      LVL {leader.level}
                    </span>
                  </div>

                  <div className="col-span-2 text-center">
                    <span className="inline-block px-2 py-1 bg-pixel-orange rounded-md text-xs font-pixelFont text-pixel-light">
                      {leader.streak} days
                    </span>
                  </div>

                  <div className="col-span-2 text-right font-pixelFont text-pixel-light flex items-center justify-end">
                    <Zap className="h-4 w-4 text-pixel-yellow mr-1" />
                    {leader.score}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <div className="grid grid-cols-12 gap-2 mb-4 px-2 text-pixel-light font-pixelFont text-sm">
              <div className="col-span-1">#</div>
              <div className="col-span-5">Team</div>
              <div className="col-span-2 text-center">Members</div>
              <div className="col-span-2 text-center">Quests</div>
              <div className="col-span-2 text-right">Score</div>
            </div>

            <div className="space-y-2">
              {teamLeaders.map((team, index) => (
                <div
                  key={team.id}
                  className={`grid grid-cols-12 gap-2 items-center p-2 rounded-md ${
                    index < 3 ? "bg-pixel-dark border border-pixel-light" : ""
                  }`}
                >
                  <div className="col-span-1 font-pixelFont text-pixel-light flex items-center">
                    {index < 3 ? <Medal className={`h-5 w-5 ${getMedalColor(index + 1)}`} /> : <span>{index + 1}</span>}
                  </div>

                  <div className="col-span-5 flex items-center">
                    <div className="w-10 h-10 bg-pixel-orange rounded-md overflow-hidden border-2 border-pixel-light flex items-center justify-center">
                      <Users className="text-pixel-light" />
                    </div>
                    <span className="ml-2 font-pixelFont text-pixel-light">{team.name}</span>
                  </div>

                  <div className="col-span-2 text-center">
                    <span className="inline-block px-2 py-1 bg-pixel-blue rounded-md text-xs font-pixelFont text-pixel-light">
                      {team.members}
                    </span>
                  </div>

                  <div className="col-span-2 text-center">
                    <span className="inline-block px-2 py-1 bg-pixel-green rounded-md text-xs font-pixelFont text-pixel-light">
                      {team.quests}
                    </span>
                  </div>

                  <div className="col-span-2 text-right font-pixelFont text-pixel-light flex items-center justify-end">
                    <Zap className="h-4 w-4 text-pixel-yellow mr-1" />
                    {team.score}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </PixelPanel>

      <div className="mt-6 flex justify-center">
        {activeTab === "individual" ? (
          <PixelButton color="blue">View Your Ranking</PixelButton>
        ) : (
          <PixelButton color="orange">Create a Team</PixelButton>
        )}
      </div>
    </div>
  )
}

