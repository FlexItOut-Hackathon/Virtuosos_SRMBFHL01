"use client"

import { useState } from "react"
import type { Exercise } from "@/lib/exercise-data"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import PixelButton from "./pixel-button"

interface WorkoutTutorialProps {
  exercise: Exercise
  onComplete: () => void
}

export default function WorkoutTutorial({ exercise, onComplete }: WorkoutTutorialProps) {
  const [currentStep, setCurrentStep] = useState(0)

  const handleNext = () => {
    if (currentStep < exercise.instructions.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      onComplete()
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  return (
    <div className="p-6 bg-pixel-dark border-2 border-pixel-light rounded-lg">
      <div className="mb-6">
        <h3 className="text-xl font-pixelFont text-pixel-light mb-2">{exercise.name} Tutorial</h3>
        <p className="text-pixel-light opacity-80">{exercise.description}</p>
      </div>

      <div className="relative min-h-[200px] mb-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="absolute inset-0"
          >
            <div className="bg-pixel-dark/50 border-2 border-pixel-light rounded-lg p-4">
              <p className="text-pixel-light font-pixelFont mb-2">Step {currentStep + 1}</p>
              <p className="text-pixel-light">{exercise.instructions[currentStep]}</p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-between">
        <PixelButton onClick={handlePrevious} disabled={currentStep === 0} variant="outline">
          <ChevronLeft className="mr-2" />
          Previous
        </PixelButton>

        <div className="flex gap-1">
          {exercise.instructions.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full ${index === currentStep ? "bg-pixel-blue" : "bg-pixel-light/20"}`}
            />
          ))}
        </div>

        <PixelButton onClick={handleNext}>
          {currentStep === exercise.instructions.length - 1 ? (
            "Start Exercise"
          ) : (
            <>
              Next
              <ChevronRight className="ml-2" />
            </>
          )}
        </PixelButton>
      </div>
    </div>
  )
}

