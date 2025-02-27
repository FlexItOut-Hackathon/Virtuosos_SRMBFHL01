import fs from 'fs';
import path from 'path';

export interface ExerciseData {
  timestamp: number;
  exerciseType: string;
  repetitions: number;
  duration?: number; // for time-based exercises
  confidence: number;
}

export interface ExerciseLog {
  exercises: ExerciseData[];
  lastUpdated: number;
}

const EXERCISE_LOG_PATH = path.join(process.cwd(), 'data', 'exercise-log.json');

// Ensure the data directory exists
if (!fs.existsSync(path.join(process.cwd(), 'data'))) {
  fs.mkdirSync(path.join(process.cwd(), 'data'));
}

// Initialize exercise log if it doesn't exist
if (!fs.existsSync(EXERCISE_LOG_PATH)) {
  fs.writeFileSync(EXERCISE_LOG_PATH, JSON.stringify({ exercises: [], lastUpdated: Date.now() }));
}

export function logExercise(data: ExerciseData): void {
  try {
    const logContent = fs.readFileSync(EXERCISE_LOG_PATH, 'utf-8');
    const log: ExerciseLog = JSON.parse(logContent);
    
    log.exercises.push(data);
    log.lastUpdated = Date.now();
    
    fs.writeFileSync(EXERCISE_LOG_PATH, JSON.stringify(log, null, 2));
  } catch (error) {
    console.error('Failed to log exercise:', error);
  }
}

export function getExerciseLog(): ExerciseLog {
  try {
    const logContent = fs.readFileSync(EXERCISE_LOG_PATH, 'utf-8');
    return JSON.parse(logContent);
  } catch (error) {
    console.error('Failed to read exercise log:', error);
    return { exercises: [], lastUpdated: Date.now() };
  }
}

export function getExercisesByType(exerciseType: string): ExerciseData[] {
  const log = getExerciseLog();
  return log.exercises.filter(exercise => exercise.exerciseType === exerciseType);
}

export function clearExerciseLog(): void {
  try {
    fs.writeFileSync(EXERCISE_LOG_PATH, JSON.stringify({ exercises: [], lastUpdated: Date.now() }, null, 2));
  } catch (error) {
    console.error('Failed to clear exercise log:', error);
  }
} 