"use client"

import type React from "react"

import Link from "next/link"
import { useState } from "react"
import { UserPlus, Mail, Lock, User, Github, ChromeIcon as Google, Gamepad, Star, Shield } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import PixelPanel from "@/components/pixel-panel"
import PixelButton from "@/components/pixel-button"
import { Toast, ToastProvider } from "@/components/ui/toast"

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { signUp } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    try {
      await signUp(formData.email, formData.password)
    } catch (error: any) {
      setError(getAuthErrorMessage(error.message))
    } finally {
      setIsLoading(false)
    }
  }

  const handleNext = () => {
    if (currentStep === 1 && (!formData.username || !formData.email)) {
      setError("Please fill in all fields")
      return
    }
    if (currentStep === 2 && (!formData.password || !formData.confirmPassword)) {
      setError("Please fill in all fields")
      return
    }
    setError(null)
    setCurrentStep((prev) => prev + 1)
  }

  const handlePrevious = () => {
    setError(null)
    setCurrentStep((prev) => prev - 1)
  }

  return (
    <ToastProvider>
      <div className="min-h-screen flex items-center justify-center p-4 bg-pixel-dark">
        <div className="w-full max-w-md space-y-8">
          <PixelPanel className="relative overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-pixel-blue/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-pixel-purple/20 rounded-full blur-3xl"></div>

            <div className="relative">
              <div className="text-center mb-8">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-pixel-blue rounded-lg border-4 border-pixel-light flex items-center justify-center animate-pixel-float">
                    <Gamepad className="w-8 h-8 text-pixel-light" />
                  </div>
                </div>
                <h1 className="text-3xl font-pixelFont text-pixel-light mb-2">Begin Your Quest</h1>
                <p className="text-pixel-light opacity-80">Create your fitness adventure account</p>
              </div>

              {/* Progress Bar */}
              <div className="mb-8">
                <div className="flex justify-between mb-2">
                  {[1, 2, 3].map((step) => (
                    <div
                      key={step}
                      className={`w-8 h-8 rounded-lg border-2 flex items-center justify-center ${
                        step === currentStep
                          ? "bg-pixel-blue border-pixel-light"
                          : step < currentStep
                            ? "bg-pixel-green border-pixel-light"
                            : "bg-pixel-dark border-pixel-light opacity-50"
                      }`}
                    >
                      <span className="font-pixelFont text-pixel-light">{step}</span>
                    </div>
                  ))}
                </div>
                <div className="h-2 bg-pixel-dark border-2 border-pixel-light rounded-full overflow-hidden">
                  <div
                    className="h-full bg-pixel-blue transition-all duration-300"
                    style={{ width: `${((currentStep - 1) / 2) * 100}%` }}
                  ></div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {currentStep === 1 && (
                  <div className="space-y-4 animate-fadeIn">
                    <div>
                      <label className="block font-pixelFont text-pixel-light mb-1">Choose Your Username</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-pixel-light opacity-50" />
                        <input
                          type="text"
                          value={formData.username}
                          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                          className="w-full bg-pixel-dark border-2 border-pixel-light rounded-md px-10 py-2 font-pixelFont text-pixel-light focus:outline-none focus:border-pixel-blue"
                          placeholder="Enter your username"
                          required
                          disabled={isLoading}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-pixelFont text-pixel-light mb-1">Email</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-pixel-light opacity-50" />
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full bg-pixel-dark border-2 border-pixel-light rounded-md px-10 py-2 font-pixelFont text-pixel-light focus:outline-none focus:border-pixel-blue"
                          placeholder="Enter your email"
                          required
                          disabled={isLoading}
                        />
                      </div>
                    </div>

                    <PixelButton type="button" className="w-full" onClick={handleNext} disabled={isLoading}>
                      Next Step
                    </PixelButton>
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="space-y-4 animate-fadeIn">
                    <div>
                      <label className="block font-pixelFont text-pixel-light mb-1">Password</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-pixel-light opacity-50" />
                        <input
                          type="password"
                          value={formData.password}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                          className="w-full bg-pixel-dark border-2 border-pixel-light rounded-md px-10 py-2 font-pixelFont text-pixel-light focus:outline-none focus:border-pixel-blue"
                          placeholder="Create a password"
                          required
                          minLength={6}
                          disabled={isLoading}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-pixelFont text-pixel-light mb-1">Confirm Password</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-pixel-light opacity-50" />
                        <input
                          type="password"
                          value={formData.confirmPassword}
                          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                          className="w-full bg-pixel-dark border-2 border-pixel-light rounded-md px-10 py-2 font-pixelFont text-pixel-light focus:outline-none focus:border-pixel-blue"
                          placeholder="Confirm your password"
                          required
                          minLength={6}
                          disabled={isLoading}
                        />
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <PixelButton
                        type="button"
                        variant="outline"
                        className="flex-1"
                        onClick={handlePrevious}
                        disabled={isLoading}
                      >
                        Back
                      </PixelButton>
                      <PixelButton type="button" className="flex-1" onClick={handleNext} disabled={isLoading}>
                        Next Step
                      </PixelButton>
                    </div>
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="space-y-6 animate-fadeIn">
                    <div className="text-center">
                      <h2 className="text-xl font-pixelFont text-pixel-light mb-2">Choose Your Path</h2>
                      <p className="text-pixel-light opacity-80">Select your initial fitness focus</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <button
                        type="button"
                        className="p-4 bg-pixel-dark border-2 border-pixel-light rounded-lg hover:border-pixel-blue focus:border-pixel-blue transition-colors"
                        disabled={isLoading}
                      >
                        <Shield className="w-8 h-8 text-pixel-blue mx-auto mb-2" />
                        <div className="font-pixelFont text-pixel-light">Strength</div>
                      </button>
                      <button
                        type="button"
                        className="p-4 bg-pixel-dark border-2 border-pixel-light rounded-lg hover:border-pixel-blue focus:border-pixel-blue transition-colors"
                        disabled={isLoading}
                      >
                        <Star className="w-8 h-8 text-pixel-yellow mx-auto mb-2" />
                        <div className="font-pixelFont text-pixel-light">Cardio</div>
                      </button>
                    </div>

                    <div className="flex gap-2">
                      <PixelButton
                        type="button"
                        variant="outline"
                        className="flex-1"
                        onClick={handlePrevious}
                        disabled={isLoading}
                      >
                        Back
                      </PixelButton>
                      <PixelButton type="submit" className="flex-1" isLoading={isLoading}>
                        <UserPlus className="w-5 h-5 mr-2" />
                        Create Account
                      </PixelButton>
                    </div>

                    {/* Starting Rewards Preview */}
                    <div className="p-4 bg-pixel-dark border-2 border-pixel-light rounded-lg">
                      <h3 className="font-pixelFont text-pixel-light mb-2">Starting Rewards</h3>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Star className="w-4 h-4 text-pixel-yellow" />
                          <span className="text-pixel-light">500 XP Welcome Bonus</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Shield className="w-4 h-4 text-pixel-blue" />
                          <span className="text-pixel-light">Starter Equipment Pack</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Gamepad className="w-4 h-4 text-pixel-green" />
                          <span className="text-pixel-light">Beginner's Badge</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </form>

              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t-2 border-pixel-light"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-pixel-dark text-pixel-light">Or register with</span>
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

              <p className="mt-6 text-center text-sm text-pixel-light">
                Already have an account?{" "}
                <Link href="/login" className="text-pixel-blue hover:underline">
                  Log in
                </Link>
              </p>
            </div>
          </PixelPanel>

          {error && <Toast message={error} type="error" />}
        </div>
      </div>
    </ToastProvider>
  )
}

function getAuthErrorMessage(error: string): string {
  if (error.includes("auth/email-already-in-use")) return "Email already in use"
  if (error.includes("auth/invalid-email")) return "Invalid email address"
  if (error.includes("auth/operation-not-allowed")) return "Email/password accounts are not enabled"
  if (error.includes("auth/weak-password")) return "Password should be at least 6 characters"
  return "An error occurred during registration"
}

