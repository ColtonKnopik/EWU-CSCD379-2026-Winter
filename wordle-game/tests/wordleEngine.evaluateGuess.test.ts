import { describe, it, expect } from 'vitest'
import { evaluateGuess_AnswerAndGuessProvided_ReturnsNYTColors } from '../utils/wordleEngine'

describe('wordleEngine.evaluateGuess', () => {
  it('evaluateGuess_AnswerHasDuplicateLetters_ColorsMatchNYTRules', () => {
    // Arrange
    const answer = 'LEVEL'
    const guess = 'LEELE'

    // Act
    const colors = evaluateGuess_AnswerAndGuessProvided_ReturnsNYTColors(answer, guess)

    // Assert
    expect(colors).toEqual(['correct', 'correct', 'present', 'present', 'wrong'])
  })

  it('evaluateGuess_AllLettersCorrect_ReturnsAllCorrect', () => {
    // Arrange
    const answer = 'CRANE'
    const guess = 'CRANE'

    // Act
    const colors = evaluateGuess_AnswerAndGuessProvided_ReturnsNYTColors(answer, guess)

    // Assert
    expect(colors).toEqual(['correct', 'correct', 'correct', 'correct', 'correct'])
  })

  it('evaluateGuess_NoLettersMatch_ReturnsAllWrong', () => {
    // Arrange
    const answer = 'CRANE'
    const guess = 'SLOTH'

    // Act
    const colors = evaluateGuess_AnswerAndGuessProvided_ReturnsNYTColors(answer, guess)

    // Assert
    expect(colors).toEqual(['wrong', 'wrong', 'wrong', 'wrong', 'wrong'])
  })
})
