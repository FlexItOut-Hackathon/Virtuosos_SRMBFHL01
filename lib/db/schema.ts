// Guild schema types
export interface CreateGuildData {
  name: string;
  description?: string;
  isPublic?: boolean;
  maxMembers?: number;
} 