"use client"

import { forwardRef } from "react"
import type { ButtonHTMLAttributes, ReactNode } from "react"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

export interface PixelButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  color?: "blue" | "green" | "orange" | "red" | "purple" | "yellow"
  size?: "small" | "medium" | "large"
  isLoading?: boolean
  loadingText?: string
  variant?: "default" | "outline"
}

const PixelButton = forwardRef<HTMLButtonElement, PixelButtonProps>(
  (
    {
      children,
      color = "blue",
      size = "medium",
      className = "",
      isLoading = false,
      loadingText,
      variant = "default",
      disabled,
      ...props
    },
    ref,
  ) => {
    const colorClasses = {
      blue: "bg-pixel-blue hover:bg-pixel-blue/90",
      green: "bg-pixel-green hover:bg-pixel-green/90",
      orange: "bg-pixel-orange hover:bg-pixel-orange/90",
      red: "bg-pixel-red hover:bg-pixel-red/90",
      purple: "bg-pixel-purple hover:bg-pixel-purple/90",
      yellow: "bg-pixel-yellow hover:bg-pixel-yellow/90",
    }

    const sizeClasses = {
      small: "text-xs px-3 py-1",
      medium: "text-sm px-4 py-2",
      large: "text-base px-6 py-3",
    }

    const variantClasses = {
      default: colorClasses[color],
      outline: "bg-transparent border-2 border-current hover:bg-pixel-light/10",
    }

    return (
      <button
        {...props}
        ref={ref}
        disabled={disabled || isLoading}
        data-color={color}
        className={cn(
          // Base styles
          "relative font-pixelFont text-pixel-light",
          "border-2 border-pixel-light rounded-md",
          "transition-all duration-100 ease-in-out",
          "flex items-center justify-center",
          // Shadow and transform effects
          "shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]",
          "hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)]",
          "hover:translate-x-[2px] hover:translate-y-[2px]",
          "active:shadow-[0px_0px_0px_0px_rgba(0,0,0,0.2)]",
          "active:translate-x-[4px] active:translate-y-[4px]",
          // Focus styles
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-pixel-blue focus-visible:ring-offset-2",
          // Disabled styles
          "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] disabled:hover:translate-x-0 disabled:hover:translate-y-0",
          // Loading animation
          isLoading && "animate-pulse",
          // Variant styles
          variantClasses[variant],
          // Size styles
          sizeClasses[size],
          className,
        )}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {loadingText || children}
          </>
        ) : (
          children
        )}
      </button>
    )
  },
)
PixelButton.displayName = "PixelButton"

export default PixelButton

