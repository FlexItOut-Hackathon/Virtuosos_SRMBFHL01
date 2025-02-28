import { useState, useEffect, useCallback } from 'react'
import { avatarStore } from '@/lib/avatarStore'

export function useAvatarProfile() {
  const [mounted, setMounted] = useState(false)
  const [profile, setProfile] = useState(avatarStore.getProfile())

  useEffect(() => {
    setMounted(true)
    // Subscribe to profile changes
    const unsubscribe = avatarStore.subscribe(() => {
      const currentProfile = avatarStore.getProfile()
      setProfile(currentProfile)
    })

    // Initial load
    setProfile(avatarStore.getProfile())

    return () => {
      unsubscribe()
    }
  }, [])

  const updateProfile = useCallback((newData: Partial<typeof profile>) => {
    if (!mounted) return
    avatarStore.updateProfile(newData)
  }, [mounted])

  return {
    profile,
    updateProfile,
    isReady: mounted
  }
} 