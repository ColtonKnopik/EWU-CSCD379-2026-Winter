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
          <Keyboard
            :disabled="gameOver"
            :enter-disabled="currentGuess.length !== WORD_LENGTH"
            :backspace-disabled="currentGuess.length === 0"
            :key-statuses="keyStatuses"
            @press="handleVirtualKey"
          />

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

    <!-- Result Modal Component -->
    <GameResultModal
      v-model="showResultModal"
      :won="won"
      :word="answer"
      :guess-count="guesses.length"
      @close="handleModalClose"
    />
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { loadTargetWords, loadValidWords } from '~/utils/wordLoader'
import Keyboard from '~/components/Keyboard.vue'
import GameResultModal from '~/components/GameResultModal.vue'
import { usePlayerStats } from '~/composables/usePlayerStats'
import { generateHint } from '~/utils/hintGenerator'

import {
  evaluateGuess_AnswerAndGuessProvided_ReturnsNYTColors,
  mergeKeyStates_PreviousAndNewFeedbackProvided_ReturnsBestStates
} from '~/utils/wordleEngine'


let WORD_LIST = ['CRANE', 'SLANT', 'STARE', 'SLATE', 'PRANK', 'FLASH', 'TRAIN', 'PLANT', 'STORM', 'SHOUT']
let VALID_WORDS = new Set(WORD_LIST)

const statsOpen = useState('statsOpen', () => false)

const WORD_LENGTH = 5

const board = ref(Array(6).fill(null).map(() => Array(5).fill('')))
const tileStates = ref(Array(6).fill(null).map(() => Array(5).fill('empty')))
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
const currentGameIsWOTD = ref(false)
const wotdDate = ref('')
const showResultModal = ref(false)
const { recordGame, load: loadStats } = usePlayerStats()
const statsRecorded = ref(false)

const hintsUsed = ref(0)
const MAX_HINTS = 3
const { registerHintHandler, unregisterHintHandler, setHintDisabled } = useHint()

const provideHint = async () => {
  if (gameOver.value || hintsUsed.value >= MAX_HINTS) {
    showMessage('No more hints available!', 'error')
    return
  }
  
  hintsUsed.value++
  
  try {
    const hintResult = await generateHint(
      answer.value,
      guesses.value.length,
      guesses.value
    )
    
    console.log('Hint result:', hintResult)
    
    const messageClass = hintResult.severity === 'strong' ? 'success' : 
                        hintResult.severity === 'medium' ? 'info' : 'subtle'
    
    showMessage(`Hint ${hintsUsed.value}/${MAX_HINTS}: ${hintResult.text}`, messageClass)
    
    if (hintsUsed.value >= MAX_HINTS) {
      setHintDisabled(true)
    }
  } catch (error) {
    console.error('Error generating hint:', error)
    
    // Fallback to simple letter hint if API fails
    const guessedLettersArray = Array.from(guessedLetters.value)
    const unusedLetters = answer.value.split('').filter(letter => 
      !guessedLettersArray.includes(letter)
    )
    
    if (unusedLetters.length > 0) {
      const hintLetter = unusedLetters[Math.floor(Math.random() * unusedLetters.length)]
      showMessage(`Hint ${hintsUsed.value}/${MAX_HINTS}: The word contains "${hintLetter}"`, 'success')
      guessedLetters.value.add(hintLetter)
    } else {
      showMessage('All letters have been revealed!', 'error')
    }
    
    if (hintsUsed.value >= MAX_HINTS) {
      setHintDisabled(true)
    }
  }
}

const keyStatuses = computed(() => {
  const out = {}
  for (const [k, v] of Object.entries(keyStates.value)) {
    if (v === 'correct') out[k] = 'correct'
    else if (v === 'present') out[k] = 'present'
    else if (v === 'wrong') out[k] = 'absent'
  }
  return out
})

function handleVirtualKey(key) {
  handleKeyPress(key)
}

const initializeGame = (initialWord = null, isWOTD = false) => {
  statsOpen.value = false
  statsRecorded.value = false
  hintsUsed.value = 0
  setHintDisabled(false)
  
  if (initialWord && typeof initialWord === 'string' && /^[A-Z]{5}$/.test(initialWord)) {
    answer.value = initialWord.toUpperCase()
    currentGameIsWOTD.value = isWOTD
    
    if (!VALID_WORDS.has(answer.value)) {
      WORD_LIST.push(answer.value)
      VALID_WORDS.add(answer.value)
    }
  } else {
    answer.value = WORD_LIST[Math.floor(Math.random() * WORD_LIST.length)]
    currentGameIsWOTD.value = false
  }

  board.value = Array(6).fill(null).map(() => Array(5).fill(''))
  tileStates.value = Array(6).fill(null).map(() => Array(5).fill('empty'))
  guesses.value = []
  currentGuess.value = ''
  gameOver.value = false
  won.value = false
  guessedLetters.value = new Set()
  keyStates.value = {}
  message.value = ''
}

const handleModalClose = () => {
  showResultModal.value = false
  
  setTimeout(() => {
    initializeGame()
  }, 300) 
}

const playSlap = () => {
  try {
    const a = slapAudio.value
    if (!a) return
    a.currentTime = 0
    a.play().catch(() => {})
  } catch (e) {}
}

const getTileState = (row, col) => {
  if (row >= guesses.value.length) return 'empty'
  return tileStates.value?.[row]?.[col] ?? 'empty'
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
    showHand.value = true
    pushLettersAway()
    showMessage('Not in word list', 'error')
    currentGuess.value = ''
    setTimeout(() => { showHand.value = false }, 1300)
    return
  }

  const feedback = checkGuess(currentGuess.value)
  currentGuess.value = ''
  return feedback
}

const checkGuess = (guess) => {
  const ROWS = 6
  const rowIndex = guesses.value.length

  const tileColors = evaluateGuess_AnswerAndGuessProvided_ReturnsNYTColors(answer.value, guess)

  if (tileStates.value?.[rowIndex]) {
    tileStates.value[rowIndex] = [...tileColors]
  }

  guesses.value.push(guess)

  keyStates.value = mergeKeyStates_PreviousAndNewFeedbackProvided_ReturnsBestStates(
    keyStates.value,
    guess,
    tileColors
  )

  if (guess === answer.value) {
    gameOver.value = true
    won.value = true

    if (currentGameIsWOTD.value && wotdDate.value) {
      localStorage.setItem('wotd_last_played', wotdDate.value)
    }

    gameEnded(true, guesses.value.length)
    showResultModal.value = true
    return tileColors
  }

  if (guesses.value.length >= ROWS) {
    gameOver.value = true

    if (currentGameIsWOTD.value && wotdDate.value) {
      localStorage.setItem('wotd_last_played', wotdDate.value)
    }

    gameEnded(false, ROWS)
    showResultModal.value = true
  }

  return tileColors
}

const gameEnded = (wonFlag, guessesCount) => {
  if (statsRecorded.value) return
  statsRecorded.value = true
  recordGame({ won: wonFlag, guesses: guessesCount })
}

const showMessage = (msg, type) => {
  message.value = msg
  messageType.value = type
  setTimeout(() => {
    message.value = ''
  }, 2000)
}

const shouldIgnoreKeydown = (event) => {
  if (event.defaultPrevented) return true
  if (event.ctrlKey || event.metaKey || event.altKey) return true

  const target = event.target
  const tag = target?.tagName
  if (tag === 'INPUT' || tag === 'TEXTAREA' || target?.isContentEditable) return true

  if (statsOpen.value) return true

  return false
}

const handlePhysicalKeyboard = (event) => {
  if (shouldIgnoreKeydown(event)) return
  if (gameOver.value) return

  const k = event.key

  if (k === 'Enter') {
    event.preventDefault()
    handleKeyPress('ENTER')
    return
  }
  if (k === 'Backspace') {
    event.preventDefault()
    handleKeyPress('BACKSPACE')
    return
  }

  const letter = k.toUpperCase()
  if (/^[A-Z]$/.test(letter)) {
    event.preventDefault()
    handleKeyPress(letter)
  }
}

// SINGLE onMounted - This is the fix!
onMounted(async () => {
  loadStats()

  // Register the hint handler FIRST
  registerHintHandler(provideHint)

  try {
    const [targets, valids] = await Promise.all([loadTargetWords(), loadValidWords()])
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

  try {
    const res = await fetch('/api/word_of_the_day')
    if (res.ok) {
      const data = await res.json()
      const w = (data?.word || '').toUpperCase()
      const date = data?.date || new Date().toISOString().split('T')[0]
      
      if (/^[A-Z]{5}$/.test(w)) {
        const lastPlayed = localStorage.getItem('wotd_last_played')
        
        if (lastPlayed === date) {
          console.log('✓ Already played today\'s WOTD, starting with random word')
          initializeGame()
        } else {
          console.log('✓ Starting with Word of the Day:', w)
          wotdDate.value = date
          initializeGame(w, true)
        }
      } else {
        initializeGame()
      }
    } else {
      initializeGame()
    }
  } catch (e) {
    console.error('Failed to fetch WOTD:', e)
    initializeGame()
  }

  try {
    const a = new Audio('/sounds/slap.mp3')
    a.preload = 'auto'
    a.load()
    slapAudio.value = a
  } catch (e) {
    console.warn('Failed to preload slap audio', e)
  }
  
  window.addEventListener('keydown', handlePhysicalKeyboard)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handlePhysicalKeyboard)
  unregisterHintHandler()
})

const pushLettersAway = () => {
  const rowIndex = guesses.value.length
  const row = document.querySelectorAll('.game-board .wordle-row')[rowIndex]
  if (!row) return

  const tiles = row.querySelectorAll('.wordle-tile')
  tiles.forEach((tile, idx) => {
    tile.classList.add('push-away')
    tile.style.transitionDelay = `${idx * 60}ms`
  })

  playSlap()

  setTimeout(() => {
    tiles.forEach(tile => {
      tile.classList.remove('push-away')
      tile.style.transitionDelay = ''
    })

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

.page {
  padding-top: 24px;
  padding-bottom: 24px;
}

.game-board-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 20px;
}

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

.hand-container {
  position: fixed;
  left: 50%;
  bottom: 40px;
  transform: translateX(-50%);
  pointer-events: none;
  z-index: 200;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.hand-image {
  width: 340px; 
  transform-origin: center bottom;
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

.wordle-tile.push-away {
  transform: translateX(-340px) translateY(-24px) rotate(-25deg);
  opacity: 0;
  transition: transform 1.2s cubic-bezier(.2,.9,.2,1), opacity 1.2s cubic-bezier(.2,.9,.2,1);
}
</style>