"use client"

import { useState } from "react"
import { Users, Trophy, Swords, Crown, Plus, Search } from "lucide-react"
import PixelPanel from "@/components/pixel-panel"
import PixelButton from "@/components/pixel-button"
import GuildChat from "@/components/guild-chat"
import GuildChallenges from "@/components/guild-challenges"
import CreateGuildDialog from "@/components/create-guild-dialog"

export default function GuildPage() {
  const [showCreateGuild, setShowCreateGuild] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("overview")

  const guildData = {
    name: "Pixel Warriors",
    level: 12,
    members: 24,
    maxMembers: 30,
    xp: 7500,
    nextLevel: 10000,
    leader: "PixelMaster",
    achievements: 15,
    activeQuests: 3,
    weeklyScore: 12500,
  }

  const members = [
    { id: 1, name: "PixelMaster", role: "Leader", level: 25, status: "online" },
    { id: 2, name: "QuestHunter", role: "Officer", level: 20, status: "online" },
    { id: 3, name: "FitWarrior", role: "Member", level: 18, status: "offline" },
    { id: 4, name: "GymHero", role: "Member", level: 15, status: "online" },
  ]

  const handleCreateGuild = (guildData: any) => {
    console.log("Creating guild:", guildData)
    // Implement guild creation logic
  }

  const handleGuildCreated = () => {
    // Refresh the guild list or update the UI as needed
    // This could involve fetching updated data or updating local state
    console.log("Guild created successfully")
  }

  return (
    <div className="container mx-auto max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-pixelFont text-pixel-light flex items-center">
          <Users className="mr-2" /> Guild Hall
        </h1>
        <PixelButton onClick={() => setShowCreateGuild(true)}>
          <Plus className="mr-2" /> Create Guild
        </PixelButton>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Guild Overview */}
        <div className="md:col-span-2 space-y-6">
          <PixelPanel>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-pixelFont text-pixel-light flex items-center">
                  <Crown className="mr-2 text-pixel-yellow" />
                  {guildData.name}
                </h2>
                <p className="text-pixel-light opacity-80">
                  Level {guildData.level} Guild • {guildData.members}/{guildData.maxMembers} Members
                </p>
              </div>
              <PixelButton color="orange">Manage Guild</PixelButton>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="bg-pixel-dark border-2 border-pixel-light rounded-md p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-pixelFont text-pixel-light">Guild XP</span>
                  <span className="font-pixelFont text-pixel-light">
                    {guildData.xp}/{guildData.nextLevel}
                  </span>
                </div>
                <div className="h-4 bg-pixel-dark border-2 border-pixel-light rounded-full overflow-hidden">
                  <div
                    className="h-full bg-pixel-blue transition-all duration-300"
                    style={{ width: `${(guildData.xp / guildData.nextLevel) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-pixel-dark border-2 border-pixel-light rounded-md p-4">
                  <Trophy className="w-6 h-6 text-pixel-yellow mb-2" />
                  <div className="font-pixelFont text-pixel-light text-2xl">{guildData.achievements}</div>
                  <div className="text-pixel-light opacity-80 text-sm">Achievements</div>
                </div>

                <div className="bg-pixel-dark border-2 border-pixel-light rounded-md p-4">
                  <Swords className="w-6 h-6 text-pixel-red mb-2" />
                  <div className="font-pixelFont text-pixel-light text-2xl">{guildData.activeQuests}</div>
                  <div className="text-pixel-light opacity-80 text-sm">Active Quests</div>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <GuildChallenges />
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-pixelFont text-pixel-light">Members</h3>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-pixel-light opacity-50" />
                  <input
                    type="text"
                    placeholder="Search members..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 pr-4 py-1 bg-pixel-dark border-2 border-pixel-light rounded-md text-sm font-pixelFont text-pixel-light focus:outline-none focus:border-pixel-blue"
                  />
                </div>
              </div>

              <div className="space-y-2">
                {members
                  .filter((member) => member.name.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between p-2 border-b border-pixel-light last:border-0"
                    >
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-pixel-blue rounded-md overflow-hidden border-2 border-pixel-light">
                          <img
                            src="/placeholder.svg?height=40&width=40"
                            alt={member.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="ml-3">
                          <div className="font-pixelFont text-pixel-light">{member.name}</div>
                          <div className="flex items-center">
                            <span
                              className={`w-2 h-2 rounded-full ${
                                member.status === "online" ? "bg-pixel-green" : "bg-gray-500"
                              } mr-2`}
                            ></span>
                            <span className="text-pixel-light opacity-80 text-sm">{member.role}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-pixelFont text-pixel-light">Level {member.level}</div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </PixelPanel>
        </div>

        {/* Guild Chat */}
        <div className="md:col-span-1">
          <PixelPanel className="h-[800px]">
            <GuildChat />
          </PixelPanel>
        </div>
      </div>

      {showCreateGuild && (
        <CreateGuildDialog
          isOpen={showCreateGuild}
          onClose={() => setShowCreateGuild(false)}
          onSuccess={handleGuildCreated}
        />
      )}
    </div>
  )
}

