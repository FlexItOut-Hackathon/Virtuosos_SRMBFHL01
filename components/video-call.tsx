"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { Camera, AlertCircle } from "lucide-react"
import PixelButton from "./pixel-button"

export default function VideoCall() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)

  const checkPermission = async () => {
    try {
      const result = await navigator.permissions.query({ name: "camera" as PermissionName })
      return result.state === "granted"
    } catch {
      // Fallback for browsers that don't support permission query
      return null
    }
  }

  const setupCamera = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      // First check permission
      const permissionStatus = await checkPermission()
      setHasPermission(permissionStatus)

      // Try different constraints in order of preference
      const constraints = [
        {
          video: {
            width: { ideal: 1280 },
            height: { ideal: 720 },
            facingMode: "user",
          },
        },
        {
          video: {
            width: { ideal: 640 },
            height: { ideal: 480 },
          },
        },
        { video: true },
      ]

      let stream: MediaStream | null = null
      let lastError: Error | null = null

      // Try each constraint until one works
      for (const constraint of constraints) {
        try {
          stream = await navigator.mediaDevices.getUserMedia(constraint)
          break
        } catch (e) {
          lastError = e as Error
          continue
        }
      }

      if (!stream) {
        throw lastError || new Error("Could not access camera with any configuration")
      }

      if (videoRef.current) {
        videoRef.current.srcObject = stream

        // Wait for video to be ready
        await new Promise<void>((resolve, reject) => {
          if (!videoRef.current) return reject(new Error("Video element not found"))

          videoRef.current.onloadedmetadata = () => {
            videoRef.current
              ?.play()
              .then(() => resolve())
              .catch(reject)
          }

          videoRef.current.onerror = () => {
            reject(new Error("Video failed to initialize"))
          }
        })
      }
    } catch (err) {
      let message = "Unable to access camera"

      if (err instanceof Error) {
        if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
          message = "Camera access denied. Please grant permission and try again."
        } else if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
          message = "No camera found. Please connect a camera and try again."
        } else if (err.name === "NotReadableError" || err.name === "TrackStartError") {
          message = "Camera is in use by another application."
        } else {
          message = `Camera error: ${err.message}`
        }
      }

      setError(message)
      console.error("Camera access error:", { name: err.name, message: err.message })
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    setupCamera()

    return () => {
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
        tracks.forEach((track) => {
          track.stop()
          track.enabled = false
        })
      }
    }
  }, [setupCamera])

  const handleRetry = async () => {
    // Clean up previous stream
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
      tracks.forEach((track) => track.stop())
      videoRef.current.srcObject = null
    }

    await setupCamera()
  }

  if (error) {
    return (
      <div className="relative h-full flex flex-col items-center justify-center bg-pixel-dark/50 rounded-lg border-2 border-pixel-light p-4">
        <AlertCircle className="w-12 h-12 text-pixel-red mb-4 animate-pulse" />
        <p className="text-pixel-light text-center mb-4 font-pixelFont">{error}</p>
        <PixelButton onClick={handleRetry} color="blue">
          <Camera className="mr-2 w-4 h-4" />
          Retry Camera Access
        </PixelButton>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="relative h-full flex items-center justify-center bg-pixel-dark/50 rounded-lg border-2 border-pixel-light">
        <div className="animate-pulse text-pixel-light font-pixelFont">
          {hasPermission === false ? "Waiting for camera permission..." : "Initializing camera..."}
        </div>
      </div>
    )
  }

  return (
    <div className="relative h-full">
      <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover rounded-lg" />
    </div>
  )
}

