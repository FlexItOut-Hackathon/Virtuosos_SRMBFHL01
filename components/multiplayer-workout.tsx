"use client"

import { useState, useEffect, useCallback } from "react"
import { WebRTCManager } from "@/lib/webrtc"
import type { Exercise } from "@/lib/exercise-data"
import { Users, Video, VideoOff, Mic, MicOff, MessageSquare } from "lucide-react"
import PixelButton from "./pixel-button"
import PixelPanel from "./pixel-panel"

interface MultiplayerWorkoutProps {
  exercise: Exercise
  roomId: string
  userId: string
}

export default function MultiplayerWorkout({ exercise, roomId, userId }: MultiplayerWorkoutProps) {
  const [isHost, setIsHost] = useState(false)
  const [participants, setParticipants] = useState<any[]>([])
  const [isVideoEnabled, setIsVideoEnabled] = useState(true)
  const [isAudioEnabled, setIsAudioEnabled] = useState(true)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [messages, setMessages] = useState<any[]>([])
  const [webrtc, setWebrtc] = useState<WebRTCManager | null>(null)

  const handleRemoteStream = useCallback((stream: MediaStream) => {
    // Add new participant with their stream
    setParticipants((prev) => [
      ...prev,
      {
        id: Date.now(),
        stream,
        score: 0,
      },
    ])
  }, [])

  const handleMessage = useCallback((message: any) => {
    if (message.type === "chat") {
      setMessages((prev) => [...prev, message])
    } else if (message.type === "score") {
      setParticipants((prev) => prev.map((p) => (p.id === message.userId ? { ...p, score: message.score } : p)))
    }
  }, [])

  const handleConnectionStateChange = useCallback((state: RTCPeerConnectionState) => {
    console.log("Connection state:", state)
  }, [])

  useEffect(() => {
    const rtc = new WebRTCManager(handleRemoteStream, handleMessage, handleConnectionStateChange)

    rtc.initializeConnection(isHost)
    setWebrtc(rtc)

    return () => {
      rtc.closeConnection()
    }
  }, [handleRemoteStream, handleMessage, handleConnectionStateChange, isHost])

  const toggleVideo = () => {
    setIsVideoEnabled(!isVideoEnabled)
    // Update local video track
  }

  const toggleAudio = () => {
    setIsAudioEnabled(!isAudioEnabled)
    // Update local audio track
  }

  const sendMessage = (text: string) => {
    if (webrtc) {
      webrtc.sendMessage({
        type: "chat",
        userId,
        text,
        timestamp: Date.now(),
      })
    }
  }

  const updateScore = (score: number) => {
    if (webrtc) {
      webrtc.sendMessage({
        type: "score",
        userId,
        score,
        timestamp: Date.now(),
      })
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Main workout area */}
      <div className="md:col-span-2">
        <PixelPanel>
          <div className="relative aspect-video">{/* Main video feed */}</div>

          {/* Controls */}
          <div className="mt-4 flex justify-center gap-2">
            <PixelButton onClick={toggleVideo} variant={isVideoEnabled ? "default" : "outline"}>
              {isVideoEnabled ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
            </PixelButton>

            <PixelButton onClick={toggleAudio} variant={isAudioEnabled ? "default" : "outline"}>
              {isAudioEnabled ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
            </PixelButton>

            <PixelButton onClick={() => setIsChatOpen(!isChatOpen)} variant={isChatOpen ? "default" : "outline"}>
              <MessageSquare className="w-4 h-4" />
            </PixelButton>
          </div>
        </PixelPanel>
      </div>

      {/* Sidebar */}
      <div className="md:col-span-1">
        <PixelPanel>
          <h3 className="text-xl font-pixelFont text-pixel-light mb-4 flex items-center">
            <Users className="mr-2" /> Participants
          </h3>

          <div className="space-y-4">
            {participants.map((participant) => (
              <div
                key={participant.id}
                className="flex items-center justify-between p-2 border-b border-pixel-light last:border-0"
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-pixel-blue rounded-md overflow-hidden border-2 border-pixel-light">
                    <video
                      src={URL.createObjectURL(participant.stream)}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="ml-3">
                    <div className="font-pixelFont text-pixel-light">Player {participant.id}</div>
                    <div className="text-sm text-pixel-light opacity-80">Score: {participant.score}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </PixelPanel>

        {isChatOpen && (
          <PixelPanel className="mt-4">
            <div className="h-[300px] flex flex-col">
              <div className="flex-1 overflow-y-auto space-y-2 mb-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`p-2 rounded-lg ${
                      message.userId === userId ? "bg-pixel-blue/20 ml-auto" : "bg-pixel-dark border border-pixel-light"
                    } max-w-[80%]`}
                  >
                    <p className="text-sm text-pixel-light">{message.text}</p>
                    <span className="text-xs text-pixel-light opacity-60">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Type a message..."
                  className="flex-1 bg-pixel-dark border-2 border-pixel-light rounded-md px-3 py-2 text-pixel-light focus:outline-none focus:border-pixel-blue"
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      const input = e.target as HTMLInputElement
                      sendMessage(input.value)
                      input.value = ""
                    }
                  }}
                />
                <PixelButton
                  onClick={() => {
                    const input = document.querySelector("input") as HTMLInputElement
                    sendMessage(input.value)
                    input.value = ""
                  }}
                >
                  Send
                </PixelButton>
              </div>
            </div>
          </PixelPanel>
        )}
      </div>
    </div>
  )
}

