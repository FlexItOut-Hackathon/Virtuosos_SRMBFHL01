"use client"

import { useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { User } from "lucide-react"

interface PixelAvatarProps {
  size?: "small" | "medium" | "large"
  role?: "user" | "assistant"
}

export default function PixelAvatar({ size = "medium", role = "user" }: PixelAvatarProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const sizeClasses = {
    small: "w-8 h-8",
    medium: "w-12 h-12",
    large: "w-16 h-16",
  }

  useEffect(() => {
    if (role === "assistant") {
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

      // Draw crystal ball
      const centerX = pixelSize / 2
      const centerY = pixelSize / 2
      const radius = pixelSize * 0.4

      // Draw outer glow
      const gradient = ctx.createRadialGradient(centerX, centerY, radius, centerX, centerY, pixelSize/2)
      gradient.addColorStop(0, "rgba(88, 101, 242, 0.3)")
      gradient.addColorStop(0.7, "rgba(255, 0, 128, 0.2)")
      gradient.addColorStop(1, "rgba(17, 24, 39, 0)")
      
      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.arc(centerX, centerY, pixelSize/2, 0, Math.PI * 2)
      ctx.fill()

      // Draw crystal ball
      const ballGradient = ctx.createRadialGradient(
        pixelSize * 0.4,
        pixelSize * 0.4,
        0,
        centerX,
        centerY,
        radius
      )
      ballGradient.addColorStop(0, "rgba(255, 255, 255, 0.8)")
      ballGradient.addColorStop(0.2, "rgba(88, 101, 242, 0.6)")
      ballGradient.addColorStop(1, "rgba(17, 24, 39, 0.7)")

      ctx.fillStyle = ballGradient
      ctx.beginPath()
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
      ctx.fill()

      // Draw highlight
      ctx.beginPath()
      ctx.arc(pixelSize * 0.4, pixelSize * 0.4, pixelSize * 0.1, 0, Math.PI * 2)
      ctx.fillStyle = "rgba(255, 255, 255, 0.6)"
      ctx.fill()
    }
  }, [size, role])

  if (role === "user") {
    return (
      <div className={`
        ${sizeClasses[size]}
        bg-pixel-blue rounded-lg overflow-hidden 
        border-2 border-pixel-light
        flex items-center justify-center
      `}>
        <User className="text-pixel-light w-1/2 h-1/2" />
      </div>
    )
  }

  return (
    <motion.canvas
      ref={canvasRef}
      className={`
        rounded-lg border-2 border-pixel-light
        ${sizeClasses[size]}
      `}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.2 }}
    />
  )
}

