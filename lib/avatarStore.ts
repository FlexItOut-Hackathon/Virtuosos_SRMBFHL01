type AvatarProfile = {
  username: string
  specialization: string
  avatarColor: string
  selectedAvatar: string
}

class AvatarStore {
  private static instance: AvatarStore
  private currentProfile: AvatarProfile = {
    username: "PixelWarrior",
    specialization: "Strength Warrior",
    avatarColor: "blue",
    selectedAvatar: 'character_maleAdventurer_idle.png'
  }
  private subscribers: Set<() => void> = new Set()

  private constructor() {
    if (typeof window !== 'undefined') {
      const savedProfile = localStorage.getItem('userProfile')
      if (savedProfile) {
        try {
          this.currentProfile = JSON.parse(savedProfile)
        } catch (error) {
          console.error('Error parsing saved profile:', error)
        }
      }
    }
  }

  public static getInstance(): AvatarStore {
    if (!AvatarStore.instance) {
      AvatarStore.instance = new AvatarStore()
    }
    return AvatarStore.instance
  }

  public getProfile(): AvatarProfile {
    return { ...this.currentProfile }
  }

  public updateProfile(newProfile: Partial<AvatarProfile>) {
    this.currentProfile = {
      ...this.currentProfile,
      ...newProfile
    }

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('userProfile', JSON.stringify(this.currentProfile))
        setTimeout(() => this.notifySubscribers(), 0)
      } catch (error) {
        console.error('Error saving profile:', error)
      }
    }
  }

  public subscribe(callback: () => void) {
    this.subscribers.add(callback)
    return () => {
      this.subscribers.delete(callback)
    }
  }

  private notifySubscribers() {
    this.subscribers.forEach(callback => {
      try {
        callback()
      } catch (error) {
        console.error('Error in subscriber callback:', error)
      }
    })
  }
}

export const avatarStore = AvatarStore.getInstance() 