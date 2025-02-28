'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

interface MotionDetectorProps {
  isActive: boolean;
  onExerciseDetected: (exercise: string, reps: number) => void;
  className?: string;
}

const EXERCISES = {
  SQUAT: 'SQUAT',
  PUSHUP: 'PUSHUP',
  JUMPING_JACK: 'JUMPING_JACK'
} as const;

const DETECTION_CONFIG = {
  SQUAT: {
    minMotion: 15,
    lowerToUpperRatio: 2.0,
    minDuration: 500,
    cooldown: 1000
  },
  PUSHUP: {
    minMotion: 10,
    balanceRatio: 0.8,
    minDuration: 800,
    cooldown: 1200
  },
  JUMPING_JACK: {
    minMotion: 25,
    symmetryThreshold: 0.7,
    minDuration: 400,
    cooldown: 800
  }
} as const;

type ExerciseType = keyof typeof DETECTION_CONFIG;

export default function BasicMotionDetector({
  isActive,
  onExerciseDetected,
  className = ''
}: MotionDetectorProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loading, setLoading] = useState(true);
  const [lastFrameData, setLastFrameData] = useState<ImageData | null>(null);
  const [isExercising, setIsExercising] = useState(false);
  const [repCount, setRepCount] = useState(0);
  const [debugInfo, setDebugInfo] = useState<string[]>([]);
  const [currentExercise, setCurrentExercise] = useState<ExerciseType | null>(null);
  const [exerciseStartTime, setExerciseStartTime] = useState<number>(0);
  const [lastRepTime, setLastRepTime] = useState<number>(0);
  const [exercisePhase, setExercisePhase] = useState<'up' | 'down' | 'none'>('none');

  // Camera setup
  useEffect(() => {
    if (!isActive) {
      // Cleanup when component becomes inactive
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
        videoRef.current.srcObject = null;
      }
      setLoading(true);
      setLastFrameData(null);
      return;
    }

    async function setupCamera() {
      if (!videoRef.current) return;
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user', width: 640, height: 480 },
          audio: false
        });
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play();
          setLoading(false);
        };
      } catch (error) {
        console.error('Error accessing camera:', error);
        setDebugInfo(prev => [...prev, `Camera Error: ${error.message}`]);
      }
    }

    setupCamera();

    // Cleanup when effect is re-run or component unmounts
    return () => {
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
        videoRef.current.srcObject = null;
      }
    };
  }, [isActive]);

  // Motion detection
  useEffect(() => {
    if (!isActive || loading) return;
    let animationFrame: number;

    function detectMotion() {
      if (!videoRef.current || !canvasRef.current) return;
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx || video.readyState !== 4) return;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const frame = ctx.getImageData(0, 0, canvas.width, canvas.height);
      
      if (lastFrameData) {
        const now = Date.now();
        let totalMotion = 0;
        let upperMotion = 0;
        let lowerMotion = 0;
        let leftMotion = 0;
        let rightMotion = 0;

        // Analyze frame in regions
        for (let y = 0; y < canvas.height; y++) {
          for (let x = 0; x < canvas.width; x++) {
            const i = (y * canvas.width + x) * 4;
            const diff = Math.abs(frame.data[i] - lastFrameData.data[i]);
            
            if (diff > 30) {
              totalMotion++;
              // Vertical regions
              if (y < canvas.height / 2) {
                upperMotion++;
              } else {
                lowerMotion++;
              }
              // Horizontal regions
              if (x < canvas.width / 2) {
                leftMotion++;
              } else {
                rightMotion++;
              }
            }
          }
        }

        const motionScore = (totalMotion / (canvas.width * canvas.height)) * 100;
        const upperToLowerRatio = upperMotion / (lowerMotion || 1);
        const symmetryScore = Math.min(leftMotion, rightMotion) / (Math.max(leftMotion, rightMotion) || 1);
        
        // Exercise detection with phases
        if (!isExercising && motionScore > DETECTION_CONFIG.SQUAT.minMotion) {
          const timeSinceLastRep = now - lastRepTime;
          
          if (timeSinceLastRep > DETECTION_CONFIG.SQUAT.cooldown) {
            // Start of new exercise
            if (lowerMotion > upperMotion * DETECTION_CONFIG.SQUAT.lowerToUpperRatio) {
              setIsExercising(true);
              setExerciseStartTime(now);
              setExercisePhase('down');
              setCurrentExercise('SQUAT');
            } else if (motionScore > DETECTION_CONFIG.JUMPING_JACK.minMotion && 
                      symmetryScore > DETECTION_CONFIG.JUMPING_JACK.symmetryThreshold) {
              setIsExercising(true);
              setExerciseStartTime(now);
              setExercisePhase('up');
              setCurrentExercise('JUMPING_JACK');
            } else if (upperToLowerRatio > DETECTION_CONFIG.PUSHUP.balanceRatio && 
                      motionScore < DETECTION_CONFIG.PUSHUP.minMotion * 1.5) {
              setIsExercising(true);
              setExerciseStartTime(now);
              setExercisePhase('down');
              setCurrentExercise('PUSHUP');
            }
          }
        } else if (isExercising) {
          const exerciseDuration = now - exerciseStartTime;
          
          // Check for exercise completion based on movement patterns
          if (currentExercise === 'SQUAT') {
            if (exercisePhase === 'down' && upperMotion > lowerMotion) {
              setExercisePhase('up');
            } else if (exercisePhase === 'up' && motionScore < DETECTION_CONFIG.SQUAT.minMotion / 2) {
              completeRep(now);
            }
          } else if (currentExercise === 'PUSHUP') {
            if (exercisePhase === 'down' && upperMotion > lowerMotion * 1.5) {
              setExercisePhase('up');
            } else if (exercisePhase === 'up' && motionScore < DETECTION_CONFIG.PUSHUP.minMotion / 2) {
              completeRep(now);
            }
          } else if (currentExercise === 'JUMPING_JACK') {
            if (exercisePhase === 'up' && motionScore < DETECTION_CONFIG.JUMPING_JACK.minMotion / 2) {
              completeRep(now);
            }
          }
        }

        // Update debug info
        setDebugInfo([
          `Motion: ${motionScore.toFixed(1)}%`,
          `Upper/Lower: ${upperToLowerRatio.toFixed(2)}`,
          `Symmetry: ${symmetryScore.toFixed(2)}`,
          `Exercise: ${currentExercise || 'None'}`,
          `Phase: ${exercisePhase}`,
          `Reps: ${repCount}`
        ]);

        // Visualize motion
        ctx.fillStyle = 'rgba(0, 255, 0, 0.2)';
        for (let y = 0; y < canvas.height; y++) {
          for (let x = 0; x < canvas.width; x++) {
            const i = (y * canvas.width + x) * 4;
            if (Math.abs(frame.data[i] - lastFrameData.data[i]) > 30) {
              ctx.fillRect(x, y, 4, 4);
            }
          }
        }
      }

      setLastFrameData(frame);
      animationFrame = requestAnimationFrame(detectMotion);
    }

    detectMotion();
    return () => cancelAnimationFrame(animationFrame);
  }, [isActive, loading, lastFrameData, isExercising, currentExercise, onExerciseDetected]);

  // Helper function to complete a rep
  function completeRep(now: number) {
    const exerciseDuration = now - exerciseStartTime;
    const minDuration = currentExercise ? DETECTION_CONFIG[currentExercise].minDuration : 0;
    
    if (exerciseDuration >= minDuration) {
      setRepCount(prev => {
        const newCount = prev + 1;
        onExerciseDetected(currentExercise!, newCount);
        return newCount;
      });
      setLastRepTime(now);
    }
    
    setIsExercising(false);
    setExercisePhase('none');
  }

  if (!isActive) return null;

  return (
    <div className={`relative ${className}`}>
      <video ref={videoRef} className="absolute inset-0 w-full h-full object-cover" autoPlay playsInline muted />
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full rounded-lg" />
      
      <div className="absolute top-4 left-4 bg-black/70 p-4 rounded-lg text-white font-mono text-sm">
        <h3 className="font-bold mb-2">Motion Detection:</h3>
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