import type { ReactNode } from "react"

type PixelPanelProps = {
  children: ReactNode
  className?: string
}

export default function PixelPanel({ children, className = "" }: PixelPanelProps) {
  return (
    <div
      className={`
        w-full
        pixel-panel
        rounded-lg
        p-3 sm:p-4 md:p-6
        pixel-shadow
        transition-shadow duration-200
        ${className}
      `}
    >
      {children}
    </div>
  )
}

