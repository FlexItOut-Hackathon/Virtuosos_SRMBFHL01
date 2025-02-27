"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"

interface CrystalBallProps {
  isThinking?: boolean
}

export function CrystalBall({ isThinking = false }: CrystalBallProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])

  class Particle {
    x: number
    y: number
    speed: number
    velocity: number
    size: number
    angle: number

    constructor(x: number, y: number) {
      this.x = x
      this.y = y
      this.speed = 0.5
      this.velocity = Math.random() * 2
      this.size = Math.random() * 3
      this.angle = Math.random() * 360
    }

    update(width: number, height: number) {
      this.angle += this.velocity
      this.x += Math.cos((this.angle * Math.PI) / 180) * this.speed
      this.y += Math.sin((this.angle * Math.PI) / 180) * this.speed

      if (this.x < 0 || this.x > width) this.angle = 180 - this.angle
      if (this.y < 0 || this.y > height) this.angle = 360 - this.angle
    }
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const setCanvasDimensions = () => {
      const size = Math.min(window.innerWidth * 0.8, 400)
      canvas.width = size
      canvas.height = size

      if (particlesRef.current.length === 0) {
        for (let i = 0; i < 50; i++) {
          particlesRef.current.push(new Particle(canvas.width / 2, canvas.height / 2))
        }
      }
    }

    setCanvasDimensions()
    window.addEventListener("resize", setCanvasDimensions)

    let animationFrameId: number
    let time = 0

    const draw = () => {
      time += 0.01

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const gradient = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        canvas.width * 0.25,
        canvas.width / 2,
        canvas.height / 2,
        canvas.width * 0.5,
      )

      gradient.addColorStop(0, `rgba(88, 101, 242, ${0.2 + Math.sin(time) * 0.1})`)
      gradient.addColorStop(0.7, `rgba(255, 0, 128, ${0.1 + Math.cos(time) * 0.05})`)
      gradient.addColorStop(1, "rgba(17, 24, 39, 0)")

      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.arc(canvas.width / 2, canvas.height / 2, canvas.width * 0.5, 0, Math.PI * 2)
      ctx.fill()

      if (isThinking) {
        ctx.globalAlpha = 0.6
        particlesRef.current.forEach((particle) => {
          particle.update(canvas.width, canvas.height)
          ctx.beginPath()
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
          ctx.fillStyle = "rgba(255, 0, 128, 0.5)"
          ctx.fill()
        })
        ctx.globalAlpha = 1
      }

      ctx.beginPath()
      ctx.arc(canvas.width / 2, canvas.height / 2, canvas.width * 0.3, 0, Math.PI * 2)

      const ballGradient = ctx.createRadialGradient(
        canvas.width * 0.4,
        canvas.height * 0.4,
        0,
        canvas.width / 2,
        canvas.height / 2,
        canvas.width * 0.3,
      )

      ballGradient.addColorStop(0, "rgba(255, 255, 255, 0.8)")
      ballGradient.addColorStop(0.2, `rgba(88, 101, 242, ${0.6 + Math.sin(time) * 0.1})`)
      ballGradient.addColorStop(1, "rgba(17, 24, 39, 0.7)")

      ctx.fillStyle = ballGradient
      ctx.fill()

      if (isThinking) {
        for (let i = 0; i < 3; i++) {
          const rippleSize = 0.1 + i * 0.05 + Math.sin(time * 2 + i) * 0.02

          ctx.beginPath()
          ctx.arc(canvas.width / 2, canvas.height / 2, canvas.width * rippleSize, 0, Math.PI * 2)
          ctx.strokeStyle = `rgba(255, 0, 128, ${0.7 - i * 0.2})`
          ctx.lineWidth = 2
          ctx.stroke()
        }
      }

      ctx.beginPath()
      ctx.arc(
        canvas.width * 0.4 + Math.sin(time) * 5,
        canvas.height * 0.4 + Math.cos(time) * 5,
        canvas.width * 0.05,
        0,
        Math.PI * 2,
      )
      ctx.fillStyle = "rgba(255, 255, 255, 0.6)"
      ctx.fill()

      animationFrameId = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      window.removeEventListener("resize", setCanvasDimensions)
      cancelAnimationFrame(animationFrameId)
    }
  }, [isThinking])

  return (
    <motion.div
      className="flex justify-center items-center"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <canvas ref={canvasRef} className="max-w-full" style={{ maxHeight: "400px" }} />
    </motion.div>
  )
} 