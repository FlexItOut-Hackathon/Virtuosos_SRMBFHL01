"use server"

import { nanoid } from "nanoid"
import { revalidatePath } from "next/cache"
import type { CreateGuildData, Guild } from "../db/schema"

// This is a mock database for demonstration
// Replace with your actual database implementation
const guilds: Guild[] = []

export async function createGuild(data: CreateGuildData): Promise<{ success: boolean; error?: string; guild?: Guild }> {
  try {
    // Validate input
    if (!data.name || data.name.length < 3) {
      return { success: false, error: "Guild name must be at least 3 characters long" }
    }

    if (!data.description || data.description.length < 10) {
      return { success: false, error: "Guild description must be at least 10 characters long" }
    }

    // Create new guild
    const newGuild: Guild = {
      id: nanoid(),
      ...data,
      leaderId: "user-123", // Replace with actual user ID from auth
      createdAt: new Date(),
      updatedAt: new Date(),
      memberCount: 1,
      level: 1,
      xp: 0,
      nextLevelXp: 1000,
    }

    // Save to database
    guilds.push(newGuild)

    // Revalidate the guild page
    revalidatePath("/guild")

    return { success: true, guild: newGuild }
  } catch (error) {
    console.error("Failed to create guild:", error)
    return { success: false, error: "Failed to create guild. Please try again." }
  }
}

