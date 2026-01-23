# Wordle Game - TypeScript Refactor

## Overview
Your vanilla JavaScript Wordle logic has been refactored into a **TypeScript composable** (`useWordleGame.ts`) and integrated into your Vue 3 app.

## Files Created/Updated

### 1. **`composables/useWordleGame.ts`** (NEW)
A reusable Vue composable with full TypeScript support.

**Key Features:**
- Type-safe game state management
- All game logic centralized
- Easy to test and reuse across components
- Proper TypeScript interfaces and types

**Exported Types:**
```typescript
interface GameState {
  word: string
  currentRow: number
  currentCol: number
  gameOver: boolean
  won: boolean
}

type TileState = 'empty' | 'correct' | 'present' | 'wrong'
type KeyStatus = 'correct' | 'present' | 'wrong' | ''
type FeedbackColor = 'correct' | 'present' | 'wrong'
```

**Exported Methods:**
- `initializeGame()` — Reset and start a new game
- `getTileState(row, col)` — Get visual state for a tile
- `getKeyStatus(key)` — Get keyboard key state
- `submitGuess(guess)` — Process a player's guess
- `checkGuess(guess)` — Core guess validation logic
- `resetGame()` — Alias for initializeGame
- `pickRandomWord()` — Select random word from list
- `isValidWord(word)` — Validate against word list

### 2. **`pages/index.vue`** (UPDATED)
- Now uses `useWordleGame` composable
- Reduced from ~300 lines to ~150 lines
- Fully typed with TypeScript
- Cleaner separation of concerns

**Usage Example:**
```typescript
const {
  gameState,
  board,
  guesses,
  currentGuess,
  keyStates,
  message,
  ROWS,
  COLS,
  initializeGame,
  submitGuess,
  getTileState,
  getKeyStatus
} = useWordleGame(WORD_LIST)
```

## Architecture

```
pages/index.vue (UI Layer)
    ↓
    uses
    ↓
composables/useWordleGame.ts (Game Logic Layer)
    ↓
    manages
    ↓
GameState (Reactive data with Vue)
```

## Improvements

✅ **Type Safety** — Full TypeScript with proper interfaces
✅ **Modularity** — Logic separated from UI
✅ **Reusability** — Composable can be used in multiple components
✅ **Maintainability** — Easier to test and debug
✅ **DRY** — No duplicated logic
✅ **Performance** — Reactive state management with Vue 3

## Stats Submission

The composable automatically calls:
```typescript
POST /games/wordle/update_stats
{
  "won": boolean,
  "guesses": number
}
```

## Integration with Existing Components

- **Header.vue** — Still displays title
- **Leaderboard.vue** — Fetches and displays player stats
- **index.vue** — Uses composable for all game logic

## No Breaking Changes

All existing functionality preserved:
- Keyboard input (physical + on-screen buttons)
- Message display system
- Win/lose detection
- Stats tracking
- Responsive design

## Next Steps

Optional enhancements:
1. Create unit tests for `useWordleGame.ts`
2. Add difficulty levels (different word lists)
3. Add game timer
4. Persist game state to localStorage
5. Add animations on tile reveal
