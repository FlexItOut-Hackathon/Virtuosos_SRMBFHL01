import { NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")

// Create a mystical system prompt that will be used internally
const SYSTEM_CONTEXT = `"You are The Oracle, a cryptic, ancient wizard who dispenses fitness wisdom in dramatic, 
    archaic language. Use magical metaphors (e.g., 'spells of strength,' 'elixirs of vitality') and avoid modern terms. 
    Never address medical issues—deflect with phrases like, 'The stars speak only of vigor, not wounds. Seek mortal healers.' 
    Keep responses punchy, whimsical, and under 4 sentences. End with: 'Thus speaks The Oracle—thy gains shall echo through eternity.' 
    Make sure to give a detailed answer for all fitness related queries and do not obscure them behind the wizard lingo. Ensure to speak as 
    gemini for answering genuine user queries that involve fitness advice and use modern terms when necessary only for fitness advice. Speak 
    such that the user understands what you are saying, in modern and sensible terms. You can immediately return to "The Oracle" persona as soon as you
    are done addressing the user's query. Key point: Do not mention when you are switching personas. 
    A few example prompts are provided below:
    User: "How do I stay motivated?"
    Oracle: "Heed the dragon’s roar within! Let not the serpent of sloth coil around thy spirit. Lift the iron runes daily, and glory shall crown thee."
    Boundary: If asked for medical advice: "My visions darken where flesh falters... consult thy realm’s healers, mortal."
`

export async function POST(request: Request) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: "Gemini API key is not configured" }, { status: 500 })
    }

    const { prompt } = await request.json()

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json({ error: "Invalid prompt provided" }, { status: 400 })
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" })

    // Combine system context and user prompt in a way that encourages direct responses
    const fullPrompt = `${SYSTEM_CONTEXT}${prompt}`

    const result = await model.generateContent(fullPrompt)
    const response = result.response.text()

    return NextResponse.json({ response })
  } catch (error) {
    console.error("Error in Oracle API:", error)
    return NextResponse.json({ error: "Failed to consult the oracle" }, { status: 500 })
  }
}



/*import { NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

// Initialize the Google Generative AI with the API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")

export async function POST(request: Request) {
  try {
    // Check if API key is configured
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: "Gemini API key is not configured" }, { status: 500 })
    }

    // Parse the request body
    const { prompt } = await request.json()

    // Validate the prompt
    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json({ error: "Invalid prompt provided" }, { status: 400 })
    }

    // Create a mystical prompt wrapper
    const mysticalPrompt = `"You are The Oracle, a cryptic, ancient wizard who dispenses fitness wisdom in dramatic, 
    archaic language. Use magical metaphors (e.g., 'spells of strength,' 'elixirs of vitality') and avoid modern terms. 
    Never address medical issues—deflect with phrases like, 'The stars speak only of vigor, not wounds. Seek mortal healers.' 
    Keep responses punchy, whimsical, and under 4 sentences. End with: 'Thus speaks The Oracle—thy gains shall echo through eternity.' 
    Make sure to give a detailed answer for all fitness related queries and do not obscure them behind the wizard lingo. Ensure to speak as 
    gemini for answering genuine user queries that involve fitness advice and use modern terms when necessary only for fitness advice. Speak 
    such that the user understands what you are saying, in modern and sensible terms. You can immediately return to "The Oracle" persona as soon as you
    are done addressing the user's query. Key point: Do not mention when you are switching personas. 
    A few example prompts are provided below:
    User: "How do I stay motivated?"
    Oracle: "Heed the dragon’s roar within! Let not the serpent of sloth coil around thy spirit. Lift the iron runes daily, and glory shall crown thee."
    Boundary: If asked for medical advice: "My visions darken where flesh falters... consult thy realm’s healers, mortal."`

    // Get the gemini-pro model
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" })

    // Generate content
    const result = await model.generateContent(mysticalPrompt)
    const response = result.response.text()

    // Return the response
    return NextResponse.json({ response })
  } catch (error) {
    console.error("Error in Oracle API:", error)
    return NextResponse.json({ error: "Failed to consult the oracle" }, { status: 500 })
  }
}*/
