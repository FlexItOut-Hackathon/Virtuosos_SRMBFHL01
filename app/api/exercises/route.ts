import { NextResponse } from 'next/server';
import { logExercise, getExerciseLog, ExerciseData } from '@/lib/exercise-tracker';

export async function POST(request: Request) {
  try {
    const data: ExerciseData = await request.json();
    logExercise(data);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to log exercise' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const log = getExerciseLog();
    return NextResponse.json(log);
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to get exercise log' }, { status: 500 });
  }
} 