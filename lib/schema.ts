export type Guild = {
  id: string
  name: string
  description: string
  type: "casual" | "competitive" | "professional"
  isPrivate: boolean
  leaderId: string
  createdAt: Date
  updatedAt: Date
  memberCount: number
  level: number
  xp: number
  nextLevelXp: number
}

export type GuildMember = {
  id: string
  guildId: string
  userId: string
  role: "leader" | "officer" | "member"
  joinedAt: Date
}

export type CreateGuildData = {
  name: string
  description: string
  type: "casual" | "competitive" | "professional"
  isPrivate: boolean
}

