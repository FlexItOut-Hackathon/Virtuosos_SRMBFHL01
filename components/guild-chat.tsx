"use client"

import { useState, useEffect, useRef } from "react"
import { Send, Smile, FileUp } from "lucide-react"
import { collection, query, orderBy, limit, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useAuth } from '@/lib/auth-context'
import PixelButton from "./pixel-button"
import PixelAvatar from "./pixel-avatar"
import { useToast } from "@/hooks/use-toast"

interface Message {
  id: string
  sender: {
    uid: string
    displayName: string
    avatar?: string
  }
  content: string
  timestamp: Date
  type: "chat" | "system" | "achievement"
}

export default function GuildChat() {
  const { user } = useAuth()
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  useEffect(() => {
    if (!user) return

    const q = query(
      collection(db, 'messages'),
      orderBy('timestamp', 'desc'),
      limit(50)
    )

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newMessages = snapshot.docs.map(doc => {
        const data = doc.data()
        return {
          id: doc.id,
          ...data,
          timestamp: data.timestamp?.toDate() || new Date(),
        }
      }) as Message[]
      
      setMessages(newMessages.reverse())
    }, (error) => {
      console.error("Error fetching messages:", error)
      toast({
        title: "Error",
        description: "Failed to load messages",
        variant: "destructive",
      })
    })

    return () => unsubscribe()
  }, [user])

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSend = async () => {
    if (!user || !newMessage.trim() || isLoading) return

    setIsLoading(true)
    try {
      await addDoc(collection(db, 'messages'), {
        sender: {
          uid: user.uid,
          displayName: user.displayName || 'Anonymous',
          avatar: user.photoURL
        },
        content: newMessage,
        timestamp: serverTimestamp(),
        type: "chat"
      })
      setNewMessage("")
    } catch (error) {
      console.error("Error sending message:", error)
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const formatTime = (date: Date | undefined) => {
    if (!date) return ''
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (!user) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-pixel-light">Please sign in to use the guild chat</p>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      <div className="border-b-2 border-pixel-light pb-4 mb-4">
        <h2 className="text-xl font-pixelFont text-pixel-light">Guild Chat</h2>
      </div>

      <div className="flex-1 overflow-y-auto mb-4 space-y-4 scrollbar-thin scrollbar-thumb-pixel-light scrollbar-track-pixel-dark">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender.uid === user.uid ? "justify-end" : "justify-start"} ${
              message.type === "system" || message.type === "achievement" ? "justify-center" : ""
            }`}
          >
            {message.type === "chat" && (
              <div className={`flex ${message.sender.uid === user.uid ? "flex-row-reverse" : "flex-row"} items-end gap-2 max-w-[90%]`}>
                <PixelAvatar src={message.sender.avatar || "/default-avatar.png"} size="small" />
                <div
                  className={`
                    relative px-4 py-2 rounded-lg break-words
                    ${
                      message.sender.uid === user.uid
                        ? "bg-pixel-blue/20 border-2 border-pixel-blue"
                        : "bg-pixel-dark border-2 border-pixel-light"
                    }
                    ${message.sender.uid === user.uid ? "rounded-br-none" : "rounded-bl-none"}
                  `}
                >
                  <div className="flex items-center justify-between gap-4 mb-1">
                    <span className="font-pixelFont text-pixel-light text-sm">{message.sender.displayName}</span>
                    <span className="text-pixel-light opacity-60 text-xs whitespace-nowrap">{formatTime(message.timestamp)}</span>
                  </div>
                  <p className="text-pixel-light break-words">{message.content}</p>
                </div>
              </div>
            )}
            
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
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      <div className="border-t-2 border-pixel-light pt-4 mt-auto">
        <div className="flex gap-2 items-center">
          <div className="flex-shrink-0 flex">
            <PixelButton variant="outline" size="small" className="rounded-r-none border-r-0">
              <FileUp className="w-4 h-4" />
            </PixelButton>
            <PixelButton
              variant="outline"
              size="small"
              className="rounded-l-none"
              onClick={() => setIsEmojiPickerOpen(!isEmojiPickerOpen)}
            >
              <Smile className="w-4 h-4" />
            </PixelButton>
          </div>
          <div className="flex-1 min-w-0">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSend()}
              placeholder="Type a message..."
              className="w-full bg-pixel-dark border-2 border-pixel-light rounded-md px-3 py-2 font-pixelFont text-pixel-light focus:outline-none focus:border-pixel-blue"
            />
          </div>
          <PixelButton onClick={handleSend} disabled={!newMessage.trim() || isLoading} className="flex-shrink-0">
            <Send className="w-4 h-4" />
          </PixelButton>
        </div>
      </div>
    </div>
  )
}

