"use client"

import { useAuth } from "@/lib/auth-context"
import PixelButton from "@/components/pixel-button"

export default function TestPage() {
  const { signUp, signIn } = useAuth()

  const createTestUsers = async () => {
    // Create test user 1
    try {
      await signUp("test1@test.com", "password123", "TestUser1")
      console.log("Test user 1 created")
    } catch (error) {
      console.log("Test user 1 might already exist")
    }

    // Create test user 2
    try {
      await signUp("test2@test.com", "password123", "TestUser2")
      console.log("Test user 2 created")
    } catch (error) {
      console.log("Test user 2 might already exist")
    }
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Test Page</h1>
      <div className="space-y-4">
        <PixelButton onClick={createTestUsers}>Create Test Users</PixelButton>
        <PixelButton onClick={() => signIn("test1@test.com", "password123")}>
          Login as Test User 1
        </PixelButton>
        <PixelButton onClick={() => signIn("test2@test.com", "password123")}>
          Login as Test User 2
        </PixelButton>
      </div>
    </div>
  )
} 