import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { RootLayoutContent } from "./RootLayoutContent"

export const metadata: Metadata = {
  title: "Pixel Quest Fitness",
  description: "A retro-themed fitness adventure",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <RootLayoutContent>{children}</RootLayoutContent>
      </body>
    </html>
  )
}

