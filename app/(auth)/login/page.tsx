"use client"

import type React from "react"
import Link from "next/link"
import { useState } from "react"
import { LogIn, Mail, Lock, Github, ChromeIcon as Google, Gamepad } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import PixelPanel from "@/components/pixel-panel"
import PixelButton from "@/components/pixel-button"
import { Toast } from "@/components/ui/toast"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { signIn } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      await signIn(email, password)
    } catch (error: any) {
      console.error("Login error:", error)
      setError(getAuthErrorMessage(error.code))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-pixel-dark">
      <div className="w-full max-w-md">
        <PixelPanel>
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-pixel-blue rounded-lg border-4 border-pixel-light flex items-center justify-center animate-pixel-float">
                <Gamepad className="w-8 h-8 text-pixel-light" />
              </div>
            </div>
            <h1 className="text-3xl font-pixelFont text-pixel-light mb-2">Welcome Back!</h1>
            <p className="text-pixel-light opacity-80">Continue your fitness quest</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-pixelFont text-pixel-light mb-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-pixel-light opacity-50" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-pixel-dark border-2 border-pixel-light rounded-md px-10 py-2 font-pixelFont text-pixel-light focus:outline-none focus:border-pixel-blue"
                  placeholder="Enter your email"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <label className="block font-pixelFont text-pixel-light mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-pixel-light opacity-50" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-pixel-dark border-2 border-pixel-light rounded-md px-10 py-2 font-pixelFont text-pixel-light focus:outline-none focus:border-pixel-blue"
                  placeholder="Enter your password"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <PixelButton type="submit" className="w-full" isLoading={isLoading}>
              <LogIn className="w-5 h-5 mr-2" />
              Login
            </PixelButton>

            <div className="flex items-center justify-between text-sm">
              <Link href="/register" className="text-pixel-blue hover:underline">
                Create account
              </Link>
              <Link href="/forgot-password" className="text-pixel-blue hover:underline">
                Forgot Password?
              </Link>
            </div>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t-2 border-pixel-light"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-pixel-dark text-pixel-light">Or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <PixelButton color="red" className="w-full" disabled={isLoading}>
              <Google className="w-5 h-5 mr-2" />
              Google
            </PixelButton>
            <PixelButton color="green" className="w-full" disabled={isLoading}>
              <Github className="w-5 h-5 mr-2" />
              GitHub
            </PixelButton>
          </div>
        </PixelPanel>

        {error && <Toast message={error} type="error" onClose={() => setError(null)} />}
      </div>
    </div>
  )
}

function getAuthErrorMessage(errorCode: string): string {
  switch (errorCode) {
    case "auth/invalid-email":
      return "Invalid email address"
    case "auth/user-disabled":
      return "This account has been disabled"
    case "auth/user-not-found":
      return "No account found with this email"
    case "auth/wrong-password":
      return "Incorrect password"
    default:
      return "An error occurred during login"
  }
}

