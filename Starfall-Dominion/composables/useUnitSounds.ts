import { ref, onUnmounted } from 'vue'

interface UnitSounds {
  attack?: string
  hurt?: string
  death?: string
}

export function useUnitSounds(sounds: UnitSounds) {
  const audioCache = new Map<string, HTMLAudioElement>()
  const loadedSounds = ref<Set<string>>(new Set())

  function preloadAudio(url: string): HTMLAudioElement | null {
    if (audioCache.has(url)) {
      return audioCache.get(url)!
    }

    try {
      const audio = new Audio(url)
      audio.preload = 'metadata' // Changed from 'auto' to 'metadata' - lighter
      audio.volume = 0.6
      
      // Mark as loaded on successful load
      audio.addEventListener('loadedmetadata', () => {
        loadedSounds.value.add(url)
      })
      
      // Handle errors gracefully
      audio.addEventListener('error', () => {
        console.warn(`Audio file not found: ${url}`)
        audioCache.delete(url)
      })
      
      audioCache.set(url, audio)
      return audio
    } catch (error) {
      console.warn(`Failed to load audio: ${url}`, error)
      return null
    }
  }

  // Preload all sounds
  Object.values(sounds).forEach(url => {
    if (url) preloadAudio(url)
  })

  function playSound(type: keyof UnitSounds, volume: number = 0.6) {
    const soundUrl = sounds[type]
    if (!soundUrl) return
    
    const audio = audioCache.get(soundUrl)
    if (!audio) return

    try {
      audio.volume = volume
      audio.currentTime = 0
      audio.play().catch(error => {
        // Silently fail if audio can't play
        console.warn(`Could not play ${type} sound:`, error.message)
      })
    } catch (error) {
      console.warn(`Error playing ${type} sound:`, error)
    }
  }

  function playAttackSound() {
    playSound('attack', 0.6)
  }

  function playHurtSound() {
    playSound('hurt', 0.5)
  }

  function playDeathSound() {
    playSound('death', 0.7)
  }

  onUnmounted(() => {
    audioCache.forEach(audio => {
      audio.pause()
      audio.src = ''
    })
    audioCache.clear()
  })

  return {
    playAttackSound,
    playHurtSound,
    playDeathSound
  }
}

