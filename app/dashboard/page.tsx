"use client"

import { useAvatarProfile } from '@/hooks/useAvatarProfile'
import PixelAvatar from '@/components/pixel-avatar'
import PixelPanel from '@/components/pixel-panel'
import PixelProgress from '@/components/pixel-progress'
import { Dumbbell, Heart, User } from 'lucide-react'
import { useState } from 'react'

export default function Dashboard() {
  const { profile, isReady } = useAvatarProfile()
  const [health, setHealth] = useState(75)
  const [strength, setStrength] = useState(60)

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
            </div>
          </div>
        </PixelPanel>

        {/* Rest of your dashboard content */}
      </div>
    </div>
  )
} 