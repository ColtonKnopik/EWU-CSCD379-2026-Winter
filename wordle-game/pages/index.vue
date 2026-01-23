<template>
  <div class="app">
    <NuxtRouteAnnouncer />
    
    <!-- Header -->
    <Header />

    <!-- Leaderboard (fixed left) -->
    <Leaderboard />

    <!-- Game Area (centered) -->
    <div class="game-board-container">
      <div class="game-board">
        <div
          v-for="row in 6"
          :key="row"
          class="wordle-row"
        >
          <div
            v-for="col in 5"
            :key="col"
            class="wordle-tile"
            :data-state="getTileState(row - 1, col - 1)"
          >
            <span>{{ board[row - 1]?.[col - 1] || '' }}</span>
          </div>
        </div>
      </div>

      <!-- Keyboard -->
      <div class="keyboard">
        <div class="keyboard-row" v-for="(row, idx) in keyboardRows" :key="idx">
          <button
            v-for="key in row"
            :key="key"
            class="key-button"
            :class="{ 'key-special': key === 'ENTER' || key === 'BACKSPACE' }"
            :data-status="getKeyStatus(key)"
            @click="handleKeyPress(key)"
          >
            {{ key === 'BACKSPACE' ? '⌫' : key }}
          </button>
        </div>
      </div>

      <!-- Game Status Message -->
      <div v-if="message" class="message" :class="messageType">
        {{ message }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import Header from '~/components/Header.vue'
import Leaderboard from '~/components/Leaderboard.vue'

const WORD_LIST = ['CRANE', 'SLANT', 'STARE', 'SLATE', 'PRANK', 'FLASH', 'TRAIN', 'PLANT', 'STORM', 'SHOUT']
const VALID_WORDS = new Set(WORD_LIST)

const keyboardRows = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACKSPACE']
]

const board = ref(Array(6).fill(null).map(() => Array(5).fill('')))
const guesses = ref([])
const currentGuess = ref('')
const gameOver = ref(false)
const won = ref(false)
const answer = ref('')
const guessedLetters = ref(new Set())
const keyStates = ref({})
const message = ref('')
const messageType = ref('')

const initializeGame = () => {
  answer.value = WORD_LIST[Math.floor(Math.random() * WORD_LIST.length)]
  board.value = Array(6).fill(null).map(() => Array(5).fill(''))
  guesses.value = []
  currentGuess.value = ''
  gameOver.value = false
  won.value = false
  guessedLetters.value = new Set()
  keyStates.value = {}
  message.value = ''
}

const getTileState = (row, col) => {
  if (row >= guesses.value.length) return 'empty'
  
  const guess = guesses.value[row]
  const letter = guess[col]
  const answerArray = answer.value.split('')
  
  if (letter === answerArray[col]) {
    return 'correct'
  }
  
  if (answerArray.includes(letter)) {
    return 'present'
  }
  
  return 'wrong'
}

const getKeyStatus = (key) => {
  return keyStates.value[key] || ''
}

const handleKeyPress = (key) => {
  if (gameOver.value) return
  
  if (key === 'ENTER') {
    submitGuess()
  } else if (key === 'BACKSPACE') {
    currentGuess.value = currentGuess.value.slice(0, -1)
    // Clear board display
    for (let i = currentGuess.value.length; i < 5; i++) {
      board.value[guesses.value.length][i] = ''
    }
  } else {
    if (currentGuess.value.length < 5) {
      currentGuess.value += key
      // Update board display
      for (let i = 0; i < currentGuess.value.length; i++) {
        board.value[guesses.value.length][i] = currentGuess.value[i]
      }
    }
  }
}

const submitGuess = () => {
  if (currentGuess.value.length !== 5) {
    showMessage('Not enough letters', 'error')
    return
  }

  if (!VALID_WORDS.has(currentGuess.value)) {
    showMessage('Not in word list', 'error')
    return
  }

  const feedback = checkGuess(currentGuess.value)
  currentGuess.value = ''

  return feedback
}

const checkGuess = (guess) => {
  const ROWS = 6
  const COLS = 5

  const wordArr = answer.value.split('')
  const guessArr = guess.split('')
  const tileColors = Array(COLS).fill('wrong')

  // first pass: correct
  for (let i = 0; i < COLS; i++) {
    if (guessArr[i] === wordArr[i]) {
      tileColors[i] = 'correct'
      wordArr[i] = null
    }
  }

  // second pass: present
  for (let i = 0; i < COLS; i++) {
    if (tileColors[i] === 'correct') continue
    const idx = wordArr.indexOf(guessArr[i])
    if (idx !== -1) {
      tileColors[i] = 'present'
      wordArr[idx] = null
    }
  }

  // push guess so getTileState will reflect it
  guesses.value.push(guess)

  // update key states using priority: correct > present > wrong
  for (let i = 0; i < COLS; i++) {
    const letter = guessArr[i]
    const color = tileColors[i]
    const prev = keyStates.value[letter]
    if (prev === 'correct') continue
    if (color === 'correct') keyStates.value[letter] = 'correct'
    else if (color === 'present' && prev !== 'present') keyStates.value[letter] = 'present'
    else if (!prev) keyStates.value[letter] = 'wrong'
  }

  // check win
  if (guess === answer.value) {
    gameOver.value = true
    won.value = true
    showMessage('You won! 🎉', 'success')
    gameEnded(true, guesses.value.length)
    return tileColors
  }

  // check lose
  if (guesses.value.length >= ROWS) {
    gameOver.value = true
    showMessage(`Game over! The word was ${answer.value}`, 'error')
    gameEnded(false, ROWS)
  }

  return tileColors
}

const resetGame = () => {
  answer.value = WORD_LIST[Math.floor(Math.random() * WORD_LIST.length)]
  board.value = Array(6).fill(null).map(() => Array(5).fill(''))
  guesses.value = []
  currentGuess.value = ''
  gameOver.value = false
  won.value = false
  guessedLetters.value = new Set()
  keyStates.value = {}
}

const gameEnded = (wonFlag, guessesCount) => {
  fetch('/games/wordle/update_stats', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ won: wonFlag, guesses: guessesCount })
  })
  .then(res => res.json())
  .then(stats => {
    console.log('stats updated', stats)
  }).catch(() => {})
}

const showMessage = (msg, type) => {
  message.value = msg
  messageType.value = type
  setTimeout(() => {
    message.value = ''
  }, 2000)
}

// Handle physical keyboard
const handlePhysicalKeyboard = (event) => {
  const key = event.key.toUpperCase()
  
  if (/^[A-Z]$/.test(key)) {
    handleKeyPress(key)
  } else if (key === 'ENTER') {
    handleKeyPress('ENTER')
  } else if (key === 'BACKSPACE') {
    handleKeyPress('BACKSPACE')
  }
}

onMounted(() => {
  initializeGame()
  window.addEventListener('keydown', handlePhysicalKeyboard)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handlePhysicalKeyboard)
})
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #ffffff;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.game-board-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  padding: 20px;
  margin-left: 260px;
}

/* Game Board */
.game-board {
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin-bottom: 30px;
}

.wordle-row {
  display: flex;
  gap: 5px;
}

.wordle-tile {
  width: 62px;
  height: 62px;
  border: 2px solid #d3d6da;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  font-weight: 700;
  color: #000000;
  background-color: #ffffff;
  transition: transform 0.1s ease-in-out, background-color 0.3s ease-in-out, border-color 0.3s ease-in-out;
}

.wordle-tile[data-state="correct"] {
  background-color: #6aaa64;
  border-color: #6aaa64;
  color: #ffffff;
}

.wordle-tile[data-state="present"] {
  background-color: #c9b458;
  border-color: #c9b458;
  color: #ffffff;
}

.wordle-tile[data-state="wrong"] {
  background-color: #787c7e;
  border-color: #787c7e;
  color: #ffffff;
}

/* Keyboard */
.keyboard {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 20px;
  width: 100%;
  max-width: 500px;
}

.keyboard-row {
  display: flex;
  gap: 6px;
  justify-content: center;
}

.keyboard-row:nth-child(2) {
  margin-left: 30px;
}

.keyboard-row:nth-child(3) {
  margin-left: 60px;
}

.key-button {
  flex: 1;
  max-width: 40px;
  padding: 10px;
  height: 40px;
  border: none;
  border-radius: 4px;
  background-color: #d3d6da;
  color: #000000;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;
}

.key-button.key-special {
  max-width: 60px;
  font-size: 11px;
}

.key-button:hover {
  background-color: #b0b5bc;
}

.key-button:active {
  transform: scale(0.95);
}

.key-button[data-status="correct"] {
  background-color: #6aaa64;
  color: #ffffff;
}

.key-button[data-status="present"] {
  background-color: #c9b458;
  color: #ffffff;
}

.key-button[data-status="wrong"] {
  background-color: #787c7e;
  color: #ffffff;
}

/* Message */
.message {
  text-align: center;
  font-size: 16px;
  font-weight: 600;
  padding: 10px 20px;
  border-radius: 4px;
  margin-top: 10px;
}

.message.error {
  background-color: #f8d7da;
  color: #721c24;
}

.message.success {
  background-color: #d4edda;
  color: #155724;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .game-board-container {
    margin-left: 0;
  }
}

@media (max-width: 600px) {
  .wordle-tile {
    width: 50px;
    height: 50px;
    font-size: 28px;
  }

  .key-button {
    max-width: 32px;
    padding: 8px;
    font-size: 11px;
  }

  .key-button.key-special {
    max-width: 50px;
  }
}
</style>
