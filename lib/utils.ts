import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function handleButtonClick(action: () => Promise<void> | void, setIsLoading?: (loading: boolean) => void) {
  return async () => {
    if (setIsLoading) setIsLoading(true)
    try {
      await action()
    } catch (error) {
      console.error("Action failed:", error)
    } finally {
      if (setIsLoading) setIsLoading(false)
    }
  }
}

