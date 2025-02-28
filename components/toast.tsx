"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

export type ToastProps = {
  message: string
  type?: "success" | "error"
  duration?: number
  onClose?: () => void
}

export function Toast({ message, type = "success", duration = 3000, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      onClose?.()
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  if (!isVisible) return null

  return (
    <div
      className={cn(
        "fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-lg border-2 border-pixel-light px-4 py-2 text-sm font-pixelFont shadow-lg animate-pixel-float",
        type === "success" ? "bg-pixel-green text-white" : "bg-pixel-red text-white",
      )}
    >
      <span>{message}</span>
      <button
        onClick={() => {
          setIsVisible(false)
          onClose?.()
        }}
        className="rounded-full p-1 hover:bg-black/10"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}

export function ToastContainer({ children }: { children: React.ReactNode }) {
  return <div className="fixed bottom-0 right-0 z-50 p-4 space-y-2">{children}</div>
}

export const ToastViewport = () => {
  return null
}

export const ToastTitle = () => {
  return null
}

export const ToastDescription = () => {
  return null
}

export const ToastClose = () => {
  return null
}

export const ToastAction = () => {
  return null
}

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>
}

