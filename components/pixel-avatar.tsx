"use client"

import { useState, useEffect } from "react"
import { User } from "lucide-react"

interface PixelAvatarProps {
  size?: 'small' | 'medium' | 'large'
  color?: 'blue' | 'red' | 'green' | 'yellow' | 'purple' | 'orange' | 'pink' | 'cyan' | 'indigo' | 'teal'
  avatarImage?: string
}

const PixelAvatar = ({ 
  size = 'medium', 
  color = 'blue',
  avatarImage
}: PixelAvatarProps) => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const sizeClasses = {
    small: 'w-8 h-8',
    medium: 'w-12 h-12',
    large: 'w-24 h-24'
  }

  if (!mounted) {
    return <div className={`rounded-lg border-2 border-pixel-light overflow-hidden ${sizeClasses[size]}`} />
  }

  return (
    <div className={`rounded-lg border-2 border-pixel-light overflow-hidden ${sizeClasses[size]}`}>
      <div className={`w-full h-full bg-pixel-${color} flex items-center justify-center`}>
        {avatarImage ? (
          <img 
            src={avatarImage}
            alt="Character Avatar" 
            className="w-full h-full object-cover"
          />
        ) : (
          <User className="w-3/4 h-3/4 text-pixel-light" />
        )}
      </div>
    </div>
  )
}

export default PixelAvatar
