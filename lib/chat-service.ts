import { generateText, streamText } from "ai"
import { openai } from "@ai-sdk/openai"

export type ChatMessage = {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
  attachments?: {
    type: "workout" | "quest" | "image" | "link"
    data: any
  }[]
}

const systemPrompt = `You are PixelQuest AI, a fitness companion in a pixel-art RPG game. 
Your responses should be encouraging and game-themed, using terms like "quest", "level up", and "power up".
Always maintain a positive, motivating tone while providing accurate fitness advice.
Format workout plans and tips in a structured, easy-to-read way.`

export class ChatService {
  private messages: ChatMessage[] = []

  constructor() {
    // Initialize with system message
    this.messages = []
  }

  async sendMessage(content: string, attachments?: ChatMessage["attachments"]) {
    // Add user message
    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      content,
      role: "user",
      timestamp: new Date(),
      attachments,
    }
    this.messages.push(userMessage)

    // Generate AI response
    const response = await generateText({
      model: openai("gpt-4o"),
      prompt: content,
      system: systemPrompt,
      temperature: 0.7,
      maxTokens: 500,
    })

    // Add AI response
    const assistantMessage: ChatMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      content: response.text,
      role: "assistant",
      timestamp: new Date(),
    }
    this.messages.push(assistantMessage)

    return assistantMessage
  }

  async streamMessage(content: string, onChunk: (chunk: string) => void) {
    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      content,
      role: "user",
      timestamp: new Date(),
    }
    this.messages.push(userMessage)

    let fullResponse = ""

    const stream = await streamText({
      model: openai("gpt-4o"),
      prompt: content,
      system: systemPrompt,
      temperature: 0.7,
      maxTokens: 500,
      onChunk: ({ chunk }) => {
        if (chunk.type === "text-delta") {
          fullResponse += chunk.text
          onChunk(chunk.text)
        }
      },
    })

    const assistantMessage: ChatMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      content: fullResponse,
      role: "assistant",
      timestamp: new Date(),
    }
    this.messages.push(assistantMessage)

    return assistantMessage
  }

  getMessages() {
    return this.messages
  }

  clearChat() {
    this.messages = []
  }
}

export const chatService = new ChatService()

