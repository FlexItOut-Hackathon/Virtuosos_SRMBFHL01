class AudioFeedback {
  private audioContext: AudioContext | null = null
  private sounds: Map<string, AudioBuffer> = new Map()
  private gainNode: GainNode | null = null
  private volume = 0.5

  async initialize() {
    this.audioContext = new AudioContext()
    this.gainNode = this.audioContext.createGain()
    this.gainNode.connect(this.audioContext.destination)
    this.gainNode.gain.value = this.volume

    // Load sound effects
    await this.loadSound("success", "/sounds/success.mp3")
    await this.loadSound("error", "/sounds/error.mp3")
    await this.loadSound("countdown", "/sounds/countdown.mp3")
    await this.loadSound("achievement", "/sounds/achievement.mp3")
  }

  private async loadSound(name: string, url: string) {
    try {
      const response = await fetch(url)
      const arrayBuffer = await response.arrayBuffer()
      if (this.audioContext) {
        const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer)
        this.sounds.set(name, audioBuffer)
      }
    } catch (error) {
      console.error(`Failed to load sound: ${name}`, error)
    }
  }

  async playSound(name: string) {
    if (!this.audioContext || !this.gainNode) return

    const sound = this.sounds.get(name)
    if (!sound) return

    const source = this.audioContext.createBufferSource()
    source.buffer = sound
    source.connect(this.gainNode)
    source.start()
  }

  setVolume(volume: number) {
    this.volume = Math.max(0, Math.min(1, volume))
    if (this.gainNode) {
      this.gainNode.gain.value = this.volume
    }
  }

  async playCountdown() {
    for (let i = 3; i > 0; i--) {
      await this.playSound("countdown")
      await new Promise((resolve) => setTimeout(resolve, 1000))
    }
    await this.playSound("success")
  }

  async playAchievement() {
    await this.playSound("achievement")
  }

  async playError() {
    await this.playSound("error")
  }

  async playSuccess() {
    await this.playSound("success")
  }
}

export const audioFeedback = new AudioFeedback()

