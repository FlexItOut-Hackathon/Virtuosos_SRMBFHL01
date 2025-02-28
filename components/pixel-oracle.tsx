"use client"

import { useState, useEffect, useCallback } from "react"
import { Sparkles } from "lucide-react"
import PixelButton from "./pixel-button"

export default function PixelOracle() {
  const [message, setMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [currentCharIndex, setCurrentCharIndex] = useState(0)

  const oracleMessages = [
    "Remember, warrior! Hydration is key to conquering your fitness quests!",
    "Your body is your character, level it up with consistent training!",
    "A true pixel hero never skips leg day. Strengthen your foundation!",
    "Rest is not defeat, it's preparing for the next battle. Sleep well!",
    "The greatest adventurers track their progress. Log your workouts!",
  ]

  const getRandomMessage = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * oracleMessages.length)
    return oracleMessages[randomIndex]
  }, [])

  const typeMessage = useCallback((newMessage: string) => {
    setIsTyping(true)
    setMessage("")
    setCurrentCharIndex(0)

    const interval = setInterval(() => {
      setCurrentCharIndex((prev) => {
        if (prev < newMessage.length) {
          setMessage(newMessage.substring(0, prev + 1))
          return prev + 1
        } else {
          clearInterval(interval)
          setIsTyping(false)
          return prev
        }
      })
    }, 30)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    typeMessage(getRandomMessage())
  }, [typeMessage, getRandomMessage])

  const handleNewWisdom = () => {
    if (!isTyping) {
      typeMessage(getRandomMessage())
    }
  }

  return (
    <div>
      <h2 className="text-xl font-pixelFont mb-4 text-pixel-light flex items-center">
        <Sparkles className="mr-2 text-pixel-purple" /> Fitness Oracle
      </h2>

      <div className="flex mb-4">
        <div className="w-16 h-16 bg-pixel-purple rounded-md overflow-hidden border-2 border-pixel-light mr-4">
          <img src="./oracle.jpeg" alt="Oracle Avatar" className="w-full h-full object-cover" />
        </div>

        <div className="flex-1 bg-pixel-dark border-2 border-pixel-light rounded-md p-3 relative">
          <p className="font-pixelFont text-pixel-light text-sm">
            {message}
            {isTyping && <span className="animate-pulse">|</span>}
          </p>
          <div className="absolute -bottom-2 left-4 w-4 h-4 bg-pixel-dark border-b-2 border-r-2 border-pixel-light transform rotate-45"></div>
        </div>
      </div>

      <div className="flex justify-center">
        <PixelButton onClick={handleNewWisdom} color="purple" disabled={isTyping}>
          Ask for Wisdom
        </PixelButton>
      </div>
    </div>
  )
}

