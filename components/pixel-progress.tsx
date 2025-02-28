type PixelProgressProps = {
  value: number
  color?: string
  height?: string
}

export default function PixelProgress({ value, color = "pixel-green", height = "h-4" }: PixelProgressProps) {
  return (
    <div className={`${height} bg-pixel-dark border-2 border-pixel-light overflow-hidden rounded-md`}>
      <div
        className={`h-full bg-${color} transition-all duration-500 ease-out`}
        style={{
          width: `${value}%`,
          backgroundImage: `linear-gradient(
            45deg,
            rgba(255, 255, 255, 0.15) 25%,
            transparent 25%,
            transparent 50%,
            rgba(255, 255, 255, 0.15) 50%,
            rgba(255, 255, 255, 0.15) 75%,
            transparent 75%,
            transparent
          )`,
          backgroundSize: "16px 16px",
          animation: "progress-animation 1s linear infinite",
        }}
      ></div>
    </div>
  )
}

