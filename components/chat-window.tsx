"use client"

import type React from "react"
import { useEffect, useRef, useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Send, X, Trash2, Maximize2, Minimize2, Sparkles } from "lucide-react"
import { useChat } from "@/lib/chat-context"
import PixelAvatar from "@/components/pixel-avatar"
import PixelButton from "@/components/pixel-button"
import { CrystalBall } from "@/components/crystal-ball"

interface ChatWindowProps {
  isOpen?: boolean
  onClose?: () => void
  className?: string
}

// Add a smaller version of CrystalBall for chat messages
interface SmallCrystalBallProps {
  isThinking: boolean
}

function SmallCrystalBall({ isThinking }: SmallCrystalBallProps) {
  return (
    <div className="scale-[0.25] origin-top-left transform translate-x-4 translate-y-4">
      <CrystalBall isThinking={isThinking} />
    </div>
  )
}

export default function ChatWindow({ isOpen = true, onClose, className = "" }: ChatWindowProps) {
  const { messages, isTyping, sendMessage, clearChat, setMessages } = useChat()
  const [input, setInput] = useState("")
  const [isMinimized, setIsMinimized] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [scrollToBottom, messages, isTyping])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    try {
      setIsLoading(true)
      console.log('Starting submission, isLoading:', true)
      const userMessage = input
      setInput("")
      
      // First add the user's message to the UI immediately
      setMessages(prev => [...prev, {
        id: `msg-${Date.now()}`,
        content: userMessage,
        role: 'user',
        timestamp: new Date()
      }]);
      
      // Then handle the assistant's response through sendMessage
      const response = await fetch('/api/oracle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: userMessage }),
      })

      if (!response.ok) {
        throw new Error('Failed to fetch response from Oracle')
      }

      const data = await response.json()
      console.log('Oracle response:', data.response)
      
      // Add Oracle's response to chat
      if (data.response) {
        setMessages(prev => [...prev, {
          id: `msg-${Date.now()}`,
          content: data.response,
          role: 'assistant',
          timestamp: new Date()
        }]);
      } else {
        console.error('No response received from Oracle')
      }
      
    } catch (error) {
      console.error('Error:', error)
      setMessages(prev => [...prev, {
        id: `msg-${Date.now()}`,
        content: 'Apologies, I encountered an error processing your request.',
        role: 'assistant',
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false)
      console.log('Ending submission, isLoading:', false)
    }
  }

  if (!isOpen) return null

  return (
    <div
      className={`
        relative w-full h-full
        bg-pixel-dark border-2 border-pixel-light rounded-lg
        shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]
        overflow-hidden flex flex-col
        ${isMinimized ? "h-14" : ""}
        transition-all duration-300 ease-in-out
        ${className}
      `}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b-2 border-pixel-light bg-pixel-dark/95 backdrop-blur">
        <h3 className="font-pixelFont text-pixel-light flex items-center">
          <Sparkles className="w-5 h-5 mr-2 text-pixel-blue animate-pulse" />
          PixelQuest AI Assistant
        </h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1 hover:bg-pixel-light/10 rounded-md transition-colors"
          >
            {isMinimized ? (
              <Maximize2 className="w-5 h-5 text-pixel-light hover:text-pixel-blue" />
            ) : (
              <Minimize2 className="w-5 h-5 text-pixel-light hover:text-pixel-blue" />
            )}
          </button>
          {onClose && (
            <button onClick={onClose} className="p-1 hover:bg-pixel-light/10 rounded-md transition-colors">
              <X className="w-5 h-5 text-pixel-light hover:text-pixel-red" />
            </button>
          )}
        </div>
      </div>

      <AnimatePresence>
        {!isMinimized && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "100%" }}
            exit={{ height: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col flex-1 overflow-hidden"
          >
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-pixel-light/20 scrollbar-track-transparent">
              {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-center p-4 space-y-4">
                  <CrystalBall isThinking={isLoading} />
                  <div>
                    <h4 className="text-lg font-pixelFont text-pixel-light mb-2">Welcome, Adventurer!</h4>
                    <p className="text-sm text-pixel-light/80">
                      I'm your AI fitness companion. Ask me about workouts, form tips, or anything fitness-related!
                    </p>
                  </div>
                </div>
              )}

              <AnimatePresence>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className={`flex items-start gap-2 ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                  >
                    <div className="flex-shrink-0 mt-1">
                      {message.role === "assistant" ? (
                        <div className="w-8 h-8">
                          <CrystalBall isThinking={isLoading} />
                        </div>
                      ) : (
                        <PixelAvatar size="small" role="user" />
                      )}
                    </div>
                    <motion.div
                      whileHover={{ y: -2 }}
                      className={`
                        group relative max-w-[80%] p-3 rounded-lg
                        ${
                          message.role === "user"
                            ? "bg-pixel-blue/20 border-2 border-pixel-blue rounded-br-none"
                            : "bg-pixel-dark border-2 border-pixel-light rounded-bl-none"
                        }
                        hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]
                        transition-all duration-200
                      `}
                    >
                      <p className="text-pixel-light whitespace-pre-wrap break-words">{message.content}</p>
                      <div
                        className={`
                          absolute bottom-0 w-4 h-4 border-2
                          ${
                            message.role === "user"
                              ? "right-0 transform translate-x-1/2 translate-y-1/2 rotate-45 border-pixel-blue bg-pixel-blue/20"
                              : "left-0 transform -translate-x-1/2 translate-y-1/2 rotate-45 border-pixel-light bg-pixel-dark"
                          }
                        `}
                      />
                      <motion.span 
                        initial={{ opacity: 0 }}
                        whileHover={{ opacity: 1 }}
                        className="absolute bottom-0 text-xs text-pixel-light/60 px-2 transform translate-y-full"
                      >
                        {message.timestamp.toLocaleTimeString()}
                      </motion.span>
                    </motion.div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start gap-2"
                >
                  <div className="flex-shrink-0 mt-1 w-8 h-8">
                    <CrystalBall isThinking={true} />
                  </div>
                  <div className="relative bg-pixel-dark border-2 border-pixel-light rounded-lg rounded-bl-none p-3">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-pixel-light rounded-full animate-bounce" style={{ animationDelay: "0s" }} />
                      <div className="w-2 h-2 bg-pixel-light rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                      <div className="w-2 h-2 bg-pixel-light rounded-full animate-bounce" style={{ animationDelay: "0.4s" }} />
                    </div>
                    <div className="absolute bottom-0 left-0 w-4 h-4 border-2 border-pixel-light bg-pixel-dark transform -translate-x-1/2 translate-y-1/2 rotate-45" />
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t-2 border-pixel-light bg-pixel-dark/95 backdrop-blur">
              <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask your fitness companion..."
                  className="flex-1 h-10 bg-pixel-dark border-2 border-pixel-light rounded-md px-3 
                           font-pixelFont text-pixel-light placeholder:text-pixel-light/50
                           focus:outline-none focus:border-pixel-blue focus:shadow-[0_0_0_1px_rgba(67,97,238,0.3)]
                           transition-all duration-200"
                />
                <PixelButton type="submit" disabled={!input.trim() || isLoading} className="h-10 px-3 flex-shrink-0">
                  <Send className="w-4 h-4" />
                </PixelButton>
                <PixelButton type="button" variant="outline" onClick={clearChat} className="h-10 px-3 flex-shrink-0">
                  <Trash2 className="w-4 h-4" />
                </PixelButton>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

