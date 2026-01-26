// utils/wordleEngine.ts
export type FeedbackColor = 'correct' | 'present' | 'wrong'
export type KeyStatus = 'correct' | 'present' | 'wrong'

const COLS = 5

/**
 * NYT-style Wordle evaluation (two-pass, handles duplicates).
 * Returns an array of 5 tile colors.
 */
export function evaluateGuess_AnswerAndGuessProvided_ReturnsNYTColors(
  answer: string,
  guess: string
): FeedbackColor[] {
  const answerArr = answer.toUpperCase().split('') as Array<string | null>
  const guessArr = guess.toUpperCase().split('')
  const tileColors: FeedbackColor[] = Array(COLS).fill('wrong')

  // Pass 1: correct
  for (let i = 0; i < COLS; i++) {
    const g = guessArr[i]
    if (g && g === answerArr[i]) {
      tileColors[i] = 'correct'
      answerArr[i] = null
    }
  }

  // Pass 2: present (only if remaining)
  for (let i = 0; i < COLS; i++) {
    if (tileColors[i] === 'correct') continue
    const g = guessArr[i]
    if (!g) continue

    const idx = answerArr.indexOf(g)
    if (idx !== -1) {
      tileColors[i] = 'present'
      answerArr[idx] = null
    }
  }

  return tileColors
}

/**
 * Merges key states so the "best" color always wins:
 * correct > present > wrong, never downgrade.
 */
export function mergeKeyStates_PreviousAndNewFeedbackProvided_ReturnsBestStates(
  prev: Record<string, KeyStatus | undefined>,
  guess: string,
  colors: FeedbackColor[]
): Record<string, KeyStatus> {
  const next: Record<string, KeyStatus> = { ...(prev as Record<string, KeyStatus>) }
  const guessArr = guess.toUpperCase().split('')

  for (let i = 0; i < COLS; i++) {
    const letter = guessArr[i]
    const color = colors[i]
    if (!letter) continue

    const prior = next[letter]

    if (prior === 'correct') continue

    if (color === 'correct') {
      next[letter] = 'correct'
    } else if (color === 'present' && prior !== 'present') {
      next[letter] = 'present'
    } else if (!prior) {
      next[letter] = 'wrong'
    }
  }

  return next
}
