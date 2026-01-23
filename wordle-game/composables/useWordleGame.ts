import { ref, type Ref } from 'vue'

// Types
export interface GameState {
    word: string
    currentRow: number
    currentCol: number
    gameOver: boolean
    won: boolean
}

export type TileState = 'empty' | 'correct' | 'present' | 'wrong'
export type KeyStatus = 'correct' | 'present' | 'wrong' | ''
export type FeedbackColor = 'correct' | 'present' | 'wrong'

export interface GameStats {
    won: boolean
    guesses: number
}

// Constants
const ROWS = 6
const COLS = 5
const MESSAGE_DURATION = 2000

export const useWordleGame = (wordList: string[]) => {
    // State
    const gameState: Ref<GameState> = ref({
        word: '',
        currentRow: 0,
        currentCol: 0,
        gameOver: false,
        won: false
    })

    const board = ref<string[][]>(Array(ROWS).fill(null).map(() => Array(COLS).fill('')))
    const guesses = ref<string[]>([])
    const currentGuess = ref('')
    const keyStates = ref<Record<string, KeyStatus>>({})
    const message = ref('')
    const messageType = ref<'error' | 'success'>('error')

    // Utility Functions
    const pickRandomWord = (): string => {
        const randomIndex = Math.floor(Math.random() * wordList.length)
        return wordList[randomIndex]!
    }

    const isValidWord = (word: string): boolean => {
        return wordList.includes(word.toUpperCase())
    }

    // Game Initialization
    const initializeGame = (): void => {
        gameState.value = {
            word: pickRandomWord(),
            currentRow: 0,
            currentCol: 0,
            gameOver: false,
            won: false
        }
        board.value = Array(ROWS).fill(null).map(() => Array(COLS).fill(''))
        guesses.value = []
        currentGuess.value = ''
        keyStates.value = {}
        message.value = ''
    }

    // Clear Board Function
    const clearBoard = (): void => {
        gameState.value.currentRow = 0
        gameState.value.currentCol = 0
        gameState.value.gameOver = false
        gameState.value.won = false
        board.value = Array(ROWS).fill(null).map(() => Array(COLS).fill(''))
        guesses.value = []
        currentGuess.value = ''
        keyStates.value = {}
        message.value = ''
    }

    // Board State
    const getTileState = (row: number, col: number): TileState => {
        if (row >= guesses.value.length) return 'empty'

        const guess = guesses.value[row]
        if (!guess) return 'empty'

        const letter = guess[col] || ''
        const answerArray = gameState.value.word.split('')

        if (letter === answerArray[col]) {
            return 'correct'
        }

        if (letter && answerArray.includes(letter)) {
            return 'present'
        }

        return 'wrong'
    }

    // Keyboard State
    const getKeyStatus = (key: string): KeyStatus => {
        return keyStates.value[key] || ''
    }

    // Check Guess Logic
    const checkGuess = (guess: string): FeedbackColor[] => {
        const wordArr = gameState.value.word.split('')
        const guessArr = guess.toUpperCase().split('')
        const tileColors: FeedbackColor[] = Array(COLS).fill('wrong')

        // First pass: correct letters
        for (let i = 0; i < COLS; i++) {
            const guessLetter = guessArr[i]
            if (guessLetter && guessLetter === wordArr[i]) {
                tileColors[i] = 'correct'
                wordArr[i] = null as any
            }
        }

        // Second pass: present letters
        for (let i = 0; i < COLS; i++) {
            if (tileColors[i] === 'correct') continue
            const guessLetter = guessArr[i]
            if (guessLetter) {
                const idx = wordArr.indexOf(guessLetter)
                if (idx !== -1) {
                    tileColors[i] = 'present'
                    wordArr[idx] = null as any
                }
            }
        }

        // Push guess
        guesses.value.push(guess.toUpperCase())

        // Update key states with priority: correct > present > wrong
        for (let i = 0; i < COLS; i++) {
            const letter = guessArr[i]
            const color = tileColors[i]
            if (!letter) continue

            const prev = keyStates.value[letter]

            if (prev === 'correct') continue
            if (color === 'correct') {
                keyStates.value[letter] = 'correct'
            } else if (color === 'present' && prev !== 'present') {
                keyStates.value[letter] = 'present'
            } else if (!prev) {
                keyStates.value[letter] = 'wrong'
            }
        }

        // Check win
        if (guess.toUpperCase() === gameState.value.word) {
            gameState.value.gameOver = true
            gameState.value.won = true
            showMessage('You won! 🎉', 'success')
            submitStats(true, guesses.value.length)

            // Start new game after a delay
            setTimeout(() => {
                initializeGame()
            }, MESSAGE_DURATION)

            return tileColors
        }

        // Check lose
        if (guesses.value.length >= ROWS) {
            gameState.value.gameOver = true
            showMessage(`Game over! The word was ${gameState.value.word}`, 'error')
            submitStats(false, ROWS)

            // Start new game after a delay
            setTimeout(() => {
                initializeGame()
            }, MESSAGE_DURATION)
        }

        return tileColors
    }

    // Submit Guess
    const submitGuess = (guess: string): FeedbackColor[] | void => {
        if (guess.length !== COLS) {
            showMessage('Not enough letters', 'error')
            return
        }

        if (!isValidWord(guess)) {
            showMessage('Not in word list', 'error')
            return
        }

        return checkGuess(guess)
    }

    // Reset Game
    const resetGame = (): void => {
        initializeGame()
    }

    // Message Display
    const showMessage = (msg: string, type: 'error' | 'success'): void => {
        message.value = msg
        messageType.value = type
        setTimeout(() => {
            message.value = ''
        }, MESSAGE_DURATION)
    }

    // Stats Submission
    const submitStats = async (won: boolean, guesses: number): Promise<void> => {
        try {
            const response = await fetch('/games/wordle/update_stats', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ won, guesses })
            })
            const stats = await response.json()
            console.log('Stats updated:', stats)
        } catch (error) {
            console.error('Failed to submit stats:', error)
        }
    }

    return {
        // State
        gameState,
        board,
        guesses,
        currentGuess,
        keyStates,
        message,
        messageType,

        // Constants
        ROWS,
        COLS,

        // Methods
        initializeGame,
        clearBoard,
        getTileState,
        getKeyStatus,
        submitGuess,
        checkGuess,
        resetGame,
        showMessage,
        pickRandomWord,
        isValidWord
    }
}