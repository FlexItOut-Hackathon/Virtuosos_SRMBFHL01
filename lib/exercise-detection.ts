interface Keypoint {
  x: number;
  y: number;
  score?: number;
}

interface ExerciseState {
  name: string;
  repCount: number;
  phase: 'up' | 'down' | 'none';
  confidence: number;
}

// Calculate angle between three points
const calculateAngle = (a: Keypoint, b: Keypoint, c: Keypoint): number => {
  const radians = Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x);
  let angle = Math.abs((radians * 180.0) / Math.PI);
  if (angle > 180.0) angle = 360 - angle;
  return angle;
};

// Squat detection thresholds
const SQUAT_CONFIG = {
  HIP_KNEE_ANKLE_MIN: 90,  // Adjusted for better detection
  HIP_KNEE_ANKLE_MAX: 160, // Adjusted for better detection
  MIN_CONFIDENCE: 0.3      // Lowered confidence threshold
};

// Push-up detection thresholds
const PUSHUP_CONFIG = {
  ELBOW_MIN: 80,   // Adjusted for better detection
  ELBOW_MAX: 150,  // Adjusted for better detection
  MIN_CONFIDENCE: 0.3
};

// Add crunch detection thresholds
const CRUNCH_CONFIG = {
  HIP_SHOULDER_MIN: 45,  // Minimum angle for crunch down position
  HIP_SHOULDER_MAX: 90,  // Maximum angle for crunch up position
  MIN_CONFIDENCE: 0.3
};

export const detectExercise = (keypoints: Keypoint[], previousState: ExerciseState): ExerciseState => {
  // Default state
  const defaultState: ExerciseState = {
    name: 'none',
    repCount: previousState.repCount,
    phase: 'none',
    confidence: 0
  };

  // Check if we have enough confidence in key points
  const minConfidence = 0.5;
  if (!keypoints.every(kp => kp.score && kp.score > minConfidence)) {
    return defaultState;
  }

  // Get relevant keypoints for exercises
  const leftShoulder = keypoints[11];
  const rightShoulder = keypoints[12];
  const leftElbow = keypoints[13];
  const rightElbow = keypoints[14];
  const leftWrist = keypoints[15];
  const rightWrist = keypoints[16];
  const leftHip = keypoints[23];
  const rightHip = keypoints[24];
  const leftKnee = keypoints[25];
  const rightKnee = keypoints[26];
  const leftAnkle = keypoints[27];
  const rightAnkle = keypoints[28];

  // Calculate angles for squat detection
  const leftHipAngle = calculateAngle(leftShoulder, leftHip, leftKnee);
  const rightHipAngle = calculateAngle(rightShoulder, rightHip, rightKnee);
  const leftKneeAngle = calculateAngle(leftHip, leftKnee, leftAnkle);
  const rightKneeAngle = calculateAngle(rightHip, rightKnee, rightAnkle);

  // Calculate angles for push-up detection
  const leftElbowAngle = calculateAngle(leftShoulder, leftElbow, leftWrist);
  const rightElbowAngle = calculateAngle(rightShoulder, rightElbow, rightWrist);

  // Detect Squats
  const avgKneeAngle = (leftKneeAngle + rightKneeAngle) / 2;
  if (avgKneeAngle < SQUAT_CONFIG.HIP_KNEE_ANKLE_MIN && previousState.phase === 'up') {
    return {
      name: 'squat',
      repCount: previousState.phase === 'up' ? previousState.repCount + 1 : previousState.repCount,
      phase: 'down',
      confidence: Math.min(leftKneeAngle, rightKneeAngle) / 180
    };
  } else if (avgKneeAngle > SQUAT_CONFIG.HIP_KNEE_ANKLE_MAX && previousState.phase === 'down') {
    return {
      name: 'squat',
      repCount: previousState.repCount,
      phase: 'up',
      confidence: Math.min(leftKneeAngle, rightKneeAngle) / 180
    };
  }

  // Detect Push-ups
  const avgElbowAngle = (leftElbowAngle + rightElbowAngle) / 2;
  if (avgElbowAngle < PUSHUP_CONFIG.ELBOW_MIN && previousState.phase === 'up') {
    return {
      name: 'pushup',
      repCount: previousState.phase === 'up' ? previousState.repCount + 1 : previousState.repCount,
      phase: 'down',
      confidence: Math.min(leftElbowAngle, rightElbowAngle) / 180
    };
  } else if (avgElbowAngle > PUSHUP_CONFIG.ELBOW_MAX && previousState.phase === 'down') {
    return {
      name: 'pushup',
      repCount: previousState.repCount,
      phase: 'up',
      confidence: Math.min(leftElbowAngle, rightElbowAngle) / 180
    };
  }

  // After push-up detection, add crunch detection:
  if (previousState.name === 'crunch') {
    const hipShoulderAngle = calculateAngle(leftHip, leftShoulder, rightHip);
    
    if (hipShoulderAngle < CRUNCH_CONFIG.HIP_SHOULDER_MIN && previousState.phase === 'up') {
      return {
        name: 'crunch',
        repCount: previousState.repCount + 1,
        phase: 'down',
        confidence: hipShoulderAngle / 90
      };
    } else if (hipShoulderAngle > CRUNCH_CONFIG.HIP_SHOULDER_MAX && previousState.phase === 'down') {
      return {
        name: 'crunch',
        repCount: previousState.repCount,
        phase: 'up',
        confidence: hipShoulderAngle / 90
      };
    }
  }

  // Add crunch angles to debug logging
  console.log('Angles:', {
    avgKneeAngle,
    avgElbowAngle,
    hipShoulderAngle: calculateAngle(leftHip, leftShoulder, rightHip),
    phase: previousState.phase
  });

  return previousState;
}; 