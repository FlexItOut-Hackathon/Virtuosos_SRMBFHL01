"use client"

import type React from "react"

import { useState } from "react"
import { Shield, Users, Trophy, X } from "lucide-react"
import { createGuild } from "@/lib/actions/guild-actions"
import type { CreateGuildData } from "@/lib/db/schema"
import PixelPanel from "./pixel-panel"
import PixelButton from "./pixel-button"
import { Toast } from "./ui/toast"

interface CreateGuildDialogProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

export default function CreateGuildDialog({ isOpen, onClose, onSuccess }: CreateGuildDialogProps) {
  const [guildData, setGuildData] = useState<CreateGuildData>({
    name: "",
    description: "",
    type: "casual",
    isPrivate: false,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await createGuild(guildData)

      if (result.success) {
        setToast({ message: "Guild created successfully!", type: "success" })
        onSuccess?.()
        setTimeout(() => {
          onClose()
        }, 2000)
      } else {
        setToast({ message: result.error || "Failed to create guild", type: "error" })
      }
    } catch (error) {
      setToast({ message: "An unexpected error occurred", type: "error" })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 p-4">
      <PixelPanel className="w-full max-w-lg relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-pixel-light hover:text-pixel-red transition-colors"
          disabled={isLoading}
        >
          <X className="w-6 h-6" />
        </button>

        <div className="mb-6">
          <h2 className="text-2xl font-pixelFont text-pixel-light flex items-center">
            <Shield className="mr-2 text-pixel-blue" /> Create New Guild
          </h2>
          <p className="text-pixel-light opacity-80">Form your team of fitness warriors!</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-pixelFont text-pixel-light mb-1">Guild Name</label>
            <input
              type="text"
              value={guildData.name}
              onChange={(e) => setGuildData({ ...guildData, name: e.target.value })}
              className="w-full bg-pixel-dark border-2 border-pixel-light rounded-md px-3 py-2 font-pixelFont text-pixel-light focus:outline-none focus:border-pixel-blue"
              placeholder="Enter guild name"
              required
              minLength={3}
              maxLength={24}
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block font-pixelFont text-pixel-light mb-1">Description</label>
            <textarea
              value={guildData.description}
              onChange={(e) => setGuildData({ ...guildData, description: e.target.value })}
              className="w-full bg-pixel-dark border-2 border-pixel-light rounded-md px-3 py-2 font-pixelFont text-pixel-light focus:outline-none focus:border-pixel-blue"
              placeholder="Describe your guild's mission"
              required
              minLength={10}
              maxLength={200}
              rows={3}
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block font-pixelFont text-pixel-light mb-1">Guild Type</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setGuildData({ ...guildData, type: "casual" })}
                className={`p-3 border-2 rounded-md flex flex-col items-center ${
                  guildData.type === "casual"
                    ? "bg-pixel-blue border-pixel-light"
                    : "bg-pixel-dark border-pixel-light/50"
                }`}
                disabled={isLoading}
              >
                <Users className="w-6 h-6 text-pixel-light mb-1" />
                <span className="text-sm font-pixelFont text-pixel-light">Casual</span>
              </button>
              <button
                type="button"
                onClick={() => setGuildData({ ...guildData, type: "competitive" })}
                className={`p-3 border-2 rounded-md flex flex-col items-center ${
                  guildData.type === "competitive"
                    ? "bg-pixel-red border-pixel-light"
                    : "bg-pixel-dark border-pixel-light/50"
                }`}
                disabled={isLoading}
              >
                <Trophy className="w-6 h-6 text-pixel-light mb-1" />
                <span className="text-sm font-pixelFont text-pixel-light">Competitive</span>
              </button>
              <button
                type="button"
                onClick={() => setGuildData({ ...guildData, type: "professional" })}
                className={`p-3 border-2 rounded-md flex flex-col items-center ${
                  guildData.type === "professional"
                    ? "bg-pixel-purple border-pixel-light"
                    : "bg-pixel-dark border-pixel-light/50"
                }`}
                disabled={isLoading}
              >
                <Shield className="w-6 h-6 text-pixel-light mb-1" />
                <span className="text-sm font-pixelFont text-pixel-light">Professional</span>
              </button>
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isPrivate"
              checked={guildData.isPrivate}
              onChange={(e) => setGuildData({ ...guildData, isPrivate: e.target.checked })}
              className="w-4 h-4 bg-pixel-dark border-2 border-pixel-light rounded focus:ring-pixel-blue"
              disabled={isLoading}
            />
            <label htmlFor="isPrivate" className="ml-2 font-pixelFont text-pixel-light">
              Private Guild (Invitation Only)
            </label>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <PixelButton type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </PixelButton>
            <PixelButton type="submit" color="blue" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Guild"}
            </PixelButton>
          </div>
        </form>
      </PixelPanel>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}

