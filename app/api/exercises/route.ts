import { NextResponse } from 'next/server';

interface ExerciseData {
  timestamp: number;
  exerciseType: string;
  repetitions: number;
  confidence: number;
}

// In-memory storage for exercises (will reset on server restart)
let exerciseLog: ExerciseData[] = [];

export async function POST(request: Request) {
  try {
    const data: ExerciseData = await request.json();
    exerciseLog.push(data);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to log exercise' }, { status: 500 });
  }
}

export async function GET() {
  try {
    return NextResponse.json({ exercises: exerciseLog });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to get exercise log' }, { status: 500 });
  }
} 