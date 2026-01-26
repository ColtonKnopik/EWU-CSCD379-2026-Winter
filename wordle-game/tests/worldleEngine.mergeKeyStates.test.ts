import { describe, it, expect } from 'vitest'
import {
  mergeKeyStates_PreviousAndNewFeedbackProvided_ReturnsBestStates,
  type FeedbackColor
} from '../utils/wordleEngine'

describe('wordleEngine.mergeKeyStates', () => {
  it('mergeKeyStates_LetterBecomesCorrect_UpgradesToCorrect', () => {
    // Arrange
    const prev = { E: 'present' as const }
    const guess = 'EEEEE'
    const colors: FeedbackColor[] = ['correct', 'wrong', 'wrong', 'wrong', 'wrong']

    // Act
    const next = mergeKeyStates_PreviousAndNewFeedbackProvided_ReturnsBestStates(prev, guess, colors)

    // Assert
    expect(next.E).toBe('correct')
  })

  it('mergeKeyStates_LetterAlreadyCorrect_DoesNotDowngradeOnWrong', () => {
    // Arrange
    const prev = { A: 'correct' as const }
    const guess = 'AAAAA'
    const colors: FeedbackColor[] = ['wrong', 'wrong', 'wrong', 'wrong', 'wrong']

    // Act
    const next = mergeKeyStates_PreviousAndNewFeedbackProvided_ReturnsBestStates(prev, guess, colors)

    // Assert
    expect(next.A).toBe('correct')
  })

  it('mergeKeyStates_LetterAlreadyPresent_DoesNotDowngradeOnWrong', () => {
    // Arrange
    const prev = { T: 'present' as const }
    const guess = 'TTTTT'
    const colors: FeedbackColor[] = ['wrong', 'wrong', 'wrong', 'wrong', 'wrong']

    // Act
    const next = mergeKeyStates_PreviousAndNewFeedbackProvided_ReturnsBestStates(prev, guess, colors)

    // Assert
    expect(next.T).toBe('present')
  })
})
