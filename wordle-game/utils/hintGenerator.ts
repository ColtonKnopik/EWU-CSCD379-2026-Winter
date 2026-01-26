/**
 * Generates contextual hints for Wordle words
 * @param word - The target word (uppercase)
 * @param guessCount - Current number of guesses made
 * @returns A helpful hint
 */
export async function generateHint(word: string, guessCount: number = 0): Promise<string> {
    // Simple progressive hints based on guess count
    if (guessCount === 0) {
        return `The word has ${word.length} letters.`
    }

    if (guessCount === 1) {
        return `The first letter is "${word[0]}".`
    }

    if (guessCount === 2) {
        return `The last letter is "${word[word.length - 1]}".`
    }

    if (guessCount === 3) {
        const vowels = ['A', 'E', 'I', 'O', 'U']
        const wordVowels = word.split('').filter(letter => vowels.includes(letter))
        if (wordVowels.length > 0) {
            return `The word contains the vowel(s): ${wordVowels.join(', ')}.`
        } else {
            return `The word has no common vowels.`
        }
    }

    if (guessCount === 4) {
        return `The second letter is "${word[1]}".`
    }

    // Final hint - give more letters
    const revealed = `${word[0]}_${word[2]}_${word[4] || ''}`
    return `Letters at positions 1, 3, 5: ${revealed}`
}

/**
 * Generates a letter-based hint
 */
export function generateLetterHint(word: string, guessCount: number): string {
    if (guessCount < 2) {
        return `First letter: ${word[0]}`
    } else if (guessCount < 4) {
        return `Letters include: ${word[0]} and ${word[word.length - 1]}`
    } else {
        const middle = word[Math.floor(word.length / 2)]
        return `Middle letter: ${middle}`
    }
}