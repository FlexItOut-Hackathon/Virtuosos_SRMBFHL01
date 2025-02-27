"use client"

import { useState, useEffect } from "react"
import { Play, Camera, Award, XCircle, CheckCircle, Timer } from "lucide-react"
import { useRouter } from "next/navigation"
import PixelPanel from "@/components/pixel-panel"
import PixelButton from "@/components/pixel-button"
import WorkoutAI from "@/components/workout-ai"
import VideoCall from "@/components/video-call"
import { handleButtonClick } from "@/lib/utils"
import PoseDetector from '@/components/workout/pose-detector'

export default function WorkoutPage() {
  const router = useRouter()
  const [isStarted, setIsStarted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isCameraEnabled, setIsCameraEnabled] = useState(false)
  const [score, setScore] = useState(0)
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [exerciseCount, setExerciseCount] = useState(0)
  const [selectedExercise, setSelectedExercise] = useState<
    'armRaise' | 'pushup' | 'squat' | 'jumpingJack' | 'crunch' | 
    'lunge' | 'sideBend' | 'highKnees' | 'armCircles' | 'mountainClimber'
  >('armRaise')
  const [currentExercise, setCurrentExercise] = useState({
    name: "Arm Raise",
    reps: 0,
    form: 85,
  })

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isStarted) {
      interval = setInterval(() => {
        setTimeElapsed((prev) => prev + 1)
        // Simulate score increase
        setScore((prev) => prev + Math.floor(Math.random() * 5))
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isStarted])

  useEffect(() => {
    setCurrentExercise(prev => ({
      ...prev,
      name: {
        armRaise: 'Arm Raise',
        pushup: 'Pushup',
        squat: 'Squat',
        jumpingJack: 'Jumping Jack',
        crunch: 'Crunch',
        lunge: 'Lunges',
        sideBend: 'Side Bends',
        highKnees: 'High Knees',
        armCircles: 'Arm Circles',
        mountainClimber: 'Mountain Climbers'
      }[selectedExercise] || 'Arm Raise',
      reps: 0
    }));
  }, [selectedExercise]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleStart = async () => {
    await handleButtonClick(async () => {
      setIsStarted(true)
      setScore(0)
      setTimeElapsed(0)
      setExerciseCount(0)
    }, setIsLoading)()
  }

  const handleStop = async () => {
    await handleButtonClick(async () => {
      setIsStarted(false)
      // Save workout data
      router.push("/character") // Redirect to character page to show results
    }, setIsLoading)()
  }

  const toggleCamera = async () => {
    await handleButtonClick(async () => {
      if (isCameraEnabled) {
        // First set the state to false to trigger cleanup in MediaPipePoseDetector
        setIsCameraEnabled(false);
        
        // Then cleanup any remaining video elements
        const videoElements = document.querySelectorAll('video');
        videoElements.forEach(videoElement => {
          if (videoElement.srcObject) {
            const stream = videoElement.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
            videoElement.srcObject = null;
          }
        });
      } else {
        setIsCameraEnabled(true);
      }
    }, setIsLoading)();
  }

  const handleExerciseUpdate = (exercise: string, reps: number) => {
    const exerciseNames = {
      armRaise: 'Arm Raise',
      pushup: 'Pushup',
      squat: 'Squat',
      jumpingJack: 'Jumping Jack',
      crunch: 'Crunch',
      lunge: 'Lunges',
      sideBend: 'Side Bends',
      highKnees: 'High Knees',
      armCircles: 'Arm Circles',
      mountainClimber: 'Mountain Climbers'
    };
    
    setCurrentExercise(prev => ({
      ...prev,
      name: exerciseNames[exercise as keyof typeof exerciseNames] || exercise,
      reps: reps
    }));
  };

  return (
    <div className="container mx-auto max-w-6xl">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Workout Area */}
        <div className="md:col-span-2">
          <PixelPanel className="h-[600px] relative">
            {!isStarted ? (
              <div className="flex flex-col items-center justify-center h-full">
                <h1 className="text-3xl font-pixelFont text-pixel-light mb-6">Ready to Quest?</h1>
                <PixelButton
                  onClick={handleStart}
                  isLoading={isLoading}
                  loadingText="Preparing..."
                  className="flex items-center"
                >
                  <Play className="mr-2" /> Start Workout
                </PixelButton>
              </div>
            ) : (
              <div className="h-full">
                <div className="relative h-full">
                  <select 
                    value={selectedExercise}
                    onChange={(e) => setSelectedExercise(e.target.value as typeof selectedExercise)}
                    className="absolute top-4 right-4 z-10 bg-pixel-dark text-pixel-light border-2 border-pixel-light p-2 rounded font-pixelFont"
                  >
                    <option value="armRaise">Arm Raises</option>
                    <option value="pushup">Pushups</option>
                    <option value="squat">Squats</option>
                    <option value="jumpingJack">Jumping Jacks</option>
                    <option value="crunch">Crunches</option>
                    <option value="lunge">Lunges</option>
                    <option value="sideBend">Side Bends</option>
                    <option value="highKnees">High Knees</option>
                    <option value="armCircles">Arm Circles</option>
                    <option value="mountainClimber">Mountain Climbers</option>
                  </select>
                  <div className="relative aspect-video rounded-lg overflow-hidden">
                    <PoseDetector 
                      isActive={isCameraEnabled} 
                      className="w-full h-full" 
                      exerciseType={selectedExercise}
                      onExerciseUpdate={handleExerciseUpdate}
                    />
                  </div>
                  {/* <WorkoutAI /> */}

                  {/* Overlay Stats */}
                  <div className="absolute top-4 left-4 right-4 flex justify-between">
                    <div className="bg-pixel-dark/80 p-2 rounded-md border-2 border-pixel-light">
                      <p className="font-pixelFont text-pixel-light">Time: {formatTime(timeElapsed)}</p>
                    </div>
                    <div className="bg-pixel-dark/80 p-2 rounded-md border-2 border-pixel-light">
                      <p className="font-pixelFont text-pixel-light">Score: {score} XP</p>
                    </div>
                  </div>

                  {/* Current Exercise */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="bg-pixel-dark/80 p-4 rounded-md border-2 border-pixel-light">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-pixelFont text-pixel-light">{currentExercise.name}</h3>
                        <span className="font-pixelFont text-pixel-light">{currentExercise.reps} reps</span>
                      </div>
                      <div className="flex items-center">
                        <span className="font-pixelFont text-pixel-light mr-2">Form:</span>
                        <div className="flex-1 h-4 bg-pixel-dark rounded-full overflow-hidden border-2 border-pixel-light">
                          <div
                            className="h-full bg-pixel-green transition-all duration-300"
                            style={{ width: `${currentExercise.form}%` }}
                          ></div>
                        </div>
                        <span className="font-pixelFont text-pixel-light ml-2">{currentExercise.form}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </PixelPanel>
        </div>

        {/* Sidebar */}
        <div className="md:col-span-1 space-y-6">
          {/* Workout Stats */}
          <PixelPanel>
            <h2 className="text-xl font-pixelFont text-pixel-light mb-4">Workout Stats</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Timer className="w-5 h-5 text-pixel-blue mr-2" />
                  <span className="font-pixelFont text-pixel-light">Duration</span>
                </div>
                <span className="font-pixelFont text-pixel-light">{formatTime(timeElapsed)}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Award className="w-5 h-5 text-pixel-yellow mr-2" />
                  <span className="font-pixelFont text-pixel-light">Score</span>
                </div>
                <span className="font-pixelFont text-pixel-light">{score} XP</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-pixel-green mr-2" />
                  <span className="font-pixelFont text-pixel-light">Exercises</span>
                </div>
                <span className="font-pixelFont text-pixel-light">{exerciseCount}</span>
              </div>
            </div>
          </PixelPanel>

          {/* Controls */}
          <PixelPanel>
            <h2 className="text-xl font-pixelFont text-pixel-light mb-4">Controls</h2>
            <div className="space-y-2">
              <PixelButton
                color={isStarted ? "red" : "blue"}
                onClick={isStarted ? handleStop : handleStart}
                isLoading={isLoading}
                loadingText={isStarted ? "Ending..." : "Starting..."}
                className="w-full"
              >
                {isStarted ? (
                  <>
                    <XCircle className="mr-2" /> End Workout
                  </>
                ) : (
                  <>
                    <Play className="mr-2" /> Start Workout
                  </>
                )}
              </PixelButton>

              <PixelButton
                color={isCameraEnabled ? "red" : "blue"}
                onClick={toggleCamera}
                variant={isCameraEnabled ? "default" : "outline"}
                className="w-full"
              >
                <Camera className="mr-2 h-4 w-4" />
                {isCameraEnabled ? "Stop Camera" : "Start Camera"}
              </PixelButton>
            </div>
          </PixelPanel>
        </div>
      </div>
    </div>
  )
}

