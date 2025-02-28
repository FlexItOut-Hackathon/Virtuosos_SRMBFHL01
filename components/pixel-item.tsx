import type { LucideIcon } from "lucide-react"
import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface PixelItemProps {
  name: string
  description?: ReactNode
  icon: LucideIcon
  rarity: "common" | "rare" | "epic" | "legendary"
  equipped?: boolean
  onClick?: () => void
  disabled?: boolean
  className?: string
}

export default function PixelItem({
  name,
  description,
  icon: Icon,
  rarity,
  equipped,
  onClick,
  disabled,
  className,
}: PixelItemProps) {
  const rarityConfig = {
    common: {
      borderColor: "border-pixel-green",
      bgColor: "bg-pixel-green/10",
      textColor: "text-pixel-green",
    },
    rare: {
      borderColor: "border-pixel-blue",
      bgColor: "bg-pixel-blue/10",
      textColor: "text-pixel-blue",
    },
    epic: {
      borderColor: "border-pixel-purple",
      bgColor: "bg-pixel-purple/10",
      textColor: "text-pixel-purple",
    },
    legendary: {
      borderColor: "border-pixel-yellow",
      bgColor: "bg-pixel-yellow/10",
      textColor: "text-pixel-yellow",
    },
  }

  return (
    <div
      className={cn(
        "relative p-4 border-2 rounded-lg transition-all cursor-pointer hover:scale-[1.02]",
        rarityConfig[rarity].borderColor,
        rarityConfig[rarity].bgColor,
        disabled && "opacity-50 cursor-not-allowed",
        className,
      )}
      onClick={disabled ? undefined : onClick}
    >
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "w-12 h-12 rounded-lg border-2 flex items-center justify-center",
            rarityConfig[rarity].borderColor,
            "bg-pixel-dark",
          )}
        >
          <Icon className={cn("w-6 h-6", rarityConfig[rarity].textColor)} />
        </div>
        <div className="flex-1">
          <h3 className="font-pixelFont text-pixel-light">{name}</h3>
          <div className="text-sm text-pixel-light opacity-80">{description}</div>
        </div>
      </div>
      {equipped && (
        <div className="absolute top-2 right-2 px-2 py-1 text-xs rounded-md bg-pixel-green text-pixel-light">
          Equipped
        </div>
      )}
    </div>
  )
}

