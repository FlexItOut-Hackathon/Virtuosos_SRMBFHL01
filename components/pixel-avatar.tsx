"use client"

import { useState, useEffect, useRef } from "react"
import { User } from "lucide-react"

interface PixelAvatarProps {
  size?: "small" | "medium" | "large"
  color?: "blue" | "red" | "green" | "yellow" | "purple" | "orange" | "pink" | "cyan" | "indigo" | "teal"
  avatarImage?: string
  alt?: string
}

const PixelAvatar = ({ 
  size = "medium", 
  color = "blue",
  avatarImage,
  alt = "Avatar"
}: PixelAvatarProps) => {
  const [mounted, setMounted] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    setMounted(true)

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const sizes = {
      small: 32,
      medium: 48,
      large: 64
    }
    const pixelSize = sizes[size]
    canvas.width = pixelSize
    canvas.height = pixelSize

    if (!avatarImage) {
      // Draw default pixel art avatar
      const colors = {
        skin: "#FFD1B5",
        hair: "#4A4A4A",
        shirt: "#4361ee"
      }

      ctx.fillStyle = colors.shirt
      ctx.fillRect(0, pixelSize * 0.4, pixelSize, pixelSize * 0.6)

      ctx.fillStyle = colors.skin
      ctx.fillRect(pixelSize * 0.25, pixelSize * 0.1, pixelSize * 0.5, pixelSize * 0.4)

      ctx.fillStyle = colors.hair
      ctx.fillRect(pixelSize * 0.2, pixelSize * 0.05, pixelSize * 0.6, pixelSize * 0.15)
      ctx.fillRect(pixelSize * 0.15, pixelSize * 0.15, pixelSize * 0.15, pixelSize * 0.2)
      ctx.fillRect(pixelSize * 0.7, pixelSize * 0.15, pixelSize * 0.15, pixelSize * 0.2)

      ctx.fillStyle = "#000000"
      ctx.fillRect(pixelSize * 0.35, pixelSize * 0.25, pixelSize * 0.1, pixelSize * 0.1)
      ctx.fillRect(pixelSize * 0.55, pixelSize * 0.25, pixelSize * 0.1, pixelSize * 0.1)
    }
  }, [avatarImage, size])

  const sizeClasses = {
    small: "w-8 h-8",
    medium: "w-12 h-12",
    large: "w-16 h-16"
  }

  if (!mounted) {
    return <div className={`rounded-lg border-2 border-pixel-light overflow-hidden ${sizeClasses[size]}`} />
  }

  return (
    <div className={`relative ${sizeClasses[size]} rounded-full overflow-hidden border-2 border-pixel-light bg-pixel-${color}`}>
      {avatarImage ? (
        <img src={avatarImage} alt={alt} className="w-full h-full object-cover" />
      ) : (
        <canvas ref={canvasRef} className="w-full h-full" aria-label={alt} />
      )}
    </div>
  )
}

export default PixelAvatar
