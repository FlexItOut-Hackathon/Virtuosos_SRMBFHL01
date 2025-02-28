"use client"

import type React from "react"
import { Pixelify_Sans } from "next/font/google"
import "./globals.css"
import Navigation from "@/components/navigation"
import { QuestProvider } from "@/lib/quest-context"
import { ChatProvider } from "@/lib/chat-context"
import { AuthProvider } from "@/lib/auth-context"
import { usePathname } from "next/navigation"
import { ThemeProvider } from "@/lib/theme-context"

const pixelifySans = Pixelify_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
})

export function RootLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAuthPage = pathname.startsWith("/login") || pathname.startsWith("/register")

  return (
    <AuthProvider>
      <ThemeProvider>
        <QuestProvider>
          <ChatProvider>
            <div className={`${pixelifySans.className} bg-pixel-dark text-pixel-light min-h-screen`}>
              <div className="flex flex-col md:flex-row min-h-screen">
                {!isAuthPage && <Navigation />}
                <main className="flex-1 p-4">{children}</main>
              </div>
            </div>
          </ChatProvider>
        </QuestProvider>
      </ThemeProvider>
    </AuthProvider>
  )
}

