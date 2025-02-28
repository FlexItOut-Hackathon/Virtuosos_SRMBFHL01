"use client"

import { useRef, useEffect } from "react"

interface PixelAvatarProps {
  src?: string
  size?: "small" | "medium" | "large"
  alt?: string
}

export default function PixelAvatar({ src, size = "medium", alt = "Avatar" }: PixelAvatarProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size based on prop
    const sizes = {
      small: 32,
      medium: 48,
      large: 64
    }
    const pixelSize = sizes[size]
    canvas.width = pixelSize
    canvas.height = pixelSize

    if (src) {
      // If src is provided, load and draw the image
      const img = new Image()
      img.onload = () => {
        ctx.drawImage(img, 0, 0, pixelSize, pixelSize)
      }
      img.src = src
    } else {
      // Draw default pixel art avatar
      const colors = {
        skin: '#FFD1B5',
        hair: '#4A4A4A',
        shirt: '#4361ee'
      }

      // Draw shirt
      ctx.fillStyle = colors.shirt
      ctx.fillRect(0, pixelSize * 0.4, pixelSize, pixelSize * 0.6)

      // Draw head
      ctx.fillStyle = colors.skin
      ctx.fillRect(pixelSize * 0.25, pixelSize * 0.1, pixelSize * 0.5, pixelSize * 0.4)

      // Draw hair
      ctx.fillStyle = colors.hair
      ctx.fillRect(pixelSize * 0.2, pixelSize * 0.05, pixelSize * 0.6, pixelSize * 0.15)
      ctx.fillRect(pixelSize * 0.15, pixelSize * 0.15, pixelSize * 0.15, pixelSize * 0.2)
      ctx.fillRect(pixelSize * 0.7, pixelSize * 0.15, pixelSize * 0.15, pixelSize * 0.2)

      // Draw eyes
      ctx.fillStyle = '#000000'
      ctx.fillRect(pixelSize * 0.35, pixelSize * 0.25, pixelSize * 0.1, pixelSize * 0.1)
      ctx.fillRect(pixelSize * 0.55, pixelSize * 0.25, pixelSize * 0.1, pixelSize * 0.1)
    }
  }, [src, size])

  const sizeClasses = {
    small: "w-8 h-8",
    medium: "w-12 h-12",
    large: "w-16 h-16"
  }

  return (
    <div className={`relative ${sizeClasses[size]} rounded-full overflow-hidden border-2 border-pixel-light bg-pixel-dark`}>
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        aria-label={alt}
      />
    </div>
  )
}

