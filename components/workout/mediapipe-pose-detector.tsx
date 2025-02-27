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

interface ExerciseState {
  type: string | null;
  count: number;
  lastDetectedTime: number;
  confidence: number;
  phase: 'up' | 'down' | 'middle' | 'none' | 'open' | 'closed';
}

// Add exercise detection thresholds
const EXERCISE_CONFIG = {
  pushup: {
    armAngleThreshold: 90,
    minConfidence: 0.5,
    cooldown: 1000,
  },
  squat: {
    kneeAngleThreshold: 130,
    hipAngleThreshold: 120,
    minConfidence: 0.5,
    cooldown: 1000,
  },
  jumping_jack: {
    armSpreadThreshold: 120,
    legSpreadThreshold: 50,
    minConfidence: 0.5,
    cooldown: 500,
  },
};

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

const calculateAngle = (pointA: Point, pointB: Point, pointC: Point): number => {
  const vectorAB = {
    x: pointB.x - pointA.x,
    y: pointB.y - pointA.y,
  };

  const vectorBC = {
    x: pointC.x - pointB.x,
    y: pointC.y - pointB.y,
  };

  const dotProduct = vectorAB.x * vectorBC.x + vectorAB.y * vectorBC.y;
  const magnitudeAB = Math.sqrt(vectorAB.x * vectorAB.x + vectorAB.y * vectorAB.y);
  const magnitudeBC = Math.sqrt(vectorBC.x * vectorBC.x + vectorBC.y * vectorBC.y);

  const angle = Math.acos(dotProduct / (magnitudeAB * magnitudeBC));
  return angle * (180 / Math.PI);
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
  const [exerciseState, setExerciseState] = useState<ExerciseState>({
    type: null,
    count: 0,
    lastDetectedTime: 0,
    confidence: 0,
    phase: 'none'
  });

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

    const logExerciseToServer = async (exerciseType: string, repetitions: number, confidence: number) => {
      try {
        const response = await fetch('/api/exercises', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            timestamp: Date.now(),
            exerciseType,
            repetitions,
            confidence
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to log exercise');
        }

        // Call the callback to update quests
        onExerciseDetected(exerciseType, repetitions);
      } catch (error) {
        console.error('Failed to log exercise:', error);
      }
    };

    const detectExercise = (pose: poseDetection.Pose) => {
      const poseScore = pose.score ?? 0;
      if (!pose.keypoints || poseScore < 0.5) return;

      const now = Date.now();
      const timeSinceLastDetection = now - exerciseState.lastDetectedTime;

      // Get relevant keypoints
      const leftShoulder = pose.keypoints[11];
      const rightShoulder = pose.keypoints[12];
      const leftElbow = pose.keypoints[13];
      const rightElbow = pose.keypoints[14];
      const leftWrist = pose.keypoints[15];
      const rightWrist = pose.keypoints[16];
      const leftHip = pose.keypoints[23];
      const rightHip = pose.keypoints[24];
      const leftKnee = pose.keypoints[25];
      const rightKnee = pose.keypoints[26];
      const leftAnkle = pose.keypoints[27];
      const rightAnkle = pose.keypoints[28];

      // Helper function to check if keypoints are valid
      const areKeypointsValid = (points: poseDetection.Keypoint[]) => {
        return points.every(point => point && point.score && point.score > 0.5);
      };

      // Push-up detection
      if (areKeypointsValid([leftShoulder, leftElbow, leftWrist, rightShoulder, rightElbow, rightWrist])) {
        const leftArmAngle = calculateAngle(leftShoulder, leftElbow, leftWrist);
        const rightArmAngle = calculateAngle(rightShoulder, rightElbow, rightWrist);

        if (exerciseState.type === null || exerciseState.type === 'pushup') {
          if (leftArmAngle > 150 && rightArmAngle > 150 && exerciseState.phase !== 'up') {
            setExerciseState(prev => ({
              ...prev,
              type: 'pushup',
              phase: 'up'
            }));
          } else if (leftArmAngle < EXERCISE_CONFIG.pushup.armAngleThreshold && 
                     rightArmAngle < EXERCISE_CONFIG.pushup.armAngleThreshold && 
                     exerciseState.phase === 'up' && 
                     timeSinceLastDetection > EXERCISE_CONFIG.pushup.cooldown) {
            setExerciseState(prev => {
              const newCount = prev.count + 1;
              if (newCount % 5 === 0) {
                logExerciseToServer('pushup', 5, poseScore);
              }
              return {
                type: 'pushup',
                count: newCount,
                lastDetectedTime: now,
                confidence: poseScore,
                phase: 'down'
              };
            });
          }
        }
      }

      // Squat detection
      if (areKeypointsValid([leftHip, leftKnee, leftAnkle, rightHip, rightKnee, rightAnkle])) {
        const leftKneeAngle = calculateAngle(leftHip, leftKnee, leftAnkle);
        const rightKneeAngle = calculateAngle(rightHip, rightKnee, rightAnkle);
        const hipAngle = calculateAngle(leftShoulder, leftHip, leftKnee);

        if (exerciseState.type === null || exerciseState.type === 'squat') {
          if (leftKneeAngle > 150 && rightKneeAngle > 150 && exerciseState.phase !== 'up') {
            setExerciseState(prev => ({
              ...prev,
              type: 'squat',
              phase: 'up'
            }));
          } else if (leftKneeAngle < EXERCISE_CONFIG.squat.kneeAngleThreshold && 
                     rightKneeAngle < EXERCISE_CONFIG.squat.kneeAngleThreshold && 
                     hipAngle < EXERCISE_CONFIG.squat.hipAngleThreshold && 
                     exerciseState.phase === 'up' && 
                     timeSinceLastDetection > EXERCISE_CONFIG.squat.cooldown) {
            setExerciseState(prev => {
              const newCount = prev.count + 1;
              if (newCount % 5 === 0) {
                logExerciseToServer('squat', 5, poseScore);
              }
              return {
                type: 'squat',
                count: newCount,
                lastDetectedTime: now,
                confidence: poseScore,
                phase: 'down'
              };
            });
          }
        }
      }

      // Jumping jack detection
      if (areKeypointsValid([leftShoulder, rightShoulder, leftHip, rightHip, leftAnkle, rightAnkle])) {
        const armSpread = Math.abs(leftShoulder.x - rightShoulder.x);
        const legSpread = Math.abs(leftAnkle.x - rightAnkle.x);
        const normalizedArmSpread = (armSpread / (pose.keypoints[0].y - leftHip.y)) * 100;
        const normalizedLegSpread = (legSpread / (pose.keypoints[0].y - leftHip.y)) * 100;

        if (exerciseState.type === null || exerciseState.type === 'jumping_jack') {
          if (normalizedArmSpread < 50 && normalizedLegSpread < 30 && exerciseState.phase !== 'closed') {
            setExerciseState(prev => ({
              ...prev,
              type: 'jumping_jack',
              phase: 'closed'
            }));
          } else if (normalizedArmSpread > EXERCISE_CONFIG.jumping_jack.armSpreadThreshold && 
                     normalizedLegSpread > EXERCISE_CONFIG.jumping_jack.legSpreadThreshold && 
                     exerciseState.phase === 'closed' && 
                     timeSinceLastDetection > EXERCISE_CONFIG.jumping_jack.cooldown) {
            setExerciseState(prev => {
              const newCount = prev.count + 1;
              if (newCount % 5 === 0) {
                logExerciseToServer('jumping_jack', 5, poseScore);
              }
              return {
                type: 'jumping_jack',
                count: newCount,
                lastDetectedTime: now,
                confidence: poseScore,
                phase: 'open'
              };
            });
          }
        }
      }
    };

    const startDetection = async () => {
      if (!videoRef.current || !canvasRef.current || !detectorRef.current) return;

      try {
        const poses = await detectorRef.current.estimatePoses(videoRef.current);
        
        const ctx = canvasRef.current.getContext('2d');
        if (ctx && poses.length > 0) {
          ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
          ctx.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);

          // Draw poses
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

            // Detect exercises
            detectExercise(pose);
          });

          // Update debug info
          setDebugInfo([
            `Poses detected: ${poses.length}`,
            `Confidence: ${(poses[0].score || 0).toFixed(2)}`,
            `Exercise: ${exerciseState.type || 'None'}`,
            `Count: ${exerciseState.count}`
          ]);
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