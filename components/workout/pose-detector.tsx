'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import * as poseDetection from '@tensorflow-models/pose-detection';
import '@mediapipe/pose';

interface PoseDetectorProps {
  isActive: boolean;
  className?: string;
  exerciseType: 'armRaise' | 'pushup' | 'squat' | 'jumpingJack' | 'crunch' | 
                'lunge' | 'sideBend' | 'highKnees' | 'armCircles' | 'mountainClimber';
  onExerciseUpdate?: (exercise: string, reps: number) => void;
}

const calculateAngle = (a: poseDetection.Keypoint, b: poseDetection.Keypoint, c: poseDetection.Keypoint) => {
  if (!a || !b || !c) return 0;
  
  const radians = Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x);
  let angle = Math.abs(radians * 180.0 / Math.PI);
  
  if (angle > 180.0) {
    angle = 360 - angle;
  }
  return angle;
};

const drawLine = (ctx: CanvasRenderingContext2D, start: poseDetection.Keypoint, end: poseDetection.Keypoint) => {
  if (start.score && end.score && start.score > 0.3 && end.score > 0.3) {
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.stroke();
  }
};

const detectArmRaise = (keypoints: poseDetection.Keypoint[], state: { phase: string, repCount: number, name: string }) => {
  const leftShoulder = keypoints[11];
  const leftWrist = keypoints[15];
  const rightShoulder = keypoints[12];
  const rightWrist = keypoints[16];

  // Check if wrists are above shoulders
  const leftArmRaised = leftWrist?.y < (leftShoulder?.y - 50);
  const rightArmRaised = rightWrist?.y < (rightShoulder?.y - 50);
  const armsRaised = leftArmRaised || rightArmRaised;

  const newState = {
    name: 'armRaise',
    phase: state.phase,
    repCount: state.repCount
  };

  // State machine logic
  if (state.phase === 'down' && armsRaised) {
    newState.phase = 'up';
    newState.repCount = state.repCount + 1;
    console.log('Rep counted:', newState.repCount);
  } else if (state.phase === 'up' && !armsRaised) {
    newState.phase = 'down';
    console.log('Reset to down position');
  }

  return newState;
};

const detectPushup = (keypoints: poseDetection.Keypoint[], state: { phase: string, repCount: number, name: string }) => {
  // Get key points
  const leftShoulder = keypoints[11];
  const rightShoulder = keypoints[12];
  const leftElbow = keypoints[13];
  const rightElbow = keypoints[14];
  const leftWrist = keypoints[15];
  const rightWrist = keypoints[16];

  // Check if key points are detected
  const requiredPoints = [
    leftShoulder, rightShoulder, 
    leftElbow, rightElbow,
    leftWrist, rightWrist
  ];
  
  if (!requiredPoints.every(point => point?.score && point.score > 0.2)) {
    return state;
  }

  // Calculate arm angles
  const leftArmAngle = calculateAngle(leftShoulder, leftElbow, leftWrist);
  const rightArmAngle = calculateAngle(rightShoulder, rightElbow, rightWrist);
  const armAngle = Math.min(leftArmAngle, rightArmAngle);

  console.log('Pushup metrics:', {
    armAngle,
    phase: state.phase,
    repCount: state.repCount
  });

  // Create new state to avoid mutations
  const newState = {
    name: 'pushup',
    phase: state.phase,
    repCount: state.repCount
  };

  // Simplified pushup detection logic
  if (armAngle < 90) { // Arms bent
    if (state.phase === 'up') {
      newState.phase = 'down';
      console.log('Pushup: Entering down phase');
    }
  } else if (armAngle > 160) { // Arms straight
    if (state.phase === 'down') {
      newState.phase = 'up';
      newState.repCount = state.repCount + 1;
      console.log('Pushup: Rep counted:', newState.repCount);
    }
  }

  return newState;
};

const detectSquat = (keypoints: poseDetection.Keypoint[], state: { phase: string, repCount: number, name: string }) => {
  // Get key points for squat detection
  const leftHip = keypoints[23];
  const rightHip = keypoints[24];
  const leftKnee = keypoints[25];
  const rightKnee = keypoints[26];
  const leftAnkle = keypoints[27];
  const rightAnkle = keypoints[28];

  // Check if key points are detected
  const requiredPoints = [
    leftHip, rightHip,
    leftKnee, rightKnee,
    leftAnkle, rightAnkle
  ];
  
  if (!requiredPoints.every(point => point?.score && point.score > 0.2)) {
    return state;
  }

  // Calculate knee angles
  const leftKneeAngle = calculateAngle(leftHip, leftKnee, leftAnkle);
  const rightKneeAngle = calculateAngle(rightHip, rightKnee, rightAnkle);
  const kneeAngle = Math.min(leftKneeAngle, rightKneeAngle);

  console.log('Squat metrics:', {
    kneeAngle,
    phase: state.phase,
    repCount: state.repCount
  });

  const newState = {
    name: 'squat',
    phase: state.phase,
    repCount: state.repCount
  };

  // Squat detection logic
  if (kneeAngle < 130) { // Knees bent - squat position
    if (state.phase === 'up') {
      newState.phase = 'down';
      console.log('Squat: Entering down phase');
    }
  } else if (kneeAngle > 160) { // Knees straight - standing
    if (state.phase === 'down') {
      newState.phase = 'up';
      newState.repCount = state.repCount + 1;
      console.log('Squat: Rep counted:', newState.repCount);
    }
  }

  return newState;
};

const detectJumpingJack = (keypoints: poseDetection.Keypoint[], state: { phase: string, repCount: number, name: string }) => {
  // Get key points for jumping jack detection
  const leftShoulder = keypoints[11];
  const rightShoulder = keypoints[12];
  const leftWrist = keypoints[15];
  const rightWrist = keypoints[16];
  const leftAnkle = keypoints[27];
  const rightAnkle = keypoints[28];

  // Check if key points are detected
  const requiredPoints = [
    leftShoulder, rightShoulder, leftWrist, rightWrist,
    leftAnkle, rightAnkle
  ];
  
  if (!requiredPoints.every(point => point?.score && point.score > 0.2)) {
    return state;
  }

  // Calculate distances for arms and legs
  const armsDistance = Math.abs(leftWrist.x - rightWrist.x);
  const legsDistance = Math.abs(leftAnkle.x - rightAnkle.x);
  const shoulderWidth = Math.abs(leftShoulder.x - rightShoulder.x);
  
  // Normalize distances relative to shoulder width
  const normalizedArmsDistance = armsDistance / shoulderWidth;
  const normalizedLegsDistance = legsDistance / shoulderWidth;

  console.log('Jumping Jack metrics:', {
    normalizedArmsDistance,
    normalizedLegsDistance,
    phase: state.phase,
    repCount: state.repCount
  });

  const newState = {
    name: 'jumpingJack',
    phase: state.phase,
    repCount: state.repCount
  };

  // More lenient thresholds for jumping jacks
  const ARMS_THRESHOLD = 1.5;  // Arms raised wider than shoulders
  const LEGS_THRESHOLD = 1.2;  // Legs spread wider than shoulders

  // Jumping jack detection logic
  if (state.phase === 'closed') {
    // Check for jump out position
    if (normalizedArmsDistance > ARMS_THRESHOLD && normalizedLegsDistance > LEGS_THRESHOLD) {
      newState.phase = 'open';
      newState.repCount = state.repCount + 1;
      console.log('Jumping Jack: Rep counted:', newState.repCount);
    }
  } else if (state.phase === 'open') {
    // Check for return to starting position
    if (normalizedArmsDistance < 1.0 && normalizedLegsDistance < 0.8) {
      newState.phase = 'closed';
      console.log('Jumping Jack: Reset to closed position');
    }
  }

  return newState;
};

const detectCrunch = (keypoints: poseDetection.Keypoint[], state: { phase: string, repCount: number, name: string }) => {
  // Get key points for crunch detection
  const leftShoulder = keypoints[11];
  const rightShoulder = keypoints[12];
  const leftHip = keypoints[23];
  const rightHip = keypoints[24];
  const leftKnee = keypoints[25];
  const rightKnee = keypoints[26];

  // Check if key points are detected
  const requiredPoints = [
    leftShoulder, rightShoulder,
    leftHip, rightHip,
    leftKnee, rightKnee
  ];
  
  if (!requiredPoints.every(point => point?.score && point.score > 0.2)) {
    return state;
  }

  // Calculate angles for crunch detection
  const leftTrunkAngle = calculateAngle(leftKnee, leftHip, leftShoulder);
  const rightTrunkAngle = calculateAngle(rightKnee, rightHip, rightShoulder);
  const trunkAngle = Math.min(leftTrunkAngle, rightTrunkAngle);

  console.log('Crunch metrics:', {
    trunkAngle,
    phase: state.phase,
    repCount: state.repCount
  });

  const newState = {
    name: 'crunch',
    phase: state.phase,
    repCount: state.repCount
  };

  // Crunch detection logic
  if (trunkAngle < 60) { // Upper body raised - crunch position
    if (state.phase === 'down') {
      newState.phase = 'up';
      newState.repCount = state.repCount + 1;
      console.log('Crunch: Rep counted:', newState.repCount);
    }
  } else if (trunkAngle > 80) { // Upper body lowered - starting position
    if (state.phase === 'up') {
      newState.phase = 'down';
      console.log('Crunch: Reset to down position');
    }
  }

  return newState;
};

const detectLunge = (keypoints: poseDetection.Keypoint[], state: { phase: string, repCount: number, name: string }) => {
  // Get both legs' keypoints
  const leftHip = keypoints[23];
  const rightHip = keypoints[24];
  const leftKnee = keypoints[25];
  const rightKnee = keypoints[26];
  const leftAnkle = keypoints[27];
  const rightAnkle = keypoints[28];

  // Check if key points are detected
  const requiredPoints = [
    leftHip, rightHip, leftKnee, rightKnee, leftAnkle, rightAnkle
  ];
  
  if (!requiredPoints.every(point => point?.score && point.score > 0.2)) {
    return state;
  }

  // Calculate angles for both knees
  const leftKneeAngle = calculateAngle(leftHip, leftKnee, leftAnkle);
  const rightKneeAngle = calculateAngle(rightHip, rightKnee, rightAnkle);
  
  // Use the smaller angle (more bent knee) for detection
  const kneeAngle = Math.min(leftKneeAngle, rightKneeAngle);

  console.log('Lunge metrics:', {
    leftKneeAngle,
    rightKneeAngle,
    phase: state.phase,
    repCount: state.repCount
  });

  const newState = {
    name: 'lunge',
    phase: state.phase,
    repCount: state.repCount
  };

  // Lunge detection logic
  if (kneeAngle < 110) { // Knee is bent in lunge position
    if (state.phase === 'up') {
      newState.phase = 'down';
      newState.repCount = state.repCount + 1;
      console.log('Lunge: Rep counted:', newState.repCount);
    }
  } else if (kneeAngle > 150) { // Standing position
    if (state.phase === 'down') {
      newState.phase = 'up';
      console.log('Lunge: Reset to up position');
    }
  }

  return newState;
};

const detectSideBend = (keypoints: poseDetection.Keypoint[], state: { phase: string, repCount: number, name: string }) => {
  const leftShoulder = keypoints[11];
  const rightShoulder = keypoints[12];
  const leftHip = keypoints[23];
  const rightHip = keypoints[24];

  // Check if key points are detected
  const requiredPoints = [leftShoulder, rightShoulder, leftHip, rightHip];
  
  if (!requiredPoints.every(point => point?.score && point.score > 0.2)) {
    return state;
  }

  // Calculate the midpoints
  const shoulderMidX = (leftShoulder.x + rightShoulder.x) / 2;
  const hipMidX = (leftHip.x + rightHip.x) / 2;
  
  // Calculate lateral displacement
  const lateralBend = Math.abs(shoulderMidX - hipMidX);
  
  // Calculate shoulder tilt
  const shoulderTilt = Math.abs(leftShoulder.y - rightShoulder.y);

  console.log('Side Bend metrics:', {
    lateralBend,
    shoulderTilt,
    phase: state.phase,
    repCount: state.repCount
  });

  const newState = {
    name: 'sideBend',
    phase: state.phase,
    repCount: state.repCount
  };

  // Side bend detection logic
  if (lateralBend > 50 || shoulderTilt > 30) { // Significant lateral movement
    if (state.phase === 'center') {
      newState.phase = 'bent';
      newState.repCount = state.repCount + 1;
      console.log('Side Bend: Rep counted:', newState.repCount);
    }
  } else { // Centered position
    if (state.phase === 'bent') {
      newState.phase = 'center';
      console.log('Side Bend: Reset to center position');
    }
  }

  return newState;
};

const detectHighKnees = (keypoints: poseDetection.Keypoint[], state: { phase: string, repCount: number, name: string }) => {
  const leftHip = keypoints[23];
  const rightHip = keypoints[24];
  const leftKnee = keypoints[25];
  const rightKnee = keypoints[26];

  // Check if key points are detected
  const requiredPoints = [leftHip, rightHip, leftKnee, rightKnee];
  
  if (!requiredPoints.every(point => point?.score && point.score > 0.2)) {
    return state;
  }

  // Calculate height for both knees relative to hips
  const leftKneeHeight = leftHip.y - leftKnee.y;
  const rightKneeHeight = rightHip.y - rightKnee.y;
  
  // Use the higher knee for detection
  const maxKneeHeight = Math.max(leftKneeHeight, rightKneeHeight);

  console.log('High Knees metrics:', {
    leftKneeHeight,
    rightKneeHeight,
    phase: state.phase,
    repCount: state.repCount
  });

  const newState = {
    name: 'highKnees',
    phase: state.phase,
    repCount: state.repCount
  };

  // High knees detection logic
  if (maxKneeHeight > 30) { // Knee raised high enough
    if (state.phase === 'down') {
      newState.phase = 'up';
      newState.repCount = state.repCount + 1;
      console.log('High Knees: Rep counted:', newState.repCount);
    }
  } else if (maxKneeHeight < 10) { // Knees lowered
    if (state.phase === 'up') {
      newState.phase = 'down';
      console.log('High Knees: Reset to down position');
    }
  }

  return newState;
};

const detectArmCircles = (keypoints: poseDetection.Keypoint[], state: { phase: string, repCount: number, name: string }) => {
  const leftShoulder = keypoints[11];
  const rightShoulder = keypoints[12];
  const leftElbow = keypoints[13];
  const rightElbow = keypoints[14];
  const leftWrist = keypoints[15];
  const rightWrist = keypoints[16];

  // Check if key points are detected
  const requiredPoints = [
    leftShoulder, rightShoulder,
    leftElbow, rightElbow,
    leftWrist, rightWrist
  ];
  
  if (!requiredPoints.every(point => point?.score && point.score > 0.2)) {
    return state;
  }

  // Calculate angles for both arms
  const leftArmAngle = calculateAngle(leftShoulder, leftElbow, leftWrist);
  const rightArmAngle = calculateAngle(rightShoulder, rightElbow, rightWrist);
  
  // Calculate vertical positions of wrists relative to shoulders
  const leftWristHeight = leftShoulder.y - leftWrist.y;
  const rightWristHeight = rightShoulder.y - rightWrist.y;

  console.log('Arm Circles metrics:', {
    leftArmAngle,
    rightArmAngle,
    leftWristHeight,
    rightWristHeight,
    phase: state.phase,
    repCount: state.repCount
  });

  const newState = {
    name: 'armCircles',
    phase: state.phase,
    repCount: state.repCount
  };

  // Arm circles detection logic - track full circular motion
  if (state.phase === 'down' && leftWristHeight > 50 && rightWristHeight > 50) {
    // Arms raised above shoulders
    newState.phase = 'up';
  } else if (state.phase === 'up' && leftWristHeight < -20 && rightWristHeight < -20) {
    // Arms completed circle
    newState.phase = 'down';
    newState.repCount = state.repCount + 1;
    console.log('Arm Circles: Rep counted:', newState.repCount);
  }

  return newState;
};

const detectMountainClimber = (keypoints: poseDetection.Keypoint[], state: { phase: string, repCount: number, name: string }) => {
  const shoulderPoint = keypoints.find((kp) => kp.name === "left_shoulder" || kp.name === "right_shoulder");
  const hipPoint = keypoints.find((kp) => kp.name === "left_hip" || kp.name === "right_hip");
  const kneePoint = keypoints.find((kp) => kp.name === "left_knee" || kp.name === "right_knee");

  if (!shoulderPoint || !hipPoint || !kneePoint) {
    return state;
  }

  const plankAngle = calculateAngle(shoulderPoint, hipPoint, kneePoint);
  const kneeHeight = hipPoint.y - kneePoint.y;

  const newState = {
    name: 'mountainClimber',
    phase: state.phase,
    repCount: state.repCount
  };

  if (plankAngle > 160 && kneeHeight > 15) {
    if (state.phase === 'down') {
      newState.phase = 'up';
      newState.repCount = state.repCount + 1;
    }
  } else {
    if (state.phase === 'up') {
      newState.phase = 'down';
    }
  }

  return newState;
};

export default function PoseDetector({ isActive, className = '', exerciseType, onExerciseUpdate }: PoseDetectorProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const detectorRef = useRef<poseDetection.PoseDetector | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [loading, setLoading] = useState(true);
  const [exerciseState, setExerciseState] = useState(() => ({
    name: exerciseType,
    repCount: 0,
    phase: exerciseType === 'jumpingJack' ? 'closed' : exerciseType === 'pushup' ? 'up' : 'down'
  }));

  const stateRef = useRef(exerciseState);
  
  // Add a new ref to track initialization status
  const isInitializedRef = useRef(false);
  
  // Add performance optimization refs
  const lastFrameTimeRef = useRef(0);
  const targetFPSRef = useRef(30); // Limit to 30 FPS for better performance
  const frameIntervalRef = useRef(1000 / 30); // milliseconds between frames
  
  // Add at the top with other refs
  const retryCountRef = useRef(0);
  const maxRetries = 3;
  const retryDelayMs = 1000;
  
  // Add these refs at the top with other refs
  const lastValidPoseTimeRef = useRef(Date.now());
  const recoveryTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isRecoveringRef = useRef(false);
  
  useEffect(() => {
    stateRef.current = exerciseState;
  }, [exerciseState]);

  // Update stateRef when exerciseType changes
  useEffect(() => {
    const newState = {
      name: exerciseType,
      repCount: 0,
      phase: exerciseType === 'jumpingJack' ? 'closed' : exerciseType === 'pushup' ? 'up' : 'down'
    };
    setExerciseState(newState);
    stateRef.current = newState;

    // Reset detector when exercise type changes
    if (detectorRef.current && isInitializedRef.current) {
      // Clean up existing detector
      detectorRef.current.dispose();
      detectorRef.current = null;
      
      // Reinitialize with new exercise type
      const reinitialize = async () => {
        try {
          detectorRef.current = await poseDetection.createDetector(
            poseDetection.SupportedModels.BlazePose,
            {
              runtime: 'mediapipe',
              modelType: 'lite',
              solutionPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/pose',
              enableSmoothing: true,
            }
          );
        } catch (error) {
          console.error('Failed to reinitialize detector:', error);
        }
      };
      
      reinitialize();
    }
  }, [exerciseType]);

  useEffect(() => {
    let mounted = true;
    let animationFrameId: number;

    const initDetector = async () => {
      try {
        if (!detectorRef.current) {
          detectorRef.current = await poseDetection.createDetector(
            poseDetection.SupportedModels.BlazePose,
            {
              runtime: 'mediapipe',
              modelType: 'lite', // Use lite model for better performance
              solutionPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/pose',
              enableSmoothing: true, // Add smoothing
            }
          );
        }
        return true;
      } catch (error) {
        console.error('Failed to initialize detector:', error);
        return false;
      }
    };

    const initCamera = async () => {
      if (!mounted) return;
      
      try {
        setLoading(true);
        retryCountRef.current = 0; // Reset retry count on new initialization

        // Initialize detector first
        const detectorInitialized = await initDetector();
        if (!detectorInitialized) {
          throw new Error('Failed to initialize pose detector');
        }

        // Clean up any existing streams before starting new one
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
          streamRef.current = null;
        }

        // Get camera stream with optimized settings
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            facingMode: 'user',
            width: { ideal: 640 },
            height: { ideal: 480 },
            frameRate: { ideal: 30, max: 30 }
          } 
        });

        if (!mounted) {
          stream.getTracks().forEach(track => track.stop());
          return;
        }

        // Set up video element
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await new Promise((resolve) => {
            if (videoRef.current) {
              videoRef.current.onloadedmetadata = resolve;
            }
          });
          await videoRef.current.play();

          // Set canvas dimensions after video is loaded
          if (canvasRef.current) {
            canvasRef.current.width = videoRef.current.videoWidth;
            canvasRef.current.height = videoRef.current.videoHeight;
          }
        }

        streamRef.current = stream;
        isInitializedRef.current = true;
        setLoading(false);

        // Update pose detection loop
        const detectPose = async () => {
          if (!mounted || !detectorRef.current || !videoRef.current || !canvasRef.current) return;

          const currentTime = performance.now();
          const elapsed = currentTime - lastFrameTimeRef.current;

          // Throttle frame rate
          if (elapsed < frameIntervalRef.current) {
            animationFrameId = requestAnimationFrame(detectPose);
            return;
          }

          try {
            // Update last frame time
            lastFrameTimeRef.current = currentTime;

            const poses = await detectorRef.current.estimatePoses(videoRef.current, {
              flipHorizontal: false,
              maxPoses: 1,
              scoreThreshold: 0.3
            });

            const ctx = canvasRef.current.getContext('2d');
            if (!ctx) return;

            // Clear and draw video frame
            ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
            ctx.drawImage(videoRef.current, 0, 0);

            if (poses.length > 0) {
              // We got a valid pose, update recovery state
              isRecoveringRef.current = false;
              lastValidPoseTimeRef.current = Date.now();
              
              if (recoveryTimeoutRef.current) {
                clearTimeout(recoveryTimeoutRef.current);
                recoveryTimeoutRef.current = null;
              }

              const pose = poses[0];
              
              // Get new state based on exercise type
              const newState = (() => {
                switch (exerciseType) {
                  case 'pushup':
                    return detectPushup(pose.keypoints, stateRef.current);
                  case 'squat':
                    return detectSquat(pose.keypoints, stateRef.current);
                  case 'jumpingJack':
                    return detectJumpingJack(pose.keypoints, stateRef.current);
                  case 'crunch':
                    return detectCrunch(pose.keypoints, stateRef.current);
                  case 'lunge':
                    return detectLunge(pose.keypoints, stateRef.current);
                  case 'sideBend':
                    return detectSideBend(pose.keypoints, stateRef.current);
                  case 'highKnees':
                    return detectHighKnees(pose.keypoints, stateRef.current);
                  case 'armCircles':
                    return detectArmCircles(pose.keypoints, stateRef.current);
                  case 'mountainClimber':
                    return detectMountainClimber(pose.keypoints, stateRef.current);
                  default:
                    return detectArmRaise(pose.keypoints, stateRef.current);
                }
              })();

              // Check for changes
              const hasPhaseChanged = newState.phase !== stateRef.current.phase;
              const hasRepCountChanged = newState.repCount > stateRef.current.repCount;

              if (hasPhaseChanged || hasRepCountChanged) {
                const updatedState = {
                  name: exerciseType,
                  phase: newState.phase,
                  repCount: newState.repCount
                };

                // Update both state and ref immediately
                setExerciseState(updatedState);
                stateRef.current = updatedState;

                // Show rep notification if count increased
                if (hasRepCountChanged) {
                  ctx.save();
                  ctx.fillStyle = '#00ff00';
                  ctx.font = 'bold 48px system-ui, sans-serif';
                  ctx.fillText('Rep!', canvasRef.current.width / 2 - 50, canvasRef.current.height / 2);
                  ctx.restore();
                  
                  onExerciseUpdate?.(exerciseType, newState.repCount);
                }
              }

              // Draw skeleton
              ctx.strokeStyle = '#00ff00';
              ctx.lineWidth = 2;

              // Draw relevant skeleton parts based on exercise
              if (exerciseType === 'pushup') {
                // Draw upper body
                drawLine(ctx, pose.keypoints[11], pose.keypoints[12]); // shoulder to shoulder
                drawLine(ctx, pose.keypoints[11], pose.keypoints[13]); // left shoulder to elbow
                drawLine(ctx, pose.keypoints[13], pose.keypoints[15]); // left elbow to wrist
                drawLine(ctx, pose.keypoints[12], pose.keypoints[14]); // right shoulder to elbow
                drawLine(ctx, pose.keypoints[14], pose.keypoints[16]); // right elbow to wrist
                
                // Draw body
                drawLine(ctx, pose.keypoints[11], pose.keypoints[23]); // left shoulder to hip
                drawLine(ctx, pose.keypoints[12], pose.keypoints[24]); // right shoulder to hip
                drawLine(ctx, pose.keypoints[23], pose.keypoints[24]); // hip to hip
                
                // Draw key points with labels
                const keyPoints = [0, 11, 12, 13, 14, 15, 16, 23, 24].map(i => ({
                  point: pose.keypoints[i],
                  index: i
                }));

                keyPoints.forEach(({ point, index }) => {
                  if (point.score && point.score > 0.2) {
                    ctx.beginPath();
                    ctx.arc(point.x, point.y, 5, 0, 2 * Math.PI);
                    ctx.fillStyle = index === 0 ? '#ff0000' : '#00ff00';
                    ctx.fill();
                    
                    // Add point labels
                    ctx.font = '12px system-ui, sans-serif';
                    ctx.fillStyle = '#ffffff';
                    ctx.fillText(`${index} (${point.score.toFixed(2)})`, point.x + 10, point.y);
                  }
                });

                // Draw angle indicators
                if (pose.keypoints[11].score && pose.keypoints[13].score && pose.keypoints[15].score) {
                  const angle = calculateAngle(pose.keypoints[11], pose.keypoints[13], pose.keypoints[15]);
                  ctx.font = '16px system-ui, sans-serif';
                  ctx.fillStyle = '#00ff00';
                  ctx.fillText(`${Math.round(angle)}°`, pose.keypoints[13].x + 10, pose.keypoints[13].y);
                }
              } else if (exerciseType === 'squat') {
                // Draw legs
                drawLine(ctx, pose.keypoints[23], pose.keypoints[25]); // left hip to knee
                drawLine(ctx, pose.keypoints[25], pose.keypoints[27]); // left knee to ankle
                drawLine(ctx, pose.keypoints[24], pose.keypoints[26]); // right hip to knee
                drawLine(ctx, pose.keypoints[26], pose.keypoints[28]); // right knee to ankle
                drawLine(ctx, pose.keypoints[23], pose.keypoints[24]); // hip to hip
                
                // Draw angles
                if (pose.keypoints[23].score && pose.keypoints[25].score && pose.keypoints[27].score) {
                  const angle = calculateAngle(pose.keypoints[23], pose.keypoints[25], pose.keypoints[27]);
                  ctx.font = '16px system-ui, sans-serif';
                  ctx.fillStyle = '#00ff00';
                  ctx.fillText(`${Math.round(angle)}°`, pose.keypoints[25].x + 10, pose.keypoints[25].y);
                }
              } else if (exerciseType === 'jumpingJack') {
                // Draw full body for jumping jacks
                // Arms
                drawLine(ctx, pose.keypoints[11], pose.keypoints[13]); // left shoulder to elbow
                drawLine(ctx, pose.keypoints[13], pose.keypoints[15]); // left elbow to wrist
                drawLine(ctx, pose.keypoints[12], pose.keypoints[14]); // right shoulder to elbow
                drawLine(ctx, pose.keypoints[14], pose.keypoints[16]); // right elbow to wrist
                drawLine(ctx, pose.keypoints[11], pose.keypoints[12]); // shoulder to shoulder
                
                // Legs
                drawLine(ctx, pose.keypoints[23], pose.keypoints[25]); // left hip to knee
                drawLine(ctx, pose.keypoints[25], pose.keypoints[27]); // left knee to ankle
                drawLine(ctx, pose.keypoints[24], pose.keypoints[26]); // right hip to knee
                drawLine(ctx, pose.keypoints[26], pose.keypoints[28]); // right knee to ankle
                drawLine(ctx, pose.keypoints[23], pose.keypoints[24]); // hip to hip
                
                // Body
                drawLine(ctx, pose.keypoints[11], pose.keypoints[23]); // left shoulder to hip
                drawLine(ctx, pose.keypoints[12], pose.keypoints[24]); // right shoulder to hip
              } else if (exerciseType === 'crunch') {
                // Draw upper body and core
                drawLine(ctx, pose.keypoints[11], pose.keypoints[12]); // shoulder to shoulder
                drawLine(ctx, pose.keypoints[11], pose.keypoints[23]); // left shoulder to hip
                drawLine(ctx, pose.keypoints[12], pose.keypoints[24]); // right shoulder to hip
                drawLine(ctx, pose.keypoints[23], pose.keypoints[24]); // hip to hip
                drawLine(ctx, pose.keypoints[23], pose.keypoints[25]); // left hip to knee
                drawLine(ctx, pose.keypoints[24], pose.keypoints[26]); // right hip to knee
                
                // Draw angles
                if (pose.keypoints[25].score && pose.keypoints[23].score && pose.keypoints[11].score) {
                  const angle = calculateAngle(pose.keypoints[25], pose.keypoints[23], pose.keypoints[11]);
                  ctx.font = '16px system-ui, sans-serif';
                  ctx.fillStyle = '#00ff00';
                  ctx.fillText(`${Math.round(angle)}°`, pose.keypoints[23].x + 10, pose.keypoints[23].y);
                }
              } else if (exerciseType === 'lunge') {
                // Draw legs and hips for lunge
                drawLine(ctx, pose.keypoints[23], pose.keypoints[25]); // left hip to knee
                drawLine(ctx, pose.keypoints[25], pose.keypoints[27]); // left knee to ankle
                drawLine(ctx, pose.keypoints[24], pose.keypoints[26]); // right hip to knee
                drawLine(ctx, pose.keypoints[26], pose.keypoints[28]); // right knee to ankle
                drawLine(ctx, pose.keypoints[23], pose.keypoints[24]); // hip to hip
                
                // Draw angles
                if (pose.keypoints[23].score && pose.keypoints[25].score && pose.keypoints[27].score) {
                  const angle = calculateAngle(pose.keypoints[23], pose.keypoints[25], pose.keypoints[27]);
                  ctx.font = '16px system-ui, sans-serif';
                  ctx.fillStyle = '#00ff00';
                  ctx.fillText(`${Math.round(angle)}°`, pose.keypoints[25].x + 10, pose.keypoints[25].y);
                }
              } else if (exerciseType === 'sideBend') {
                // Draw torso for side bends
                drawLine(ctx, pose.keypoints[11], pose.keypoints[12]); // shoulder to shoulder
                drawLine(ctx, pose.keypoints[11], pose.keypoints[23]); // left shoulder to hip
                drawLine(ctx, pose.keypoints[12], pose.keypoints[24]); // right shoulder to hip
                drawLine(ctx, pose.keypoints[23], pose.keypoints[24]); // hip to hip
                
                // Draw lateral angle
                const shoulderMidpoint = {
                  x: (pose.keypoints[11].x + pose.keypoints[12].x) / 2,
                  y: (pose.keypoints[11].y + pose.keypoints[12].y) / 2
                };
                const hipMidpoint = {
                  x: (pose.keypoints[23].x + pose.keypoints[24].x) / 2,
                  y: (pose.keypoints[23].y + pose.keypoints[24].y) / 2
                };
                ctx.beginPath();
                ctx.moveTo(shoulderMidpoint.x, shoulderMidpoint.y);
                ctx.lineTo(hipMidpoint.x, hipMidpoint.y);
                ctx.stroke();
              } else if (exerciseType === 'highKnees') {
                // Draw legs and hips for high knees
                drawLine(ctx, pose.keypoints[23], pose.keypoints[25]); // left hip to knee
                drawLine(ctx, pose.keypoints[25], pose.keypoints[27]); // left knee to ankle
                drawLine(ctx, pose.keypoints[24], pose.keypoints[26]); // right hip to knee
                drawLine(ctx, pose.keypoints[26], pose.keypoints[28]); // right knee to ankle
                drawLine(ctx, pose.keypoints[23], pose.keypoints[24]); // hip to hip
                
                // Draw knee height indicator
                if (pose.keypoints[23].score && pose.keypoints[25].score) {
                  const kneeHeight = pose.keypoints[23].y - pose.keypoints[25].y;
                  ctx.font = '16px system-ui, sans-serif';
                  ctx.fillStyle = '#00ff00';
                  ctx.fillText(`Height: ${Math.round(kneeHeight)}`, pose.keypoints[25].x + 10, pose.keypoints[25].y);
                }
              } else if (exerciseType === 'armCircles') {
                // Draw arms for arm circles
                drawLine(ctx, pose.keypoints[11], pose.keypoints[13]); // left shoulder to elbow
                drawLine(ctx, pose.keypoints[13], pose.keypoints[15]); // left elbow to wrist
                drawLine(ctx, pose.keypoints[12], pose.keypoints[14]); // right shoulder to elbow
                drawLine(ctx, pose.keypoints[14], pose.keypoints[16]); // right elbow to wrist
                drawLine(ctx, pose.keypoints[11], pose.keypoints[12]); // shoulder to shoulder
                
                // Draw arm angles
                if (pose.keypoints[11].score && pose.keypoints[13].score && pose.keypoints[15].score) {
                  const angle = calculateAngle(pose.keypoints[11], pose.keypoints[13], pose.keypoints[15]);
                  ctx.font = '16px system-ui, sans-serif';
                  ctx.fillStyle = '#00ff00';
                  ctx.fillText(`${Math.round(angle)}°`, pose.keypoints[13].x + 10, pose.keypoints[13].y);
                }
              } else if (exerciseType === 'mountainClimber') {
                // Draw full body for mountain climbers
                // Upper body
                drawLine(ctx, pose.keypoints[11], pose.keypoints[12]); // shoulder to shoulder
                drawLine(ctx, pose.keypoints[11], pose.keypoints[13]); // left shoulder to elbow
                drawLine(ctx, pose.keypoints[13], pose.keypoints[15]); // left elbow to wrist
                drawLine(ctx, pose.keypoints[12], pose.keypoints[14]); // right shoulder to elbow
                drawLine(ctx, pose.keypoints[14], pose.keypoints[16]); // right elbow to wrist
                
                // Core and legs
                drawLine(ctx, pose.keypoints[11], pose.keypoints[23]); // left shoulder to hip
                drawLine(ctx, pose.keypoints[12], pose.keypoints[24]); // right shoulder to hip
                drawLine(ctx, pose.keypoints[23], pose.keypoints[24]); // hip to hip
                drawLine(ctx, pose.keypoints[23], pose.keypoints[25]); // left hip to knee
                drawLine(ctx, pose.keypoints[25], pose.keypoints[27]); // left knee to ankle
                drawLine(ctx, pose.keypoints[24], pose.keypoints[26]); // right hip to knee
                drawLine(ctx, pose.keypoints[26], pose.keypoints[28]); // right knee to ankle
                
                // Draw plank angle
                if (pose.keypoints[11].score && pose.keypoints[23].score && pose.keypoints[25].score) {
                  const angle = calculateAngle(pose.keypoints[11], pose.keypoints[23], pose.keypoints[25]);
                  ctx.font = '16px system-ui, sans-serif';
                  ctx.fillStyle = '#00ff00';
                  ctx.fillText(`${Math.round(angle)}°`, pose.keypoints[23].x + 10, pose.keypoints[23].y);
                }
              } else {
                // Default arm raise drawing
                drawLine(ctx, pose.keypoints[11], pose.keypoints[13]); // left shoulder to elbow
                drawLine(ctx, pose.keypoints[13], pose.keypoints[15]); // left elbow to wrist
                drawLine(ctx, pose.keypoints[12], pose.keypoints[14]); // right shoulder to elbow
                drawLine(ctx, pose.keypoints[14], pose.keypoints[16]); // right elbow to wrist
              }

              // Draw exercise info
              ctx.save();

              // Set text properties first to measure text width
              ctx.font = 'bold 24px system-ui, sans-serif';
              const text1 = `${(() => {
                switch (exerciseType) {
                  case 'pushup': return 'Pushups';
                  case 'squat': return 'Squats';
                  case 'jumpingJack': return 'Jumping Jacks';
                  case 'crunch': return 'Crunch';
                  case 'lunge': return 'Lunges';
                  case 'sideBend': return 'Side Bends';
                  case 'highKnees': return 'High Knees';
                  case 'armCircles': return 'Arm Circles';
                  case 'mountainClimber': return 'Mountain Climber';
                  default: return 'Arm Raises';
                }
              })()}: ${stateRef.current.repCount}`;
              const text2 = `Phase: ${stateRef.current.phase}`;
              const text1Width = ctx.measureText(text1).width;
              const text2Width = ctx.measureText(text2).width;

              const padding = 20;
              const lineHeight = 35;
              const backgroundWidth = Math.max(text1Width, text2Width) + (padding * 2);
              const backgroundHeight = (2 * lineHeight) + (padding * 2);
              const verticalOffset = canvasRef.current.height - backgroundHeight - 100; // Move up 100px from bottom

              ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
              ctx.fillRect(10, verticalOffset, backgroundWidth, backgroundHeight);

              ctx.fillStyle = '#ffffff';
              ctx.fillText(text1, padding + 10, verticalOffset + padding + 24);
              ctx.fillText(text2, padding + 10, verticalOffset + padding + lineHeight + 24);

              ctx.restore();

            } else if (!isRecoveringRef.current) {
              // No pose detected, start recovery process
              isRecoveringRef.current = true;
              console.log('Lost pose detection, attempting to recover...');

              // Clear any existing recovery timeout
              if (recoveryTimeoutRef.current) {
                clearTimeout(recoveryTimeoutRef.current);
              }

              // Set a timeout to reinitialize if we don't recover quickly
              recoveryTimeoutRef.current = setTimeout(() => {
                if (mounted && isActive && Date.now() - lastValidPoseTimeRef.current > 5000) {
                  console.log('Recovery timeout reached, reinitializing detector...');
                  // Reset detector and try again
                  detectorRef.current?.dispose();
                  detectorRef.current = null;
                  initCamera();
                }
              }, 5000);
            }

          } catch (error) {
            console.error('Pose detection error:', error);
            // Don't immediately stop on errors
            if (mounted && isInitializedRef.current && !isRecoveringRef.current) {
              isRecoveringRef.current = true;
              console.log('Error in pose detection, attempting to recover...');
              
              // Try to reinitialize after a short delay
              setTimeout(() => {
                if (mounted && isActive) {
                  console.log('Attempting to reinitialize after error...');
                  detectorRef.current?.dispose();
                  detectorRef.current = null;
                  initCamera();
                }
              }, 1000);
            }
          }

          // Continue the detection loop if we're still mounted and initialized
          if (mounted && isInitializedRef.current) {
            animationFrameId = requestAnimationFrame(detectPose);
          }
        };

        detectPose();
      } catch (error) {
        console.error('Camera initialization error:', error);
        
        // Clean up on error
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
          streamRef.current = null;
        }
        if (videoRef.current) {
          videoRef.current.srcObject = null;
        }
        
        setLoading(false);
        isInitializedRef.current = false;

        // Retry logic with count limit
        if (mounted && isActive && retryCountRef.current < maxRetries) {
          retryCountRef.current++;
          console.log(`Retrying camera initialization (${retryCountRef.current}/${maxRetries})...`);
          
          setTimeout(() => {
            if (mounted && isActive && !isInitializedRef.current) {
              initCamera();
            }
          }, retryDelayMs * retryCountRef.current); // Increase delay with each retry
        } else if (retryCountRef.current >= maxRetries) {
          console.error('Max retry attempts reached. Please restart the camera manually.');
          // You might want to show an error message to the user here
        }
      }
    };

    // Only initialize if active and not already initialized
    if (isActive && !isInitializedRef.current) {
      initCamera();
    }

    return () => {
      mounted = false;
      isInitializedRef.current = false;
      retryCountRef.current = 0;
      isRecoveringRef.current = false;
      
      if (recoveryTimeoutRef.current) {
        clearTimeout(recoveryTimeoutRef.current);
        recoveryTimeoutRef.current = null;
      }
      
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => {
          try {
            track.stop();
          } catch (e) {
            console.error('Error stopping track:', e);
          }
        });
        streamRef.current = null;
      }

      if (videoRef.current) {
        try {
          videoRef.current.srcObject = null;
        } catch (e) {
          console.error('Error cleaning up video element:', e);
        }
      }
    };
  }, [isActive, exerciseType]);

  // Add cleanup when component unmounts
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (detectorRef.current) {
        detectorRef.current.dispose();
      }
    };
  }, []);

  return isActive ? (
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
      />
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <Loader2 className="w-8 h-8 text-white animate-spin" />
          <span className="ml-2 text-white">Starting camera...</span>
        </div>
      )}
    </div>
  ) : null;
}