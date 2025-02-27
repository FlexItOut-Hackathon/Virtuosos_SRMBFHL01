import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Remove middleware for now to simplify auth flow
export function middleware(request: NextRequest) {
  return NextResponse.next()
}

export const config = {
  matcher: [],
}

