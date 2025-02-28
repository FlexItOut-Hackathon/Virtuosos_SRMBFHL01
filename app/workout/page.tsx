"use client"

import { useState, useEffect } from "react"
import { Play, Camera, Award, XCircle, CheckCircle, Timer, Trophy } from "lucide-react"
import { useRouter } from "next/navigation"
import PixelPanel from "@/components/pixel-panel"
import PixelButton from "@/components/pixel-button"
import WorkoutAI from "@/components/workout-ai"
import VideoCall from "@/components/video-call"
import { handleButtonClick } from "@/lib/utils"
import PoseDetector from '@/components/workout/pose-detector'
import { useQuests } from "@/lib/quest-context"
import { AnimatePresence, motion } from "framer-motion"
import PixelProgress from "@/components/pixel-progress"

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
  const [showReward, setShowReward] = useState<{
    questId: string
    xp: number
    name: string
  } | null>(null)
  const [lastRepCount, setLastRepCount] = useState(0)

  const { state: questState, updateQuestProgress } = useQuests()

  // Filter active quests based on current exercise type
  const relevantQuests = questState.activeQuests.filter(quest => {
    const exerciseToQuestType = {
      pushup: 'strength',
      squat: 'strength',
      crunch: 'strength',
      lunge: 'strength',
      jumpingJack: 'cardio',
      highKnees: 'cardio',
      mountainClimber: 'cardio',
      armRaise: 'flexibility',
      sideBend: 'flexibility',
      armCircles: 'flexibility'
    };
    
    const questType = exerciseToQuestType[selectedExercise as keyof typeof exerciseToQuestType];
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
    
    return quest.type === questType && 
           quest.name.toLowerCase().includes(exerciseNames[selectedExercise as keyof typeof exerciseNames].toLowerCase());
  });

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isStarted) {
      interval = setInterval(() => {
        setTimeElapsed((prev) => prev + 1)
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
    // Reset the last rep count when changing exercises
    setLastRepCount(0);
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
      setLastRepCount(0) // Reset last rep count when starting
      // Automatically enable camera when starting workout
      setIsCameraEnabled(true)
    }, setIsLoading)()
  }

  const handleStop = async () => {
    await handleButtonClick(async () => {
      setIsStarted(false)
      setIsCameraEnabled(false)
      router.push("/character")
    }, setIsLoading)()
  }

  const toggleCamera = async () => {
    await handleButtonClick(async () => {
      if (isCameraEnabled) {
        setIsCameraEnabled(false);
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

    // Update current exercise display
    setCurrentExercise(prev => ({
      ...prev,
      name: exerciseNames[exercise as keyof typeof exerciseNames] || exercise,
      reps: reps
    }));

    // Check if this is a new rep
    if (reps > lastRepCount) {
      // Calculate how many new reps were performed
      const newReps = reps - lastRepCount;
      
      // Update exercise count and score for each new rep
      setExerciseCount(prev => prev + newReps);
      setScore(prev => prev + (10 * newReps));

      // Map exercises to quest types
      const exerciseToQuestType = {
        pushup: 'strength',
        squat: 'strength',
        crunch: 'strength',
        lunge: 'strength',
        jumpingJack: 'cardio',
        highKnees: 'cardio',
        mountainClimber: 'cardio',
        armRaise: 'flexibility',
        sideBend: 'flexibility',
        armCircles: 'flexibility'
      };

      const questType = exerciseToQuestType[exercise as keyof typeof exerciseToQuestType];
      
      // Find relevant quests and update their progress
      questState.activeQuests.forEach(quest => {
        if (quest.type === questType) {
          const exerciseNameInQuest = quest.name.toLowerCase();
          const currentExerciseName = exerciseNames[exercise as keyof typeof exerciseNames].toLowerCase();
          
          if (exerciseNameInQuest.includes(currentExerciseName)) {
            // Update progress for each new rep
            const newProgress = quest.completed + newReps;
            
            // Update the progress
            updateQuestProgress(quest.id, newProgress);
            
            // Show reward popup if quest is completed
            if (newProgress >= quest.total) {
              setShowReward({
                questId: quest.id,
                xp: quest.xp,
                name: quest.name,
              });
            }
          }
        }
      });
    }

    // Always update the last rep count
    setLastRepCount(reps);
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

          {/* Active Quests */}
          <PixelPanel>
            <h2 className="text-xl font-pixelFont text-pixel-light mb-4">Active Quests</h2>
            <div className="space-y-4">
              {relevantQuests.length > 0 ? (
                relevantQuests.map((quest) => (
                  <div
                    key={quest.id}
                    className="border-2 border-pixel-light rounded-md p-3"
                  >
                    <div className="flex justify-between items-center">
                      <h3 className="font-pixelFont text-pixel-light">{quest.name}</h3>
                      <span className="text-xs bg-pixel-blue px-2 py-1 rounded-md text-pixel-light">{quest.type}</span>
                    </div>
                    <div className="mt-2">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-pixel-light">Progress</span>
                        <span className="text-pixel-light">
                          {quest.completed}/{quest.total}
                        </span>
                      </div>
                      <PixelProgress
                        value={(quest.completed / quest.total) * 100}
                        color={quest.completed === quest.total ? "pixel-green" : "pixel-blue"}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4">
                  <p className="text-pixel-light">No active quests for this exercise</p>
                </div>
              )}
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

      {/* Quest Completion Popup */}
      <AnimatePresence>
        {showReward && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 flex items-center justify-center z-50 bg-black/50"
            onClick={() => setShowReward(null)}
          >
            <PixelPanel className="transform p-8 text-center">
              <Trophy className="w-16 h-16 text-pixel-yellow mx-auto mb-4 animate-bounce" />
              <h2 className="text-2xl font-pixelFont text-pixel-light mb-2">Quest Complete!</h2>
              <p className="text-pixel-light mb-4">{showReward.name}</p>
              <div className="flex items-center justify-center gap-2 text-xl font-pixelFont text-pixel-yellow">
                <Trophy className="w-6 h-6" />+{showReward.xp} XP
              </div>
            </PixelPanel>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

