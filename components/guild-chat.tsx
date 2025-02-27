"use client"

import { useState, useEffect, useRef } from "react"
import { Send, Smile, FileUp } from "lucide-react"
import PixelButton from "./pixel-button"
import PixelAvatar from "./pixel-avatar"

type Message = {
  id: number
  sender: string
  content: string
  timestamp: Date
  type: "chat" | "system" | "achievement"
  avatar?: string
}

export default function GuildChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: "System",
      content: "Welcome to the guild chat! 🎮",
      timestamp: new Date(),
      type: "system",
    },
    {
      id: 2,
      sender: "QuestMaster",
      content: "Let's tackle today's guild challenge! 💪",
      timestamp: new Date(),
      type: "chat",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 3,
      sender: "System",
      content: "🏆 GuildMember123 completed the daily workout challenge!",
      timestamp: new Date(),
      type: "achievement",
    },
  ])
  const [newMessage, setNewMessage] = useState("")
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSend = () => {
    if (!newMessage.trim()) return

    setMessages((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        sender: "You",
        content: newMessage,
        timestamp: new Date(),
        type: "chat",
        avatar: "/placeholder.svg?height=40&width=40",
      },
    ])
    setNewMessage("")
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="h-full flex flex-col">
      <div className="border-b-2 border-pixel-light pb-4 mb-4">
        <h2 className="text-xl font-pixelFont text-pixel-light">Guild Chat</h2>
      </div>

      <div className="flex-1 overflow-y-auto mb-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === "You" ? "justify-end" : "justify-start"} ${
              message.type === "system" || message.type === "achievement" ? "justify-center" : ""
            }`}
          >
            {message.type === "system" && (
              <div className="bg-pixel-dark/50 border border-pixel-light rounded-md px-4 py-2 max-w-[80%]">
                <p className="text-pixel-light text-sm text-center">{message.content}</p>
              </div>
            )}

            {message.type === "achievement" && (
              <div className="bg-pixel-yellow/20 border-2 border-pixel-yellow rounded-md px-4 py-2 max-w-[80%]">
                <p className="text-pixel-yellow text-sm text-center">{message.content}</p>
              </div>
            )}

            {message.type === "chat" && (
              <div className={`flex ${message.sender === "You" ? "flex-row-reverse" : "flex-row"} items-end gap-2`}>
                <PixelAvatar size="small" image={message.avatar} />
                <div
                  className={`
                    relative max-w-[70%] px-4 py-2 rounded-lg
                    ${
                      message.sender === "You"
                        ? "bg-pixel-blue/20 border-2 border-pixel-blue"
                        : "bg-pixel-dark border-2 border-pixel-light"
                    }
                    ${message.sender === "You" ? "rounded-br-none" : "rounded-bl-none"}
                  `}
                >
                  <div className="flex items-center justify-between gap-4 mb-1">
                    <span className="font-pixelFont text-pixel-light text-sm">{message.sender}</span>
                    <span className="text-pixel-light opacity-60 text-xs">{formatTime(message.timestamp)}</span>
                  </div>
                  <p className="text-pixel-light break-words">{message.content}</p>
                  <div
                    className={`absolute bottom-0 ${
                      message.sender === "You"
                        ? "right-0 transform translate-x-1/2"
                        : "left-0 transform -translate-x-1/2"
                    } translate-y-1/2 w-4 h-4 border-2 ${
                      message.sender === "You" ? "border-pixel-blue" : "border-pixel-light"
                    } ${message.sender === "You" ? "bg-pixel-blue/20" : "bg-pixel-dark"} transform rotate-45`}
                  ></div>
                </div>
              </div>
            )}
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      <div className="border-t-2 border-pixel-light pt-4">
        <div className="flex gap-2">
          <div className="flex">
            <PixelButton variant="outline" size="icon" className="rounded-r-none border-r-0">
              <FileUp className="w-4 h-4" />
            </PixelButton>
            <PixelButton
              variant="outline"
              size="icon"
              className="rounded-l-none"
              onClick={() => setIsEmojiPickerOpen(!isEmojiPickerOpen)}
            >
              <Smile className="w-4 h-4" />
            </PixelButton>
          </div>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            placeholder="Type a message..."
            className="flex-1 bg-pixel-dark border-2 border-pixel-light rounded-md px-3 py-2 font-pixelFont text-pixel-light focus:outline-none focus:border-pixel-blue"
          />
          <PixelButton onClick={handleSend} disabled={!newMessage.trim()}>
            <Send className="w-4 h-4" />
          </PixelButton>
        </div>
      </div>
    </div>
  )
}

