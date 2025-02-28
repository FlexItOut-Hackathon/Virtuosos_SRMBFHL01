"use client"

import { useEffect, useRef } from "react"
import * as poseDetection from "@tensorflow-models/pose-detection"
import * as tf from "@tensorflow/tfjs-core"
import "@tensorflow/tfjs-backend-webgl"
import "@tensorflow/tfjs-converter"

export default function WorkoutAI() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const setupCamera = async () => {
      if (!videoRef.current) return

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 640, height: 480 },
        })
        videoRef.current.srcObject = stream
        console.log("Camera stream started")
      } catch (error) {
        console.error("Error accessing camera:", error)
      }

      return new Promise((resolve) => {
        videoRef.current!.onloadedmetadata = () => {
          resolve(videoRef.current)
        }
      })
    }

    const loadModelAndDetectPose = async () => {
      await tf.setBackend('webgl')
      await tf.ready()

      const detector = await poseDetection.createDetector(
        poseDetection.SupportedModels.MoveNet,
        {
          modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING,
        }
      )

      const detectPose = async () => {
        if (!videoRef.current || !canvasRef.current) return

        const poses = await detector.estimatePoses(videoRef.current)
        drawPoses(poses)
        requestAnimationFrame(detectPose)
      }

      detectPose()
    }

    const drawPoses = (poses: poseDetection.Pose[]) => {
      const ctx = canvasRef.current!.getContext("2d")
      if (!ctx) return

      ctx.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height)

      poses.forEach((pose) => {
        pose.keypoints.forEach((keypoint) => {
          if (keypoint.score && keypoint.score > 0.5) {
            ctx.beginPath()
            ctx.arc(keypoint.x, keypoint.y, 5, 0, 2 * Math.PI)
            ctx.fillStyle = "red"
            ctx.fill()
          }
        })
      })
    }

    setupCamera().then(() => {
      videoRef.current!.play()
      loadModelAndDetectPose()
    })
  }, [])

  return (
    <div className="relative w-full h-full">
      <video ref={videoRef} className="hidden" autoPlay playsInline muted />
      <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" />
    </div>
  )
}

