import * as poseDetection from "@tensorflow-models/pose-detection"
import "@tensorflow/tfjs-backend-webgl"
import * as tf from "@tensorflow/tfjs"

let detector: poseDetection.PoseDetector | null = null

export async function initializePoseDetection() {
  if (detector) return detector

  await tf.ready()
  const model = poseDetection.SupportedModels.BlazePose
  const detectorConfig = {
    runtime: "tfjs",
    enableSmoothing: true,
    modelType: "full",
  }

  detector = await poseDetection.createDetector(model, detectorConfig)
  return detector
}

export async function detectPose(video: HTMLVideoElement) {
  if (!detector) return null

  const poses = await detector.estimatePoses(video, {
    maxPoses: 1,
    flipHorizontal: false,
  })

  return poses[0] || null
}

export function calculateExerciseCount(
  pose: poseDetection.Pose,
  exerciseType: string,
): {
  isCorrectForm: boolean
  message: string
} {
  if (!pose || !pose.keypoints) {
    return { isCorrectForm: false, message: "No pose detected" }
  }

  const keypoints = pose.keypoints3D || pose.keypoints

  switch (exerciseType.toLowerCase()) {
    case "squat":
      return analyzeSquat(keypoints)
    case "pushup":
      return analyzePushup(keypoints)
    case "crunch":
      return analyzeCrunch(keypoints)
    case "lunge":
      return analyzeLunge(keypoints)
    case "side-bend":
      return analyzeSideBend(keypoints)
    case "high-knees":
      return analyzeHighKnees(keypoints)
    case "arm-circles":
      return analyzeArmCircles(keypoints)
    case "mountain-climber":
      return analyzeMountainClimber(keypoints)
    default:
      return { isCorrectForm: false, message: "Unknown exercise type" }
  }
}

function analyzeSquat(keypoints: poseDetection.Keypoint[]) {
  const hipPoint = keypoints.find((kp) => kp.name === "left_hip" || kp.name === "right_hip")
  const kneePoint = keypoints.find((kp) => kp.name === "left_knee" || kp.name === "right_knee")
  const anklePoint = keypoints.find((kp) => kp.name === "left_ankle" || kp.name === "right_ankle")

  if (!hipPoint || !kneePoint || !anklePoint) {
    return { isCorrectForm: false, message: "Could not detect key body points" }
  }

  // Calculate knee angle
  const kneeAngle = calculateAngle(hipPoint, kneePoint, anklePoint)

  if (kneeAngle < 90) {
    return { isCorrectForm: true, message: "Good squat depth!" }
  } else if (kneeAngle < 120) {
    return { isCorrectForm: false, message: "Go lower for full range of motion" }
  } else {
    return { isCorrectForm: false, message: "Bend your knees more" }
  }
}

function analyzePushup(keypoints: poseDetection.Keypoint[]) {
  const shoulderPoint = keypoints.find((kp) => kp.name === "left_shoulder" || kp.name === "right_shoulder")
  const elbowPoint = keypoints.find((kp) => kp.name === "left_elbow" || kp.name === "right_elbow")
  const wristPoint = keypoints.find((kp) => kp.name === "left_wrist" || kp.name === "right_wrist")

  if (!shoulderPoint || !elbowPoint || !wristPoint) {
    return { isCorrectForm: false, message: "Could not detect arm position" }
  }

  // Calculate elbow angle
  const elbowAngle = calculateAngle(shoulderPoint, elbowPoint, wristPoint)

  if (elbowAngle < 90) {
    return { isCorrectForm: true, message: "Good pushup depth!" }
  } else {
    return { isCorrectForm: false, message: "Lower your chest more" }
  }
}

function analyzeCrunch(keypoints: poseDetection.Keypoint[]) {
  const shoulderPoint = keypoints.find((kp) => kp.name === "left_shoulder" || kp.name === "right_shoulder")
  const hipPoint = keypoints.find((kp) => kp.name === "left_hip" || kp.name === "right_hip")
  const kneePoint = keypoints.find((kp) => kp.name === "left_knee" || kp.name === "right_knee")

  if (!shoulderPoint || !hipPoint || !kneePoint) {
    return { isCorrectForm: false, message: "Could not detect core position" }
  }

  // Calculate trunk angle
  const trunkAngle = calculateAngle(shoulderPoint, hipPoint, kneePoint)

  if (trunkAngle < 45) {
    return { isCorrectForm: true, message: "Good crunch form!" }
  } else {
    return { isCorrectForm: false, message: "Lift your shoulders more" }
  }
}

function analyzeLunge(keypoints: poseDetection.Keypoint[]) {
  const hipPoint = keypoints.find((kp) => kp.name === "left_hip" || kp.name === "right_hip")
  const kneePoint = keypoints.find((kp) => kp.name === "left_knee" || kp.name === "right_knee")
  const anklePoint = keypoints.find((kp) => kp.name === "left_ankle" || kp.name === "right_ankle")

  if (!hipPoint || !kneePoint || !anklePoint) {
    return { isCorrectForm: false, message: "Could not detect leg position" }
  }

  // Calculate knee angle
  const kneeAngle = calculateAngle(hipPoint, kneePoint, anklePoint)

  if (kneeAngle >= 85 && kneeAngle <= 95) {
    return { isCorrectForm: true, message: "Good lunge form!" }
  } else if (kneeAngle < 85) {
    return { isCorrectForm: false, message: "Don't go too low" }
  } else {
    return { isCorrectForm: false, message: "Bend your knee more" }
  }
}

function analyzeSideBend(keypoints: poseDetection.Keypoint[]) {
  const shoulderPoint = keypoints.find((kp) => kp.name === "left_shoulder" || kp.name === "right_shoulder")
  const hipPoint = keypoints.find((kp) => kp.name === "left_hip" || kp.name === "right_hip")

  if (!shoulderPoint || !hipPoint) {
    return { isCorrectForm: false, message: "Could not detect torso position" }
  }

  // Calculate lateral bend angle
  const lateralAngle = Math.abs(shoulderPoint.x - hipPoint.x) / hipPoint.y * 100

  if (lateralAngle > 15) {
    return { isCorrectForm: true, message: "Good side bend!" }
  } else {
    return { isCorrectForm: false, message: "Bend more to the side" }
  }
}

function analyzeHighKnees(keypoints: poseDetection.Keypoint[]) {
  const hipPoint = keypoints.find((kp) => kp.name === "left_hip" || kp.name === "right_hip")
  const kneePoint = keypoints.find((kp) => kp.name === "left_knee" || kp.name === "right_knee")

  if (!hipPoint || !kneePoint) {
    return { isCorrectForm: false, message: "Could not detect knee position" }
  }

  // Check if knee is raised high enough (near hip level)
  const kneeHeight = hipPoint.y - kneePoint.y

  if (kneeHeight > 20) {
    return { isCorrectForm: true, message: "Good knee height!" }
  } else {
    return { isCorrectForm: false, message: "Lift your knees higher" }
  }
}

function analyzeArmCircles(keypoints: poseDetection.Keypoint[]) {
  const shoulderPoint = keypoints.find((kp) => kp.name === "left_shoulder" || kp.name === "right_shoulder")
  const elbowPoint = keypoints.find((kp) => kp.name === "left_elbow" || kp.name === "right_elbow")
  const wristPoint = keypoints.find((kp) => kp.name === "left_wrist" || kp.name === "right_wrist")

  if (!shoulderPoint || !elbowPoint || !wristPoint) {
    return { isCorrectForm: false, message: "Could not detect arm position" }
  }

  // Check if arm is extended
  const armAngle = calculateAngle(shoulderPoint, elbowPoint, wristPoint)

  if (armAngle > 150) {
    return { isCorrectForm: true, message: "Keep arms straight!" }
  } else {
    return { isCorrectForm: false, message: "Extend your arms fully" }
  }
}

function analyzeMountainClimber(keypoints: poseDetection.Keypoint[]) {
  const shoulderPoint = keypoints.find((kp) => kp.name === "left_shoulder" || kp.name === "right_shoulder")
  const hipPoint = keypoints.find((kp) => kp.name === "left_hip" || kp.name === "right_hip")
  const kneePoint = keypoints.find((kp) => kp.name === "left_knee" || kp.name === "right_knee")

  if (!shoulderPoint || !hipPoint || !kneePoint) {
    return { isCorrectForm: false, message: "Could not detect body position" }
  }

  // Check plank position and knee drive
  const plankAngle = calculateAngle(shoulderPoint, hipPoint, kneePoint)
  const kneeHeight = hipPoint.y - kneePoint.y

  if (plankAngle > 160 && kneeHeight > 15) {
    return { isCorrectForm: true, message: "Good form!" }
  } else if (plankAngle <= 160) {
    return { isCorrectForm: false, message: "Keep your body straight" }
  } else {
    return { isCorrectForm: false, message: "Drive knees higher" }
  }
}

function calculateAngle(
  pointA: poseDetection.Keypoint,
  pointB: poseDetection.Keypoint,
  pointC: poseDetection.Keypoint,
) {
  const vectorAB = {
    x: pointB.x - pointA.x,
    y: pointB.y - pointA.y,
  }

  const vectorBC = {
    x: pointC.x - pointB.x,
    y: pointC.y - pointB.y,
  }

  const dotProduct = vectorAB.x * vectorBC.x + vectorAB.y * vectorBC.y
  const magnitudeAB = Math.sqrt(vectorAB.x * vectorAB.x + vectorAB.y * vectorAB.y)
  const magnitudeBC = Math.sqrt(vectorBC.x * vectorBC.x + vectorBC.y * vectorBC.y)

  const angle = Math.acos(dotProduct / (magnitudeAB * magnitudeBC))
  return angle * (180 / Math.PI)
}

