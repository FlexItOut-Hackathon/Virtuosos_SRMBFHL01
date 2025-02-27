'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import * as tf from '@tensorflow/tfjs-core';
import '@tensorflow/tfjs-backend-webgl';
import * as poseDetection from '@tensorflow-models/pose-detection';

interface PoseDetectorProps {
  isActive: boolean;
  onExerciseDetected: (exercise: string, reps: number) => void;
  className?: string;
}

interface Point {
  x: number;
  y: number;
}

const drawPoint = (ctx: CanvasRenderingContext2D, point: Point, color: string) => {
  ctx.beginPath();
  ctx.arc(point.x, point.y, 4, 0, 2 * Math.PI);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2;
  ctx.stroke();
};

const drawLine = (ctx: CanvasRenderingContext2D, start: Point, end: Point, color: string) => {
  ctx.beginPath();
  ctx.moveTo(start.x, start.y);
  ctx.lineTo(end.x, end.y);
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.stroke();
};

export default function MediaPipePoseDetector({
  isActive,
  onExerciseDetected,
  className = ''
}: PoseDetectorProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const detectorRef = useRef<poseDetection.PoseDetector | null>(null);
  const [loading, setLoading] = useState(true);
  const [debugInfo, setDebugInfo] = useState<string[]>([]);

  useEffect(() => {
    if (!isActive) return;

    async function initializeDetector() {
      try {
        await tf.ready();
        await tf.setBackend('webgl');
        
        const detector = await poseDetection.createDetector(
          poseDetection.SupportedModels.BlazePose,
          {
            runtime: 'tfjs',
            modelType: 'lite',
            enableSmoothing: true
          }
        );
        detectorRef.current = detector;
        console.log('Pose detector initialized');

        // Start camera
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 640, height: 480 }
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            videoRef.current?.play();
            setLoading(false);
            startDetection();
          };
        }
      } catch (error) {
        console.error('Error initializing:', error);
        setDebugInfo(prev => [...prev, `Error: ${error instanceof Error ? error.message : String(error)}`]);
        setLoading(false);
      }
    }

    const startDetection = async () => {
      if (!videoRef.current || !canvasRef.current || !detectorRef.current) return;

      try {
        const poses = await detectorRef.current.estimatePoses(videoRef.current);
        
        const ctx = canvasRef.current.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
          ctx.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);

          // Draw detected poses
          poses.forEach(pose => {
            pose.keypoints.forEach(keypoint => {
              if (keypoint.score && keypoint.score > 0.3) {
                drawPoint(ctx, keypoint, '#00ff00');
              }
            });

            // Draw connections
            const connections = [
              [11, 13], [13, 15], // Left arm
              [12, 14], [14, 16], // Right arm
              [11, 12], // Shoulders
              [11, 23], [12, 24], // Torso
              [23, 24], // Hips
              [23, 25], [25, 27], // Left leg
              [24, 26], [26, 28], // Right leg
            ];

            connections.forEach(([i, j]) => {
              const kp1 = pose.keypoints[i];
              const kp2 = pose.keypoints[j];
              if (kp1.score && kp2.score && kp1.score > 0.3 && kp2.score > 0.3) {
                drawLine(ctx, kp1, kp2, '#00ff00');
              }
            });
          });

          // Update debug info
          if (poses.length > 0) {
            setDebugInfo([
              `Poses detected: ${poses.length}`,
              `Confidence: ${(poses[0].score || 0).toFixed(2)}`,
              `Keypoints: ${poses[0].keypoints.length}`
            ]);
          }
        }

        requestAnimationFrame(startDetection);
      } catch (error) {
        console.error('Detection error:', error);
        requestAnimationFrame(startDetection);
      }
    };

    initializeDetector();

    return () => {
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isActive]);

  if (!isActive) return null;

  return (
    <div className={`relative ${className}`}>
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        playsInline
        muted
      />
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full object-cover"
        width={640}
        height={480}
      />
      
      <div className="absolute top-4 left-4 bg-black/70 p-4 rounded-lg text-white font-mono text-sm">
        <h3 className="font-bold mb-2">Pose Detection Status:</h3>
        {debugInfo.map((info, i) => (
          <div key={i}>{info}</div>
        ))}
      </div>

      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg">
          <Loader2 className="w-8 h-8 text-white animate-spin" />
          <span className="ml-2 text-white">Starting camera...</span>
        </div>
      )}
    </div>
  );
} 