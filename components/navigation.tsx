"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Home,
  Scroll,
  Trophy,
  User,
  Settings,
  Package,
  Users,
  Dumbbell,
  Menu,
  X,
  Sparkles,
  LogOut,
  LogIn,
  UserPlus,
} from "lucide-react"
import { useAuth } from "@/lib/auth-context"

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const { user, logOut } = useAuth()

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  const navItems = [
    { name: "Dashboard", icon: Home, href: "/" },
    { name: "Quest Log", icon: Scroll, href: "/quests" },
    { name: "Workout", icon: Dumbbell, href: "/workout" },
    { name: "AI Chat", icon: Sparkles, href: "/chat" },
    { name: "Guild", icon: Users, href: "/guild" },
    { name: "Leaderboard", icon: Trophy, href: "/leaderboard" },
    { name: "Shop", icon: Package, href: "/shop" },
    { name: "Character", icon: User, href: "/character" },
    { name: "Settings", icon: Settings, href: "/settings" },
  ]

  const isActive = (href: string) => {
    if (href === "/" && pathname !== "/") return false
    return pathname.startsWith(href)
  }

  const handleLogout = async () => {
    try {
      await logOut()
    } catch (error) {
      console.error("Failed to log out:", error)
    }
  }

  return (
    <>
      <button
        className="md:hidden fixed top-4 right-4 z-50 bg-pixel-blue p-2 rounded-md text-pixel-light"
        onClick={toggleMenu}
        aria-label={isOpen ? "Close menu" : "Open menu"}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <nav
        className={`
          fixed md:relative z-40 
          ${isOpen ? "left-0" : "-left-full"} 
          md:left-0 top-0 h-screen w-64 
          bg-pixel-dark border-r-2 border-pixel-light 
          transition-all duration-300 ease-in-out
          pixel-grid
        `}
      >
        <div className="p-4 border-b-2 border-pixel-light flex items-center justify-center">
          <Link href="/" className="block">
            <h1 className="text-2xl font-pixelFont text-pixel-light glow">
              PIXEL<span className="text-pixel-orange">QUEST</span>
            </h1>
          </Link>
        </div>

        <div className="p-4">
          {user ? (
            <div className="mb-6">
              <div className="flex items-center justify-center mb-2">
                <Link href="/character" className="block">
                  <div className="w-16 h-16 bg-pixel-blue rounded-md overflow-hidden border-2 border-pixel-light hover:border-pixel-blue transition-colors">
                    <img
                      src="./pixel.png"
                      alt="Pixel Character"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </Link>
              </div>
              <p className="text-center font-pixelFont text-pixel-light">LVL 8</p>
              <div className="w-full mt-2 pixel-progress rounded-md">
                <div className="pixel-progress-bar" style={{ width: "65%" }}></div>
              </div>
            </div>
          ) : (
            <div className="mb-6 space-y-2">
              <Link
                href="/login"
                className="w-full flex items-center justify-center p-2 bg-pixel-blue rounded-md font-pixelFont text-pixel-light hover:bg-pixel-blue/90 transition-colors"
              >
                <LogIn className="w-5 h-5 mr-2" />
                Login
              </Link>
              <Link
                href="/register"
                className="w-full flex items-center justify-center p-2 bg-pixel-green rounded-md font-pixelFont text-pixel-light hover:bg-pixel-green/90 transition-colors"
              >
                <UserPlus className="w-5 h-5 mr-2" />
                Sign Up
              </Link>
            </div>
          )}

          <ul className="space-y-2">
            {navItems.map((item) => {
              const active = isActive(item.href)
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`
                      flex items-center p-2 rounded-md transition-colors duration-200 font-pixelFont
                      ${active ? "bg-pixel-blue text-pixel-light" : "text-pixel-light hover:bg-pixel-blue/20"}
                    `}
                    onClick={() => setIsOpen(false)}
                  >
                    <item.icon className={`mr-2 h-5 w-5 ${active ? "animate-pulse" : ""}`} />
                    {item.name}
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>

        <div className="relative w-full p-4 mt-auto border-t-2 border-pixel-light">
          {user ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-pixel-green rounded-full border-2 border-pixel-light flex items-center justify-center">
                  <span className="font-pixelFont text-pixel-dark">7</span>
                </div>
                <span className="ml-2 font-pixelFont text-pixel-light">Day Streak</span>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 hover:bg-pixel-blue/20 rounded-md transition-colors"
                aria-label="Log out"
              >
                <LogOut className="w-5 h-5 text-pixel-light" />
              </button>
            </div>
          ) : (
            <p className="text-center text-sm text-pixel-light opacity-80">Login to start your fitness quest!</p>
          )}
        </div>
      </nav>
    </>
  )
}

