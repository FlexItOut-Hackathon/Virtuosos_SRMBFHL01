"use client"

import { useRef, useEffect } from "react"
import { motion } from "framer-motion"

interface PixelAvatarProps {
  src?: string
  size?: "small" | "medium" | "large"
  alt?: string
}

export default function PixelAvatar({ src, size = "medium", alt = "Avatar" }: PixelAvatarProps) {
  const sizeClasses = {
    small: "w-8 h-8",
    medium: "w-12 h-12",
    large: "w-16 h-16"
  }

  return (
    <div className={`relative ${sizeClasses[size]} rounded-full overflow-hidden border-2 border-pixel-light bg-pixel-dark`}>
      <img
        src={src || "/placeholder-avatar.png"}
        alt={alt}
        className="w-full h-full object-cover"
      />
    </div>
  )
}

