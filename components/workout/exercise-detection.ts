export function detectExercise(keypoints: poseDetection.Keypoint[]) {
  if (!Array.isArray(keypoints)) {
    return null;
  }

  // Convert keypoints to array if needed
  const keypointsArray = Array.from(keypoints);
  
  // Now we can use array methods
  const validKeypoints = keypointsArray.every(kp => kp.score && kp.score > 0.5);
  
  if (!validKeypoints) {
    return null;
  }

  // ... rest of exercise detection logic ...
} 