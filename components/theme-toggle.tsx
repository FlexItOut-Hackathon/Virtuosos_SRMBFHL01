"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "@/lib/theme-context"
import PixelButton from "./pixel-button"

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <PixelButton
      onClick={toggleTheme}
      variant="outline"
      size="small"
      className="w-9 h-9 p-0"
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
    >
      {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </PixelButton>
  )
}

