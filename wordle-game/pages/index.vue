<template>
  
  <NuxtRouteAnnouncer />

  <!-- Page layout -->
  <v-container class="page" fluid>
    <v-row justify="center">
      <!-- Main content column -->
      <v-col cols="12" sm="10" md="8" lg="6" class="d-flex justify-center">
        <div class="game-board-container">
          <!-- Game Board -->
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
      </v-col>
    </v-row>
    
   

    <!-- Hand animation (shown on invalid guess) -->
    <div v-if="showHand" class="hand-container">
      <img src="/images/hand.png" alt="hand" class="hand-image" />
    </div>
  </v-container>
  
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import Header from '~/components/Header.vue'
import { loadTargetWords, loadValidWords, loadWordsFromFile } from '~/utils/wordLoader'

let WORD_LIST = ['CRANE', 'SLANT', 'STARE', 'SLATE', 'PRANK', 'FLASH', 'TRAIN', 'PLANT', 'STORM', 'SHOUT']
let VALID_WORDS = new Set(WORD_LIST)

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
const showHand = ref(false)
const slapAudio = ref(null)

// initializeGame optionally accepts an initialWord (e.g. word of the day).
const initializeGame = (initialWord = null) => {
  if (initialWord && typeof initialWord === 'string' && /^[A-Z]{5}$/.test(initialWord)) {
    answer.value = initialWord.toUpperCase()
    // ensure word is valid for submission checks
    if (!VALID_WORDS.has(answer.value)) {
      WORD_LIST.push(answer.value)
      VALID_WORDS.add(answer.value)
    }
  } else {
    answer.value = WORD_LIST[Math.floor(Math.random() * WORD_LIST.length)]
  }

  board.value = Array(6).fill(null).map(() => Array(5).fill(''))
  guesses.value = []
  currentGuess.value = ''
  gameOver.value = false
  won.value = false
  guessedLetters.value = new Set()
  keyStates.value = {}
  message.value = ''
}

// Preload slap sound and play with low latency
// Place `slap.mp3` at `public/sounds/slap.mp3`.
const playSlap = () => {
  try {
    const a = slapAudio.value
    if (!a) return
    // restart and play
    a.currentTime = 0
    a.play().catch(() => {})
  } catch (e) {
    // ignore playback errors
  }
}

const getTileState = (row, col) => {
  if (row >= guesses.value.length) return 'empty'

  const guess = guesses.value[row]
  const letter = guess[col]
  const answerArray = answer.value.split('')

  if (letter === answerArray[col]) return 'correct'
  if (answerArray.includes(letter)) return 'present'
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
    for (let i = currentGuess.value.length; i < 5; i++) {
      board.value[guesses.value.length][i] = ''
    }
  } else {
    if (currentGuess.value.length < 5) {
      currentGuess.value += key
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
    // show hand and push letters away
    showHand.value = true
    pushLettersAway()
    showMessage('Not in word list', 'error')
    // clear current guess so tiles visually removed
    currentGuess.value = ''
    // hide hand after animation completes (match hand sweep duration)
    setTimeout(() => { showHand.value = false }, 1300)
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

  for (let i = 0; i < COLS; i++) {
    if (guessArr[i] === wordArr[i]) {
      tileColors[i] = 'correct'
      wordArr[i] = null
    }
  }

  for (let i = 0; i < COLS; i++) {
    if (tileColors[i] === 'correct') continue
    const idx = wordArr.indexOf(guessArr[i])
    if (idx !== -1) {
      tileColors[i] = 'present'
      wordArr[idx] = null
    }
  }

  guesses.value.push(guess)

  for (let i = 0; i < COLS; i++) {
    const letter = guessArr[i]
    const color = tileColors[i]
    const prev = keyStates.value[letter]
    if (prev === 'correct') continue
    if (color === 'correct') keyStates.value[letter] = 'correct'
    else if (color === 'present' && prev !== 'present') keyStates.value[letter] = 'present'
    else if (!prev) keyStates.value[letter] = 'wrong'
  }

  if (guess === answer.value) {
    gameOver.value = true
    won.value = true
    showMessage('You won! 🎉', 'success')
    gameEnded(true, guesses.value.length)
    setTimeout(() => {
      initializeGame()
    }, 2000)
    return tileColors
  }

  if (guesses.value.length >= ROWS) {
    gameOver.value = true
    showMessage(`Game over! The word was ${answer.value}`, 'error')
    gameEnded(false, ROWS)
    setTimeout(() => {
      initializeGame()
    }, 2000)
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

const handlePhysicalKeyboard = (event) => {
  const key = event.key.toUpperCase()

  if (/^[A-Z]$/.test(key)) handleKeyPress(key)
  else if (key === 'ENTER') handleKeyPress('ENTER')
  else if (key === 'BACKSPACE') handleKeyPress('BACKSPACE')
}

onMounted(async () => {
  try {
    const [targets, valids] = await Promise.all([loadTargetWords(), loadValidWords()])
    // targets -> WORD_LIST (answers), valids -> VALID_WORDS
    if (Array.isArray(targets) && targets.length) {
      WORD_LIST = targets
    }
    if (Array.isArray(valids) && valids.length) {
      VALID_WORDS = new Set(valids)
    }
    console.log(`✓ Loaded ${WORD_LIST.length} target words, ${Array.from(VALID_WORDS).length} valid words`)
  } catch (error) {
    console.error('Failed to load word lists:', error)
  }

  // Attempt to fetch Word of the Day (WOTD) and start with it. If fetch fails or invalid,
  // fall back to a random word.
  try {
    const res = await fetch('/api/word_of_the_day')
    if (res.ok) {
      const data = await res.json()
      const w = (data?.word || '').toUpperCase()
      if (/^[A-Z]{5}$/.test(w)) {
        initializeGame(w)
      } else {
        initializeGame()
      }
    } else {
      initializeGame()
    }
  } catch (e) {
    // If the API isn't available or errors, just initialize normally.
    initializeGame()
  }
  // create and preload slap audio for lower-latency playback
  try {
    const a = new Audio('/sounds/slap.mp3')
    a.preload = 'auto'
    // optional: set volume if desired
    // a.volume = 0.9
    a.load()
    slapAudio.value = a
  } catch (e) {
    console.warn('Failed to preload slap audio', e)
  }
  window.addEventListener('keydown', handlePhysicalKeyboard)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handlePhysicalKeyboard)
})

// Push letters off the board with animation
const pushLettersAway = () => {
  const rowIndex = guesses.value.length
  const row = document.querySelectorAll('.game-board .wordle-row')[rowIndex]
  if (!row) return

  // For each tile in the current row, add a class that triggers CSS animation
  const tiles = row.querySelectorAll('.wordle-tile')
  tiles.forEach((tile, idx) => {
    tile.classList.add('push-away')
    // stagger
    tile.style.transitionDelay = `${idx * 60}ms`
  })

  // play slap sound at start of animation
  playSlap()

  // After animation, clear those tiles visually
  setTimeout(() => {
    // remove animation class and inline delay
    tiles.forEach(tile => {
      tile.classList.remove('push-away')
      tile.style.transitionDelay = ''
    })

    // update reactive board state for this row so Vue re-renders and input works
    const idx = rowIndex
    if (board.value && board.value[idx]) {
      board.value[idx] = Array(tiles.length).fill('')
    }
  }, 700)
}
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

/* Give the Vuetify container some consistent vertical breathing room */
.page {
  padding-top: 24px;
  padding-bottom: 24px;
}

/* Now this is just the centered game stack (no more margin-left hack) */
.game-board-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 20px;
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

/* Hand animation */
  .hand-container {
    position: fixed;
    left: 50%;
    bottom: 40px; /* anchor the base near the bottom */
    transform: translateX(-50%);
    pointer-events: none;
    z-index: 200;
    display: flex;
    align-items: flex-end;
    justify-content: center;
  }

  .hand-image {
    width: 340px; 
    transform-origin: center bottom; /* anchor at the base */
    animation: hand-sweep-left 1.2s cubic-bezier(.2,.9,.2,1) forwards;
  }

  @keyframes hand-sweep-left {
    0% {
      transform: rotate(40deg) scale(1.05);
      opacity: 1;
    }
    60% {
      transform: rotate(-20deg) scale(1.03);
      opacity: 1;
    }
    90% {
      transform: rotate(-20deg) scale(1.02);
      opacity: 1;
    }
    100% {
      transform: rotate(-20deg) scale(1);
      opacity: 0;
    }
  }

  /* Push away tiles to the left (match sweep distance) */
  .wordle-tile.push-away {
    transform: translateX(-340px) translateY(-24px) rotate(-25deg);
    opacity: 0;
    transition: transform 1.2s cubic-bezier(.2,.9,.2,1), opacity 1.2s cubic-bezier(.2,.9,.2,1);
  }
</style>
