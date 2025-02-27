import { User } from "lucide-react"

type PixelAvatarProps = {
  size?: "small" | "medium" | "large"
  image?: string
}

export default function PixelAvatar({
  size = "medium",
  image = "./pixel.png",
}: PixelAvatarProps) {
  const sizeClasses = {
    small: "w-10 h-10",
    medium: "w-16 h-16",
    large: "w-24 h-24",
  }

  return (
    <div
      className={`
      ${sizeClasses[size]} 
      bg-pixel-blue rounded-md overflow-hidden 
      border-2 border-pixel-light
      relative
    `}
    >
      {image ? (
        <img src={image || "/placeholder.svg"} alt="Pixel Character" className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <User className="text-pixel-light" />
        </div>
      )}
    </div>
  )
}

