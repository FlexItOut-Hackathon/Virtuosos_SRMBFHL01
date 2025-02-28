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
  bg-pixel-dark 
  border-2 border-pixel-light 
  rounded-lg
  p-3 sm:p-4 md:p-6
  shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]
  sm:shadow-[6px_6px_0px_0px_rgba(0,0,0,0.2)]
  md:shadow-[8px_8px_0px_0px_rgba(0,0,0,0.2)]
  transition-shadow duration-200
  ${className}
`}
    >
      {children}
    </div>
  )
}

