"use client"

import { useRef, useEffect } from "react"
import { motion } from "framer-motion"

interface PixelAvatarProps {
  size?: "small" | "medium" | "large"
  color?: "blue" | "red" | "green" | "yellow" | "purple"
  avatarImage?: string
  role?: "user" | "assistant"
}

export default function PixelAvatar({ size = "medium", color = "blue", avatarImage, role }: PixelAvatarProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!role || avatarImage) return // Only use canvas for pixel avatars
    
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const sizes = { small: 32, medium: 48, large: 64 }
    const pixelSize = sizes[size]
    canvas.width = pixelSize
    canvas.height = pixelSize

    if (role === "assistant") {
      // Draw crystal ball effect
      const centerX = pixelSize / 2
      const centerY = pixelSize / 2
      const radius = pixelSize * 0.4
      const gradient = ctx.createRadialGradient(centerX, centerY, radius, centerX, centerY, pixelSize / 2)
      gradient.addColorStop(0, "rgba(88, 101, 242, 0.3)")
      gradient.addColorStop(0.7, "rgba(255, 0, 128, 0.2)")
      gradient.addColorStop(1, "rgba(17, 24, 39, 0)")
      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.arc(centerX, centerY, pixelSize / 2, 0, Math.PI * 2)
      ctx.fill()
    } else {
      // Draw pixel user avatar
      const colors = { skin: "#FFD1B5", hair: "#4A4A4A", shirt: "#4361ee" }
      ctx.fillStyle = colors.shirt
      ctx.fillRect(0, pixelSize * 0.4, pixelSize, pixelSize * 0.6)
      ctx.fillStyle = colors.skin
      ctx.fillRect(pixelSize * 0.25, pixelSize * 0.1, pixelSize * 0.5, pixelSize * 0.4)
      ctx.fillStyle = colors.hair
      ctx.fillRect(pixelSize * 0.2, pixelSize * 0.05, pixelSize * 0.6, pixelSize * 0.15)
    }
  }, [size, role])

  if (avatarImage) {
    return (
      <div className={`rounded-lg border-2 border-pixel-light overflow-hidden w-16 h-16 bg-pixel-${color}`}>
        <img src={avatarImage} alt="Character Avatar" className="w-full h-full object-cover" />
      </div>
    )
  }

  return (
    <motion.canvas
      ref={canvasRef}
      className={`rounded-lg border-2 border-pixel-light ${size === "small" ? "w-8 h-8" : size === "medium" ? "w-12 h-12" : "w-16 h-16"}`}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.2 }}
    />
  )
}
