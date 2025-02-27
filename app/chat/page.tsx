"use client"

import { Sparkles } from "lucide-react"
import PixelPanel from "@/components/pixel-panel"
import ChatWindow from "@/components/chat-window"

export default function ChatPage() {
  return (
    <div className="container mx-auto max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-pixelFont text-pixel-light flex items-center">
          <Sparkles className="mr-2" /> AI Training Assistant
        </h1>
      </div>

      <PixelPanel className="min-h-[600px] md:min-h-[700px]">
        <div className="mb-6">
          <h2 className="text-xl font-pixelFont text-pixel-light mb-2">Chat with your AI companion</h2>
          <p className="text-pixel-light opacity-80">
            Get workout advice, form tips, and motivation from your personal AI training assistant.
          </p>
        </div>
        <div className="h-[500px] md:h-[600px] relative">
          <ChatWindow className="absolute inset-0" />
        </div>
      </PixelPanel>
    </div>
  )
}

