import { computed, ref } from 'vue'

type PlayerStatsV1 = {
    gamesPlayed: number
    wins: number
    losses: number
    currentStreak: number
    maxStreak: number
    guessDistribution: number[] // length 6; index 0 => 1 guess, index 5 => 6 guesses
    
    // For “average attempts (words to win)” requirement:
    winGuessesTotal: number // sum of guesses on wins only
}

const STORAGE_KEY = 'wordle_stats_v1'

const defaultStats = (): PlayerStatsV1 => ({
    gamesPlayed: 0,
    wins: 0,
    losses: 0,
    currentStreak: 0,
    maxStreak: 0,
    guessDistribution: [0, 0, 0, 0, 0, 0],
    winGuessesTotal: 0,
})

function safeParse(json: string | null): PlayerStatsV1 | null {
    if (!json) return null
    try {
        const obj = JSON.parse(json)
        if (!obj || typeof obj !== 'object') return null
        return normalize(obj)
    } catch {
        return null
    }
}

function normalize(input: any): PlayerStatsV1 {
    const base = defaultStats()
    const gd = Array.isArray(input.guessDistribution) ? input.guessDistribution : base.guessDistribution
    
    return {
        gamesPlayed: Number.isFinite(input.gamesPlayed) ? input.gamesPlayed : base.gamesPlayed,
        wins: Number.isFinite(input.wins) ? input.wins : base.wins,
        losses: Number.isFinite(input.losses) ? input.losses : base.losses,
        currentStreak: Number.isFinite(input.currentStreak) ? input.currentStreak : base.currentStreak,
        maxStreak: Number.isFinite(input.maxStreak) ? input.maxStreak : base.maxStreak,
        guessDistribution: Array(6)
        .fill(0)
        .map((_, i) => (Number.isFinite(gd?.[i]) ? gd[i] : 0)),
        winGuessesTotal: Number.isFinite(input.winGuessesTotal) ? input.winGuessesTotal : base.winGuessesTotal,
    }
}

const stats = ref<PlayerStatsV1>(defaultStats())
export function usePlayerStats() {

  const load = () => {
    if (typeof window === 'undefined') return
    const saved = safeParse(sessionStorage.getItem(STORAGE_KEY))
    stats.value = saved ?? defaultStats()
  }

  const save = () => {
    if (typeof window === 'undefined') return
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(stats.value))
  }

  const recordGame = (params: { won: boolean; guesses: number }) => {
    const guesses = Math.max(1, Math.min(6, Math.floor(params.guesses)))

    stats.value.gamesPlayed += 1

    if (params.won) {
      stats.value.wins += 1
      stats.value.currentStreak += 1
      if (stats.value.currentStreak > stats.value.maxStreak) {
        stats.value.maxStreak = stats.value.currentStreak
      }

      // distribution is for wins only 
      const idx = guesses - 1
      stats.value.guessDistribution[idx] = (stats.value.guessDistribution[idx] ?? 0) + 1

      stats.value.winGuessesTotal += guesses
    } else {
      stats.value.losses += 1
      stats.value.currentStreak = 0
    }

    save()
  }

  const reset = () => {
    stats.value = defaultStats()
    save()
  }

  const winRate = computed(() => {
    const gp = stats.value.gamesPlayed
    return gp > 0 ? stats.value.wins / gp : 0
  })

  const avgAttempts = computed(() => {
    // average attempts to win (wins only)
    return stats.value.wins > 0 ? stats.value.winGuessesTotal / stats.value.wins : 0
  })

  return {
    stats,
    load,
    save,
    recordGame,
    reset,
    winRate,
    avgAttempts,
  }
}
