"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"
import { chatService, type ChatMessage } from "./chat-service"

interface ChatContextType {
  messages: ChatMessage[]
  isTyping: boolean
  sendMessage: (content: string, attachments?: ChatMessage["attachments"]) => Promise<void>
  clearChat: () => void
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

export function ChatProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isTyping, setIsTyping] = useState(false)

  const sendMessage = useCallback(async (content: string, attachments?: ChatMessage["attachments"]) => {
    setIsTyping(true)
    try {
      await chatService.streamMessage(content, (chunk) => {
        setMessages((prev) => {
          const lastMessage = prev[prev.length - 1]
          if (lastMessage && lastMessage.role === "assistant") {
            return [...prev.slice(0, -1), { ...lastMessage, content: lastMessage.content + chunk }]
          } else {
            return [
              ...prev,
              {
                id: `msg-${Date.now()}`,
                content: chunk,
                role: "assistant",
                timestamp: new Date(),
              },
            ]
          }
        })
      })
    } finally {
      setIsTyping(false)
    }
  }, [])

  const clearChat = useCallback(() => {
    chatService.clearChat()
    setMessages([])
  }, [])

  return (
    <ChatContext.Provider
      value={{
        messages,
        isTyping,
        sendMessage,
        clearChat,
        setMessages,
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}

export function useChat() {
  const context = useContext(ChatContext)
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider")
  }
  return context
}

