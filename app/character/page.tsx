"use client"

import { useState, useEffect } from "react"
import { User, Award, Dumbbell, Heart, Flame, Zap, Brain, Shield, TrendingUp, X, Share2, Check, Copy } from "lucide-react"
import PixelPanel from "@/components/pixel-panel"
import PixelButton from "@/components/pixel-button"
import PixelProgress from "@/components/pixel-progress"
import PixelAvatar from "@/components/pixel-avatar"
import Image from 'next/image'
import { useAvatarProfile } from '@/hooks/useAvatarProfile'

export default function Character() {
  const [activeTab, setActiveTab] = useState("stats")
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const { profile, updateProfile, isReady } = useAvatarProfile()
  const [showShareModal, setShowShareModal] = useState(false)
  const [copied, setCopied] = useState(false)
  const AVAILABLE_AVATARS = [
    { 
      id: 'char1', 
      src: 'character_femaleAdventurer_idle.png',
      name: 'Female Adventurer' 
    },
    { 
      id: 'char2', 
      src: 'character_maleAdventurer_idle.png',
      name: 'Male Adventurer' 
    },
    { 
      id: 'char3', 
      src: 'character_femalePerson_idle.png',
      name: 'Female Athlete' 
    },
    { 
      id: 'char4', 
      src: 'character_malePerson_idle.png',
      name: 'Male Athlete' 
    },
    { 
      id: 'char5', 
      src: 'character_robot_idle.png',
      name: 'Robot' 
    },
    { 
      id: 'char6', 
      src: 'character_zombie_idle.png',
      name: 'Zombie' 
    },
  ]

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

  const CLASS_SPECIALIZATIONS = {
    "Strength Warrior": {
      description: "Focused on building muscle and power",
      details: [
        "Specializes in resistance training and muscle building",
        "Bonus XP for completing strength-based workouts",
        "Unlocks advanced weight training programs",
        "Higher base strength stats"
      ],
      icon: <Dumbbell className="text-pixel-light" />
    },
    "Cardio Master": {
      description: "Focused on cardiovascular endurance",
      details: [
        "Excels in endurance and stamina activities",
        "Bonus XP for completing cardio workouts",
        "Access to advanced HIIT programs",
        "Enhanced recovery between exercises"
      ],
      icon: <Heart className="text-pixel-light" />
    },
    "Flexibility Expert": {
      description: "Focused on mobility and flexibility",
      details: [
        "Masters of stretching and mobility work",
        "Bonus XP for flexibility training",
        "Special access to yoga and stretching routines",
        "Reduced risk of workout injuries"
      ],
      icon: <Flame className="text-pixel-light" />
    },
    "Endurance Runner": {
      description: "Focused on long-distance performance",
      details: [
        "Specializes in long-duration activities",
        "Bonus XP for running and endurance workouts",
        "Access to marathon training programs",
        "Enhanced stamina regeneration"
      ],
      icon: <Zap className="text-pixel-light" />
    },
    "Power Lifter": {
      description: "Focused on maximum strength",
      details: [
        "Masters of heavy lifting and power moves",
        "Bonus XP for PR achievements",
        "Access to powerlifting programs",
        "Increased strength gains"
      ],
      icon: <Dumbbell className="text-pixel-light" />
    },
    "Speed Demon": {
      description: "Focused on agility and speed",
      details: [
        "Specializes in quick, explosive movements",
        "Bonus XP for sprint and agility workouts",
        "Access to speed training programs",
        "Enhanced agility stats"
      ],
      icon: <Zap className="text-pixel-light" />
    },
    "Yoga Master": {
      description: "Focused on balance and flexibility",
      details: [
        "Masters of mind-body connection",
        "Bonus XP for yoga sessions",
        "Access to advanced yoga poses",
        "Enhanced flexibility and balance"
      ],
      icon: <Brain className="text-pixel-light" />
    },
    "CrossFit Champion": {
      description: "Focused on overall fitness",
      details: [
        "Jack of all trades, master of intensity",
        "Bonus XP for varied workout completion",
        "Access to WOD programs",
        "Balanced stat improvements"
      ],
      icon: <Award className="text-pixel-light" />
    },
    "Calisthenics Pro": {
      description: "Focused on bodyweight mastery",
      details: [
        "Masters of bodyweight exercises",
        "Bonus XP for calisthenics workouts",
        "Access to advanced movement patterns",
        "Enhanced body control"
      ],
      icon: <User className="text-pixel-light" />
    },
    "Martial Artist": {
      description: "Focused on combat fitness",
      details: [
        "Combines strength, speed, and flexibility",
        "Bonus XP for martial arts training",
        "Access to combat-focused workouts",
        "Enhanced overall coordination"
      ],
      icon: <Shield className="text-pixel-light" />
    }
  }

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

  const handleFieldUpdate = (field: string, value: string) => {
    updateProfile({ [field]: value })
  }

  const handleProfileUpdate = () => {
    setIsEditModalOpen(false)
  }

  const handleShareStats = () => {
    setShowShareModal(true)
  }

  const generateShareableStats = () => {
    return `🎮 ${profile.username}'s Adventure Stats 🎮
Level 8 ${profile.specialization}

💪 Strength: ${stats.strength}%
❤️ Health: ${stats.health}%
⚡ Endurance: ${stats.endurance}%
🏃 Agility: ${stats.agility}%
🧠 Wisdom: ${stats.wisdom}%
🛡️ Defense: ${stats.defense}%

🏆 Achievements: ${achievements.filter(a => a.completed).length}/${achievements.length}
⚔️ Recent Activity: ${history[0]?.name || 'No recent activity'}

Join me on Pixel Quest! 🎯`
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generateShareableStats())
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  useEffect(() => {
    if (isReady) {
      console.log('Profile updated:', profile)
    }
  }, [profile, isReady])

  const handleEditProfile = () => {
    setIsEditModalOpen(true)
  }

  if (!isReady) {
    return (
      <div className="container mx-auto max-w-4xl">
        <div className="animate-pulse">
          {/* Add loading skeleton here */}
        </div>
      </div>
    )
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
            <div 
              className="cursor-pointer hover:opacity-90 transition-opacity"
            >
              <PixelAvatar 
                size="large" 
                color={profile.avatarColor}
                avatarImage={profile.selectedAvatar}
              />
            </div>
            <h2 className="text-xl font-pixelFont mt-4 text-pixel-light">{profile.username}</h2>
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
                <PixelButton size="small" className="w-full" onClick={handleEditProfile}>
                  Edit Profile
                </PixelButton>
                <PixelButton 
                  size="small" 
                  color="green" 
                  className="w-full"
                  onClick={handleShareStats}
                >
                  Share Stats
                </PixelButton>
              </div>
            </div>

            <div className="mt-6 w-full">
              <h3 className="text-lg font-pixelFont mb-2 text-pixel-light">Class Specialization</h3>
              <div className="bg-pixel-dark border-2 border-pixel-light rounded-md p-3">
                <div className="flex items-start">
                  <div className="w-10 h-10 bg-pixel-blue rounded-md overflow-hidden border-2 border-pixel-light flex items-center justify-center flex-shrink-0">
                    {CLASS_SPECIALIZATIONS[profile.specialization]?.icon}
                  </div>
                  <div className="ml-3 space-y-2">
                    <div>
                      <h4 className="font-pixelFont text-pixel-light">{profile.specialization}</h4>
                      <p className="text-xs text-pixel-light opacity-80">
                        {CLASS_SPECIALIZATIONS[profile.specialization]?.description}
                      </p>
                    </div>
                    <ul className="text-xs text-pixel-light space-y-1">
                      {CLASS_SPECIALIZATIONS[profile.specialization]?.details.map((detail, index) => (
                        <li key={index} className="flex items-center">
                          <span className="w-1 h-1 bg-pixel-blue rounded-full mr-2"></span>
                          {detail}
                        </li>
                      ))}
                    </ul>
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

      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <PixelPanel className="w-full max-w-md relative">
            <button
              onClick={() => setIsEditModalOpen(false)}
              className="absolute top-4 right-4 text-pixel-light hover:text-pixel-blue"
            >
              <X className="w-6 h-6" />
            </button>
            
            <h2 className="text-xl font-pixelFont mb-6 text-pixel-light">Edit Profile</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-pixel-light font-pixelFont mb-2">Username</label>
                <input
                  type="text"
                  value={profile.username}
                  onChange={(e) => handleFieldUpdate('username', e.target.value)}
                  className="w-full bg-pixel-dark border-2 border-pixel-light rounded-md p-2 text-pixel-light font-pixelFont"
                />
              </div>

              <div>
                <label className="block text-pixel-light font-pixelFont mb-2">Class Specialization</label>
                <select
                  value={profile.specialization}
                  onChange={(e) => handleFieldUpdate('specialization', e.target.value)}
                  className="w-full bg-pixel-dark border-2 border-pixel-light rounded-md p-2 text-pixel-light font-pixelFont"
                >
                  <option value="Strength Warrior">Strength Warrior</option>
                  <option value="Cardio Master">Cardio Master</option>
                  <option value="Flexibility Expert">Flexibility Expert</option>
                  <option value="Endurance Runner">Endurance Runner</option>
                  <option value="Power Lifter">Power Lifter</option>
                  <option value="Speed Demon">Speed Demon</option>
                  <option value="Yoga Master">Yoga Master</option>
                  <option value="CrossFit Champion">CrossFit Champion</option>
                  <option value="Calisthenics Pro">Calisthenics Pro</option>
                  <option value="Martial Artist">Martial Artist</option>
                </select>
              </div>

              <div>
                <label className="block text-pixel-light font-pixelFont mb-2">Avatar Background</label>
                <div className="grid grid-cols-5 gap-2">
                  {[
                    { name: "blue", color: "bg-pixel-blue" },
                    { name: "red", color: "bg-pixel-red" },
                    { name: "green", color: "bg-pixel-green" },
                    { name: "yellow", color: "bg-pixel-yellow" },
                    { name: "purple", color: "bg-pixel-purple" },
                    { name: "orange", color: "bg-pixel-orange" },
                    { name: "pink", color: "bg-[#FF69B4]" },
                    { name: "cyan", color: "bg-[#00FFFF]" },
                    { name: "indigo", color: "bg-[#4B0082]" },
                    { name: "teal", color: "bg-[#008080]" }
                  ].map((colorOption) => (
                    <button
                      key={colorOption.name}
                      onClick={() => handleFieldUpdate('avatarColor', colorOption.name)}
                      className={`w-10 h-10 rounded-md border-2 ${
                        profile.avatarColor === colorOption.name 
                          ? 'border-pixel-light shadow-lg scale-110' 
                          : 'border-transparent hover:scale-105'
                      } ${colorOption.color} transition-all duration-200`}
                      title={colorOption.name.charAt(0).toUpperCase() + colorOption.name.slice(1)}
                    />
                  ))}
                </div>
                <p className="text-xs text-pixel-light opacity-70 mt-2">
                  Choose a background color for your avatar frame
                </p>
              </div>

              <div>
                <label className="block text-pixel-light font-pixelFont mb-2">Choose Avatar</label>
                <div className="grid grid-cols-3 gap-4 max-h-48 overflow-y-auto p-2">
                  {AVAILABLE_AVATARS.map((avatar) => (
                    <button
                      key={avatar.id}
                      onClick={() => handleFieldUpdate('selectedAvatar', avatar.src)}
                      className={`relative rounded-lg overflow-hidden border-2 ${
                        profile.selectedAvatar === avatar.src 
                          ? 'border-pixel-blue' 
                          : 'border-transparent'
                      }`}
                    >
                      <div className="aspect-square">
                        <img
                          src={avatar.src}
                          alt={avatar.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-1">
                        <p className="text-xs text-center text-pixel-light font-pixelFont">
                          {avatar.name}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 mt-6">
                <PixelButton
                  className="flex-1"
                  onClick={handleProfileUpdate}
                >
                  Save Changes
                </PixelButton>
                <PixelButton
                  color="red"
                  className="flex-1"
                  onClick={() => setIsEditModalOpen(false)}
                >
                  Cancel
                </PixelButton>
              </div>
            </div>
          </PixelPanel>
        </div>
      )}

      {/* Share Stats Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <PixelPanel className="w-full max-w-md relative">
            <button
              onClick={() => setShowShareModal(false)}
              className="absolute top-4 right-4 text-pixel-light hover:text-pixel-blue"
            >
              <X className="w-6 h-6" />
            </button>
            
            <h2 className="text-xl font-pixelFont mb-6 text-pixel-light">Share Your Stats</h2>
            
            <div className="space-y-4">
              <div className="bg-pixel-dark p-4 rounded-md font-mono text-sm text-pixel-light whitespace-pre-wrap">
                {generateShareableStats()}
              </div>

              <div className="flex justify-end gap-2">
                <PixelButton
                  onClick={copyToClipboard}
                  className="flex items-center gap-2"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy to Clipboard
                    </>
                  )}
                </PixelButton>
                <PixelButton
                  color="red"
                  onClick={() => setShowShareModal(false)}
                >
                  Close
                </PixelButton>
              </div>
            </div>
          </PixelPanel>
        </div>
      )}
    </div>
  )
}

